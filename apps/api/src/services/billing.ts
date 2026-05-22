import { redis } from './redis.js';
import type { Plan } from './apiKeys.js';

// Stripe is a runtime-optional dependency. We import lazily so the API still
// boots if Stripe is not configured (e.g. in dev without billing).
let stripeClient: any = null;

async function getStripe() {
  if (stripeClient) return stripeClient;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  // Dynamic import via Function constructor so TypeScript doesn't try to
  // resolve the module at build time; Stripe is an optional runtime dep.
  try {
    const dynImport = new Function('m', 'return import(m)') as (m: string) => Promise<{ default: new (k: string, opts: unknown) => unknown }>;
    const mod = await dynImport('stripe');
    const Ctor = mod.default;
    stripeClient = new Ctor(key, { apiVersion: '2024-06-20' });
    return stripeClient;
  } catch {
    return null;
  }
}

export const PLAN_PRICE_IDS: Record<Exclude<Plan, 'free'>, string | undefined> = {
  pro: process.env.STRIPE_PRICE_PRO,
  unlimited: process.env.STRIPE_PRICE_UNLIMITED,
};

export interface CheckoutInput {
  email: string;
  plan: 'pro' | 'unlimited';
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(input: CheckoutInput): Promise<string> {
  const stripe = await getStripe();
  if (!stripe) throw new Error('Billing is not configured.');
  const priceId = PLAN_PRICE_IDS[input.plan];
  if (!priceId) throw new Error(`Plan ${input.plan} is not available.`);

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: input.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    allow_promotion_codes: true,
    metadata: { plan: input.plan },
    subscription_data: { metadata: { plan: input.plan } },
  });
  return session.url ?? '';
}

export async function verifyWebhook(rawBody: Buffer, signature: string): Promise<any> {
  const stripe = await getStripe();
  if (!stripe) throw new Error('Stripe not configured');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET not set');
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}

// Customer ↔ key mapping: subscription.id -> key id.
export async function linkSubscription(subscriptionId: string, keyId: string): Promise<void> {
  await redis.set(`stripe:sub:${subscriptionId}`, keyId);
}
export async function lookupKeyForSubscription(subscriptionId: string): Promise<string | null> {
  return redis.get(`stripe:sub:${subscriptionId}`);
}
