import type { FastifyReply, FastifyRequest } from 'fastify';
import { isWithinQuota, lookupApiKey, recordKeyUsage, type ApiKey } from '../services/apiKeys.js';

declare module 'fastify' {
  interface FastifyRequest {
    apiKey?: ApiKey;
  }
}

function extractToken(req: FastifyRequest): string | undefined {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7).trim();
  const headerKey = req.headers['x-api-key'];
  if (typeof headerKey === 'string') return headerKey.trim();
  const queryKey = (req.query as Record<string, string | undefined>)?.api_key;
  if (queryKey) return queryKey;
  return undefined;
}

// Optional API key — populates req.apiKey if present and valid, otherwise no-op.
export async function attachApiKey(req: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const token = extractToken(req);
  if (!token) return;
  const key = await lookupApiKey(token);
  if (key && !key.disabled) {
    req.apiKey = key;
  }
}

// Required API key — rejects request if missing/disabled/over-quota.
export async function requireApiKey(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const token = extractToken(req);
  if (!token) {
    reply.code(401).send({ code: 'missing_api_key', message: 'API key required.' });
    return;
  }
  const key = await lookupApiKey(token);
  if (!key || key.disabled) {
    reply.code(401).send({ code: 'invalid_api_key', message: 'Invalid or disabled API key.' });
    return;
  }
  const ok = await isWithinQuota(key);
  if (!ok) {
    reply.code(429).send({ code: 'quota_exceeded', message: 'Monthly quota reached.' });
    return;
  }
  await recordKeyUsage(key.id);
  req.apiKey = key;
}

// Admin auth — bearer token compared in constant time.
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (!ADMIN_TOKEN) {
    reply.code(503).send({ code: 'admin_disabled', message: 'ADMIN_TOKEN not configured.' });
    return;
  }
  const token = extractToken(req);
  if (!token || !timingSafeEqual(token, ADMIN_TOKEN)) {
    reply.code(401).send({ code: 'unauthorized', message: 'Invalid admin token.' });
    return;
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
