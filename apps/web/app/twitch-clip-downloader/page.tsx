import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/twitch-clip-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'Twitch Clip Downloader — Free MP4 Download',
  description:
    'Download Twitch clips and VODs in HD MP4 for free. Save your favorite stream highlights without re-encoding. Works for clips.twitch.tv and twitch.tv/clip links.',
  path: PATH,
  keywords: [
    'twitch clip downloader',
    'twitch downloader',
    'download twitch clips',
    'twitch vod downloader',
    'twitch mp4',
    'save twitch clip',
    'clips.twitch.tv downloader',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="twitch"
      platformName="Twitch"
      h1="Twitch Clip Downloader"
      intro="Save Twitch clips and VOD highlights as HD MP4 in seconds. Save47 grabs the source-quality stream so there is no re-encoding loss. Free, no Twitch login required."
      pageUrl={`${SITE.url}${PATH}`}
      steps={[
        'Open the Twitch clip or VOD and copy its URL.',
        'Paste it into Save47.',
        'Choose MP4 quality and click Download.',
      ]}
      formats={['MP4 1080p source', 'MP4 720p', 'MP4 480p', 'MP3 audio']}
      faqs={[
        {
          q: 'What types of Twitch content are supported?',
          a: 'Twitch clips (clips.twitch.tv links), VOD highlights, and recorded past broadcasts that the streamer has saved publicly. Live streams in progress cannot be downloaded.',
        },
        {
          q: 'Can I download Twitch subscriber-only VODs?',
          a: 'No. Subscriber-only content requires a logged-in session and is not supported.',
        },
        {
          q: 'Is the Twitch downloader free?',
          a: 'Yes. No ads, no signups, no daily limits for personal use.',
        },
        {
          q: 'Can I extract just the audio?',
          a: 'Yes — pick MP3 to save just the audio stream.',
        },
        {
          q: 'Does this work for entire VODs (multi-hour streams)?',
          a: 'Yes, but very long VODs take a few minutes to process. For multi-hour streams the API endpoint is recommended over the web UI.',
        },
      ]}
    />
  );
}
