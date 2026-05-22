'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check, Loader2 } from 'lucide-react';
import { FaqAccordion, type FaqItem } from '@/components/seo/FaqAccordion';
import { API_BASE_URL } from '@/lib/api';
import { cn } from '@/lib/utils';

interface PlanDef {
  id: 'free' | 'pro' | 'unlimited';
  name: string;
  price: string;
  cadence: string;
  highlight?: boolean;
  description: string;
  features: string[];
}

const PLANS: PlanDef[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    description: 'Web app, APK, and a starter API key for personal scripting.',
    features: [
      '200 API requests / month',
      'Unlimited web downloads',
      'Bulk endpoint (up to 50 URLs)',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9',
    cadence: '/ month',
    highlight: true,
    description: 'For automations, side projects, and small bots.',
    features: [
      '10,000 API requests / month',
      'Concurrency up to 8',
      'Priority queue',
      'Email support within 24 h',
    ],
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: '$49',
    cadence: '/ month',
    description: 'Everything you need for production-scale ingestion.',
    features: [
      '1,000,000 API requests / month',
      'Highest priority queue',
      'Dedicated worker capacity',
      'Email support within 4 h',
    ],
  },
];

export function PricingView({ faq }: { faq: FaqItem[] }) {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const upgrade = async (plan: 'pro' | 'unlimited') => {
    if (!email || !email.includes('@')) {
      setError('Enter the email you want this plan tied to.');
      return;
    }
    setError(null);
    setLoading(plan);
    try {
      const res = await fetch(`${API_BASE_URL}/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.message || 'Checkout is not available right now.');
      }
      window.location.href = data.url as string;
    } catch (e) {
      setError((e as Error).message);
      setLoading(null);
    }
  };

  return (
    <>
      <section className="mx-auto max-w-3xl pt-8 text-center sm:pt-12">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, honest pricing
        </h1>
        <p className="mt-4 text-balance text-base text-[var(--muted-foreground)] sm:text-lg">
          The web app and Android APK are free forever. Paid plans only unlock higher API quotas
          for automation and bulk workflows.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-md">
        <label className="block">
          <span className="text-xs font-medium text-[var(--muted-foreground)]">
            Email tied to your API key
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none"
          />
        </label>
        {error && (
          <p className="mt-2 text-center text-sm text-[var(--error)]">{error}</p>
        )}
      </section>

      <section className="mx-auto mt-10 grid max-w-5xl gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'flex flex-col rounded-2xl border bg-[var(--card)] p-6',
              plan.highlight ? 'border-[var(--accent)]' : 'border-[var(--card-border)]'
            )}
          >
            {plan.highlight && (
              <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--accent)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
                Most popular
              </span>
            )}
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{plan.description}</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
              <span className="text-sm text-[var(--muted-foreground)]">{plan.cadence}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              {plan.id === 'free' ? (
                <Link
                  href="/api"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--accent)]"
                >
                  Get a free key
                </Link>
              ) : (
                <button
                  onClick={() => upgrade(plan.id as 'pro' | 'unlimited')}
                  disabled={loading !== null}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-60',
                    plan.highlight
                      ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                      : 'border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--accent)]'
                  )}
                >
                  {loading === plan.id ? <Loader2 size={14} className="animate-spin" /> : null}
                  {loading === plan.id ? 'Redirecting…' : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-16 max-w-3xl pb-16">
        <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-6">
          <FaqAccordion items={faq} />
        </div>
      </section>
    </>
  );
}
