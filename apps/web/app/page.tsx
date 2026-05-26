import { Suspense } from 'react';
import Link from 'next/link';
import {
  Apple,
  Code2,
  Download,
  Globe,
  Lock,
  Smartphone,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import { UrlInput } from '@/components/downloader/UrlInput';
import { PlatformGrid } from '@/components/PlatformGrid';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import {
  JsonLd,
  faqSchema,
  softwareApplicationSchema,
} from '@/components/seo/StructuredData';
import { HOMEPAGE_FAQ } from '@/lib/faq';
import { SITE } from '@/lib/seo';
import { ShareTargetHandler } from './share-target-handler';

interface HomePageProps {
  searchParams: Promise<{ url?: string; text?: string; title?: string }>;
}

const SITE_URL = SITE.url;

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const shared = pickSharedUrl(params);

  return (
    <>
      <JsonLd
        data={softwareApplicationSchema({
          name: 'Save47',
          description:
            'Free video and audio downloader for YouTube, Instagram, TikTok, Facebook, Twitter, Reddit, SoundCloud and 1000+ sites. No ads, no login.',
          url: SITE_URL,
        })}
      />
      <JsonLd data={faqSchema(HOMEPAGE_FAQ)} />

      {shared && <ShareTargetHandler url={shared} />}

      {/* HERO */}
      <section className="relative isolate mx-auto max-w-3xl pt-8 text-center sm:pt-16">
        <div
          className="absolute -top-20 left-1/2 -z-10 h-72 w-[28rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)' }}
          aria-hidden
        />

        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
          <Sparkles size={12} className="text-[var(--accent)]" />
          1000+ sites · No ads · No tracking · Open source
        </div>

        <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
          Download videos from anywhere.
        </h1>
        <p className="mt-4 text-balance text-base text-[var(--muted-foreground)] sm:text-lg">
          Paste any link from YouTube, Instagram, TikTok, Reddit, Twitter and 1,000+ other sites.
          Get the file. Move on.
        </p>

        <div className="mt-8">
          <Suspense>
            <UrlInput initialValue={shared ?? ''} autoSubmit={!!shared} />
          </Suspense>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {['YouTube', 'Instagram', 'TikTok', 'Facebook', 'Twitter', 'Reddit', 'SoundCloud'].map(
            (p) => (
              <span
                key={p}
                className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1 text-xs text-[var(--muted-foreground)]"
              >
                {p}
              </span>
            )
          )}
        </div>

        {/* CTA TRIO */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <Link
            href="#downloader"
            className="group flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
          >
            <Globe size={16} />
            Use on web
          </Link>
          <Link
            href="/download/apk"
            className="group flex items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 text-sm font-medium transition hover:border-[var(--accent)]"
          >
            <Smartphone size={16} />
            Get Android APK
          </Link>
          <Link
            href="/api"
            className="group flex items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 text-sm font-medium transition hover:border-[var(--accent)]"
          >
            <Terminal size={16} />
            API & CLI
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto mt-24 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={<Zap size={18} />}
          title="Direct streaming"
          desc="Bytes go from source to your browser. We never store anything on disk."
        />
        <FeatureCard
          icon={<Lock size={18} />}
          title="Privacy-first"
          desc="No accounts, no cookies, no analytics. Just a URL in and a file out."
        />
        <FeatureCard
          icon={<Download size={18} />}
          title="Every format"
          desc="MP4 up to 4K, MP3 audio, full quality picker. No watermarks, no re-encodes."
        />
        <FeatureCard
          icon={<Code2 size={18} />}
          title="Built for devs"
          desc="REST API and CLI for bulk downloads from your terminal or scripts."
        />
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto mt-24 max-w-4xl">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
        <p className="mt-3 text-center text-[var(--muted-foreground)]">Three steps. No account.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { n: 1, t: 'Copy the link', d: 'Tap share on any social app, copy the URL.' },
            { n: 2, t: 'Paste into Save47', d: 'Drop the link into the input above.' },
            { n: 3, t: 'Pick quality + download', d: 'Choose MP4 quality or MP3 audio. Done.' },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)]/15 text-sm font-semibold text-[var(--accent)]">
                {s.n}
              </div>
              <h3 className="mt-4 font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APK BANNER */}
      <section className="mx-auto mt-24 max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-[var(--card-border)] bg-gradient-to-br from-[var(--card)] to-transparent p-8 sm:p-10">
          <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
                <Apple size={12} />
                Coming to iOS · Available on Android
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">Get Save47 on Android</h2>
              <p className="mt-3 text-[var(--muted-foreground)]">
                Install the APK to receive shared links directly from any social app. The app is a
                native shell over the web experience and updates automatically.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/download/apk"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
                >
                  <Smartphone size={16} />
                  Download APK
                </Link>
                <Link
                  href="#downloader"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 text-sm font-medium transition hover:border-[var(--accent)]"
                >
                  <Globe size={16} />
                  Or use it on web
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--background)] p-5 font-mono text-xs">
              <div className="text-[var(--muted-foreground)]"># Install via terminal</div>
              <div className="mt-2 text-[var(--foreground)]">
                $ adb install save47-latest.apk
              </div>
              <div className="mt-4 text-[var(--muted-foreground)]"># Or use the CLI</div>
              <div className="mt-2 text-[var(--foreground)]">
                $ npx save47-cli download &lt;url&gt;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="mx-auto mt-24 grid max-w-3xl grid-cols-2 gap-3 text-center sm:grid-cols-4">
        {['No ads', 'No account', 'No tracking', '1000+ sites'].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-4"
          >
            <p className="text-sm font-medium">{label}</p>
          </div>
        ))}
      </section>

      <PlatformGrid />

      {/* POPULAR DOWNLOADERS — internal links to platform-specific landing pages */}
      <section className="mx-auto mt-24 max-w-5xl">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Popular downloaders
          </h2>
          <Link
            href="/all-platforms"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            View all →
          </Link>
        </div>
        <p className="mt-3 text-[var(--muted-foreground)]">
          Dedicated guides for the most-used platforms.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/youtube-downloader', name: 'YouTube Downloader', desc: 'MP4 4K, 1080p, 720p, 480p' },
            { href: '/youtube-to-mp3', name: 'YouTube to MP3', desc: 'High-quality audio extraction' },
            { href: '/instagram-reel-downloader', name: 'Instagram Reels', desc: 'No watermark, no login' },
            { href: '/tiktok-downloader', name: 'TikTok Downloader', desc: 'Watermark-free MP4' },
            { href: '/facebook-video-downloader', name: 'Facebook Video', desc: 'Public videos & Reels' },
            { href: '/twitter-video-downloader', name: 'Twitter / X Video', desc: 'Videos and GIFs' },
            { href: '/reddit-video-downloader', name: 'Reddit (with audio)', desc: 'Auto-merged sound' },
            { href: '/soundcloud-downloader', name: 'SoundCloud to MP3', desc: 'Tracks and mixes' },
            { href: '/youtube-shorts-downloader', name: 'YouTube Shorts', desc: 'Vertical MP4' },
          ].map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 transition hover:border-[var(--accent)]"
            >
              <div className="font-semibold">{p.name}</div>
              <div className="mt-1 text-xs text-[var(--muted-foreground)]">{p.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-24 max-w-3xl" id="faq">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked
        </h2>
        <p className="mt-3 text-center text-[var(--muted-foreground)]">
          Privacy, formats, mobile, terminal — all the common questions.
        </p>
        <div className="mt-8">
          <FaqAccordion items={HOMEPAGE_FAQ} />
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{desc}</p>
    </div>
  );
}

function pickSharedUrl(params: { url?: string; text?: string; title?: string }): string | null {
  for (const candidate of [params.url, params.text, params.title]) {
    if (!candidate) continue;
    const match = candidate.match(/https?:\/\/\S+/);
    if (match) return match[0];
  }
  return null;
}
