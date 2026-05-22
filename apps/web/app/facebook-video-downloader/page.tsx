import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/facebook-video-downloader`;

export const metadata: Metadata = {
  title: 'Facebook Video Downloader — Free HD Download',
  description:
    'Download Facebook videos and reels in HD for free. Paste any public Facebook video link and save it to your device.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Facebook Video Downloader — Free HD Download',
    description: 'Download Facebook videos in HD. Free, no login.',
    url: PAGE_URL,
  },
};

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="facebook"
      platformName="Facebook"
      h1="Facebook Video Downloader"
      intro="Save public Facebook videos and reels in HD. Free, no login required."
      pageUrl={PAGE_URL}
      steps={[
        'Open the Facebook video and copy its link from the address bar or the Share menu.',
        'Paste the link in the box above.',
        'Pick a quality and click Download.',
      ]}
      formats={['MP4 HD', 'MP4 SD', 'MP3 Audio']}
      faqs={[
        {
          q: 'Can I download private Facebook videos?',
          a: 'No. Only public Facebook videos and reels are supported.',
        },
        {
          q: 'Does the downloader work on mobile?',
          a: 'Yes. Save47 works on every modern phone browser.',
        },
        {
          q: 'What qualities are available?',
          a: 'Save47 automatically lists every quality Facebook exposes for the video, up to the original.',
        },
        {
          q: 'Is the audio downloadable separately?',
          a: 'Yes — choose the MP3 option to extract just the soundtrack.',
        },
        {
          q: 'Do you keep my downloads?',
          a: 'No. Save47 proxies the download stream in real time and stores nothing.',
        },
      ]}
    />
  );
}
