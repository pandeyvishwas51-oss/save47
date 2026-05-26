import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/dailymotion-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'Dailymotion Downloader — Free HD MP4',
  description:
    'Download Dailymotion videos in HD MP4 for free. Save any public Dailymotion video to your device or extract MP3 audio. No login required.',
  path: PATH,
  keywords: [
    'dailymotion downloader',
    'download dailymotion videos',
    'dailymotion mp4',
    'dailymotion to mp3',
    'save dailymotion video',
    'dai.ly downloader',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="dailymotion"
      platformName="Dailymotion"
      h1="Dailymotion Video Downloader"
      intro="Save any public Dailymotion video as HD MP4. Free, no Dailymotion account required, supports both dailymotion.com and dai.ly short links."
      pageUrl={`${SITE.url}${PATH}`}
      steps={[
        'Open the Dailymotion video and copy its URL or dai.ly short link.',
        'Paste the link into Save47.',
        'Pick MP4 quality and click Download.',
      ]}
      formats={['MP4 1080p HD', 'MP4 720p', 'MP4 480p', 'MP3 audio']}
      faqs={[
        {
          q: 'Does it support dai.ly short links?',
          a: 'Yes. Both dailymotion.com/video/... and dai.ly/... short links are supported.',
        },
        {
          q: 'Can I download age-restricted videos?',
          a: 'Public age-restricted videos may require login on Dailymotion itself; those are not supported. Free public videos work fine.',
        },
        {
          q: 'Is the Dailymotion downloader free?',
          a: 'Yes. No ads, no signups, no daily limits for personal use.',
        },
        {
          q: 'Can I extract audio?',
          a: 'Yes — pick MP3 in the format picker to save just the soundtrack.',
        },
      ]}
    />
  );
}
