import 'dotenv/config';
import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import { registerCors } from './middleware/cors.js';
import { healthRoutes } from './routes/health.js';
import { probeRoutes } from './routes/probe.js';
import { downloadRoutes } from './routes/download.js';
import { streamRoutes } from './routes/stream.js';
import { v1Routes } from './routes/v1.js';
import { adminRoutes } from './routes/admin.js';
import { keyRequestRoutes } from './routes/keys.js';
import { billingRoutes } from './routes/billing.js';
import { proxyRoutes } from './routes/proxy.js';

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || '0.0.0.0';

async function main() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
    trustProxy: true,
    bodyLimit: 1 * 1024 * 1024, // 1 MB — we don't accept large bodies
  });

  await registerCors(app);
  await app.register(helmet, {
    contentSecurityPolicy: false, // not needed for an API; the web app sets its own CSP
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });

  await app.register(healthRoutes);
  await app.register(probeRoutes);
  await app.register(downloadRoutes);
  await app.register(streamRoutes);
  await app.register(v1Routes);
  await app.register(adminRoutes);
  await app.register(keyRequestRoutes);
  await app.register(billingRoutes);
  await app.register(proxyRoutes);

  app.setErrorHandler((err, _req, reply) => {
    app.log.error(err);
    if (reply.sent) return;
    reply.code(err.statusCode || 500).send({
      code: 'default',
      message: err.message || 'Internal server error',
    });
  });

  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`Save47 API listening on http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  const shutdown = async (signal: string) => {
    app.log.info(`${signal} received, shutting down...`);
    await app.close();
    process.exit(0);
  };
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
