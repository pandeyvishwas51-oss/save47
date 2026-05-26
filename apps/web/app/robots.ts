import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Block infrastructure and admin routes only.
        // Everything else is fully crawlable for SEO.
        disallow: [
          '/admin',
          '/admin/*',
          '/api/probe',
          '/api/turnstile',
          '/og',
          '/_next/',
        ],
      },
      // Be explicit about good crawlers — helps Google + Bing prioritize.
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/api/probe', '/api/turnstile'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/api/probe', '/api/turnstile'],
      },
      // Block aggressive AI scrapers from training on our content.
      // These don't drive traffic and just consume bandwidth.
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: '/',
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
