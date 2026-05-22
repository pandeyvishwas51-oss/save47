import type { FastifyInstance } from 'fastify';
import {
  createApiKey,
  findKeyByOwnerEmail,
  setKeyPlan,
} from '../services/apiKeys.js';
import {
  createCheckoutSession,
  linkSubscription,
  lookupKeyForSubscription,
  verifyWebhook,
} from '../services/billing.js';

interface CheckoutBody {
  email?: string;
  plan?: 'pro' | 'unlimited';
}

export async function billingRoutes(app: FastifyInstance) {
  // Public: create a Stripe Checkout Session for an upgrade.
  app.post<{ Body: CheckoutBody }>('/billing/checkout', async (req, reply) => {
    const email = req.body?.email?.trim().toLowerCase();
    const plan = req.body?.plan;
    if (!email || !email.includes('@')) {
      reply.code(400);
      return { code: 'bad_request', message: 'Valid email required.' };
    }
    if (plan !== 'pro' && plan !== 'unlimited') {
      reply.code(400);
      return { code: 'bad_request', message: "plan must be 'pro' or 'unlimited'." };
    }
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    try {
      const url = await createCheckoutSession({
        email,
        plan,
        successUrl: `${siteUrl}/api?upgrade=success`,
        cancelUrl: `${siteUrl}/pricing?canceled=1`,
      });
      return { url };
    } catch (err) {
      reply.code(503);
      return { code: 'billing_unavailable', message: (err as Error).message };
    }
  });

  // Stripe webhook — needs the raw body for signature verification, so we
  // register a dedicated parser only for this route's content type.
  app.addContentTypeParser(
    'application/json',
    { parseAs: 'buffer' },
    (req, body, done) => {
      // We only want raw bodies for the webhook path; otherwise parse JSON.
      if (req.url === '/billing/webhook') {
        done(null, body);
      } else {
        try {
          const json = JSON.parse((body as Buffer).toString('utf8') || 'null');
          done(null, json);
        } catch (err) {
          done(err as Error, undefined);
        }
      }
    }
  );

  app.post('/billing/webhook', async (req, reply) => {
    const sig = req.headers['stripe-signature'];
    if (!sig || typeof sig !== 'string') {
      reply.code(400);
      return { ok: false };
    }
    let event: any;
    try {
      event = await verifyWebhook(req.body as Buffer, sig);
    } catch (err) {
      app.log.error({ err }, 'Stripe webhook verification failed');
      reply.code(400);
      return { ok: false };
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          const email: string | undefined = session.customer_details?.email || session.customer_email;
          const plan: 'pro' | 'unlimited' = (session.metadata?.plan as 'pro' | 'unlimited') ?? 'pro';
          const subscriptionId: string | undefined = session.subscription;
          if (email) {
            let key = await findKeyByOwnerEmail(email);
            if (!key) {
              const issued = await createApiKey({ ownerEmail: email, plan });
              key = issued;
            } else {
              await setKeyPlan(key.id, plan);
            }
            if (subscriptionId) await linkSubscription(subscriptionId, key.id);
          }
          break;
        }
        case 'customer.subscription.deleted':
        case 'customer.subscription.updated': {
          const sub = event.data.object;
          const status: string = sub.status;
          const keyId = await lookupKeyForSubscription(sub.id);
          if (keyId) {
            if (status === 'active' || status === 'trialing') {
              const plan = (sub.metadata?.plan as 'pro' | 'unlimited') ?? 'pro';
              await setKeyPlan(keyId, plan);
            } else {
              // Downgrade to free on cancellation / past_due.
              await setKeyPlan(keyId, 'free');
            }
          }
          break;
        }
        default:
          break;
      }
    } catch (err) {
      app.log.error({ err, type: event.type }, 'Stripe webhook handler error');
    }
    return { ok: true };
  });
}
