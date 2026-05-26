import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { getGuide, listGuideSlugs, type Guide } from '@/lib/guides';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/seo/StructuredData';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import { pageMetadata, SITE } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return listGuideSlugs().map((slug) => ({ slug }));
}

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: 'Guide not found' };
  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    type: 'article',
    publishedTime: guide.publishedAt,
    modifiedTime: guide.updatedAt,
    keywords: [
      guide.title.toLowerCase(),
      'tutorial',
      'how-to',
      'video downloader',
      'save47',
    ],
  });
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE.url },
          { name: 'Guides', url: `${SITE.url}/guides` },
          { name: guide.title, url: `${SITE.url}/guides/${guide.slug}` },
        ])}
      />
      <JsonLd data={faqSchema(guide.faq)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guide.title,
          description: guide.description,
          datePublished: guide.publishedAt,
          dateModified: guide.updatedAt,
          author: {
            '@type': 'Organization',
            name: guide.authorName,
            url: SITE.url,
          },
          publisher: {
            '@type': 'Organization',
            name: SITE.name,
            logo: {
              '@type': 'ImageObject',
              url: `${SITE.url}/icons/icon-512.png`,
              width: 512,
              height: 512,
            },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/guides/${guide.slug}` },
          image: [`${SITE.url}/og?title=${encodeURIComponent(guide.title.slice(0, 80))}`],
          inLanguage: 'en-US',
        }}
      />

      <article className="mx-auto max-w-3xl pt-6 sm:pt-10">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={14} />
          All guides
        </Link>

        <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          {guide.title}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
          <span>{guide.authorName}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            Updated {new Date(guide.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="prose prose-invert mt-8 max-w-none">
          <GuideBody body={guide.body} />
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
          <div className="mt-6">
            <FaqAccordion items={guide.faq} />
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent)]/5 p-6 text-center">
          <h2 className="text-xl font-semibold">Try Save47 now</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Free, no ads, no login. Paste a URL and download.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
          >
            Open Save47
            <ArrowRight size={14} />
          </Link>
        </section>

        {guide.related && guide.related.length > 0 && (
          <RelatedGuides slugs={guide.related} />
        )}
      </article>
    </>
  );
}

function GuideBody({ body }: { body: Guide['body'] }) {
  return (
    <>
      {body.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={i} className="mt-10 text-2xl font-bold tracking-tight">
                {block.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} className="mt-6 text-lg font-semibold">
                {block.text}
              </h3>
            );
          case 'p':
            return (
              <p key={i} className="mt-4 text-base leading-relaxed text-[var(--muted-foreground)]">
                {block.text}
              </p>
            );
          case 'ul':
            return (
              <ul key={i} className="mt-4 list-disc space-y-2 pl-6 text-base text-[var(--muted-foreground)]">
                {block.items?.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="mt-4 list-decimal space-y-2 pl-6 text-base text-[var(--muted-foreground)]">
                {block.items?.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            );
          case 'code':
            return (
              <pre
                key={i}
                className="mt-4 overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 text-xs leading-relaxed"
              >
                <code>{block.text}</code>
              </pre>
            );
          case 'callout':
            return (
              <aside
                key={i}
                className="mt-6 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 p-4 text-sm leading-relaxed"
              >
                {block.text}
              </aside>
            );
        }
      })}
    </>
  );
}

function RelatedGuides({ slugs }: { slugs: string[] }) {
  const items = slugs.map((s) => getGuide(s)).filter(Boolean) as Guide[];
  if (!items.length) return null;
  return (
    <section className="mt-12 border-t border-[var(--card-border)] pt-8">
      <h2 className="text-xl font-semibold">Related guides</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition hover:border-[var(--accent)]"
          >
            <p className="text-sm font-semibold">{g.title}</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)] line-clamp-2">{g.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
