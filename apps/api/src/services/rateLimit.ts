import { redis } from './redis.js';

// Per-IP sliding window rate limiter using Redis sorted sets.
// Probe: 60 requests per minute per IP (configurable via env)
// Download: 15 downloads per hour per IP (configurable via env)

export type RateLimitAction = 'probe' | 'download';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

function getLimits(action: RateLimitAction): { max: number; windowSeconds: number } {
  if (action === 'probe') {
    return {
      max: Number(process.env.RATE_LIMIT_PROBE_PER_MINUTE) || 60,
      windowSeconds: 60,
    };
  }
  return {
    max: Number(process.env.RATE_LIMIT_DOWNLOADS_PER_HOUR) || 15,
    windowSeconds: 3600,
  };
}

export async function checkRateLimit(
  ip: string,
  action: RateLimitAction
): Promise<RateLimitResult> {
  const { max, windowSeconds } = getLimits(action);
  const key = `ratelimit:${action}:${ip}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  const pipe = redis.pipeline();
  pipe.zremrangebyscore(key, 0, windowStart);
  pipe.zadd(key, now, `${now}-${Math.random()}`);
  pipe.zcard(key);
  pipe.expire(key, windowSeconds);

  const results = await pipe.exec();
  const count = (results?.[2]?.[1] as number) ?? 0;

  return {
    allowed: count <= max,
    remaining: Math.max(0, max - count),
    resetAt: now + windowSeconds * 1000,
    limit: max,
  };
}
