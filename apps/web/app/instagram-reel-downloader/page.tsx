import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/instagram-reel-downloader`;

export const metadata: Metadata = {
  title: 'Instagram Reel Downloader — Save Reels Free',
  description:
    'Download Instagram reels, posts and IGTV videos in HD for free. No login, no watermark, works on phone and desktop.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Instagram Reel Downloader — Save Reels Free',
    description: 'Download Instagram reels in HD. Free. No login.',
    url: PAGE_URL,
  },
};

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="instagram"
      platformName="Instagram"
      h1="Instagram Reel Downloader"
      intro="Save Instagram reels, posts and IGTV videos in HD. Free, no login, works on any device."
      pageUrl={PAGE_URL}
      steps={[
        'In Instagram, tap the share icon and copy the post or reel link.',
        'Paste the link in the input above.',
        'Click Download to save the video to your device.',
      ]}
      formats={['MP4 HD', 'MP4 SD', 'MP3 Audio']}
      faqs={[
        {
          q: 'Can I download private Instagram content?',
          a: 'No. Save47 only supports public posts and reels. Private content requires a logged-in session and we never bypass platform privacy.',
        },
        {
          q: 'Will the downloaded video have a watermark?',
          a: 'Save47 returns the original Instagram media as-is. We do not add watermarks.',
        },
        {
          q: 'Does it work on iPhone and Android?',
          a: 'Yes. The site runs in any modern mobile browser. You can also install Save47 as an app and share links to it directly.',
        },
        {
          q: 'Are there download limits?',
          a: 'There are reasonable per-IP rate limits to prevent abuse, but no daily caps for normal personal use.',
        },
        {
          q: 'Do you store any reels I download?',
          a: 'No. Save47 proxies the download in real time and never persists media files.',
        },
      ]}
    />
  );
}
