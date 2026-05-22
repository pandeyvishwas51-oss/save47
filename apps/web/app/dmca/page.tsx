import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DMCA / Copyright Policy',
  description: 'Save47 DMCA and copyright policy. Submit takedown requests here.',
  alternates: { canonical: '/dmca' },
};

export default function DmcaPage() {
  return (
    <article className="mx-auto max-w-2xl pt-6 text-[var(--foreground)]">
      <h1 className="text-3xl font-bold tracking-tight">DMCA / Copyright</h1>
      <p className="mt-4 text-sm text-[var(--muted-foreground)]">
        Save47 does not host any content. We proxy media in real time from the source platform
        directly to the user&apos;s device. Even so, if you believe Save47 has been used to
        access content in a way that infringes your rights, you can submit a takedown notice and
        we will respond.
      </p>

      <Section title="How to submit a takedown request">
        Send an email to{' '}
        <a className="text-[var(--accent)] hover:underline" href="mailto:dmca@save47.com">
          dmca@save47.com
        </a>{' '}
        that includes:
        <ul className="ml-5 mt-2 list-disc space-y-1">
          <li>Your contact information.</li>
          <li>Identification of the copyrighted work.</li>
          <li>The exact URL(s) you allege infringe your rights.</li>
          <li>
            A statement, under penalty of perjury, that you are the rightsholder or authorized to
            act on the rightsholder&apos;s behalf.
          </li>
          <li>Your physical or electronic signature.</li>
        </ul>
      </Section>

      <Section title="Response time">
        We acknowledge valid takedown requests within 48 business hours and remove access to the
        identified URL pattern as appropriate.
      </Section>

      <Section title="Counter-notice">
        If your content was disabled by mistake, you can file a counter-notice using the same
        email address. We will review and reinstate access where appropriate.
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{children}</div>
    </section>
  );
}
