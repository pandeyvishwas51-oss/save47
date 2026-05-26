import Link from 'next/link';

interface FooterLink {
  href: string;
  label: string;
}

const DOWNLOADERS: FooterLink[] = [
  { href: '/youtube-downloader', label: 'YouTube' },
  { href: '/youtube-to-mp3', label: 'YouTube to MP3' },
  { href: '/youtube-shorts-downloader', label: 'YouTube Shorts' },
  { href: '/instagram-reel-downloader', label: 'Instagram Reels' },
  { href: '/instagram-video-downloader', label: 'Instagram Videos' },
  { href: '/tiktok-downloader', label: 'TikTok' },
  { href: '/facebook-video-downloader', label: 'Facebook' },
  { href: '/twitter-video-downloader', label: 'Twitter / X' },
  { href: '/reddit-video-downloader', label: 'Reddit' },
  { href: '/soundcloud-downloader', label: 'SoundCloud' },
  { href: '/pinterest-video-downloader', label: 'Pinterest' },
  { href: '/vimeo-downloader', label: 'Vimeo' },
  { href: '/twitch-clip-downloader', label: 'Twitch' },
  { href: '/dailymotion-downloader', label: 'Dailymotion' },
];

const PRODUCT: FooterLink[] = [
  { href: '/all-platforms', label: 'All platforms' },
  { href: '/api', label: 'API & CLI' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/download/apk', label: 'Android APK' },
  { href: '/compare', label: 'Compare' },
  { href: '/guides', label: 'Guides' },
];

const LEGAL: FooterLink[] = [
  { href: '/terms', label: 'Terms of Use' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/dmca', label: 'DMCA / Copyright' },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--card-border)] py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden>
                <defs>
                  <linearGradient id="ftr-mark" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#a78bfa" />
                    <stop offset="0.6" stopColor="#6366f1" />
                    <stop offset="1" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
                <path d="M7 8 L16 13 L25 8" stroke="url(#ftr-mark)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
                <path d="M6 15 L16 21 L26 15" stroke="url(#ftr-mark)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
                <path d="M5 22 L16 28 L27 22" stroke="url(#ftr-mark)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <span>Save47</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--muted-foreground)]">
              Free video downloader for YouTube, Instagram, TikTok and 1,000+ sites. No ads, no
              login, no tracking. Web, Android APK, and CLI.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
              <span className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-2 py-0.5">No ads</span>
              <span className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-2 py-0.5">No login</span>
              <span className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-2 py-0.5">Open source</span>
            </div>
          </div>

          {/* Downloaders — first half */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Downloaders
            </h3>
            <ul className="mt-4 space-y-2 text-xs">
              {DOWNLOADERS.slice(0, 7).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Downloaders — second half */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              More downloaders
            </h3>
            <ul className="mt-4 space-y-2 text-xs">
              {DOWNLOADERS.slice(7).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product + Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Product
            </h3>
            <ul className="mt-4 space-y-2 text-xs">
              {PRODUCT.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Legal
            </h3>
            <ul className="mt-4 space-y-2 text-xs">
              {LEGAL.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://github.com/pandeyvishwas51-oss/save47"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--card-border)] pt-6 text-xs text-[var(--muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Save47. Free forever.</p>
          <p className="max-w-2xl text-right leading-relaxed">
            Save47 is a tool for downloading content you own or have permission to download. Users
            are responsible for complying with platform terms of service and applicable copyright
            laws. We do not store or redistribute any content.
          </p>
        </div>
      </div>
    </footer>
  );
}
