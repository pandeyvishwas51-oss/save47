import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const SIZE = { width: 1200, height: 630 };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || 'Save47 — Free Video Downloader').slice(0, 100);
  const subtitle = (
    searchParams.get('subtitle') ||
    'YouTube, Instagram, TikTok and 1000+ sites · No ads · No login'
  ).slice(0, 140);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#09090b',
          backgroundImage:
            'radial-gradient(circle at 30% 20%, rgba(167,139,250,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.20) 0%, transparent 50%)',
          padding: 80,
          fontFamily: 'sans-serif',
          color: '#fafafa',
          position: 'relative',
        }}
      >
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width="56" height="56" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="og-mark" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#a78bfa" />
                <stop offset="0.6" stopColor="#6366f1" />
                <stop offset="1" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <path d="M7 8 L16 13 L25 8" stroke="url(#og-mark)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
            <path d="M6 15 L16 21 L26 15" stroke="url(#og-mark)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
            <path d="M5 22 L16 28 L27 22" stroke="url(#og-mark)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }}>Save47</span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 'auto',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#fafafa',
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              marginTop: 24,
              color: '#a1a1aa',
              maxWidth: 980,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 48,
            fontSize: 20,
            color: '#a1a1aa',
          }}
        >
          {['No ads', 'No login', 'Open source', '1000+ sites'].map((label) => (
            <span
              key={label}
              style={{
                padding: '8px 18px',
                borderRadius: 999,
                border: '1px solid #27272a',
                background: '#18181b',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
