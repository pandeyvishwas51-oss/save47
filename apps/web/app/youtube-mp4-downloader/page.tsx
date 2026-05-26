import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/youtube-mp4-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'YouTube to MP4 Downloader — Free HD MP4 1080p, 4K',
  description:
    'Download YouTube videos as MP4 files in 1080p, 720p, 480p, or 4K when available. Free, fast, no ads, no signup. Works on iPhone, Android, Windows, Mac, Linux.',
  path: PATH,
  keywords: [
    'youtube to mp4',
    'youtube mp4 downloader',
    'youtube to mp4 converter',
    'youtube mp4 1080p',
    'youtube mp4 4k',
    'youtube to mp4 free',
    'yt to mp4',
    'download youtube as mp4',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="youtube"
      platformName="YouTube"
      h1="YouTube to MP4 Downloader"
      intro="Download any YouTube video as an MP4 file in seconds. Save47 supports the entire YouTube quality ladder — 4K, 1440p, 1080p, 720p, 480p — and the saved file is byte-for-byte identical to the source. Free, no ads, no software install."
      pageUrl={`${SITE.url}${PATH}`}
      steps={[
        'Copy a YouTube video URL from your browser address bar or the YouTube share menu.',
        'Paste it in the box above.',
        'Pick MP4 quality (1080p is a great default) and click Download. The file lands in your Downloads folder.',
      ]}
      formats={['MP4 4K', 'MP4 1440p', 'MP4 1080p', 'MP4 720p', 'MP4 480p', 'MP3 audio']}
      faqs={[
        {
          q: 'Does Save47 download YouTube videos in 4K?',
          a: 'Yes when the original video was uploaded in 4K. The format picker shows every quality YouTube serves for the video — if 4K appears, you can save it.',
        },
        {
          q: 'What\'s the difference between MP4 and WebM?',
          a: 'MP4 (H.264) plays everywhere — iPhone, Android, Windows, Mac, smart TVs. WebM (VP9/AV1) is smaller per pixel but has worse compatibility. Save47 defaults to MP4 because it just works.',
        },
        {
          q: 'Are the downloaded MP4s the same quality as the YouTube original?',
          a: 'Yes. Save47 fetches the highest-quality stream YouTube serves and merges video and audio without re-encoding. The result is bit-identical to what YouTube would stream to a Chromebook playing back at the same quality.',
        },
        {
          q: 'Can I download a YouTube video as MP4 on iPhone?',
          a: 'Yes. Open Save47 in Safari, paste the YouTube link, pick MP4, and tap download. The file saves to Files → Downloads where you can open it in any video player or move it to Photos.',
        },
        {
          q: 'Does it work for YouTube Shorts and Live recordings?',
          a: 'Yes. Shorts download as vertical MP4. Past Live broadcasts download as MP4 once the stream has ended and the recording has been processed.',
        },
        {
          q: 'Why does the MP4 download show different sizes for the same quality?',
          a: 'YouTube serves multiple bitrates per resolution. Save47 always picks the highest-bitrate stream available. For high-action videos that means a larger file at 1080p than for static talking-head videos.',
        },
        {
          q: 'Can I download age-restricted YouTube videos as MP4?',
          a: 'Public age-restricted videos that don\'t require sign-in usually work. Videos that require an authenticated session do not — Save47 does not bypass YouTube login.',
        },
      ]}
    />
  );
}
