import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { JsonLd, breadcrumbSchema, faqSchema, softwareApplicationSchema } from '@/components/seo/StructuredData';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { UrlInput } from '@/components/downloader/UrlInput';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/free-video-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'Free Video Downloader — No Ads, No Signup, 1000+ Sites',
  description:
    'A truly free video downloader. No ads, no trackers, no signup, no premium tier. Download from YouTube, Instagram, TikTok, and 1,000+ sites in seconds.',
  path: PATH,
  keywords: [
    'free video downloader',
    'free video downloader no ads',
    'free video downloader no signup',
    'best free video downloader',
    'free video downloader 2026',
    'free online video saver',
    'free hd video downloader',
    'free 4k video downloader',
  ],
});

const FAQ = [
  {
    q: 'Is Save47 truly free? What\'s the catch?',
    a: 'Save47 is fully free for personal use — web, Android APK, and CLI free tier. We have an optional paid API for high-volume programmatic access; that\'s how we keep the lights on. The website itself has zero ads.',
  },
  {
    q: 'How is Save47 free with no ads?',
    a: 'A small percentage of API users pay for higher quotas. That subsidizes the free web and mobile experience. It\'s a different business model from ad-supported downloaders.',
  },
  {
    q: 'Will Save47 stay free?',
    a: 'Yes. The web app and APK have always been free and will remain so. We commit to never adding ads to the free experience or paywalling existing features.',
  },
  {
    q: 'Is the free version limited?',
    a: 'For personal use, no. There are reasonable per-IP rate limits to prevent abuse, but you can download as many videos as you want for personal use without ever hitting a wall.',
  },
  {
    q: 'Are there hidden fees?',
    a: 'None. There is no signup, no credit card, no trial period. The web app downloads videos with no friction whatsoever.',
  },
  {
    q: 'Why are most "free" video downloaders not actually free?',
    a: 'They monetize through aggressive ads, fake download buttons, browser extension installs, and sometimes outright malware. The real cost is paid in your time, attention, and security risk.',
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE.url },
          { name: 'Free Video Downloader', url: `${SITE.url}${PATH}` },
        ])}
      />
      <JsonLd data={faqSchema(FAQ)} />
      <JsonLd
        data={softwareApplicationSchema({
          name: 'Save47 — Free Video Downloader',
          description:
            'Truly free video downloader. No ads. No trackers. No signup. 1,000+ supported sites.',
          url: `${SITE.url}${PATH}`,
        })}
      />

      <section className="mx-auto max-w-3xl pt-8 text-center sm:pt-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
          <Sparkles size={12} className="text-[var(--accent)]" />
          Truly free. No ads. No signup. No tricks.
        </div>
        <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          The free video downloader that&apos;s actually free
        </h1>
        <p className="mt-4 text-balance text-base text-[var(--muted-foreground)] sm:text-lg">
          Download videos from YouTube, Instagram, TikTok, Facebook, Twitter, Reddit and 1,000+
          other sites — without ads, signups, or hidden costs.
        </p>
        <div className="mt-8">
          <UrlInput />
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <Zap size={20} className="text-[var(--accent)]" />
          <h2 className="mt-3 text-base font-semibold">Zero ads</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            No banner ads, no pop-ups, no fake download buttons, no notification prompts.
          </p>
        </article>
        <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <ShieldCheck size={20} className="text-[var(--accent)]" />
          <h2 className="mt-3 text-base font-semibold">No tracking</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            No analytics scripts, no cookie banners, no third-party data brokers.
          </p>
        </article>
        <article className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <Sparkles size={20} className="text-[var(--accent)]" />
          <h2 className="mt-3 text-base font-semibold">No signup</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            No email, no password, no account. Paste a URL and download. That&apos;s it.
          </p>
        </article>
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">How does Save47 stay free?</h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--muted-foreground)]">
          <p>
            We monetize through an optional paid API tier for developers and businesses who need
            high-volume programmatic access. A small percentage of those users pay, and that
            subsidizes the free web app and Android APK for everyone else.
          </p>
          <p>
            This business model keeps the free experience clean. You don&apos;t see ads because the
            paid API users pay for the servers. We don&apos;t track you because we don&apos;t need
            advertiser data. We don&apos;t lock features behind premium tiers because the free
            experience is the product, and the API is the business.
          </p>
          <p>
            The downside: there is no graphical bulk-downloader UI in the free tier. If you need
            to download 1,000 videos at once you grab an API key and use the CLI. For one-off
            personal downloads the free web app is unbeatable.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">Frequently asked</h2>
        <div className="mt-6">
          <FaqAccordion items={FAQ} />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
        >
          Try Save47 now
          <ArrowRight size={14} />
        </Link>
      </section>
    </>
  );
}
