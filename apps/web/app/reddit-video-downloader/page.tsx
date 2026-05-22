import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reddit-video-downloader`;

export const metadata: Metadata = {
  title: 'Reddit Video Downloader with Audio',
  description:
    'Download Reddit videos with audio merged automatically. Works for v.redd.it links, free, no login.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Reddit Video Downloader with Audio',
    description: 'Download Reddit videos with sound. Free.',
    url: PAGE_URL,
  },
};

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="reddit"
      platformName="Reddit"
      h1="Reddit Video Downloader (with audio)"
      intro="Reddit serves video and audio in separate streams. Save47 merges them for you so the file you save has sound."
      pageUrl={PAGE_URL}
      steps={[
        'Copy the Reddit post link from the comments page or the share menu.',
        'Paste it above.',
        'Click Download. Save47 automatically merges video and audio into one MP4.',
      ]}
      formats={['MP4 HD with audio', 'MP4 SD with audio', 'MP3 Audio only']}
      faqs={[
        {
          q: 'Why do other Reddit downloaders give me silent videos?',
          a: 'Reddit hosts video and audio as separate files. Save47 merges them server-side using ffmpeg before the download starts.',
        },
        {
          q: 'Does it work with v.redd.it links?',
          a: 'Yes. Both reddit.com/r/... and v.redd.it links are supported.',
        },
        {
          q: 'Can I download NSFW Reddit videos?',
          a: 'Public NSFW posts that do not require login are supported.',
        },
        {
          q: 'Are crossposts supported?',
          a: 'Yes. Save47 follows the crosspost reference to the original media.',
        },
        {
          q: 'Is it free?',
          a: 'Yes. No ads, no signups, no daily limits for personal use.',
        },
      ]}
    />
  );
}
