import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/soundcloud-downloader`;

export const metadata: Metadata = {
  title: 'SoundCloud to MP3 — Free Audio Download',
  description:
    'Download SoundCloud tracks as high-quality MP3 for free. Paste any public SoundCloud link and save the audio.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'SoundCloud to MP3 — Free Audio Download',
    description: 'Download SoundCloud tracks as MP3. Free.',
    url: PAGE_URL,
  },
};

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="soundcloud"
      platformName="SoundCloud"
      h1="SoundCloud to MP3 Downloader"
      intro="Save any public SoundCloud track as a high-quality MP3 file. Free, no login, instant."
      pageUrl={PAGE_URL}
      steps={[
        'Copy the SoundCloud track URL from the browser address bar or the Share menu.',
        'Paste it in the input above.',
        'Click Download. Your MP3 saves directly.',
      ]}
      formats={['MP3 (high quality)', 'M4A (when available)']}
      faqs={[
        {
          q: 'Can I download SoundCloud Go+ tracks?',
          a: 'No. Only publicly streamable tracks can be downloaded. Subscriber-only content is excluded.',
        },
        {
          q: 'What bitrate is the MP3?',
          a: 'Save47 extracts the highest available stream quality and encodes it to MP3 (typically 128kbps for SoundCloud, since that is what the platform serves).',
        },
        {
          q: 'Are private tracks supported?',
          a: 'Only when a public share link is provided. Truly private tracks behind a login are not supported.',
        },
        {
          q: 'Does the artist get credit?',
          a: 'Save47 embeds title and uploader metadata into the file when SoundCloud exposes it.',
        },
        {
          q: 'Is downloading SoundCloud tracks legal?',
          a: 'Only when the track is licensed for download or you have permission from the rightsholder. Always check the track\'s license.',
        },
      ]}
    />
  );
}
