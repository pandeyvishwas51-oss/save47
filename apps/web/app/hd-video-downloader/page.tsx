import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JsonLd, breadcrumbSchema, faqSchema, softwareApplicationSchema } from '@/components/seo/StructuredData';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { UrlInput } from '@/components/downloader/UrlInput';
import { pageMetadata, SITE } from '@/lib/seo';

const PATH = '/hd-video-downloader';

export const metadata: Metadata = pageMetadata({
  title: 'HD Video Downloader — Save 1080p, 1440p, 4K Free',
  description:
    'Download videos in HD up to 4K resolution from YouTube, Instagram, TikTok, Vimeo and 1,000+ sites. Free, no quality loss, no re-encoding. The MP4 you save matches the source exactly.',
  path: PATH,
  keywords: [
    'hd video downloader',
    '1080p video downloader',
    '4k video downloader',
    'hd video downloader free',
    '1440p video downloader',
    'high quality video downloader',
    'youtube 4k downloader',
    'youtube 1080p downloader',
    'hd mp4 downloader',
  ],
});

const FAQ = [
  {
    q: 'What\'s the highest resolution Save47 can download?',
    a: 'Save47 supports the full quality ladder of every supported platform. For YouTube that includes 4K (2160p), 1440p, 1080p, 720p, 480p, and 360p. The format picker shows every quality the source video has — if 4K is available, you\'ll see it.',
  },
  {
    q: 'Will the downloaded HD video match the source quality?',
    a: 'Yes. Save47 fetches the highest-bitrate streams the platform serves and merges them without re-encoding. The result is a byte-for-byte copy of what the platform would stream to a 4K-capable device.',
  },
  {
    q: 'Why do other downloaders give me lower-quality files?',
    a: 'Many free downloaders cap quality at 720p or 480p in their free tier and require payment for HD. Save47 has no quality paywall — every resolution the source provides is available for free.',
  },
  {
    q: 'Does HD download work on iPhone and Android?',
    a: 'Yes. iPhones from the 11 Pro onward play 4K natively, and most modern Android phones support 4K playback. Save47 saves the file to Files → Downloads (iOS) or your Downloads folder (Android).',
  },
  {
    q: 'How big are 4K downloads?',
    a: 'A 4K MP4 averages about 50-200 MB per minute depending on the source bitrate. A 5-minute YouTube 4K music video is typically 300-800 MB. The format picker shows the estimated file size before you download.',
  },
  {
    q: 'Can I download Instagram in HD?',
    a: 'Yes. Save47 fetches the highest resolution Instagram serves, typically 1080p for Reels and posts. Instagram does not offer 4K for user content.',
  },
];

const QUALITY_TABLE = [
  { resolution: '4K (2160p)', sites: 'YouTube, Vimeo (when available)', size: '~200 MB / min' },
  { resolution: '1440p (2K)', sites: 'YouTube', size: '~100 MB / min' },
  { resolution: '1080p (Full HD)', sites: 'Most platforms', size: '~50 MB / min' },
  { resolution: '720p (HD)', sites: 'Every platform', size: '~25 MB / min' },
  { resolution: '480p (SD)', sites: 'Every platform', size: '~12 MB / min' },
];

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE.url },
          { name: 'HD Video Downloader', url: `${SITE.url}${PATH}` },
        ])}
      />
      <JsonLd data={faqSchema(FAQ)} />
      <JsonLd
        data={softwareApplicationSchema({
          name: 'Save47 — HD Video Downloader',
          description:
            'Download videos in HD up to 4K from 1,000+ sites. Free, no quality loss, no re-encoding.',
          url: `${SITE.url}${PATH}`,
        })}
      />

      <section className="mx-auto max-w-3xl pt-8 text-center sm:pt-12">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          HD video downloader — up to 4K, free
        </h1>
        <p className="mt-4 text-balance text-base text-[var(--muted-foreground)] sm:text-lg">
          Save videos in 1080p Full HD, 1440p (2K), or 4K when the source supports it. No quality
          paywall. No re-encoding. The MP4 you download matches the source bit-for-bit.
        </p>
        <div className="mt-8">
          <UrlInput />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl overflow-x-auto">
        <h2 className="text-2xl font-bold tracking-tight">Quality reference</h2>
        <p className="mt-3 text-[var(--muted-foreground)]">
          Approximate file sizes per minute of video at each resolution.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
              <tr className="border-b border-[var(--card-border)]">
                <th className="px-5 py-4">Resolution</th>
                <th className="px-5 py-4">Available on</th>
                <th className="px-5 py-4">Approx. size</th>
              </tr>
            </thead>
            <tbody>
              {QUALITY_TABLE.map((row) => (
                <tr key={row.resolution} className="border-b border-[var(--card-border)]/50 last:border-0">
                  <td className="px-5 py-3.5 font-medium">{row.resolution}</td>
                  <td className="px-5 py-3.5 text-[var(--muted-foreground)]">{row.sites}</td>
                  <td className="px-5 py-3.5 font-mono text-xs">{row.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">How HD downloading works</h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--muted-foreground)]">
          <p>
            For HD videos, YouTube, Vimeo, and similar platforms serve video and audio as
            separate streams. Save47 fetches the highest-quality video stream and the
            highest-quality audio stream, then merges them server-side using ffmpeg. The merge is
            a remux, not a re-encode — the result is identical to the source.
          </p>
          <p>
            For Instagram, TikTok, Facebook, Twitter and most social platforms, the video and
            audio are already merged in a single MP4 file at the source. Save47 fetches that file
            directly with no processing — what you download is exactly what the platform serves.
          </p>
          <p>
            This is why Save47 downloads are usually higher quality than competing free
            downloaders. Many alternatives capture only the watermarked playback stream, or
            re-encode to save bandwidth, both of which lose quality.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">Frequently asked</h2>
        <div className="mt-6">
          <FaqAccordion items={FAQ} />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
        >
          Try the HD downloader
          <ArrowRight size={14} />
        </Link>
      </section>
    </>
  );
}
