import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/vimeo-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'Vimeo Downloader — Free HD MP4 + MP3',
  description:
    'Download Vimeo videos in HD MP4 for free. Save public Vimeo videos to your device or extract audio as MP3. No login, no software install required.',
  path: PATH,
  keywords: [
    'vimeo downloader',
    'download vimeo videos',
    'vimeo to mp4',
    'vimeo hd downloader',
    'vimeo to mp3',
    'save vimeo video',
    'vimeo video saver',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="vimeo"
      platformName="Vimeo"
      h1="Vimeo Video Downloader"
      intro="Save any public Vimeo video as HD MP4 in seconds. Save47 supports the full Vimeo quality ladder up to 4K when the source provides it. Audio extraction to MP3 is one click away."
      pageUrl={`${SITE.url}${PATH}`}
      steps={[
        'Open the Vimeo video and copy its URL from the browser or share menu.',
        'Paste the link into Save47.',
        'Pick a quality and click Download.',
      ]}
      formats={['MP4 4K', 'MP4 1080p', 'MP4 720p', 'MP4 480p', 'MP3 audio']}
      faqs={[
        {
          q: 'Can I download password-protected Vimeo videos?',
          a: 'No. Save47 only supports public Vimeo videos. Password-protected and login-required videos are not bypassed.',
        },
        {
          q: 'Does it support 4K Vimeo downloads?',
          a: 'Yes when the original was uploaded in 4K. The format picker shows every quality Vimeo exposes for the video.',
        },
        {
          q: 'Is the Vimeo downloader really free?',
          a: 'Yes. No ads, no signups, no daily caps for personal use.',
        },
        {
          q: 'Can I extract audio from a Vimeo video?',
          a: 'Yes. Pick MP3 in the format picker to save just the soundtrack.',
        },
        {
          q: 'Does this work on iPhone and Android?',
          a: 'Yes. Save47 runs in any modern phone browser.',
        },
      ]}
    />
  );
}
