import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';
import { PLATFORM_FAQ_TEMPLATE } from '@/lib/faq';

const PATH = '/instagram-video-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'Instagram Video Downloader — Free, No Login, MP4 HD',
  description:
    'Download Instagram videos, Reels, and IGTV in HD. No login required for public posts. Free, no ads, no watermark.',
  path: PATH,
  keywords: [
    'instagram video downloader',
    'instagram downloader',
    'download instagram videos',
    'instagram mp4',
    'igtv downloader',
    'instagram reel downloader',
    'instagram story downloader',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="instagram"
      platformName="Instagram"
      h1="Instagram Video Downloader"
      intro="Save any public Instagram video, Reel, or IGTV as MP4 in HD. No login, no Instagram account needed. We pull straight from Instagram's CDN — quality is identical to the source."
      steps={[
        'Open the post on Instagram, tap the three-dot menu, and copy the link.',
        'Paste the link into Save47 above.',
        'Pick MP4 quality and download. Done in seconds.',
      ]}
      formats={['MP4 1080p HD', 'MP4 720p', 'MP3 audio']}
      faqs={PLATFORM_FAQ_TEMPLATE('Instagram')}
      pageUrl={`${SITE.url}${PATH}`}
    />
  );
}
