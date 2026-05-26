import { createHash } from 'crypto';
import type { FastifyInstance } from 'fastify';
import { redis } from '../services/redis.js';
import { checkRateLimit } from '../services/rateLimit.js';
import { streamVideo, probeUrl as runYtdlpProbe, parseYtdlpError } from '../services/ytdlp.js';
import { buildFormatSelector, sanitizeFilename, buildMediaInfo } from '../services/formats.js';
import { isDrmBlocked, isValidUrl } from '../services/platforms.js';
import { validateTurnstile } from '../middleware/turnstile.js';
import { attachApiKey } from '../middleware/auth.js';
import { record } from '../services/metrics.js';
import { DownloadError, type MediaInfo } from '../types.js';

interface DownloadQuery {
  url?: string;
  formatId?: string;
  quality?: string;
  token?: string;
  filename?: string;
}

function cacheKey(url: string): string {
  return `probe:${createHash('sha256').update(url).digest('hex')}`;
}

async function getCachedOrProbe(url: string): Promise<MediaInfo> {
  const key = cacheKey(url);
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached) as MediaInfo;
  } catch {
    /* fall through to fresh probe */
  }
  const raw = await runYtdlpProbe(url);
  return buildMediaInfo(raw, url);
}

export async function downloadRoutes(app: FastifyInstance) {
  app.get<{ Querystring: DownloadQuery }>('/download', { preHandler: attachApiKey }, async (req, reply) => {
    const url = req.query.url?.trim();
    const formatId = req.query.formatId?.trim() || 'best';
    const quality = req.query.quality?.trim() || formatId;
    const token = req.query.token;
    const ip = req.ip;
    const via: 'web' | 'api' = req.apiKey ? 'api' : 'web';

    if (!url || !isValidUrl(url)) {
      reply.code(400);
      void record({ kind: 'errors', code: 'no_video_found', ip, via });
      return { code: 'no_video_found', message: 'Provide a valid URL.' };
    }
    if (isDrmBlocked(url)) {
      reply.code(400);
      void record({ kind: 'errors', code: 'unsupported_platform', ip, via, url });
      return {
        code: 'unsupported_platform',
        message: 'This platform uses DRM protection and is not supported.',
      };
    }

    // Turnstile / rate limits — skipped for valid API-key requests.
    if (!req.apiKey) {
      const allowedToken = await validateTurnstile(token, ip);
      if (!allowedToken) {
        reply.code(403);
        return { code: 'default', message: 'Bot protection check failed. Reload and try again.' };
      }
      const rl = await checkRateLimit(ip, 'download').catch(() => null);
      if (rl) {
        reply.header('X-RateLimit-Limit', String(rl.limit));
        reply.header('X-RateLimit-Remaining', String(rl.remaining));
        if (!rl.allowed) {
          reply.code(429);
          void record({ kind: 'errors', code: 'youtube_rate_limited', ip, via });
          return {
            code: 'youtube_rate_limited',
            message: 'Hourly download limit reached. Try again later.',
          };
        }
      }
    }

    let title = 'download';
    let platform: string | undefined;
    try {
      const info = await getCachedOrProbe(url);
      title = info.title || title;
      platform = info.platform;
    } catch (err) {
      const e = err instanceof DownloadError ? err : parseYtdlpError(String(err));
      reply.code(e.status);
      void record({ kind: 'errors', code: e.code, ip, via, url });
      return { code: e.code, message: e.message };
    }

    const { selector, audioOnly, ext } = buildFormatSelector(formatId, quality);
    const filename = req.query.filename
      ? sanitizeFilename(req.query.filename, ext)
      : sanitizeFilename(title, ext);

    const handle = streamVideo(url, selector, audioOnly);

    // Defer sending response headers until yt-dlp produces the first byte.
    // If yt-dlp fails before any output (e.g. login-required, rate-limit),
    // we can still return a clean JSON error via fastify's reply. Once we
    // start streaming, the raw socket is owned by us and any further error
    // can only be signaled by closing the connection early.
    let bytesWritten = 0;
    let headersSent = false;
    const sendHeaders = () => {
      if (headersSent) return;
      headersSent = true;
      reply.raw.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`
      );
      reply.raw.setHeader(
        'Content-Type',
        audioOnly ? 'audio/mpeg' : ext === 'webm' ? 'video/webm' : 'video/mp4'
      );
      reply.raw.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      reply.raw.setHeader('X-Accel-Buffering', 'no');
      reply.hijack();
    };

    handle.stream.on('data', (chunk: Buffer) => {
      if (!headersSent) sendHeaders();
      bytesWritten += chunk.length;
      reply.raw.write(chunk);
    });

    req.raw.on('close', () => {
      if (!reply.raw.writableEnded) {
        handle.kill();
      }
    });

    return new Promise<void>((resolve, reject) => {
      handle.process.on('error', (err) => {
        if (!headersSent) {
          reply.code(500).send({ code: 'default', message: err.message });
        } else if (!reply.raw.writableEnded) {
          reply.raw.end();
        }
        reject(err);
      });
      handle.process.on('close', (code) => {
        if (code !== 0 && !headersSent) {
          const e = parseYtdlpError(handle.stderrBuffer.value);
          reply.code(e.status).send({ code: e.code, message: e.message });
          void record({ kind: 'errors', code: e.code, ip, via, url, platform });
          resolve();
          return;
        }
        if (headersSent && !reply.raw.writableEnded) reply.raw.end();
        void record({ kind: 'downloads', platform, ip, via, url });
        resolve();
      });
    });
  });
}
