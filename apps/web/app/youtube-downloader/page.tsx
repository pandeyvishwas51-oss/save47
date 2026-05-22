import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';
import { PLATFORM_FAQ_TEMPLATE } from '@/lib/faq';

const PATH = '/youtube-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'YouTube Video Downloader — Free, No Ads, MP4 + MP3',
  description:
    'Free YouTube video downloader. Save YouTube videos as MP4 in 1080p, 720p, 480p, or extract MP3 audio. No ads, no signup, no watermarks.',
  path: PATH,
  keywords: [
    'youtube downloader',
    'youtube video downloader',
    'download youtube videos',
    'youtube mp4 downloader',
    'youtube to mp4',
    'free youtube downloader',
    'youtube hd downloader',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="youtube"
      platformName="YouTube"
      h1="YouTube Video Downloader"
      intro="Paste any YouTube video URL and save it as MP4 or MP3 — up to 4K resolution when available. Works with regular videos, Shorts, and live streams. No ads, no login, no watermarks."
      steps={[
        'Copy the YouTube video URL from the address bar or the share menu.',
        'Paste it into the input above on Save47.',
        'Pick MP4 quality or MP3, then click download. Files arrive in seconds.',
      ]}
      formats={['MP4 4K', 'MP4 1080p', 'MP4 720p', 'MP4 480p', 'MP3 320kbps']}
      faqs={PLATFORM_FAQ_TEMPLATE('YouTube')}
      pageUrl={`${SITE.url}${PATH}`}
    />
  );
}
