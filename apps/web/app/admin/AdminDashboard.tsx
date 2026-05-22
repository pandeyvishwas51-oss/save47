'use client';

import * as React from 'react';
import {
  Activity,
  AlertCircle,
  Check,
  Copy,
  Download as DownloadIcon,
  KeyRound,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import { cn, formatDuration } from '@/lib/utils';

interface MetricsSummary {
  totals: { probes: number; downloads: number; errors: number };
  today: { probes: number; downloads: number; errors: number };
  last14: Array<{ day: string; probes: number; downloads: number; errors: number }>;
  topPlatforms: Array<{ platform: string; count: number }>;
  topErrors: Array<{ code: string; count: number }>;
  recent: Array<{
    ts: number;
    kind: 'probes' | 'downloads' | 'errors';
    platform?: string;
    code?: string;
    via?: 'web' | 'api';
    url?: string;
    ip?: string;
  }>;
}

interface ApiKey {
  id: string;
  ownerEmail: string;
  label: string;
  plan: string;
  createdAt: number;
  monthlyQuota: number;
  disabled: boolean;
}

const TOKEN_KEY = 'save47:admin-token';

export function AdminDashboard() {
  const [token, setToken] = React.useState<string | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  if (!token) {
    return (
      <LoginCard
        onSubmit={(t) => {
          localStorage.setItem(TOKEN_KEY, t);
          setToken(t);
        }}
      />
    );
  }

  return (
    <Dashboard
      token={token}
      onLogout={() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }}
    />
  );
}

function LoginCard({ onSubmit }: { onSubmit: (token: string) => void }) {
  const [token, setToken] = React.useState('');
  return (
    <div className="mx-auto max-w-md pt-12">
      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-8">
        <div className="flex items-center gap-2">
          <KeyRound size={18} className="text-[var(--accent)]" />
          <h1 className="text-xl font-semibold">Admin login</h1>
        </div>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Paste the <code className="rounded bg-[var(--background)] px-1.5 py-0.5 text-xs">ADMIN_TOKEN</code>{' '}
          configured on the API server.
        </p>
        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (token.trim()) onSubmit(token.trim());
          }}
        >
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ADMIN_TOKEN"
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!token.trim()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [metrics, setMetrics] = React.useState<MetricsSummary | null>(null);
  const [keys, setKeys] = React.useState<ApiKey[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<'overview' | 'keys'>('overview');

  const authHeader = React.useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const reload = React.useCallback(async () => {
    setError(null);
    try {
      const [m, k] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/metrics`, { headers: authHeader }),
        fetch(`${API_BASE_URL}/admin/keys`, { headers: authHeader }),
      ]);
      if (m.status === 401 || k.status === 401) {
        setError('Invalid admin token. Sign out and re-enter.');
        return;
      }
      if (!m.ok || !k.ok) throw new Error(`API returned ${m.status}/${k.status}`);
      setMetrics((await m.json()) as MetricsSummary);
      const data = (await k.json()) as { keys: ApiKey[] };
      setKeys(data.keys);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [authHeader]);

  React.useEffect(() => {
    void reload();
    const interval = setInterval(reload, 15000);
    return () => clearInterval(interval);
  }, [reload]);

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--card-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Live metrics. Refreshes every 15s.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reload}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm transition hover:border-[var(--accent)]"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm transition hover:border-[var(--error)] hover:text-[var(--error)]"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </header>

      <nav className="mt-4 flex gap-1 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-1">
        {(['overview', 'keys'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 rounded-lg px-3 py-1.5 text-sm capitalize transition',
              tab === t
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            )}
          >
            {t}
          </button>
        ))}
      </nav>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-[var(--error)]/40 bg-[var(--error)]/10 px-4 py-3 text-sm text-[var(--error)]">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {tab === 'overview' && metrics && <Overview metrics={metrics} />}
      {tab === 'keys' && (
        <KeysPanel
          keys={keys ?? []}
          authHeader={authHeader}
          onChange={reload}
        />
      )}
    </div>
  );
}

function Overview({ metrics }: { metrics: MetricsSummary }) {
  const max = Math.max(
    1,
    ...metrics.last14.map((d) => Math.max(d.probes, d.downloads, d.errors))
  );

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Probes" total={metrics.totals.probes} today={metrics.today.probes} />
        <Stat
          label="Downloads"
          total={metrics.totals.downloads}
          today={metrics.today.downloads}
          accent
        />
        <Stat label="Errors" total={metrics.totals.errors} today={metrics.today.errors} danger />
      </div>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Last 14 days</h2>
          <Legend />
        </div>
        <div className="mt-5 flex h-40 items-end gap-2">
          {metrics.last14.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full items-end gap-0.5" style={{ height: '120px' }}>
                <Bar value={d.probes} max={max} color="var(--accent)" />
                <Bar value={d.downloads} max={max} color="var(--success)" />
                <Bar value={d.errors} max={max} color="var(--error)" />
              </div>
              <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                {d.day.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Activity size={14} /> Top platforms
          </h2>
          <ul className="mt-4 space-y-2">
            {metrics.topPlatforms.length === 0 && (
              <li className="text-sm text-[var(--muted-foreground)]">No data yet.</li>
            )}
            {metrics.topPlatforms.map((p) => (
              <li key={p.platform} className="flex items-center justify-between text-sm">
                <span className="capitalize">{p.platform}</span>
                <span className="font-mono text-xs text-[var(--muted-foreground)]">{p.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <AlertCircle size={14} /> Top error codes
          </h2>
          <ul className="mt-4 space-y-2">
            {metrics.topErrors.length === 0 && (
              <li className="text-sm text-[var(--muted-foreground)]">No errors yet.</li>
            )}
            {metrics.topErrors.map((e) => (
              <li key={e.code} className="flex items-center justify-between text-sm">
                <span className="font-mono text-xs">{e.code}</span>
                <span className="font-mono text-xs text-[var(--muted-foreground)]">{e.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Search size={14} /> Recent activity
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[var(--muted-foreground)]">
              <tr className="border-b border-[var(--card-border)]">
                <th className="py-2 pr-2 font-medium">Time</th>
                <th className="py-2 pr-2 font-medium">Kind</th>
                <th className="py-2 pr-2 font-medium">Platform</th>
                <th className="py-2 pr-2 font-medium">Via</th>
                <th className="py-2 pr-2 font-medium">Code</th>
                <th className="py-2 pr-2 font-medium">URL</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recent.slice(0, 30).map((r, i) => (
                <tr key={i} className="border-b border-[var(--card-border)]/50">
                  <td className="py-2 pr-2 font-mono text-[var(--muted-foreground)]">
                    {timeAgo(r.ts)}
                  </td>
                  <td className="py-2 pr-2">
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px]',
                        r.kind === 'downloads' && 'bg-[var(--success)]/15 text-[var(--success)]',
                        r.kind === 'probes' && 'bg-[var(--accent)]/15 text-[var(--accent)]',
                        r.kind === 'errors' && 'bg-[var(--error)]/15 text-[var(--error)]'
                      )}
                    >
                      {r.kind}
                    </span>
                  </td>
                  <td className="py-2 pr-2 capitalize">{r.platform ?? '—'}</td>
                  <td className="py-2 pr-2 text-[var(--muted-foreground)]">{r.via ?? '—'}</td>
                  <td className="py-2 pr-2 font-mono text-[10px]">{r.code ?? '—'}</td>
                  <td className="py-2 pr-2 max-w-xs truncate font-mono text-[10px] text-[var(--muted-foreground)]">
                    {r.url ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const h = Math.max(2, (value / max) * 100);
  return <div className="flex-1 rounded-t" style={{ height: `${h}%`, background: color }} title={String(value)} />;
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-[10px] text-[var(--muted-foreground)]">
      <LegendDot color="var(--accent)" label="Probes" />
      <LegendDot color="var(--success)" label="Downloads" />
      <LegendDot color="var(--error)" label="Errors" />
    </div>
  );
}
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-2 w-2 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}

function Stat({
  label,
  total,
  today,
  accent,
  danger,
}: {
  label: string;
  total: number;
  today: number;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border bg-[var(--card)] p-5',
        accent ? 'border-[var(--success)]/40' : danger ? 'border-[var(--error)]/40' : 'border-[var(--card-border)]'
      )}
    >
      <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums">{total.toLocaleString()}</p>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
        +{today.toLocaleString()} today
      </p>
    </div>
  );
}

function KeysPanel({
  keys,
  authHeader,
  onChange,
}: {
  keys: ApiKey[];
  authHeader: Record<string, string>;
  onChange: () => void;
}) {
  const [issuing, setIssuing] = React.useState(false);
  const [issued, setIssued] = React.useState<{ token: string; id: string } | null>(null);
  const [email, setEmail] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [plan, setPlan] = React.useState<'free' | 'pro' | 'unlimited'>('free');

  const issue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssuing(true);
    setIssued(null);
    const res = await fetch(`${API_BASE_URL}/admin/keys`, {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerEmail: email, label, plan }),
    });
    setIssuing(false);
    if (res.ok) {
      const data = await res.json();
      setIssued({ token: data.token, id: data.id });
      setEmail('');
      setLabel('');
      onChange();
    }
  };

  const revoke = async (id: string) => {
    if (!confirm('Revoke this API key? This cannot be undone.')) return;
    await fetch(`${API_BASE_URL}/admin/keys/${id}`, {
      method: 'DELETE',
      headers: authHeader,
    });
    onChange();
  };

  return (
    <div className="mt-6 space-y-6">
      <form
        onSubmit={issue}
        className="grid gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 sm:grid-cols-4"
      >
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="owner@example.com"
          className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label"
          className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value as 'free' | 'pro' | 'unlimited')}
          className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm"
        >
          <option value="free">Free (200/mo)</option>
          <option value="pro">Pro (10k/mo)</option>
          <option value="unlimited">Unlimited (1M/mo)</option>
        </select>
        <button
          type="submit"
          disabled={issuing}
          className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white sm:col-span-4"
        >
          {issuing ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
          Issue API key
        </button>
      </form>

      {issued && <IssuedAdminKey token={issued.token} />}

      <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-[var(--muted-foreground)]">
            <tr className="border-b border-[var(--card-border)]">
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Label</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {keys.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
                  No API keys issued yet.
                </td>
              </tr>
            )}
            {keys.map((k) => (
              <tr key={k.id} className="border-b border-[var(--card-border)]/50">
                <td className="px-4 py-3">{k.ownerEmail}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">{k.label}</td>
                <td className="px-4 py-3 capitalize">{k.plan}</td>
                <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                  {new Date(k.createdAt).toISOString().slice(0, 10)}
                </td>
                <td className="px-4 py-3">
                  {k.disabled ? (
                    <span className="rounded bg-[var(--error)]/15 px-2 py-0.5 text-xs text-[var(--error)]">
                      Revoked
                    </span>
                  ) : (
                    <span className="rounded bg-[var(--success)]/15 px-2 py-0.5 text-xs text-[var(--success)]">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {!k.disabled && (
                    <button
                      onClick={() => revoke(k.id)}
                      className="text-[var(--muted-foreground)] hover:text-[var(--error)]"
                      aria-label="Revoke"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IssuedAdminKey({ token }: { token: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="rounded-2xl border border-[var(--success)]/40 bg-[var(--success)]/10 p-4">
      <div className="text-sm font-medium text-[var(--success)]">Key issued — copy now:</div>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 font-mono text-xs">
        <code className="flex-1 truncate">{token}</code>
        <button
          onClick={copy}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

function timeAgo(ts: number): string {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return formatDuration(s);
}
