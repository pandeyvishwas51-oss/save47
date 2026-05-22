import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JsonLd, breadcrumbSchema } from '@/components/seo/StructuredData';
import { pageMetadata, SITE } from '@/lib/seo';
import { GUIDES } from '@/lib/guides';

const PATH = '/guides';

export const metadata: Metadata = pageMetadata({
  title: 'Video Downloader Guides — How-Tos for YouTube, TikTok, Instagram',
  description:
    'Step-by-step guides for downloading videos from every major platform. iPhone, Android, desktop, and command-line.',
  path: PATH,
  keywords: [
    'how to download youtube videos',
    'how to download instagram reels',
    'how to download tiktok videos',
    'video downloader guide',
    'iphone video downloader',
  ],
});

const GUIDE_LIST = GUIDES.map((g) => ({
  slug: g.slug,
  title: g.title,
  excerpt: g.description,
}));

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE.url },
          { name: 'Guides', url: `${SITE.url}${PATH}` },
        ])}
      />
      <section className="mx-auto max-w-3xl pt-8 text-center sm:pt-12">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Guides</h1>
        <p className="mt-4 text-balance text-base text-[var(--muted-foreground)] sm:text-lg">
          Step-by-step downloading tutorials for every major platform.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
        {GUIDE_LIST.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]"
          >
            <h2 className="text-base font-semibold leading-snug">{g.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{g.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)]">
              Read guide
              <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
