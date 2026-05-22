import type { Metadata } from 'next';
import { PlatformLandingPage } from '@/components/seo/PlatformLandingPage';

const PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/tiktok-downloader`;

export const metadata: Metadata = {
  title: 'TikTok Video Downloader — No Watermark, Free',
  description:
    'Download TikTok videos without watermark in HD. Free, no login, works on iPhone, Android and desktop.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'TikTok Video Downloader — No Watermark, Free',
    description: 'Download TikTok videos in HD without watermark. Free.',
    url: PAGE_URL,
  },
};

export default function Page() {
  return (
    <PlatformLandingPage
      platformId="tiktok"
      platformName="TikTok"
      h1="TikTok Video Downloader"
      intro="Download TikTok videos in HD with or without watermark. Free, no app required, works on every device."
      pageUrl={PAGE_URL}
      steps={[
        'Tap Share on the TikTok video and choose Copy Link.',
        'Paste the link in the box above.',
        'Click Download. The video saves directly to your device.',
      ]}
      formats={['MP4 HD (no watermark)', 'MP4 with watermark', 'MP3 Audio']}
      faqs={[
        {
          q: 'Does Save47 remove the TikTok watermark?',
          a: 'When the platform exposes a clean version, Save47 will surface it as an option. Otherwise, the original watermarked version is downloaded.',
        },
        {
          q: 'Can I download TikTok audio only?',
          a: 'Yes. Pick the MP3 option in the format picker to extract the soundtrack.',
        },
        {
          q: 'Is this free?',
          a: 'Yes, completely free. No ads, no signups.',
        },
        {
          q: 'Can I download private TikTok videos?',
          a: 'No. Only public TikTok videos are supported.',
        },
        {
          q: 'Will my download be tracked?',
          a: 'No. Save47 does not log downloads, store IPs beyond rate-limit windows, or share data with third parties.',
        },
      ]}
    />
  );
}
