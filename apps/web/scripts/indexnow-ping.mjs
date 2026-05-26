#!/usr/bin/env node
// IndexNow auto-ping. Call this after a successful production deploy to
// notify Bing and Yandex that fresh URLs exist. Result: pages get crawled
// within minutes instead of the days Google would normally take.
//
// Usage in package.json:
//   "postdeploy": "node scripts/indexnow-ping.mjs"
//
// Or run manually:
//   INDEXNOW_KEY=save47-2026-indexnow-verify-9f3a8c2d1b4e \
//     node scripts/indexnow-ping.mjs

const KEY = process.env.INDEXNOW_KEY || 'save47-2026-indexnow-verify-9f3a8c2d1b4e';
const HOST = process.env.SITE_HOST || 'save47.com';
const ORIGIN = `https://${HOST}`;

// All canonical URLs we want indexed. Mirrors sitemap.ts logic so the two
// stay in sync. If you add a new page, add it here as well.
const URLS = [
  '/',
  '/all-platforms',
  '/online-video-downloader',
  '/free-video-downloader',
  '/hd-video-downloader',
  '/api',
  '/pricing',
  '/download/apk',
  '/compare',
  '/guides',
  '/youtube-downloader',
  '/youtube-mp4-downloader',
  '/youtube-to-mp3',
  '/youtube-shorts-downloader',
  '/instagram-reel-downloader',
  '/instagram-video-downloader',
  '/tiktok-downloader',
  '/facebook-video-downloader',
  '/twitter-video-downloader',
  '/reddit-video-downloader',
  '/soundcloud-downloader',
  '/pinterest-video-downloader',
  '/vimeo-downloader',
  '/twitch-clip-downloader',
  '/dailymotion-downloader',
  '/guides/how-to-download-youtube-videos-on-iphone',
  '/guides/how-to-download-instagram-reels',
  '/guides/how-to-download-tiktok-without-watermark',
  '/guides/how-to-download-youtube-videos-on-android',
  '/guides/youtube-to-mp3-best-quality',
  '/guides/how-to-download-instagram-photos',
  '/guides/best-video-downloader-2026',
  '/guides/is-it-legal-to-download-youtube-videos',
  '/guides/safe-video-downloader-without-malware',
].map((p) => `${ORIGIN}${p}`);

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: `${ORIGIN}/${KEY}.txt`,
  urlList: URLS,
};

// IndexNow accepts the same payload at multiple endpoints; submitting to
// the public api.indexnow.org propagates to Bing, Yandex, and Naver.
const ENDPOINTS = ['https://api.indexnow.org/indexnow', 'https://www.bing.com/indexnow'];

async function ping(endpoint) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log(`[indexnow] ${endpoint} → ${res.status} ${res.statusText}`);
    if (res.status >= 400) {
      const text = await res.text();
      console.warn(`[indexnow] body: ${text.slice(0, 500)}`);
    }
    return res.status;
  } catch (err) {
    console.error(`[indexnow] ${endpoint} failed: ${err.message}`);
    return 0;
  }
}

(async () => {
  console.log(`[indexnow] submitting ${URLS.length} URLs from ${HOST}`);
  await Promise.all(ENDPOINTS.map(ping));
  console.log('[indexnow] done');
})();
