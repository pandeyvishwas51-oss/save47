import type { FastifyInstance } from 'fastify';
import { requireAdmin } from '../middleware/auth.js';
import {
  createApiKey,
  getKeyUsage,
  listApiKeys,
  revokeApiKey,
  type Plan,
} from '../services/apiKeys.js';
import { summary } from '../services/metrics.js';

export async function adminRoutes(app: FastifyInstance) {
  app.addHook('onRequest', async (req, reply) => {
    // Only protect /admin/* paths
    if (!req.url.startsWith('/admin')) return;
    await requireAdmin(req, reply);
  });

  app.get('/admin/metrics', async () => {
    return summary();
  });

  app.get('/admin/keys', async () => {
    const keys = await listApiKeys();
    return { count: keys.length, keys };
  });

  app.post<{ Body: { ownerEmail?: string; label?: string; plan?: Plan } }>(
    '/admin/keys',
    async (req, reply) => {
      const { ownerEmail, label, plan } = req.body ?? {};
      if (!ownerEmail || !ownerEmail.includes('@')) {
        reply.code(400);
        return { code: 'bad_request', message: 'ownerEmail required and must be valid email.' };
      }
      const issued = await createApiKey({ ownerEmail, label, plan });
      return issued;
    }
  );

  app.delete<{ Params: { id: string } }>('/admin/keys/:id', async (req, reply) => {
    const ok = await revokeApiKey(req.params.id);
    if (!ok) {
      reply.code(404);
      return { code: 'not_found', message: 'Key not found.' };
    }
    return { ok: true };
  });

  app.get<{ Params: { id: string } }>('/admin/keys/:id/usage', async (req) => {
    return getKeyUsage(req.params.id);
  });
}
