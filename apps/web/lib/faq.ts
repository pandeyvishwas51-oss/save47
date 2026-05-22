import type { FaqItem } from '@/components/seo/FaqAccordion';

export const HOMEPAGE_FAQ: FaqItem[] = [
  {
    q: 'Is Save47 really free?',
    a: 'Yes — completely free, no ads, no signup, no premium tier. The web app and the Android APK are both free. Heavy API users can grab a key for bulk programmatic access; the free tier is enough for casual scripting.',
  },
  {
    q: 'Which sites are supported?',
    a: 'YouTube, Instagram, TikTok, Facebook, Twitter/X, Reddit, SoundCloud, Pinterest, Vimeo, Dailymotion, Twitch clips, plus 1,000+ other sites that yt-dlp supports. DRM-protected services (Spotify, Apple Music, Netflix, Disney+) are deliberately blocked.',
  },
  {
    q: 'Do you store the videos I download?',
    a: 'No. Save47 proxies bytes directly from the source platform to your browser — nothing is written to disk on our servers. We do not log download URLs or content.',
  },
  {
    q: 'Do I need an account to download?',
    a: 'No account is required for the website or the Android app. The API requires a free key so we can fairly distribute capacity, but it ties to an email, not an identity.',
  },
  {
    q: 'How do I download from the terminal?',
    a: 'Grab a free API key from the API page, then run our CLI: npx save47-cli download "<url>". You can also call the API directly with curl. See the API docs for examples.',
  },
  {
    q: 'Can I download in bulk?',
    a: 'Yes. Use POST /v1/bulk with up to 50 URLs per request and tunable concurrency. Pair with the CLI for batch downloads of entire playlists or feeds.',
  },
  {
    q: 'Is downloading videos legal?',
    a: 'Downloading content you own or have permission to download is generally fine. Redistributing copyrighted material is not. You are responsible for complying with platform terms and copyright law in your jurisdiction.',
  },
  {
    q: 'Will the Android APK auto-update?',
    a: 'The APK is a Trusted Web Activity wrapping the PWA, so the UI and core logic update automatically the moment we ship. Major shell changes ship as a new APK release.',
  },
];

export const PLATFORM_FAQ_TEMPLATE = (platform: string): FaqItem[] => [
  {
    q: `Is the ${platform} downloader free?`,
    a: `Yes — Save47's ${platform} downloader is completely free with no ads, no watermarks, and no signup. Web app, Android APK, and CLI are all free.`,
  },
  {
    q: `What quality can I download from ${platform}?`,
    a: `Save47 offers every quality the source provides — typically 1080p, 720p, 480p, and audio-only MP3. For some platforms 4K is available when the original was uploaded in 4K.`,
  },
  {
    q: `Can I download ${platform} videos as MP3?`,
    a: `Yes. Pick the "MP3 Audio" option on the download page or click the audio-only toggle. The audio is extracted at the highest available bitrate.`,
  },
  {
    q: `Do I need to install anything to download from ${platform}?`,
    a: `Nothing. Just paste the URL and click download. For mobile, install the Android APK or add Save47 to your home screen as a PWA.`,
  },
  {
    q: `Is there a watermark on ${platform} downloads?`,
    a: `No. Save47 delivers the original media file directly from the platform. We do not re-encode or watermark anything.`,
  },
];
