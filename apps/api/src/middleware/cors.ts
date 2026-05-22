import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';

export async function registerCors(app: FastifyInstance) {
  const allowed = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  await app.register(cors, {
    origin: (origin, cb) => {
      // Allow same-origin / non-browser tools (no Origin header).
      if (!origin) return cb(null, true);
      if (allowed.includes('*') || allowed.includes(origin)) return cb(null, true);
      cb(new Error('Origin not allowed'), false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: false,
  });
}
