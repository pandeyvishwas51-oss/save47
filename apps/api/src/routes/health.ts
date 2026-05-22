import type { FastifyInstance } from 'fastify';
import { spawn } from 'child_process';
import { redis } from '../services/redis.js';

const startedAt = Date.now();

async function checkRedis(): Promise<'ok' | 'error'> {
  try {
    const reply = await redis.ping();
    return reply === 'PONG' ? 'ok' : 'error';
  } catch {
    return 'error';
  }
}

async function checkYtdlp(): Promise<'ok' | 'error'> {
  return new Promise((resolve) => {
    const proc = spawn(process.env.YTDLP_PATH || 'yt-dlp', ['--version']);
    let resolved = false;
    const finish = (status: 'ok' | 'error') => {
      if (resolved) return;
      resolved = true;
      resolve(status);
    };
    proc.on('error', () => finish('error'));
    proc.on('close', (code) => finish(code === 0 ? 'ok' : 'error'));
    setTimeout(() => {
      proc.kill();
      finish('error');
    }, 3000);
  });
}

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    const [r, y] = await Promise.all([checkRedis(), checkYtdlp()]);
    return {
      status: r === 'ok' && y === 'ok' ? 'ok' : 'degraded',
      redis: r,
      ytdlp: y,
      uptime: Math.round((Date.now() - startedAt) / 1000),
    };
  });
}
