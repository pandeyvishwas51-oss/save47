import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/twitter-video-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'Twitter / X Video Downloader — Free HD MP4 + GIF',
  description:
    'Download videos, GIFs and audio from Twitter (X) in MP4 format. Free, fast, no watermark, no login required. Works for x.com and twitter.com links.',
  path: PATH,
  keywords: [
    'twitter video downloader',
    'x video downloader',
    'download twitter videos',
    'x.com video download',
    'twitter mp4',
    'twitter gif downloader',
    'save tweet video',
    'twitter to mp3',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="twitter"
      platformName="Twitter / X"
      h1="Twitter / X Video Downloader"
      intro="Save videos and GIFs from any public tweet on Twitter or X.com in HD MP4. No login, no watermark, no quality loss. Audio extraction to MP3 is also supported."
      pageUrl={`${SITE.url}${PATH}`}
      steps={[
        'Open the tweet and copy its link from the share menu or the address bar.',
        'Paste the link into Save47.',
        'Choose MP4 quality or MP3 audio, then click Download.',
      ]}
      formats={['MP4 1080p HD', 'MP4 720p', 'MP4 480p', 'MP3 audio']}
      faqs={[
        {
          q: 'Does it work for x.com and twitter.com links?',
          a: 'Yes. Save47 supports both x.com and the legacy twitter.com URL format. You can also paste a t.co short link.',
        },
        {
          q: 'Are GIFs supported?',
          a: 'Twitter serves GIFs as silent MP4 videos, so yes — they download as standard MP4 files that play in any video app.',
        },
        {
          q: 'Can I download videos from protected accounts?',
          a: 'No. Save47 only supports public tweets. Protected accounts require a logged-in follower session, which we do not bypass.',
        },
        {
          q: 'Can I extract just the audio?',
          a: 'Yes. Pick MP3 in the format picker to grab just the soundtrack at the highest available bitrate.',
        },
        {
          q: 'Does Save47 add a watermark?',
          a: 'No. Save47 returns the original media exactly as Twitter serves it. No branding, no overlay, no re-encoding.',
        },
        {
          q: 'Are downloads logged?',
          a: 'No. We only keep per-IP rate-limit counters that expire automatically. We do not log which tweets or videos were downloaded.',
        },
        {
          q: 'Does this work for Twitter Spaces (audio rooms)?',
          a: 'Spaces recordings that have been published to a tweet are supported. Live Spaces in progress cannot be saved.',
        },
      ]}
    />
  );
}
