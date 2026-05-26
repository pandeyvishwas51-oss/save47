import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { JsonLd, breadcrumbSchema } from '@/components/seo/StructuredData';
import { pageMetadata, SITE } from '@/lib/seo';
import { GUIDES } from '@/lib/guides';

const PATH = '/guides';

export const metadata: Metadata = pageMetadata({
  title: 'Video Downloader Guides — Tutorials for YouTube, TikTok, Instagram',
  description:
    'Step-by-step guides for downloading videos from every major platform. iPhone, Android, desktop, and command-line walkthroughs. All free, all maintained for 2026.',
  path: PATH,
  keywords: [
    'how to download youtube videos',
    'how to download instagram reels',
    'how to download tiktok videos',
    'video downloader guide',
    'iphone video downloader',
    'android video downloader',
    'youtube to mp3 guide',
    'video download tutorial',
  ],
});

export default function Page() {
  // Sort newest first based on updatedAt
  const sorted = [...GUIDES].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE.url },
          { name: 'Guides', url: `${SITE.url}${PATH}` },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Save47 Guides',
          url: `${SITE.url}${PATH}`,
          description:
            'Step-by-step tutorials for downloading videos from every major platform.',
          publisher: { '@id': `${SITE.url}/#organization` },
          blogPost: sorted.map((g) => ({
            '@type': 'BlogPosting',
            headline: g.title,
            description: g.description,
            url: `${SITE.url}/guides/${g.slug}`,
            datePublished: g.publishedAt,
            dateModified: g.updatedAt,
            author: { '@type': 'Organization', name: g.authorName },
          })),
        }}
      />

      <section className="mx-auto max-w-3xl pt-8 text-center sm:pt-12">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Guides</h1>
        <p className="mt-4 text-balance text-base text-[var(--muted-foreground)] sm:text-lg">
          Step-by-step downloading tutorials for every major platform.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
        {sorted.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 transition hover:border-[var(--accent)]"
          >
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
              <Clock size={11} />
              <time dateTime={g.updatedAt}>
                {new Date(g.updatedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </div>
            <h2 className="text-base font-semibold leading-snug">{g.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
              {g.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)]">
              Read guide
              <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>

      <section className="mx-auto mt-16 max-w-3xl text-center">
        <div className="rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent)]/5 p-8">
          <h2 className="text-2xl font-bold tracking-tight">Have a topic to suggest?</h2>
          <p className="mt-3 text-[var(--muted-foreground)]">
            Open an issue on{' '}
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline-offset-4 hover:underline"
            >
              GitHub
            </a>{' '}
            and we&apos;ll write the guide.
          </p>
        </div>
      </section>
    </>
  );
}
