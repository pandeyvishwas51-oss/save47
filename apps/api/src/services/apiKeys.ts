import { createHash, randomBytes } from 'crypto';
import { redis } from './redis.js';

// API key model
// Storage:
//   key:<sha256(token)> -> JSON { id, ownerEmail, createdAt, label, plan, monthlyQuota, disabled }
//   keys:list -> ZSET of <id> by createdAt
//   key-usage:<id>:<YYYY-MM-DD> -> counter (TTL 35 days)
//   key-usage:<id>:total -> counter

export type Plan = 'free' | 'pro' | 'unlimited';

export interface ApiKey {
  id: string;
  hash: string;
  ownerEmail: string;
  label: string;
  plan: Plan;
  createdAt: number;
  monthlyQuota: number;
  disabled: boolean;
}

export interface IssuedKey extends ApiKey {
  token: string; // plaintext, only returned on creation
}

const KEY_PREFIX = 'sk_live_';

const PLAN_QUOTAS: Record<Plan, number> = {
  free: 200, // requests / month
  pro: 10000,
  unlimited: 1_000_000,
};

function sha256(s: string): string {
  return createHash('sha256').update(s).digest('hex');
}

export function generateToken(): string {
  return KEY_PREFIX + randomBytes(24).toString('base64url');
}

export async function createApiKey(input: {
  ownerEmail: string;
  label?: string;
  plan?: Plan;
}): Promise<IssuedKey> {
  const token = generateToken();
  const hash = sha256(token);
  const id = randomBytes(8).toString('hex');
  const plan: Plan = input.plan ?? 'free';
  const record: ApiKey = {
    id,
    hash,
    ownerEmail: input.ownerEmail.toLowerCase().trim(),
    label: input.label?.slice(0, 80) ?? 'default',
    plan,
    createdAt: Date.now(),
    monthlyQuota: PLAN_QUOTAS[plan],
    disabled: false,
  };
  await redis.set(`key:${hash}`, JSON.stringify(record));
  await redis.zadd('keys:list', record.createdAt, id);
  await redis.set(`key-id:${id}`, hash);
  return { ...record, token };
}

export async function lookupApiKey(token: string): Promise<ApiKey | null> {
  if (!token || !token.startsWith(KEY_PREFIX)) return null;
  const raw = await redis.get(`key:${sha256(token)}`);
  return raw ? (JSON.parse(raw) as ApiKey) : null;
}

export async function listApiKeys(): Promise<ApiKey[]> {
  const ids = await redis.zrange('keys:list', 0, -1, 'REV');
  if (!ids.length) return [];
  const hashes = await Promise.all(ids.map((id) => redis.get(`key-id:${id}`)));
  const records = await Promise.all(
    hashes.filter(Boolean).map((h) => redis.get(`key:${h}`))
  );
  return records
    .filter((r): r is string => !!r)
    .map((r) => JSON.parse(r) as ApiKey);
}

export async function revokeApiKey(id: string): Promise<boolean> {
  const hash = await redis.get(`key-id:${id}`);
  if (!hash) return false;
  const raw = await redis.get(`key:${hash}`);
  if (!raw) return false;
  const record = JSON.parse(raw) as ApiKey;
  record.disabled = true;
  await redis.set(`key:${hash}`, JSON.stringify(record));
  return true;
}

export async function recordKeyUsage(id: string): Promise<void> {
  const day = new Date().toISOString().slice(0, 10);
  const pipe = redis.pipeline();
  pipe.incr(`key-usage:${id}:${day}`);
  pipe.expire(`key-usage:${id}:${day}`, 35 * 24 * 3600);
  pipe.incr(`key-usage:${id}:total`);
  await pipe.exec();
}

export async function findKeyByOwnerEmail(email: string): Promise<ApiKey | null> {
  const keys = await listApiKeys();
  return keys.find((k) => k.ownerEmail === email.toLowerCase().trim()) ?? null;
}

export async function setKeyPlan(id: string, plan: Plan): Promise<ApiKey | null> {
  const hash = await redis.get(`key-id:${id}`);
  if (!hash) return null;
  const raw = await redis.get(`key:${hash}`);
  if (!raw) return null;
  const record = JSON.parse(raw) as ApiKey;
  const PLAN_QUOTAS: Record<Plan, number> = {
    free: 200,
    pro: 10000,
    unlimited: 1_000_000,
  };
  record.plan = plan;
  record.monthlyQuota = PLAN_QUOTAS[plan];
  record.disabled = false;
  await redis.set(`key:${hash}`, JSON.stringify(record));
  return record;
}

export async function getKeyUsage(
  id: string
): Promise<{ today: number; total: number; last30: Array<{ day: string; count: number }> }> {
  const today = new Date().toISOString().slice(0, 10);
  const days: string[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const [todayCount, totalCount, ...counts] = await Promise.all([
    redis.get(`key-usage:${id}:${today}`),
    redis.get(`key-usage:${id}:total`),
    ...days.map((day) => redis.get(`key-usage:${id}:${day}`)),
  ]);
  return {
    today: Number(todayCount ?? 0),
    total: Number(totalCount ?? 0),
    last30: days.map((day, i) => ({ day, count: Number(counts[i] ?? 0) })).reverse(),
  };
}

export async function isWithinQuota(record: ApiKey): Promise<boolean> {
  if (record.disabled) return false;
  const month = new Date().toISOString().slice(0, 7);
  // Simple monthly counter — we sum daily counters from this month.
  const days = await redis.keys(`key-usage:${record.id}:${month}*`);
  if (!days.length) return true;
  const counts = await Promise.all(days.map((k) => redis.get(k)));
  const used = counts.reduce((sum, c) => sum + Number(c ?? 0), 0);
  return used < record.monthlyQuota;
}
