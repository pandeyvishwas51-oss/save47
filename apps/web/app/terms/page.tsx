import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Save47 Terms of Use — personal use only, you are responsible for compliance.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <article className="prose mx-auto max-w-2xl pt-6 text-[var(--foreground)]">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Use</h1>
      <p className="mt-4 text-sm text-[var(--muted-foreground)]">Last updated: 2026</p>

      <Section title="1. Personal use only">
        Save47 is provided as a personal-use tool for downloading content you own, content you
        have permission to download, or content released under permissive licenses.
      </Section>

      <Section title="2. Your responsibilities">
        You are responsible for complying with the terms of service of the platforms you use and
        with applicable copyright and intellectual-property laws in your jurisdiction. Save47 is
        not a license to infringe.
      </Section>

      <Section title="3. We do not host or redistribute">
        Save47 does not store, host, or redistribute any downloaded content. Files are streamed
        from the source platform directly to your device through a transient proxy connection.
      </Section>

      <Section title="4. No warranty">
        The service is provided as-is without warranty of any kind. We do not guarantee
        availability, completeness, or compatibility with any specific platform at any time.
      </Section>

      <Section title="5. Limitation of liability">
        To the maximum extent permitted by law, Save47 and its operators are not liable for any
        damages arising out of your use of the service.
      </Section>

      <Section title="6. Acceptable use">
        You may not use Save47 to bypass DRM, paywalls, geographic restrictions you are not
        otherwise permitted to bypass, or to mass-scrape, harass, or commercialize third-party
        content.
      </Section>

      <Section title="7. Contact">
        DMCA / copyright concerns:{' '}
        <a className="text-[var(--accent)] hover:underline" href="mailto:dmca@save47.com">
          dmca@save47.com
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
