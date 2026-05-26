import type { Metadata } from 'next';
import { PricingView } from './PricingView';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/seo/StructuredData';
import { pageMetadata, SITE } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Pricing — Save47 API & CLI',
  description:
    'Simple pricing for the Save47 API. Free tier with 200 requests/month, Pro at 10K/month, Unlimited at 1M/month. The web downloader and Android APK are free forever.',
  path: '/pricing',
  keywords: [
    'save47 pricing',
    'video downloader api pricing',
    'youtube api downloader pricing',
    'bulk video download api',
    'video downloader pro plan',
  ],
});

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
          { name: 'Home', url: SITE.url },
          { name: 'Pricing', url: `${SITE.url}/pricing` },
        ])}
      />
      <JsonLd data={faqSchema(PRICING_FAQ)} />
      <PricingView faq={PRICING_FAQ} />
    </>
  );
}
