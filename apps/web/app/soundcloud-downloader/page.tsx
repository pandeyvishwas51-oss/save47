import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/soundcloud-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'SoundCloud to MP3 Downloader — Free Audio Download',
  description:
    'Download SoundCloud tracks as high-quality MP3 for free. Paste any public SoundCloud link and save the audio in seconds. No login, no software install required.',
  path: PATH,
  keywords: [
    'soundcloud downloader',
    'soundcloud to mp3',
    'download soundcloud',
    'soundcloud mp3 free',
    'soundcloud song download',
    'soundcloud audio',
    'soundcloud track downloader',
    'sc downloader',
  ],
});

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="soundcloud"
      platformName="SoundCloud"
      h1="SoundCloud to MP3 Downloader"
      intro="Save any public SoundCloud track as a high-quality MP3 for free. Works for songs, podcasts, mixes, and DJ sets. No login, no signup, no app install."
      pageUrl={`${SITE.url}${PATH}`}
      steps={[
        'Copy the SoundCloud track URL from the browser address bar or the Share menu.',
        'Paste it in the input above.',
        'Click Download. Your MP3 saves directly to your device.',
      ]}
      formats={['MP3 (highest available)', 'M4A (when available)']}
      faqs={[
        {
          q: 'Can I download SoundCloud Go+ tracks?',
          a: 'No. Only publicly streamable tracks can be downloaded. Subscriber-only Go+ content is excluded by design.',
        },
        {
          q: 'What bitrate is the MP3?',
          a: 'Save47 extracts the highest stream quality SoundCloud serves and encodes it to MP3. SoundCloud typically streams at 128kbps for free tracks; the saved MP3 matches that source quality without re-encoding losses.',
        },
        {
          q: 'Are private SoundCloud tracks supported?',
          a: 'Only when a public share link is provided by the artist. Truly private tracks behind a SoundCloud login are not supported.',
        },
        {
          q: 'Does the artist get credit?',
          a: 'Save47 embeds title and uploader metadata into the MP3 file when SoundCloud exposes it. Always credit the original artist when sharing.',
        },
        {
          q: 'Is downloading SoundCloud tracks legal?',
          a: 'Only when the track is licensed for download (the artist has enabled it) or you have permission from the rightsholder. Always check the track\'s license before redistributing.',
        },
        {
          q: 'Can I download entire SoundCloud playlists or albums?',
          a: 'Yes via the API or CLI — paste the playlist URL into the bulk endpoint and Save47 will queue every track. The web UI handles single tracks at a time.',
        },
        {
          q: 'Does this work on iPhone and Android?',
          a: 'Yes. Save47 runs in any modern phone browser. The MP3 saves to Files → Downloads on iPhone or your Downloads folder on Android.',
        },
      ]}
    />
  );
}
