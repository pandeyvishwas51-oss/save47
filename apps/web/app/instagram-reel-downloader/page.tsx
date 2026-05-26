import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/instagram-reel-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'Instagram Reel Downloader — Save Reels Free, No Login',
  description:
    'Download Instagram reels, posts, and IGTV in HD MP4 for free. No login, no watermark, no app. Works on iPhone, Android, and desktop.',
  path: PATH,
  keywords: [
    'instagram reel downloader',
    'download instagram reels',
    'reel downloader free',
    'instagram reel mp4',
    'save instagram reels',
    'reel download no watermark',
    'igtv downloader',
    'instagram story downloader',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="instagram"
      platformName="Instagram"
      h1="Instagram Reel Downloader"
      intro="Save Instagram reels, posts, and IGTV videos in HD. Free, no Instagram login required for public content, no watermark, works on any device. We pull straight from Instagram's CDN — quality is identical to the source."
      pageUrl={`${SITE.url}${PATH}`}
      steps={[
        'In the Instagram app, tap the share icon below the reel and choose Copy Link.',
        'Paste the link in the input above.',
        'Pick MP4 quality, then tap Download. The reel saves to your phone.',
      ]}
      formats={['MP4 1080p HD', 'MP4 720p', 'MP4 SD', 'MP3 audio']}
      faqs={[
        {
          q: 'Can I download private Instagram content?',
          a: 'No. Save47 only supports public posts, reels, and IGTV videos. Private content requires a logged-in follower session and we never bypass platform privacy.',
        },
        {
          q: 'Will the downloaded reel have a watermark?',
          a: 'No. Save47 returns the original Instagram media exactly as the platform serves it. There is no Save47 branding, and the username overlay that the Instagram save feature adds is not present.',
        },
        {
          q: 'Does it work on iPhone and Android?',
          a: 'Yes. Save47 runs in any modern mobile browser. You can also install Save47 as a Progressive Web App and share Instagram links directly to it from the share sheet.',
        },
        {
          q: 'Are there download limits?',
          a: 'There are reasonable per-IP rate limits to prevent abuse, but no daily caps for normal personal use. If you need higher volume, grab a free API key.',
        },
        {
          q: 'Do you store any reels I download?',
          a: 'No. Save47 proxies the download in real time and never persists media files. We do not log download URLs or content.',
        },
        {
          q: 'Can I download Instagram Stories?',
          a: 'Yes for public Stories within the 24-hour window they are visible. After that the public URL expires. Highlights also work.',
        },
        {
          q: 'How do I download a carousel post with multiple reels?',
          a: 'Paste the carousel URL and Save47 lists each video and image separately so you can download them individually or together.',
        },
        {
          q: 'Why is the audio sometimes missing on a downloaded reel?',
          a: 'Some Instagram reels use copyrighted audio that the platform mutes for downloads. If you get a silent file, the audio was muted at the source — we cannot restore it.',
        },
      ]}
    />
  );
}
