import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';
import { PLATFORM_FAQ_TEMPLATE } from '@/lib/faq';

const PATH = '/pinterest-video-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'Pinterest Video Downloader — Free Pin & Idea Pin MP4',
  description:
    'Download Pinterest videos, Idea Pins, and pins as MP4. Free, no Pinterest account needed.',
  path: PATH,
  keywords: [
    'pinterest video downloader',
    'pinterest downloader',
    'download pinterest videos',
    'idea pin downloader',
    'pinterest mp4',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="pinterest"
      platformName="Pinterest"
      h1="Pinterest Video Downloader"
      intro="Save Pinterest videos, Idea Pins, and pin GIFs as MP4. Free, fast, and no Pinterest account required."
      steps={[
        'Open the Pin in the Pinterest app or web, tap Share, and copy the link.',
        'Paste it into Save47 above.',
        'Click download — the video saves directly to your device.',
      ]}
      formats={['MP4 720p', 'MP4 480p', 'MP3 audio']}
      faqs={PLATFORM_FAQ_TEMPLATE('Pinterest')}
      pageUrl={`${SITE.url}${PATH}`}
    />
  );
}
