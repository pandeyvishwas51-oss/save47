'use client';

import * as React from 'react';
import { Check, Copy, KeyRound, Loader2, Mail, Terminal } from 'lucide-react';
import { FaqAccordion, type FaqItem } from '@/components/seo/FaqAccordion';
import { API_BASE_URL } from '@/lib/api';
import { cn } from '@/lib/utils';

interface IssuedKey {
  token: string;
  id: string;
  plan: string;
  monthlyQuota: number;
}

export function ApiDocsView({ faq }: { faq: FaqItem[] }) {
  const [email, setEmail] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [issued, setIssued] = React.useState<IssuedKey | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submitKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/keys/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, label }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to issue key');
      }
      setIssued(data as IssuedKey);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="mx-auto max-w-3xl pt-8 text-center sm:pt-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
          <Terminal size={12} className="text-[var(--accent)]" />
          REST API · CLI · Bulk endpoint
        </div>
        <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Download videos from your terminal
        </h1>
        <p className="mt-4 text-balance text-base text-[var(--muted-foreground)] sm:text-lg">
          A small REST API for scripting bulk downloads. Free tier, instant key issuance, no
          signup beyond an email.
        </p>
      </section>

      {/* Key request */}
      <section className="mx-auto mt-12 max-w-2xl">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-[var(--accent)]" />
            <h2 className="text-xl font-semibold">Get a free API key</h2>
          </div>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Free tier: 200 requests / month. Plenty for personal scripts and one-off batches.
          </p>

          {issued ? (
            <IssuedKeyCard issued={issued} />
          ) : (
            <form onSubmit={submitKey} className="mt-5 space-y-3">
              <label className="block">
                <span className="text-xs font-medium text-[var(--muted-foreground)]">Email</span>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3">
                  <Mail size={14} className="text-[var(--muted-foreground)]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 bg-transparent py-2.5 text-sm focus:outline-none"
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-[var(--muted-foreground)]">
                  Label (optional)
                </span>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. archive-bot"
                  className="mt-1 w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none"
                />
              </label>
              {error && (
                <p className="rounded-xl border border-[var(--error)]/40 bg-[var(--error)]/10 px-3 py-2 text-sm text-[var(--error)]">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !email}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
                {loading ? 'Issuing key…' : 'Issue free key'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Quick start */}
      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">Quick start</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Replace <code className="rounded bg-[var(--card)] px-1.5 py-0.5 text-xs">$SAVE47_KEY</code>{' '}
          with the token issued above.
        </p>

        <div className="mt-6 grid gap-4">
          <CodeBlock
            title="Probe a URL (metadata only)"
            code={`curl '${API_BASE_URL}/v1/probe?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ' \\
  -H "Authorization: Bearer $SAVE47_KEY"`}
          />
          <CodeBlock
            title="Download a file"
            code={`curl -L --output video.mp4 \\
  '${API_BASE_URL}/download?url=<URL>&formatId=1080p' \\
  -H "Authorization: Bearer $SAVE47_KEY"`}
          />
          <CodeBlock
            title="Bulk probe (up to 50 URLs)"
            code={`curl -X POST '${API_BASE_URL}/v1/bulk' \\
  -H "Authorization: Bearer $SAVE47_KEY" \\
  -H 'Content-Type: application/json' \\
  -d '{"urls": ["https://youtu.be/abc", "https://youtu.be/def"], "concurrency": 4}'`}
          />
          <CodeBlock
            title="Use the CLI"
            code={`# install
npm i -g save47-cli

# configure
save47 login $SAVE47_KEY

# download
save47 download "https://www.tiktok.com/@user/video/123"

# bulk
save47 bulk urls.txt --concurrency 4 --out ./downloads`}
          />
        </div>
      </section>

      {/* Endpoint reference */}
      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">Endpoint reference</h2>
        <div className="mt-6 space-y-4">
          <Endpoint
            method="GET"
            path="/v1/probe"
            desc="Returns metadata + available formats for a URL. Cached for 10 minutes."
          />
          <Endpoint
            method="GET"
            path="/download"
            desc="Streams the media file. Set Authorization to skip per-IP rate limit and Turnstile."
          />
          <Endpoint
            method="POST"
            path="/v1/bulk"
            desc="Body: { urls: string[], concurrency?: 1-8 }. Returns metadata for each URL."
          />
          <Endpoint
            method="GET"
            path="/v1/me"
            desc="Returns your key info: id, plan, monthly quota, label, created timestamp."
          />
        </div>
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

function IssuedKeyCard({ issued }: { issued: IssuedKey }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(issued.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="mt-5 space-y-3 rounded-xl border border-[var(--success)]/40 bg-[var(--success)]/10 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--success)]">
        <Check size={14} />
        Key issued — save it now, this is the only time we show it
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-2.5 font-mono text-xs">
        <code className="flex-1 truncate">{issued.token}</code>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[var(--muted-foreground)] transition hover:bg-[var(--card)] hover:text-[var(--foreground)]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-xs text-[var(--muted-foreground)]">
        Plan: <span className="font-medium text-[var(--foreground)]">{issued.plan}</span> · Monthly
        quota: <span className="font-medium text-[var(--foreground)]">{issued.monthlyQuota}</span>
      </p>
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
      <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-2.5">
        <span className="text-xs font-medium text-[var(--muted-foreground)]">{title}</span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[var(--muted-foreground)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-xs leading-relaxed text-[var(--foreground)]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Endpoint({
  method,
  path,
  desc,
}: {
  method: 'GET' | 'POST';
  path: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
      <span
        className={cn(
          'rounded-md px-2 py-0.5 font-mono text-xs font-medium',
          method === 'GET'
            ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
            : 'bg-[var(--success)]/15 text-[var(--success)]'
        )}
      >
        {method}
      </span>
      <div className="min-w-0 flex-1">
        <code className="font-mono text-sm">{path}</code>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{desc}</p>
      </div>
    </div>
  );
}
