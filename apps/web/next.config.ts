import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
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
    ];
  },
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [{ source: '/api/proxy/:path*', destination: 'http://localhost:4000/:path*' }]
      : [];
  },
};

export default nextConfig;
