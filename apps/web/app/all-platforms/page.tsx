import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/seo/StructuredData';
import { pageMetadata, SITE } from '@/lib/seo';
import { UrlInput } from '@/components/downloader/UrlInput';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { PLATFORM_COLORS } from '@/lib/platforms';

const PATH = '/all-platforms';

export const metadata: Metadata = pageMetadata({
  title: 'All Supported Platforms — 1,000+ Sites Save47 Can Download From',
  description:
    'Save47 supports YouTube, Instagram, TikTok, Facebook, Twitter, Reddit, SoundCloud, Pinterest, Vimeo, Twitch, Dailymotion and 1,000+ other sites via yt-dlp. See the full list.',
  path: PATH,
  keywords: [
    'video downloader sites',
    'supported platforms',
    'yt-dlp supported sites',
    'all in one video downloader',
    'video downloader list',
    'social media downloader',
  ],
});

interface PlatformLink {
  name: string;
  href: string;
  desc: string;
  color: string;
}

const PLATFORMS_WITH_PAGES: PlatformLink[] = [
  { name: 'YouTube', href: '/youtube-downloader', desc: 'Videos in 4K, 1080p, 720p, MP3', color: PLATFORM_COLORS.youtube },
  { name: 'YouTube Shorts', href: '/youtube-shorts-downloader', desc: 'Vertical Shorts MP4 + audio', color: PLATFORM_COLORS.youtube },
  { name: 'YouTube to MP3', href: '/youtube-to-mp3', desc: '320kbps audio extraction', color: PLATFORM_COLORS.youtube },
  { name: 'Instagram Reels', href: '/instagram-reel-downloader', desc: 'Reels, no watermark', color: PLATFORM_COLORS.instagram },
  { name: 'Instagram Videos', href: '/instagram-video-downloader', desc: 'Posts, IGTV, carousel', color: PLATFORM_COLORS.instagram },
  { name: 'TikTok', href: '/tiktok-downloader', desc: 'No watermark MP4 + MP3', color: PLATFORM_COLORS.tiktok },
  { name: 'Facebook', href: '/facebook-video-downloader', desc: 'Videos, Reels, Watch links', color: PLATFORM_COLORS.facebook },
  { name: 'Twitter / X', href: '/twitter-video-downloader', desc: 'Videos and GIFs in MP4', color: PLATFORM_COLORS.twitter },
  { name: 'Reddit', href: '/reddit-video-downloader', desc: 'Video + audio merged', color: PLATFORM_COLORS.reddit },
  { name: 'SoundCloud', href: '/soundcloud-downloader', desc: 'Tracks, mixes, podcasts', color: PLATFORM_COLORS.soundcloud },
  { name: 'Pinterest', href: '/pinterest-video-downloader', desc: 'Pins, Idea Pins, GIFs', color: PLATFORM_COLORS.pinterest },
  { name: 'Vimeo', href: '/vimeo-downloader', desc: 'Up to 4K MP4 + MP3', color: PLATFORM_COLORS.vimeo },
  { name: 'Twitch', href: '/twitch-clip-downloader', desc: 'Clips and VOD highlights', color: PLATFORM_COLORS.twitch },
  { name: 'Dailymotion', href: '/dailymotion-downloader', desc: 'HD MP4 + MP3 extraction', color: PLATFORM_COLORS.dailymotion },
];

const OTHER_SUPPORTED = [
  'Bilibili', 'BitChute', 'Bluesky', 'Brightcove', 'Crunchyroll (free)',
  'CBS News', 'Discovery+', 'Disney+ (DRM-free clips)', 'Drive (Google)',
  'eporner', 'ESPN', 'Facebook Live (after end)', 'Fox News', 'Funimation',
  'Giphy', 'Hulu (DRM-free trailers)', 'Imgur', 'Imgflip', 'Kick',
  'Likee', 'Loom', 'Mastodon', 'Mixcloud', 'NBC News', 'Newgrounds',
  'OK.ru', 'PBS', 'Peertube', 'Periscope (archives)', 'PornHub',
  'RTL', 'Rumble', 'SoundCloud Sets', 'Streamable', 'TED Talks',
  'Telegram (public channels)', 'Tumblr', 'TV5MONDE', 'Udemy (free preview)',
  'VK', 'Vlive', 'Wistia', 'XHamster', 'Xvideos', 'Yahoo News',
  'YouPorn', 'Zoom (recordings)', 'Plus 950+ more',
];

const FAQ = [
  {
    q: 'How many sites does Save47 support?',
    a: 'Over 1,000 sites. Save47 is built on yt-dlp, the most actively maintained video extractor in the open source world. If yt-dlp can extract from a site, Save47 can download from it.',
  },
  {
    q: 'My favorite site is not in your dedicated landing pages. Does it still work?',
    a: 'Almost certainly yes. The dedicated pages exist for the most popular platforms, but the homepage URL input handles any site yt-dlp supports. Just paste your link.',
  },
  {
    q: 'Why are some sites blocked?',
    a: 'DRM-protected services (Netflix, Disney+ premium content, Apple Music, Spotify) are deliberately blocked. Bypassing DRM is illegal in most jurisdictions and we will not assist with it.',
  },
  {
    q: 'A site I tried does not work — what should I do?',
    a: 'Send us the URL via the API page contact form. We update extraction monthly and can usually patch a broken site within a few days.',
  },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE.url },
          { name: 'All Platforms', url: `${SITE.url}${PATH}` },
        ])}
      />
      <JsonLd data={faqSchema(FAQ)} />

      <section className="mx-auto max-w-3xl pt-6 text-center sm:pt-10">
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
          Every platform Save47 supports
        </h1>
        <p className="mt-4 text-balance text-base text-[var(--muted-foreground)]">
          We have dedicated landing pages for the most popular platforms below, plus 1,000+ more
          sites supported via the universal URL input. Paste any link to try it.
        </p>
        <div className="mt-8">
          <UrlInput />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="mb-6 text-xl font-semibold">Dedicated downloaders</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORMS_WITH_PAGES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex items-center justify-between rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition hover:border-[var(--accent)]"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: p.color }}
                />
                <div>
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{p.desc}</div>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-[var(--muted-foreground)] transition group-hover:text-[var(--accent)] group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="mb-2 text-xl font-semibold">Plus 1,000+ more sites</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Paste any URL from the sites below directly into Save47 — they all work.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {OTHER_SUPPORTED.map((name) => (
            <span
              key={name}
              className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1 text-xs text-[var(--muted-foreground)]"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-xl font-semibold">Frequently asked</h2>
        <div className="mt-6">
          <FaqAccordion items={FAQ} />
        </div>
      </section>
    </>
  );
}
