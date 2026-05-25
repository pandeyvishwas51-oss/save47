import type { FastifyInstance } from 'fastify';
import {
  requireAdmin,
  checkAdminCredentials,
  issueAdminSession,
  verifyAdminSession,
  adminAuthConfigured,
} from '../middleware/auth.js';
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
    // Only protect /admin/* paths. Public sub-paths are allowed through.
    if (!req.url.startsWith('/admin')) return;
    if (req.url.startsWith('/admin/login')) return;
    if (req.url.startsWith('/admin/config')) return;
    await requireAdmin(req, reply);
  });

  // Tells the frontend whether email+password login is configured on this server.
  // Lets the UI render a sensible message when ADMIN_PASSWORD has not been set yet.
  app.get('/admin/config', async () => {
    const cfg = adminAuthConfigured();
    return {
      passwordLoginEnabled: cfg.passwordConfigured,
      legacyTokenEnabled: cfg.legacyTokenConfigured,
      adminEmail: cfg.email,
    };
  });

  // Email + password login. Returns a signed session token on success.
  app.post<{ Body: { email?: string; password?: string } }>('/admin/login', async (req, reply) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      reply.code(400);
      return { code: 'bad_request', message: 'Email and password are required.' };
    }
    if (!checkAdminCredentials(email, password)) {
      reply.code(401);
      return { code: 'unauthorized', message: 'Invalid email or password.' };
    }
    const token = issueAdminSession(email);
    if (!token) {
      reply.code(503);
      return {
        code: 'admin_disabled',
        message: 'Admin login is not configured on the server. Set ADMIN_PASSWORD.',
      };
    }
    return { ok: true, token, email: email.toLowerCase().trim() };
  });

  // Lets the UI verify a stored session is still valid (e.g. on page load).
  app.get('/admin/me', async (req, reply) => {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
    const session = token ? verifyAdminSession(token) : null;
    if (!session) {
      reply.code(401);
      return { code: 'unauthorized', message: 'Session invalid or expired.' };
    }
    return { ok: true, email: session.sub, exp: session.exp };
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
