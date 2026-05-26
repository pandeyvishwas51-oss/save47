import type { MetadataRoute } from 'next';
import { listGuideSlugs, GUIDES } from '@/lib/guides';
import { SITE } from '@/lib/seo';

// Single sitemap. Stays well under Google's 50,000-URL cap.
//
// Each platform / guide page declares its own OG image so Google can pick
// it up as a featured image. If the URL count ever crosses 5K we should
// split into a sitemap index (sitemap-platforms.xml, sitemap-guides.xml).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const ogFor = (path: string, title: string): MetadataRoute.Sitemap[number]['images'] => [
    `${SITE.url}/og?title=${encodeURIComponent(title.slice(0, 80))}`,
  ];

  type Entry = {
    path: string;
    priority: number;
    changeFrequency: 'daily' | 'weekly' | 'monthly';
    title: string;
    lastModified?: Date;
  };

  const core: Entry[] = [
    { path: '/', priority: 1, changeFrequency: 'daily', title: 'Save47 — Free Video Downloader' },
    { path: '/all-platforms', priority: 0.95, changeFrequency: 'weekly', title: 'All Supported Platforms' },
    { path: '/online-video-downloader', priority: 0.9, changeFrequency: 'weekly', title: 'Online Video Downloader' },
    { path: '/free-video-downloader', priority: 0.9, changeFrequency: 'weekly', title: 'Free Video Downloader' },
    { path: '/hd-video-downloader', priority: 0.9, changeFrequency: 'weekly', title: 'HD Video Downloader' },
    { path: '/api', priority: 0.9, changeFrequency: 'weekly', title: 'Save47 API & CLI' },
    { path: '/pricing', priority: 0.9, changeFrequency: 'weekly', title: 'Pricing' },
    { path: '/download/apk', priority: 0.9, changeFrequency: 'weekly', title: 'Save47 Android APK' },
    { path: '/compare', priority: 0.85, changeFrequency: 'monthly', title: 'Save47 vs other downloaders' },
    { path: '/guides', priority: 0.85, changeFrequency: 'weekly', title: 'Video Downloader Guides' },
  ];

  const platforms: Entry[] = [
    { path: '/youtube-downloader', title: 'YouTube Video Downloader' },
    { path: '/youtube-mp4-downloader', title: 'YouTube to MP4 Downloader' },
    { path: '/youtube-to-mp3', title: 'YouTube to MP3 Converter' },
    { path: '/youtube-shorts-downloader', title: 'YouTube Shorts Downloader' },
    { path: '/instagram-reel-downloader', title: 'Instagram Reel Downloader' },
    { path: '/instagram-video-downloader', title: 'Instagram Video Downloader' },
    { path: '/tiktok-downloader', title: 'TikTok Video Downloader' },
    { path: '/facebook-video-downloader', title: 'Facebook Video Downloader' },
    { path: '/twitter-video-downloader', title: 'Twitter / X Video Downloader' },
    { path: '/reddit-video-downloader', title: 'Reddit Video Downloader' },
    { path: '/soundcloud-downloader', title: 'SoundCloud to MP3 Downloader' },
    { path: '/pinterest-video-downloader', title: 'Pinterest Video Downloader' },
    { path: '/vimeo-downloader', title: 'Vimeo Video Downloader' },
    { path: '/twitch-clip-downloader', title: 'Twitch Clip Downloader' },
    { path: '/dailymotion-downloader', title: 'Dailymotion Video Downloader' },
  ].map((p) => ({ ...p, priority: 0.85, changeFrequency: 'weekly' as const }));

  const guides: Entry[] = listGuideSlugs().map((slug) => {
    const g = GUIDES.find((x) => x.slug === slug)!;
    return {
      path: `/guides/${slug}`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
      title: g.title,
      lastModified: new Date(g.updatedAt),
    };
  });

  const legal: Entry[] = [
    { path: '/terms', title: 'Terms of Use' },
    { path: '/privacy', title: 'Privacy Policy' },
    { path: '/dmca', title: 'DMCA Policy' },
  ].map((p) => ({ ...p, priority: 0.3, changeFrequency: 'monthly' as const }));

  return [...core, ...platforms, ...guides, ...legal].map((entry) => ({
    url: `${SITE.url}${entry.path}`,
    lastModified: entry.lastModified ?? now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    images: ogFor(entry.path, entry.title),
  }));
}
