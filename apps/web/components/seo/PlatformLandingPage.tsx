import Link from 'next/link';
import { ArrowRight, Smartphone, Terminal } from 'lucide-react';
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
import { SITE } from '@/lib/seo';

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

interface RelatedLink {
  href: string;
  name: string;
  desc: string;
}

const RELATED_BY_PLATFORM: Record<string, RelatedLink[]> = {
  youtube: [
    { href: '/youtube-to-mp3', name: 'YouTube to MP3', desc: 'High-quality audio' },
    { href: '/youtube-shorts-downloader', name: 'YouTube Shorts', desc: 'Vertical Shorts MP4' },
    { href: '/instagram-reel-downloader', name: 'Instagram Reels', desc: 'Save reels free' },
  ],
  instagram: [
    { href: '/instagram-video-downloader', name: 'Instagram Videos', desc: 'Posts & IGTV' },
    { href: '/tiktok-downloader', name: 'TikTok', desc: 'No watermark MP4' },
    { href: '/youtube-shorts-downloader', name: 'YouTube Shorts', desc: 'Vertical clips' },
  ],
  tiktok: [
    { href: '/instagram-reel-downloader', name: 'Instagram Reels', desc: 'Save reels free' },
    { href: '/youtube-shorts-downloader', name: 'YouTube Shorts', desc: 'Vertical Shorts' },
    { href: '/twitter-video-downloader', name: 'Twitter / X', desc: 'Tweet videos' },
  ],
  facebook: [
    { href: '/instagram-reel-downloader', name: 'Instagram Reels', desc: 'Save reels free' },
    { href: '/youtube-downloader', name: 'YouTube', desc: 'Videos in 4K' },
    { href: '/twitter-video-downloader', name: 'Twitter / X', desc: 'Tweet videos' },
  ],
  twitter: [
    { href: '/reddit-video-downloader', name: 'Reddit', desc: 'Video + audio' },
    { href: '/tiktok-downloader', name: 'TikTok', desc: 'No watermark' },
    { href: '/instagram-video-downloader', name: 'Instagram Videos', desc: 'Posts & IGTV' },
  ],
  reddit: [
    { href: '/twitter-video-downloader', name: 'Twitter / X', desc: 'Videos & GIFs' },
    { href: '/youtube-downloader', name: 'YouTube', desc: 'Videos in 4K' },
    { href: '/tiktok-downloader', name: 'TikTok', desc: 'No watermark' },
  ],
  soundcloud: [
    { href: '/youtube-to-mp3', name: 'YouTube to MP3', desc: 'Audio from YT' },
    { href: '/youtube-downloader', name: 'YouTube', desc: 'Videos & music' },
    { href: '/twitter-video-downloader', name: 'Twitter / X', desc: 'Tweet audio' },
  ],
  pinterest: [
    { href: '/instagram-reel-downloader', name: 'Instagram Reels', desc: 'Save reels' },
    { href: '/tiktok-downloader', name: 'TikTok', desc: 'No watermark' },
    { href: '/youtube-shorts-downloader', name: 'YouTube Shorts', desc: 'Vertical clips' },
  ],
  vimeo: [
    { href: '/youtube-downloader', name: 'YouTube', desc: 'Videos in 4K' },
    { href: '/dailymotion-downloader', name: 'Dailymotion', desc: 'HD MP4' },
    { href: '/twitch-clip-downloader', name: 'Twitch', desc: 'Clips & VODs' },
  ],
  twitch: [
    { href: '/youtube-downloader', name: 'YouTube', desc: 'Videos in 4K' },
    { href: '/vimeo-downloader', name: 'Vimeo', desc: 'HD MP4' },
    { href: '/dailymotion-downloader', name: 'Dailymotion', desc: 'HD MP4' },
  ],
  dailymotion: [
    { href: '/youtube-downloader', name: 'YouTube', desc: 'Videos in 4K' },
    { href: '/vimeo-downloader', name: 'Vimeo', desc: 'Up to 4K' },
    { href: '/twitch-clip-downloader', name: 'Twitch', desc: 'Clips & VODs' },
  ],
};

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
  const related =
    RELATED_BY_PLATFORM[platformId] ?? [
      { href: '/youtube-downloader', name: 'YouTube', desc: 'Videos in 4K' },
      { href: '/instagram-reel-downloader', name: 'Instagram Reels', desc: 'Save reels' },
      { href: '/tiktok-downloader', name: 'TikTok', desc: 'No watermark' },
    ];

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
          { name: 'Home', url: SITE.url },
          { name: 'All Platforms', url: `${SITE.url}/all-platforms` },
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

      {/* Related downloaders — internal linking for SEO + helps users find more tools */}
      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-xl font-semibold">Other downloaders</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Save47 supports 1,000+ sites. Here are a few related to {platformName}:
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group flex items-center justify-between rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition hover:border-[var(--accent)]"
            >
              <div>
                <div className="text-sm font-semibold">{r.name}</div>
                <div className="mt-0.5 text-xs text-[var(--muted-foreground)]">{r.desc}</div>
              </div>
              <ArrowRight
                size={14}
                className="text-[var(--muted-foreground)] transition group-hover:text-[var(--accent)] group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/all-platforms"
            className="text-sm text-[var(--muted-foreground)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
          >
            See all 1,000+ supported platforms →
          </Link>
        </div>
      </section>
    </>
  );
}
