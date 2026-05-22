import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, Globe, Shield, Smartphone, Zap } from 'lucide-react';
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/seo/StructuredData';
import { FaqAccordion } from '@/components/seo/FaqAccordion';

export const metadata: Metadata = {
  title: 'Download Save47 APK — Android Video Downloader',
  description:
    'Free Android APK for Save47. Download videos from YouTube, Instagram, TikTok and 1000+ sites directly from your phone. No ads, no login.',
  alternates: { canonical: '/download/apk' },
  openGraph: {
    title: 'Download Save47 for Android',
    description: 'Free APK. No ads. No login. Share-target enabled.',
    type: 'website',
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const APK_URL = process.env.NEXT_PUBLIC_APK_URL || '/downloads/save47-latest.apk';
const APK_VERSION = process.env.NEXT_PUBLIC_APK_VERSION || '1.0.0';

const APK_FAQ = [
  {
    q: 'Is the Save47 APK safe?',
    a: 'Yes. The APK is open source and built from this repository. It is signed and SHA-256 checksums are published on the GitHub release page so you can verify integrity before installing.',
  },
  {
    q: 'Why is it not on the Play Store?',
    a: 'Google Play does not allow general-purpose video downloaders that bypass platform terms. We distribute the APK directly to keep the app free, ad-free, and unrestricted.',
  },
  {
    q: 'How do I install an APK on Android?',
    a: 'Tap the download button below, open the file, and confirm "Install from unknown source" when prompted. After install you can revoke that permission again.',
  },
  {
    q: 'Will the app update automatically?',
    a: 'The app shell wraps our PWA, so UI and feature updates ship instantly. Major shell upgrades (target SDK bumps, signing key rotations) will require reinstalling a new APK release.',
  },
  {
    q: 'Does the app track me?',
    a: 'No. The Android app uses the same privacy-first backend as the website — no analytics, no third-party SDKs, no telemetry of any kind.',
  },
];

export default function ApkPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Download APK', url: `${SITE_URL}/download/apk` },
        ])}
      />
      <JsonLd data={faqSchema(APK_FAQ)} />

      <section className="mx-auto max-w-3xl pt-8 text-center sm:pt-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
          <Smartphone size={12} className="text-[var(--accent)]" />
          Android · v{APK_VERSION} · ~6 MB
        </div>
        <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Save47 for Android
        </h1>
        <p className="mt-4 text-balance text-base text-[var(--muted-foreground)] sm:text-lg">
          Install the APK and download from any app: tap share in Instagram, TikTok, or YouTube,
          pick Save47, and the file lands in your downloads folder.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href={APK_URL}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-medium text-white transition hover:bg-[var(--accent-hover)]"
            download
          >
            <Download size={18} />
            Download APK · v{APK_VERSION}
          </a>
          <p className="text-xs text-[var(--muted-foreground)]">
            SHA-256 checksums published with each{' '}
            <a
              href="https://github.com/save47/save47/releases"
              className="underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              GitHub release
            </a>
            .
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
          >
            <Globe size={14} />
            Or use Save47 on the web
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
        <Feature
          icon={<Zap size={18} />}
          title="Native share target"
          desc="Receive URLs from any social app via Android's share menu."
        />
        <Feature
          icon={<Shield size={18} />}
          title="Open source"
          desc="Build it yourself from source. Reproducible builds via GitHub Actions."
        />
        <Feature
          icon={<Smartphone size={18} />}
          title="Lightweight"
          desc="Just a few MB. The app is a TWA shell over the web app."
        />
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">Install steps</h2>
        <ol className="mt-6 space-y-3">
          {[
            'Tap the green Download APK button above to save save47-latest.apk to your phone.',
            'Open your Files app, tap the APK, and confirm "Install from unknown source" when Android prompts.',
            'Launch Save47. Optionally pin it to your home screen and disable the unknown-sources permission again.',
            'Use the share button in any social app and pick Save47 to send a link straight to the downloader.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-xs font-semibold text-[var(--accent)]">
                {i + 1}
              </div>
              <span className="text-sm">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-16 max-w-3xl pb-16">
        <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-6">
          <FaqAccordion items={APK_FAQ} />
        </div>
      </section>
    </>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{desc}</p>
    </div>
  );
}
