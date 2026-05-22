import { Redis } from 'ioredis';

const host = process.env.REDIS_HOST || 'localhost';
const port = Number(process.env.REDIS_PORT) || 6379;
const password = process.env.REDIS_PASSWORD || undefined;

export const redis = new Redis({
  host,
  port,
  password,
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

export const redisConnection = { host, port, password };
