import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/StructuredData';
import { SITE, siteWideSchema } from '@/lib/seo';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const API_HOST = process.env.NEXT_PUBLIC_API_URL || 'https://save47-api-production.up.railway.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Save47 — Free Video Downloader for YouTube, Instagram, TikTok',
    template: '%s | Save47',
  },
  description: SITE.defaultDescription,
  keywords: [
    'video downloader',
    'youtube downloader',
    'youtube to mp3',
    'youtube to mp4',
    'instagram reel downloader',
    'instagram video downloader',
    'tiktok downloader',
    'tiktok no watermark',
    'twitter video downloader',
    'x video downloader',
    'reddit video downloader',
    'facebook video downloader',
    'soundcloud downloader',
    'pinterest video downloader',
    'vimeo downloader',
    'twitch clip downloader',
    'free video download',
    'no ads downloader',
    'mp4 downloader',
    'mp3 converter',
    'online video downloader',
    'save online videos',
    '4k video downloader',
    'hd video downloader',
  ],
  applicationName: SITE.name,
  authors: [{ name: 'Save47', url: SITE.url }],
  creator: 'Save47',
  publisher: 'Save47',
  manifest: '/manifest.json',
  alternates: { canonical: '/' },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: 'Save47 — Free Video Downloader',
    description:
      'Download videos from YouTube, Instagram, TikTok and 1000+ sites. No ads, no login. Web, Android, and CLI.',
    locale: 'en_US',
    url: SITE.url,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Save47 — Free Video Downloader' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Save47 — Free Video Downloader',
    description: 'No ads. No login. 1000+ sites supported.',
    site: SITE.twitter,
    creator: SITE.twitter,
    images: ['/og-image.png'],
  },
  robots: {
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
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/logo-mark.svg', type: 'image/svg+xml' },
    ],
    apple: '/icons/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Save47',
  },
  category: 'technology',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION ?? '',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#6366f1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemas = siteWideSchema();
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo-mark.svg" type="image/svg+xml" />
        <link rel="preconnect" href={API_HOST} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={API_HOST} />
        <meta name="theme-color" content="#6366f1" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Save47" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        {schemas.map((s, i) => (
          <JsonLd key={i} data={s} />
        ))}
      </head>
      <body className="min-h-dvh bg-[var(--background)] font-sans text-[var(--foreground)] antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Header />
          <main className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
