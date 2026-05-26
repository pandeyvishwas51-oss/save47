import type { MetadataRoute } from 'next';
import { listGuideSlugs } from '@/lib/guides';
import { SITE } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 3600 * 1000);

  const core: Array<{ path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }> = [
    { path: '/', priority: 1, changeFrequency: 'daily' },
    { path: '/all-platforms', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/api', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/download/apk', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/compare', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/guides', priority: 0.8, changeFrequency: 'weekly' },
  ];

  const platforms = [
    'youtube-downloader',
    'youtube-to-mp3',
    'youtube-shorts-downloader',
    'instagram-reel-downloader',
    'instagram-video-downloader',
    'tiktok-downloader',
    'facebook-video-downloader',
    'twitter-video-downloader',
    'reddit-video-downloader',
    'soundcloud-downloader',
    'pinterest-video-downloader',
    'vimeo-downloader',
    'twitch-clip-downloader',
    'dailymotion-downloader',
  ].map((slug) => ({
    path: `/${slug}`,
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  }));

  const guides = listGuideSlugs().map((slug) => ({
    path: `/guides/${slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));

  const legal = [
    { path: '/terms', priority: 0.3, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' as const },
    { path: '/dmca', priority: 0.3, changeFrequency: 'monthly' as const },
  ];

  return [...core, ...platforms, ...guides, ...legal].map((entry) => ({
    url: `${SITE.url}${entry.path}`,
    lastModified: entry.path.startsWith('/guides/') ? lastWeek : now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
