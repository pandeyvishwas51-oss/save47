import { createHash } from 'crypto';
import type { FastifyInstance } from 'fastify';
import { redis } from '../services/redis.js';
import { checkRateLimit } from '../services/rateLimit.js';
import { probeUrl as runYtdlpProbe } from '../services/ytdlp.js';
import { buildMediaInfo } from '../services/formats.js';
import { detectPlatform, isDrmBlocked, isValidUrl } from '../services/platforms.js';
import { DownloadError } from '../types.js';
import { attachApiKey } from '../middleware/auth.js';
import { record } from '../services/metrics.js';

const CACHE_TTL_SECONDS = 600; // 10 minutes

function cacheKey(url: string): string {
  return `probe:${createHash('sha256').update(url).digest('hex')}`;
}

export async function probeRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { url?: string } }>('/probe', { preHandler: attachApiKey }, async (req, reply) => {
    const url = req.query.url?.trim();
    const ip = req.ip;
    const via: 'web' | 'api' = req.apiKey ? 'api' : 'web';

    if (!url || !isValidUrl(url)) {
      reply.code(400);
      void record({ kind: 'errors', code: 'no_video_found', ip, via });
      return { code: 'no_video_found', message: 'Provide a valid http(s) URL.' };
    }

    if (isDrmBlocked(url)) {
      reply.code(400);
      void record({ kind: 'errors', code: 'unsupported_platform', ip, via, url });
      return {
        code: 'unsupported_platform',
        message: 'This platform uses DRM protection and is not supported.',
      };
    }

    if (/instagram\.com\/stories\/[^/]+\/?$/.test(url)) {
      reply.code(403);
      void record({ kind: 'errors', code: 'instagram_login_required', ip, via, url });
      return {
        code: 'instagram_login_required',
        message: 'This Instagram content requires login. Try a public post or reel.',
      };
    }

    // Skip per-IP rate limit for valid API keys (their per-key quota applies instead).
    if (!req.apiKey) {
      const rl = await checkRateLimit(ip, 'probe').catch(() => null);
      if (rl) {
        reply.header('X-RateLimit-Limit', String(rl.limit));
        reply.header('X-RateLimit-Remaining', String(rl.remaining));
        if (!rl.allowed) {
          reply.code(429);
          void record({ kind: 'errors', code: 'youtube_rate_limited', ip, via });
          return {
            code: 'youtube_rate_limited',
            message: 'Too many requests. Slow down and try again in a minute.',
          };
        }
      }
    }

    const key = cacheKey(url);
    try {
      const cached = await redis.get(key);
      if (cached) {
        reply.header('X-Cache', 'HIT');
        const info = JSON.parse(cached);
        void record({ kind: 'probes', platform: info.platform, ip, via, url });
        return info;
      }
    } catch {
      /* cache failures should not block probe */
    }

    try {
      const raw = await runYtdlpProbe(url);
      const info = buildMediaInfo(raw, url);
      if (!info.platform || info.platform === 'default') {
        const fallback = detectPlatform(url);
        if (fallback) info.platform = fallback.id;
      }
      try {
        await redis.set(key, JSON.stringify(info), 'EX', CACHE_TTL_SECONDS);
      } catch {
        /* ignore cache write errors */
      }
      reply.header('X-Cache', 'MISS');
      void record({ kind: 'probes', platform: info.platform, ip, via, url });
      return info;
    } catch (err) {
      const e = err instanceof DownloadError ? err : new DownloadError('default', String(err), 500);
      reply.code(e.status);
      void record({ kind: 'errors', code: e.code, ip, via, url });
      return { code: e.code, message: e.message };
    }
  });
}
