import { createHash } from 'crypto';
import type { FastifyInstance } from 'fastify';
import { redis } from '../services/redis.js';
import { probeUrl as runYtdlpProbe } from '../services/ytdlp.js';
import { buildMediaInfo } from '../services/formats.js';
import { isDrmBlocked, isValidUrl } from '../services/platforms.js';
import { requireApiKey } from '../middleware/auth.js';
import { record } from '../services/metrics.js';
import { DownloadError } from '../types.js';

const CACHE_TTL_SECONDS = 600;

function cacheKey(url: string): string {
  return `probe:${createHash('sha256').update(url).digest('hex')}`;
}

interface BulkBody {
  urls?: string[];
  concurrency?: number;
}

interface BulkResult {
  url: string;
  ok: boolean;
  data?: ReturnType<typeof buildMediaInfo>;
  error?: { code: string; message: string };
}

async function probeOne(url: string): Promise<BulkResult> {
  if (!isValidUrl(url)) {
    return { url, ok: false, error: { code: 'no_video_found', message: 'Invalid URL' } };
  }
  if (isDrmBlocked(url)) {
    return {
      url,
      ok: false,
      error: { code: 'unsupported_platform', message: 'DRM-protected platform' },
    };
  }
  try {
    const cached = await redis.get(cacheKey(url));
    if (cached) {
      return { url, ok: true, data: JSON.parse(cached) };
    }
  } catch {
    /* ignore */
  }
  try {
    const raw = await runYtdlpProbe(url);
    const info = buildMediaInfo(raw, url);
    void redis.set(cacheKey(url), JSON.stringify(info), 'EX', CACHE_TTL_SECONDS);
    return { url, ok: true, data: info };
  } catch (err) {
    const e = err instanceof DownloadError ? err : new DownloadError('default', String(err));
    return { url, ok: false, error: { code: e.code, message: e.message } };
  }
}

async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

export async function v1Routes(app: FastifyInstance) {
  // GET /v1/probe?url=...
  app.get<{ Querystring: { url?: string } }>(
    '/v1/probe',
    { preHandler: requireApiKey },
    async (req, reply) => {
      const url = req.query.url?.trim();
      if (!url) {
        reply.code(400);
        return { code: 'no_video_found', message: 'Missing url query parameter.' };
      }
      const result = await probeOne(url);
      if (!result.ok) {
        reply.code(400);
        void record({
          kind: 'errors',
          code: result.error?.code,
          ip: req.ip,
          via: 'api',
          url,
        });
        return result.error;
      }
      void record({
        kind: 'probes',
        platform: result.data?.platform,
        ip: req.ip,
        via: 'api',
        url,
      });
      return result.data;
    }
  );

  // POST /v1/bulk { urls: string[], concurrency?: number }
  app.post<{ Body: BulkBody }>(
    '/v1/bulk',
    { preHandler: requireApiKey },
    async (req, reply) => {
      const urls = (req.body?.urls ?? []).map((u) => String(u).trim()).filter(Boolean);
      if (!urls.length) {
        reply.code(400);
        return { code: 'no_video_found', message: 'urls must be a non-empty array.' };
      }
      if (urls.length > 50) {
        reply.code(400);
        return { code: 'default', message: 'Maximum 50 URLs per bulk request.' };
      }
      const concurrency = Math.min(Math.max(1, req.body?.concurrency ?? 4), 8);
      const results = await runWithConcurrency(urls, concurrency, probeOne);
      results.forEach((r) => {
        if (r.ok) {
          void record({ kind: 'probes', platform: r.data?.platform, ip: req.ip, via: 'api', url: r.url });
        } else {
          void record({ kind: 'errors', code: r.error?.code, ip: req.ip, via: 'api', url: r.url });
        }
      });
      return { count: results.length, results };
    }
  );

  // GET /v1/me — returns key + usage so users can verify their key
  app.get('/v1/me', { preHandler: requireApiKey }, async (req) => {
    const key = req.apiKey!;
    return {
      id: key.id,
      label: key.label,
      plan: key.plan,
      monthlyQuota: key.monthlyQuota,
      createdAt: key.createdAt,
    };
  });
}
