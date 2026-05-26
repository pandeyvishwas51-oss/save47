import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/youtube-to-mp3';

export const metadata: Metadata = pageMetadata({
  title: 'YouTube to MP3 Converter — Free 320kbps, No Ads',
  description:
    'Convert any YouTube video to MP3 audio for free. High-quality 320kbps MP3 extraction, no ads, no login, no app install. Works on iPhone, Android, desktop.',
  path: PATH,
  keywords: [
    'youtube to mp3',
    'youtube mp3 converter',
    'youtube to mp3 free',
    'youtube to mp3 320kbps',
    'youtube audio downloader',
    'youtube music download',
    'yt to mp3',
    'youtube to mp3 hd',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="youtube"
      platformName="YouTube"
      h1="YouTube to MP3 Converter"
      intro="Convert any YouTube video to high-quality MP3 audio in seconds. Free, no ads, no signup, no software install. Save47 extracts the highest available audio bitrate and encodes it to MP3 for any device."
      pageUrl={`${SITE.url}${PATH}`}
      steps={[
        'Copy a YouTube video URL from your browser or the YouTube app.',
        'Paste it in the box above.',
        'Pick MP3 and click Download. Your audio file lands in your Downloads folder.',
      ]}
      formats={['MP3 320kbps', 'MP3 192kbps', 'MP4 1080p', 'MP4 720p', 'MP4 480p']}
      faqs={[
        {
          q: 'Is the YouTube to MP3 converter really free?',
          a: 'Yes. Save47 is completely free with no ads, no logins, and no daily limits for personal use. There is no premium tier for the web converter.',
        },
        {
          q: 'What audio quality do I get?',
          a: 'Save47 extracts the highest audio bitrate YouTube serves for the video and encodes it to MP3 at 320kbps. For most videos that is indistinguishable from the source.',
        },
        {
          q: 'Do I need to install anything?',
          a: 'No. Save47 runs entirely in your browser. You can also install it as a Progressive Web App by tapping Share → Add to Home Screen on iPhone or installing the Android APK.',
        },
        {
          q: 'Does it work on iPhone?',
          a: 'Yes. Paste the YouTube link into Safari, pick MP3, and tap download. The MP3 saves to Files → Downloads where any music player can open it.',
        },
        {
          q: 'Can I convert YouTube playlists to MP3?',
          a: 'Yes via the API. Use POST /v1/bulk with up to 50 URLs per request, or use the CLI to download an entire playlist with one command.',
        },
        {
          q: 'Is downloading YouTube content legal?',
          a: 'You should only download content you own, content released under permissive licenses (Creative Commons, public domain), or content the rightsholder has explicitly allowed you to download. Always respect copyright.',
        },
        {
          q: 'Does Save47 keep a copy of the converted MP3?',
          a: 'No. The MP3 is generated and streamed to your device in real time. Nothing is stored on our servers and we do not log which videos you converted.',
        },
        {
          q: 'Why is my MP3 sometimes shorter than the video?',
          a: 'YouTube ads inserted at the start or end of long videos are not part of the audio stream Save47 grabs, so the MP3 only contains the actual content.',
        },
      ]}
    />
  );
}
