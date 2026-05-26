import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/reddit-video-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'Reddit Video Downloader with Audio — Free MP4',
  description:
    'Download Reddit videos with sound. Save47 merges Reddit\'s separate video and audio streams automatically. Works for v.redd.it links, free, no login.',
  path: PATH,
  keywords: [
    'reddit video downloader',
    'reddit downloader with audio',
    'download reddit videos',
    'v.redd.it downloader',
    'reddit mp4',
    'reddit video with sound',
    'save reddit video',
    'reddit gif downloader',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="reddit"
      platformName="Reddit"
      h1="Reddit Video Downloader (with audio)"
      intro="Reddit hosts video and audio as separate streams which is why most other downloaders give you silent files. Save47 merges them automatically server-side using ffmpeg, so the MP4 you save has full sound."
      pageUrl={`${SITE.url}${PATH}`}
      steps={[
        'Copy the Reddit post link from the comments page or the share menu.',
        'Paste it into Save47.',
        'Click Download. Save47 merges video + audio into a single MP4 with sound.',
      ]}
      formats={['MP4 HD with audio', 'MP4 SD with audio', 'MP3 audio only']}
      faqs={[
        {
          q: 'Why do other Reddit downloaders give me silent videos?',
          a: 'Reddit hosts the video and audio as two separate files on its v.redd.it CDN. Most downloaders only fetch the video stream and skip audio. Save47 fetches both and merges them server-side using ffmpeg before the file is sent to you.',
        },
        {
          q: 'Does it work with v.redd.it short links?',
          a: 'Yes. Both reddit.com/r/... post URLs and standalone v.redd.it links are supported.',
        },
        {
          q: 'Can I download NSFW Reddit videos?',
          a: 'Yes for public NSFW posts that do not require login. Quarantined or login-gated NSFW content is not supported.',
        },
        {
          q: 'Are crossposts supported?',
          a: 'Yes. Save47 follows the crosspost reference back to the original media so you get the full quality.',
        },
        {
          q: 'Can I extract just the audio?',
          a: 'Yes — pick MP3 in the format picker. Save47 will extract the audio stream at the highest available bitrate.',
        },
        {
          q: 'Is it really free?',
          a: 'Yes. No ads, no signups, no daily caps. The Reddit downloader is free for personal use.',
        },
        {
          q: 'Does it work on iPhone?',
          a: 'Yes. Open the Reddit post in Safari, tap Share → Copy Link, then paste into Save47. The MP4 saves to Files → Downloads.',
        },
      ]}
    />
  );
}
