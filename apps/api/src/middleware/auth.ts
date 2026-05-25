import type { FastifyReply, FastifyRequest } from 'fastify';
import { createHmac, timingSafeEqual as cryptoTimingSafeEqual } from 'crypto';
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

// ----------------- Admin auth -----------------
//
// Two ways to authenticate as admin:
//   1) Email + password login → POST /admin/login → returns a signed session token.
//      The session token is what the web UI stores and sends as Bearer.
//   2) Raw ADMIN_TOKEN (legacy, for CLI / curl). Still accepted for back-compat.
//
// Session tokens are: base64url(payload).hex(hmac-sha256(payload, secret))
// payload = JSON {sub: email, iat, exp}
//
// Secret = ADMIN_SESSION_SECRET if set, else ADMIN_TOKEN (so it always has a key).

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'pandeyvishwas51@gmail.com').toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_TTL_SECONDS = Number(process.env.ADMIN_SESSION_TTL_SECONDS) || 60 * 60 * 24 * 7; // 7 days

function sessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || ADMIN_TOKEN || null;
}

function b64urlEncode(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

interface SessionPayload {
  sub: string;
  iat: number;
  exp: number;
}

export function issueAdminSession(email: string, ttlSeconds = SESSION_TTL_SECONDS): string | null {
  const secret = sessionSecret();
  if (!secret) return null;
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: email.toLowerCase().trim(),
    iat: now,
    exp: now + ttlSeconds,
  };
  const payloadEncoded = b64urlEncode(Buffer.from(JSON.stringify(payload)));
  const sig = createHmac('sha256', secret).update(payloadEncoded).digest('hex');
  return `${payloadEncoded}.${sig}`;
}

export function verifyAdminSession(token: string): SessionPayload | null {
  const secret = sessionSecret();
  if (!secret) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadEncoded, sig] = parts;
  const expected = createHmac('sha256', secret).update(payloadEncoded).digest('hex');
  if (!timingSafeEqual(sig, expected)) return null;
  let payload: SessionPayload;
  try {
    payload = JSON.parse(b64urlDecode(payloadEncoded).toString('utf8'));
  } catch {
    return null;
  }
  const now = Math.floor(Date.now() / 1000);
  if (!payload || typeof payload.exp !== 'number' || payload.exp < now) return null;
  if (payload.sub !== ADMIN_EMAIL) return null;
  return payload;
}

export function checkAdminCredentials(email: string, password: string): boolean {
  if (!ADMIN_PASSWORD) return false;
  if (!email || !password) return false;
  const emailOk = email.toLowerCase().trim() === ADMIN_EMAIL;
  const passOk = timingSafeEqual(password, ADMIN_PASSWORD);
  return emailOk && passOk;
}

export function adminAuthConfigured(): { passwordConfigured: boolean; legacyTokenConfigured: boolean; email: string } {
  return {
    passwordConfigured: Boolean(ADMIN_PASSWORD && sessionSecret()),
    legacyTokenConfigured: Boolean(ADMIN_TOKEN),
    email: ADMIN_EMAIL,
  };
}

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const token = extractToken(req);
  if (!token) {
    reply.code(401).send({ code: 'unauthorized', message: 'Admin auth required.' });
    return;
  }
  // 1) Try session token (issued by /admin/login).
  const session = verifyAdminSession(token);
  if (session) return;
  // 2) Fall back to legacy raw ADMIN_TOKEN bearer (for CLI/curl).
  if (ADMIN_TOKEN && timingSafeEqual(token, ADMIN_TOKEN)) return;

  reply.code(401).send({ code: 'unauthorized', message: 'Invalid admin credentials.' });
}

function timingSafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return cryptoTimingSafeEqual(ab, bb);
}
