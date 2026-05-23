import { Redis } from 'ioredis';

// Railway / Upstash provide a single REDIS_URL. Honor that first;
// fall back to discrete host/port/password vars for local dev.
const url = process.env.REDIS_URL;

let host: string;
let port: number;
let password: string | undefined;
let tls: object | undefined;

if (url) {
  const parsed = new URL(url);
  host = parsed.hostname;
  port = Number(parsed.port) || (parsed.protocol === 'rediss:' ? 6380 : 6379);
  password = decodeURIComponent(parsed.password) || undefined;
  if (parsed.protocol === 'rediss:') tls = {};
} else {
  host = process.env.REDIS_HOST || 'localhost';
  port = Number(process.env.REDIS_PORT) || 6379;
  password = process.env.REDIS_PASSWORD || undefined;
}

export const redis = new Redis({
  host,
  port,
  password,
  tls,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: false,
});

redis.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('[redis] error:', err.message);
});

redis.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log(`[redis] connected to ${host}:${port}`);
});

export const redisConnection = { host, port, password, tls };
