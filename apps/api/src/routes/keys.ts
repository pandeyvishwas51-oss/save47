import type { FastifyInstance } from 'fastify';
import { createApiKey } from '../services/apiKeys.js';
import { redis } from '../services/redis.js';

// Public endpoint — anyone can request a free-tier key. Rate-limited per IP
// to prevent abuse.

export async function keyRequestRoutes(app: FastifyInstance) {
  app.post<{ Body: { email?: string; label?: string } }>(
    '/keys/request',
    async (req, reply) => {
      const email = req.body?.email?.trim().toLowerCase();
      if (!email || !email.includes('@')) {
        reply.code(400);
        return { code: 'bad_request', message: 'Valid email required.' };
      }
      // 3 keys per email per day, 5 per IP per day.
      const ipKey = `keyreq:ip:${req.ip}`;
      const emailKey = `keyreq:email:${email}`;
      const [ipCount, emailCount] = await Promise.all([redis.incr(ipKey), redis.incr(emailKey)]);
      if (ipCount === 1) await redis.expire(ipKey, 24 * 3600);
      if (emailCount === 1) await redis.expire(emailKey, 24 * 3600);
      if (ipCount > 5 || emailCount > 3) {
        reply.code(429);
        return { code: 'rate_limited', message: 'Too many key requests. Try again tomorrow.' };
      }
      const issued = await createApiKey({
        ownerEmail: email,
        label: req.body?.label?.slice(0, 80) ?? 'self-serve',
        plan: 'free',
      });
      return {
        token: issued.token,
        id: issued.id,
        plan: issued.plan,
        monthlyQuota: issued.monthlyQuota,
      };
    }
  );
}
