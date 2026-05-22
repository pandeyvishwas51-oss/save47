import type { Metadata } from 'next';
import { ApiDocsView } from './ApiDocsView';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Save47 API & CLI — Bulk download videos from your terminal',
  description:
    'REST API and CLI for programmatic video downloads from YouTube, Instagram, TikTok and 1000+ sites. Free tier, bulk endpoint, no signup beyond an email.',
  alternates: { canonical: '/api' },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const API_FAQ = [
  {
    q: 'How do I get an API key?',
    a: 'Submit your email on this page. A free-tier key is issued instantly with a generous monthly quota for personal projects and scripting.',
  },
  {
    q: 'Is there rate limiting?',
    a: 'Per-IP limits apply only to anonymous web traffic. API-key requests are bound by your monthly quota — they bypass IP-level throttling and Turnstile.',
  },
  {
    q: 'Can I do bulk requests?',
    a: 'Yes. POST /v1/bulk accepts up to 50 URLs per request with tunable concurrency (1-8). Pair with the CLI for very large batches.',
  },
  {
    q: 'What does it cost?',
    a: 'Save47 is free. The free-tier API key covers most personal use; if you need a higher quota, get in touch.',
  },
];

export default function ApiPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'API', url: `${SITE_URL}/api` },
        ])}
      />
      <JsonLd data={faqSchema(API_FAQ)} />
      <ApiDocsView faq={API_FAQ} />
    </>
  );
}
