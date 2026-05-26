import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Improves Core Web Vitals + reduces transferred bytes for SEO ranking.
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24h
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' }, // YouTube
      { protocol: 'https', hostname: '**.ytimg.com' },
      { protocol: 'https', hostname: '**.cdninstagram.com' }, // Instagram
      { protocol: 'https', hostname: 'instagram.com' },
      { protocol: 'https', hostname: '**.tiktokcdn.com' }, // TikTok
      { protocol: 'https', hostname: '**.tiktokcdn-us.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' }, // Facebook
      { protocol: 'https', hostname: 'pbs.twimg.com' }, // Twitter
      { protocol: 'https', hostname: 'preview.redd.it' }, // Reddit
      { protocol: 'https', hostname: 'external-preview.redd.it' },
      { protocol: 'https', hostname: 'i1.sndcdn.com' }, // SoundCloud
      { protocol: 'https', hostname: 'i.pinimg.com' }, // Pinterest
      { protocol: 'https', hostname: 'i.vimeocdn.com' }, // Vimeo
      { protocol: 'https', hostname: 's2.dmcdn.net' }, // Dailymotion
      { protocol: 'https', hostname: 'clips-media-assets2.twitch.tv' }, // Twitch
    ],
    dangerouslyAllowSVG: false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Long cache for sitemap + robots — Google re-fetches these on its own schedule.
        source: '/(sitemap.xml|robots.txt)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' }],
      },
      {
        // 1 year immutable cache for OG images.
        source: '/og',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [{ source: '/api/proxy/:path*', destination: 'http://localhost:4000/:path*' }]
      : [];
  },
};

export default nextConfig;
