import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/facebook-video-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'Facebook Video Downloader — Free HD MP4 + Reels',
  description:
    'Download Facebook videos, reels and watch links in HD MP4 for free. Paste any public Facebook video link and save it to your phone or computer in seconds.',
  path: PATH,
  keywords: [
    'facebook video downloader',
    'facebook downloader',
    'download facebook videos',
    'facebook mp4',
    'fb video download',
    'facebook reels downloader',
    'fb watch downloader',
    'facebook to mp3',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="facebook"
      platformName="Facebook"
      h1="Facebook Video Downloader"
      intro="Save any public Facebook video, Reel, or Watch clip as HD MP4. Free, no Facebook login required, works on iPhone, Android, and desktop."
      pageUrl={`${SITE.url}${PATH}`}
      steps={[
        'Open the Facebook video and copy its link from the address bar or the Share menu.',
        'Paste the link in the input above.',
        'Pick MP4 quality and click Download. The video saves directly to your device.',
      ]}
      formats={['MP4 1080p HD', 'MP4 720p', 'MP4 480p', 'MP3 audio']}
      faqs={[
        {
          q: 'Can I download private Facebook videos?',
          a: 'No. Save47 only supports public videos, Reels and Watch links. Private posts, friends-only content, and group videos that require login are not supported.',
        },
        {
          q: 'Does the Facebook downloader work on iPhone and Android?',
          a: 'Yes. Save47 runs in any modern phone browser. You can also install Save47 as an app and share Facebook links directly to it.',
        },
        {
          q: 'What qualities are available?',
          a: 'Save47 lists every quality Facebook exposes for the video, up to the original. For most videos that means 1080p HD, 720p, and 480p.',
        },
        {
          q: 'Can I extract just the audio from a Facebook video?',
          a: 'Yes — choose the MP3 option in the format picker to extract just the soundtrack at the highest available bitrate.',
        },
        {
          q: 'Do you keep my downloads?',
          a: 'No. Save47 proxies the download in real time. Nothing is stored on our servers, no logs are kept of which videos you saved.',
        },
        {
          q: 'Does this work with Facebook Live videos?',
          a: 'Yes, after the live broadcast ends and Facebook saves the recording. Active live streams cannot be downloaded.',
        },
      ]}
    />
  );
}
