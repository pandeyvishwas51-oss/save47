import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/tiktok-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'TikTok Video Downloader — No Watermark, Free MP4 + MP3',
  description:
    'Download TikTok videos without watermark in HD MP4 or extract audio as MP3. Free, no login, works on iPhone, Android and desktop.',
  path: PATH,
  keywords: [
    'tiktok downloader',
    'tiktok video downloader',
    'download tiktok no watermark',
    'tiktok mp4 download',
    'save tiktok video',
    'tiktok to mp3',
    'tiktok hd downloader',
    'no watermark tiktok',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="tiktok"
      platformName="TikTok"
      h1="TikTok Video Downloader (No Watermark)"
      intro="Save any public TikTok video in HD without the username watermark, or extract audio as MP3. Free, no app needed, works on every device."
      pageUrl={`${SITE.url}${PATH}`}
      steps={[
        'Tap Share on the TikTok video and choose Copy Link.',
        'Paste the link in the box above.',
        'Pick MP4 or MP3, then click Download. The video saves directly to your device.',
      ]}
      formats={['MP4 1080p (no watermark)', 'MP4 720p', 'MP4 480p', 'MP3 320kbps']}
      faqs={[
        {
          q: 'How does Save47 download TikTok videos without a watermark?',
          a: 'TikTok serves two versions of every public video: a watermarked version their app displays, and an unwatermarked source version used for embeds. Save47 fetches the source version directly so you get a clean copy with no username or TikTok logo overlay.',
        },
        {
          q: 'Can I download TikTok audio only?',
          a: 'Yes. Pick MP3 in the format picker after pasting your link. Save47 extracts the soundtrack at the highest available bitrate.',
        },
        {
          q: 'Is the TikTok downloader free?',
          a: 'Yes — completely free. No ads, no signup, no daily caps for personal use.',
        },
        {
          q: 'Can I download private TikTok videos?',
          a: 'No. Save47 only works with public TikTok videos. Private and friends-only content is not supported by design.',
        },
        {
          q: 'Will TikTok know I downloaded the video?',
          a: 'No. Save47 fetches publicly accessible CDN URLs without an authenticated session. There is no signal sent to TikTok that ties the download back to you.',
        },
        {
          q: 'Why is my downloaded TikTok sometimes silent?',
          a: 'TikTok occasionally serves video and audio as separate streams. Save47 merges them automatically before delivering the file. If you still get a silent file, try the download again — it almost always succeeds on retry.',
        },
        {
          q: 'Does it work for TikTok photo carousels?',
          a: 'Yes. Save47 packages photo posts as a downloadable archive containing each image at its original resolution.',
        },
      ]}
    />
  );
}
