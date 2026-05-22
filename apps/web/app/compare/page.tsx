import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/seo/StructuredData';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/compare';

export const metadata: Metadata = pageMetadata({
  title: 'Save47 vs Y2mate, SaveFrom, SnapTik — Honest Comparison',
  description:
    'Why Save47 is different from y2mate, SaveFrom, SnapTik, and other downloaders. No ads, no trackers, open source, with a real CLI and API.',
  path: PATH,
  keywords: [
    'save47 vs y2mate',
    'best free video downloader',
    'no ads video downloader',
    'open source downloader',
    'savefrom alternative',
    'y2mate alternative',
  ],
});

const FAQ = [
  {
    q: 'Why should I use Save47 instead of Y2mate or SaveFrom?',
    a: "Save47 has zero ads, no trackers, no fake download buttons, and is open source. Most other free downloaders monetize through aggressive advertising and data collection — we don't.",
  },
  {
    q: 'Is Save47 actually free?',
    a: 'Yes. The web app, Android APK, and CLI are completely free. We have an optional paid API tier for high-volume users, but personal use never costs anything.',
  },
  {
    q: 'Does Save47 add a watermark?',
    a: 'No. We deliver the original media file from the source platform. Some other tools add their branding to your downloads.',
  },
];

const ROWS: Array<{ feature: string; save47: boolean | string; y2mate: boolean | string; savefrom: boolean | string; snaptik: boolean | string }> = [
  { feature: 'No ads', save47: true, y2mate: false, savefrom: false, snaptik: false },
  { feature: 'No tracking', save47: true, y2mate: false, savefrom: false, snaptik: false },
  { feature: 'No login', save47: true, y2mate: true, savefrom: true, snaptik: true },
  { feature: 'Open source', save47: true, y2mate: false, savefrom: false, snaptik: false },
  { feature: 'No watermark', save47: true, y2mate: true, savefrom: true, snaptik: false },
  { feature: 'Direct streaming (no server cache)', save47: true, y2mate: false, savefrom: false, snaptik: false },
  { feature: 'CLI / API', save47: true, y2mate: false, savefrom: false, snaptik: false },
  { feature: 'Native Android app (no Play Store)', save47: true, y2mate: false, savefrom: false, snaptik: 'Play Store' },
  { feature: '4K downloads', save47: true, y2mate: 'limited', savefrom: 'paywall', snaptik: false },
  { feature: 'Supported sites', save47: '1,000+', y2mate: '~10', savefrom: '~30', snaptik: 'TikTok only' },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE.url },
          { name: 'Compare', url: `${SITE.url}${PATH}` },
        ])}
      />
      <JsonLd data={faqSchema(FAQ)} />

      <section className="mx-auto max-w-3xl pt-8 text-center sm:pt-12">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Save47 vs the rest
        </h1>
        <p className="mt-4 text-balance text-base text-[var(--muted-foreground)] sm:text-lg">
          We compared Save47 head-to-head with the most popular free video downloaders. Here&apos;s
          the honest breakdown — including the things we don&apos;t do.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-5xl overflow-x-auto rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
            <tr className="border-b border-[var(--card-border)]">
              <th className="px-5 py-4 font-medium">Feature</th>
              <th className="px-5 py-4 font-semibold text-[var(--accent)]">Save47</th>
              <th className="px-5 py-4 font-medium">Y2mate</th>
              <th className="px-5 py-4 font-medium">SaveFrom</th>
              <th className="px-5 py-4 font-medium">SnapTik</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.feature} className="border-b border-[var(--card-border)]/50 last:border-0">
                <td className="px-5 py-3.5 font-medium">{row.feature}</td>
                <Cell value={row.save47} highlight />
                <Cell value={row.y2mate} />
                <Cell value={row.savefrom} />
                <Cell value={row.snaptik} />
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <h2 className="text-xl font-semibold">Why no ads matter</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
            Free video downloaders typically monetize through aggressive ad networks, fake
            download buttons that install malware, and pop-ups. We chose to charge a small fee
            for the API instead — so the website can stay clean. It&apos;s a different business model.
          </p>
        </article>
        <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <h2 className="text-xl font-semibold">Open source means trustworthy</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
            Save47&apos;s code is public on GitHub. Anyone can verify there are no trackers, no data
            collection, and no hidden behavior. Closed-source downloaders ask you to trust them
            without any way to verify.
          </p>
        </article>
      </section>

      <section className="mx-auto mt-12 max-w-3xl text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
        >
          Try Save47 now
        </Link>
      </section>

      <section className="mx-auto mt-16 max-w-3xl pb-16">
        <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-6">
          <FaqAccordion items={FAQ} />
        </div>
      </section>
    </>
  );
}

function Cell({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  return (
    <td
      className={`px-5 py-3.5 ${highlight ? 'bg-[var(--accent)]/5 font-medium' : 'text-[var(--muted-foreground)]'}`}
    >
      {value === true ? (
        <Check size={16} className="text-[var(--success)]" />
      ) : value === false ? (
        <X size={16} className="text-[var(--error)]/70" />
      ) : (
        <span className="text-xs">{value}</span>
      )}
    </td>
  );
}
