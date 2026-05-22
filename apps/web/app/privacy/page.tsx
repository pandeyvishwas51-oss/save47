import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Save47 Privacy Policy — no personal data collection, no cookies, no tracking.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl pt-6 text-[var(--foreground)]">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-sm text-[var(--muted-foreground)]">Last updated: 2026</p>

      <Section title="What we collect">
        Save47 logs IP addresses for the sole purpose of rate limiting. These records expire
        automatically after at most one hour. We do not collect names, emails, browsing history,
        or any other personally identifying information.
      </Section>

      <Section title="What we do not do">
        We do not use third-party analytics, tracking pixels, or advertising cookies. There are
        no accounts, so we have nothing to share with anyone.
      </Section>

      <Section title="Cookies">
        Save47 uses a single piece of local storage to remember your light/dark theme
        preference. No cookies are set by Save47 itself.
      </Section>

      <Section title="Third parties">
        We use Cloudflare for DDoS protection and TLS termination. Cloudflare may receive your IP
        address as part of routine HTTPS request handling. See the Cloudflare Privacy Policy for
        details.
      </Section>

      <Section title="Downloaded content">
        Files you download are proxied directly from the source to your browser. Save47 never
        stores a copy of any downloaded media.
      </Section>

      <Section title="Contact">
        Questions? Email{' '}
        <a className="text-[var(--accent)] hover:underline" href="mailto:privacy@save47.com">
          privacy@save47.com
        </a>
        .
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{children}</p>
    </section>
  );
}
