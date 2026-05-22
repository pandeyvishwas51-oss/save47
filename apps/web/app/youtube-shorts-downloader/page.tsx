import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';
import { PLATFORM_FAQ_TEMPLATE } from '@/lib/faq';

const PATH = '/youtube-shorts-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'YouTube Shorts Downloader — Save Shorts MP4 Free',
  description:
    'Download YouTube Shorts as MP4 with audio. Free, no ads, no login. Works on iPhone, Android, and desktop.',
  path: PATH,
  keywords: [
    'youtube shorts downloader',
    'download youtube shorts',
    'youtube shorts to mp4',
    'save youtube shorts',
    'shorts downloader free',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="youtube"
      platformName="YouTube Shorts"
      h1="YouTube Shorts Downloader"
      intro="Save any public YouTube Short as a vertical MP4 with full audio. Works on iPhone, Android, and desktop without installing anything."
      steps={[
        'Tap Share on the Short and pick "Copy link".',
        'Paste the link into Save47 above.',
        'Choose MP4 and click download. The Short saves to your phone or Downloads folder.',
      ]}
      formats={['MP4 1080p (vertical)', 'MP4 720p', 'MP3 audio']}
      faqs={PLATFORM_FAQ_TEMPLATE('YouTube Shorts')}
      pageUrl={`${SITE.url}${PATH}`}
    />
  );
}
