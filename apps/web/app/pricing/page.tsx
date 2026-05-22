import type { Metadata } from 'next';
import { PricingView } from './PricingView';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Pricing — Save47 API',
  description:
    'Simple pricing for the Save47 API. Free tier with 200 requests/month. Pro and Unlimited plans for high-volume users.',
  alternates: { canonical: '/pricing' },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const PRICING_FAQ = [
  {
    q: 'Is the website always free?',
    a: 'Yes. The web downloader, Android APK, and CLI free tier are free forever. Paid plans only apply to high-volume API usage.',
  },
  {
    q: 'Can I upgrade or downgrade later?',
    a: 'Yes. Upgrades take effect immediately; downgrades take effect at the end of the current billing period.',
  },
  {
    q: 'How is usage counted?',
    a: 'Each authenticated API request counts as one. /v1/bulk counts as one request per URL in the batch. Anonymous web traffic is not counted toward API quotas.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes — within 7 days of purchase, no questions asked. Email support@save47.com.',
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Pricing', url: `${SITE_URL}/pricing` },
        ])}
      />
      <JsonLd data={faqSchema(PRICING_FAQ)} />
      <PricingView faq={PRICING_FAQ} />
    </>
  );
}
