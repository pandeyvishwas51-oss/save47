import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { JsonLd, breadcrumbSchema, faqSchema, softwareApplicationSchema } from '@/components/seo/StructuredData';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { UrlInput } from '@/components/downloader/UrlInput';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/online-video-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'Online Video Downloader — Free, Browser-Based, No Install',
  description:
    'Download videos online from any website. No software install, no signup, no ads. Works on iPhone, Android, Mac, Windows, and Linux directly in your browser.',
  path: PATH,
  keywords: [
    'online video downloader',
    'online video downloader free',
    'browser video downloader',
    'web video downloader',
    'no install video downloader',
    'free online downloader',
    'video downloader online',
    'video saver online',
  ],
});

const FAQ = [
  {
    q: 'What is an online video downloader?',
    a: 'An online video downloader is a website that lets you save videos from another website to your device, without installing any software. Save47 is a privacy-respecting online video downloader that supports 1,000+ sites.',
  },
  {
    q: 'Is Save47 really an online tool — no install needed?',
    a: 'Yes. Save47 runs entirely in your browser. You can use it on any device with a modern browser: iPhone, Android, Mac, Windows, Linux, ChromeOS, even some smart TVs.',
  },
  {
    q: 'How is this different from desktop downloader apps?',
    a: 'Desktop apps require installation, OS-specific builds, manual updates, and many include ads or trackers. Save47 is the same engine (yt-dlp) wrapped in a clean web UI you can use from anywhere.',
  },
  {
    q: 'Will my videos be tracked?',
    a: 'No. Save47 does not log download URLs, store IPs beyond rate-limit windows, or share data with third parties. The website has no analytics tracker.',
  },
  {
    q: 'Can I use the online downloader on my phone?',
    a: 'Yes. Save47 is mobile-optimized. You can also install it as a Progressive Web App for a one-tap home screen icon, or use the dedicated Android APK.',
  },
];

const FEATURES = [
  'No software install — runs in any browser',
  '1,000+ supported video sites',
  'Free forever for personal use',
  'No ads, no trackers, no signup',
  'Works on iPhone, Android, desktop',
  'MP4, WebM, MP3 output formats',
  'Up to 4K when source supports it',
  'Open source — verify the code yourself',
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE.url },
          { name: 'Online Video Downloader', url: `${SITE.url}${PATH}` },
        ])}
      />
      <JsonLd data={faqSchema(FAQ)} />
      <JsonLd
        data={softwareApplicationSchema({
          name: 'Save47 — Online Video Downloader',
          description:
            'Free browser-based video downloader. No install. Supports 1,000+ sites including YouTube, Instagram, TikTok, Facebook, Twitter, Reddit, SoundCloud.',
          url: `${SITE.url}${PATH}`,
        })}
      />

      <section className="mx-auto max-w-3xl pt-8 text-center sm:pt-12">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Online video downloader
        </h1>
        <p className="mt-4 text-balance text-base text-[var(--muted-foreground)] sm:text-lg">
          Save videos from 1,000+ sites directly in your browser. No install. No ads. No login.
          Works on every device.
        </p>
        <div className="mt-8">
          <UrlInput />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Why Save47 is the best online video downloader
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f}
              className="flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4"
            >
              <Check size={16} className="shrink-0 text-[var(--success)]" />
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <h2 className="text-2xl font-bold tracking-tight">Most popular use cases</h2>
        <p className="mt-3 text-[var(--muted-foreground)]">
          People use the Save47 online downloader for hundreds of reasons. These are the top five.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: 'Saving YouTube tutorials for offline study',
              body: 'Programmers, language learners, and students download YouTube tutorials to watch on flights, in the gym, or anywhere offline. Save47 to MP4 or audio-only MP3.',
            },
            {
              title: 'Archiving Instagram and TikTok content you love',
              body: 'Reels and TikToks vanish when accounts go private or creators delete posts. Save the ones that matter to you with Save47 — no Instagram or TikTok account needed.',
            },
            {
              title: 'Capturing Twitter videos before tweets are deleted',
              body: 'Tweets and the videos in them get deleted constantly. If a video matters, save the MP4 with Save47 the moment you see it.',
            },
            {
              title: 'Downloading podcasts from SoundCloud',
              body: 'Many podcasts only host on SoundCloud. Save47 grabs the highest-quality audio stream as MP3 — no SoundCloud subscription required.',
            },
            {
              title: 'Converting any YouTube video to MP3 for music',
              body: 'High-quality MP3 extraction at the best bitrate YouTube serves. Embed metadata, cover art, and play in any music player.',
            },
            {
              title: 'Bulk downloading playlists for archives',
              body: 'The Save47 CLI handles entire YouTube playlists, Instagram account reels, or SoundCloud sets in one command. Perfect for archivists.',
            },
          ].map((u) => (
            <article
              key={u.title}
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5"
            >
              <h3 className="text-base font-semibold">{u.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{u.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">Browse by platform</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { href: '/youtube-downloader', name: 'YouTube' },
            { href: '/instagram-reel-downloader', name: 'Instagram' },
            { href: '/tiktok-downloader', name: 'TikTok' },
            { href: '/facebook-video-downloader', name: 'Facebook' },
            { href: '/twitter-video-downloader', name: 'Twitter / X' },
            { href: '/reddit-video-downloader', name: 'Reddit' },
            { href: '/soundcloud-downloader', name: 'SoundCloud' },
            { href: '/pinterest-video-downloader', name: 'Pinterest' },
            { href: '/all-platforms', name: 'See all 14+ →' },
          ].map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 text-center text-sm transition hover:border-[var(--accent)]"
            >
              {p.name}
            </Link>
          ))}
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
          Use Save47 now
          <ArrowRight size={14} />
        </Link>
      </section>
    </>
  );
}
