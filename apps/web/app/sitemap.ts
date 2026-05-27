import type { MetadataRoute } from 'next';
import { listGuideSlugs, GUIDES } from '@/lib/guides';
import { SITE } from '@/lib/seo';

// Single sitemap covering every indexable URL (~37 entries today).
// Once we cross ~5K URLs we'll switch to a multi-sitemap split.
//
// Each entry carries an image: extension pointing at the page's OG image,
// so Google can use it as the featured image in SERPs.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const ogImage = (title: string): string =>
    `${SITE.url}/og?title=${encodeURIComponent(title.slice(0, 80))}`;

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
    { path: '/youtube-downloader', title: 'YouTube Video Downloader', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/youtube-mp4-downloader', title: 'YouTube to MP4 Downloader', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/youtube-to-mp3', title: 'YouTube to MP3 Converter', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/youtube-shorts-downloader', title: 'YouTube Shorts Downloader', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/instagram-reel-downloader', title: 'Instagram Reel Downloader', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/instagram-video-downloader', title: 'Instagram Video Downloader', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/tiktok-downloader', title: 'TikTok Video Downloader', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/facebook-video-downloader', title: 'Facebook Video Downloader', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/twitter-video-downloader', title: 'Twitter / X Video Downloader', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/reddit-video-downloader', title: 'Reddit Video Downloader', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/soundcloud-downloader', title: 'SoundCloud to MP3 Downloader', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/pinterest-video-downloader', title: 'Pinterest Video Downloader', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/vimeo-downloader', title: 'Vimeo Video Downloader', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/twitch-clip-downloader', title: 'Twitch Clip Downloader', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/dailymotion-downloader', title: 'Dailymotion Video Downloader', priority: 0.85, changeFrequency: 'weekly' },
  ];

  const guides: Entry[] = listGuideSlugs().map((slug) => {
    const g = GUIDES.find((x) => x.slug === slug)!;
    return {
      path: `/guides/${slug}`,
      priority: 0.7,
      changeFrequency: 'monthly',
      title: g.title,
      lastModified: new Date(g.updatedAt),
    };
  });

  const legal: Entry[] = [
    { path: '/terms', title: 'Terms of Use', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/privacy', title: 'Privacy Policy', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/dmca', title: 'DMCA Policy', priority: 0.3, changeFrequency: 'monthly' },
  ];

  return [...core, ...platforms, ...guides, ...legal].map((e) => ({
    url: `${SITE.url}${e.path}`,
    lastModified: e.lastModified ?? now,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
    images: [ogImage(e.title)],
  }));
}
