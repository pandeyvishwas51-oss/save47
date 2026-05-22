import Link from 'next/link';
import { Smartphone, Terminal } from 'lucide-react';
import { UrlInput } from '@/components/downloader/UrlInput';
import { FaqAccordion } from './FaqAccordion';
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  softwareApplicationSchema,
} from './StructuredData';
import { platformColor } from '@/lib/platforms';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export interface PlatformLandingPageProps {
  platformId: string;
  platformName: string;
  h1: string;
  intro: string;
  steps: string[];
  faqs: Array<{ q: string; a: string }>;
  formats: string[];
  pageUrl: string;
}

export function PlatformLandingPage({
  platformId,
  platformName,
  h1,
  intro,
  steps,
  faqs,
  formats,
  pageUrl,
}: PlatformLandingPageProps) {
  const accent = platformColor(platformId);
  return (
    <>
      <JsonLd
        data={softwareApplicationSchema({
          name: `Save47 — ${platformName} Downloader`,
          description: intro,
          url: pageUrl,
        })}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={howToSchema({
          name: `How to download ${platformName} videos`,
          description: intro,
          steps: steps.map((s, i) => ({ name: `Step ${i + 1}`, text: s })),
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: platformName, url: pageUrl },
        ])}
      />

      <section className="mx-auto max-w-2xl pt-6 text-center sm:pt-10">
        <span
          className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: `${accent}1a`, color: accent }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          {platformName}
        </span>
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{h1}</h1>
        <p className="mt-4 text-balance text-base text-[var(--muted-foreground)]">{intro}</p>

        <div className="mt-8">
          <UrlInput />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Link
            href="/download/apk"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1 hover:text-[var(--foreground)]"
          >
            <Smartphone size={12} />
            Get APK
          </Link>
          <Link
            href="/api"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1 hover:text-[var(--foreground)]"
          >
            <Terminal size={12} />
            API & CLI
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-xl font-semibold">How to download {platformName} videos</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={i}
              className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4"
            >
              <div
                className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold text-white"
                style={{ background: accent }}
              >
                {i + 1}
              </div>
              <p className="text-sm">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-xl font-semibold">Supported formats</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {formats.map((f) => (
            <span
              key={f}
              className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1 text-xs"
            >
              {f}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <div className="mt-6">
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-3 text-center sm:grid-cols-4">
        {['No ads', 'No login', 'No tracking', 'Free forever'].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-4"
          >
            <p className="text-sm font-medium">{label}</p>
          </div>
        ))}
      </section>
    </>
  );
}
