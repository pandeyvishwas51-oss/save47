import type { Metadata } from 'next';

// Always default to the production domain so that pages built with no
// env var (e.g. CI without secrets) still emit correct canonical/OG URLs.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://save47.com';
const SITE_NAME = 'Save47';

export const SITE = {
  url: SITE_URL,
  name: SITE_NAME,
  defaultDescription:
    'Download videos from YouTube, Instagram, TikTok, Facebook, Twitter, Reddit, SoundCloud and 1000+ sites. Free, no ads, no login. Web, Android, and CLI.',
  twitter: '@save47',
  github: 'https://github.com/pandeyvishwas51-oss/save47',
  domain: SITE_URL.replace(/^https?:\/\//, ''),
  publisher: 'Save47',
  // Year founded — used in Organization schema.
  founded: '2024',
  // Logo dimensions for Organization schema.
  logo: {
    url: `${SITE_URL}/icons/icon-512.png`,
    width: 512,
    height: 512,
  },
};

interface PageSeoOpts {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  type?: 'website' | 'article';
}

export function pageMetadata(opts: PageSeoOpts): Metadata {
  const url = `${SITE.url}${opts.path}`;
  const ogImage =
    opts.ogImage ??
    `${SITE.url}/og?title=${encodeURIComponent(opts.title.slice(0, 80))}`;
  const isArticle = opts.type === 'article';

  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: {
      canonical: opts.path,
      languages: {
        'en-US': url,
        'x-default': url,
      },
    },
    openGraph: {
      type: isArticle ? 'article' : 'website',
      siteName: SITE.name,
      title: opts.ogTitle ?? opts.title,
      description: opts.ogDescription ?? opts.description,
      url,
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: opts.title }],
      ...(isArticle && opts.publishedTime
        ? {
            publishedTime: opts.publishedTime,
            modifiedTime: opts.modifiedTime ?? opts.publishedTime,
            authors: [`${SITE.url}/about`],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.ogTitle ?? opts.title,
      description: opts.ogDescription ?? opts.description,
      site: SITE.twitter,
      creator: SITE.twitter,
      images: [ogImage],
    },
    robots: opts.noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };
}

// Site-wide JSON-LD: WebSite + Organization
export function siteWideSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      name: SITE.name,
      alternateName: ['Save47 Downloader', 'save47.com'],
      url: SITE.url,
      description: SITE.defaultDescription,
      inLanguage: 'en-US',
      publisher: { '@id': `${SITE.url}/#organization` },
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/?url={url}` },
          'query-input': 'required name=url',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE.url}/#organization`,
      name: SITE.name,
      legalName: SITE.publisher,
      url: SITE.url,
      foundingDate: SITE.founded,
      description: SITE.defaultDescription,
      logo: {
        '@type': 'ImageObject',
        url: SITE.logo.url,
        width: SITE.logo.width,
        height: SITE.logo.height,
      },
      sameAs: [
        `https://twitter.com/${SITE.twitter.replace('@', '')}`,
        SITE.github,
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@save47.com',
          availableLanguage: ['English'],
        },
        {
          '@type': 'ContactPoint',
          contactType: 'DMCA / copyright',
          email: 'dmca@save47.com',
          availableLanguage: ['English'],
        },
      ],
    },
  ];
}
