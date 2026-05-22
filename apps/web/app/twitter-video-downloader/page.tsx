import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/twitter-video-downloader`;

export const metadata: Metadata = {
  title: 'Twitter / X Video Downloader — Free MP4',
  description:
    'Download videos and GIFs from Twitter (X) in MP4 format. Free, fast, no watermark, no login.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Twitter / X Video Downloader',
    description: 'Download Twitter videos in MP4. Free, no login.',
    url: PAGE_URL,
  },
};

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="twitter"
      platformName="Twitter / X"
      h1="Twitter / X Video Downloader"
      intro="Save videos and GIFs from any public tweet in HD MP4. No login, no watermark."
      pageUrl={PAGE_URL}
      steps={[
        'Open the tweet and copy its link from the share menu.',
        'Paste the link above.',
        'Choose MP4 quality and click Download.',
      ]}
      formats={['MP4 HD', 'MP4 SD', 'MP3 Audio']}
      faqs={[
        {
          q: 'Does it work for tweets that are protected?',
          a: 'No. Only publicly accessible tweets are supported.',
        },
        {
          q: 'Are GIFs supported?',
          a: 'Twitter serves GIFs as MP4 videos, so yes — they download as MP4.',
        },
        {
          q: 'Can I extract just the audio?',
          a: 'Yes — pick the MP3 option in the picker.',
        },
        {
          q: 'Does Save47 add a watermark?',
          a: 'No. Save47 returns the original media as it appears on Twitter.',
        },
        {
          q: 'Are downloads logged?',
          a: 'No. We only log per-IP rate limit counters which expire automatically.',
        },
      ]}
    />
  );
}
