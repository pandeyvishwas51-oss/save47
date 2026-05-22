import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/youtube-to-mp3`;

export const metadata: Metadata = {
  title: 'YouTube to MP3 Converter — Free, No Ads',
  description:
    'Convert any YouTube video to MP3 audio for free. High-quality 320kbps MP3, no ads, no login, instant download to any device.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'YouTube to MP3 Converter — Free, No Ads',
    description: 'Free YouTube to MP3. High quality. No login. No ads.',
    url: PAGE_URL,
  },
};

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="youtube"
      platformName="YouTube"
      h1="YouTube to MP3 Converter"
      intro="Convert any YouTube video to high-quality MP3 audio for free. No registration, no ads, instant download."
      pageUrl={PAGE_URL}
      steps={[
        'Copy a YouTube video link from your browser or the YouTube app.',
        'Paste it in the box above.',
        'Pick MP3 and click Download. Your file lands in your device.',
      ]}
      formats={['MP3 (320kbps)', 'MP4 1080p', 'MP4 720p', 'MP4 480p']}
      faqs={[
        {
          q: 'Is the YouTube to MP3 converter free?',
          a: 'Yes. Save47 is completely free with no ads, no logins and no daily limits.',
        },
        {
          q: 'What audio quality do I get?',
          a: 'Save47 extracts the highest available audio bitrate and encodes it to MP3 (typically 320kbps).',
        },
        {
          q: 'Do I need to install anything?',
          a: 'No. Save47 runs entirely in your browser. You can also install it as a PWA for one-tap access.',
        },
        {
          q: 'Is downloading YouTube content legal?',
          a: 'You should only download content you own, content released under permissive licenses, or content the rightsholder has explicitly allowed you to download.',
        },
        {
          q: 'Does Save47 keep a copy of my downloads?',
          a: 'No. Files stream directly from the source to your device. We never store your downloads.',
        },
      ]}
    />
  );
}
