import type { FaqItem } from '@/components/seo/FaqAccordion';

export interface Guide {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
  body: Array<{
    type: 'p' | 'h2' | 'h3' | 'ul' | 'ol' | 'code' | 'callout';
    text?: string;
    items?: string[];
    lang?: string;
  }>;
  faq: FaqItem[];
  related?: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'how-to-download-youtube-videos-on-iphone',
    title: 'How to download YouTube videos on iPhone (2024)',
    description:
      'Three reliable ways to save YouTube videos to your iPhone. The fastest needs no app — just Safari, a paste, and a tap.',
    publishedAt: '2024-09-01',
    updatedAt: '2024-12-01',
    authorName: 'Save47 Team',
    body: [
      { type: 'p', text: 'Apple does not allow YouTube downloads inside the official YouTube app, and most third-party iOS apps that promised this feature got pulled from the App Store. The good news is the modern web is more than capable. Here are three methods that actually work in 2024 — ranked by speed.' },
      { type: 'h2', text: 'Method 1 — Use Save47 in Safari (fastest, ~10 seconds)' },
      { type: 'ol', items: [
        'Open the YouTube app, find the video, and tap Share.',
        'Tap Copy Link.',
        'Open Safari and go to save47.com.',
        'Paste the link, pick MP4 quality, and tap the download arrow.',
        'When the file finishes, Safari saves it to the Files app under Downloads.',
      ]},
      { type: 'callout', text: 'Tip: install Save47 as a Progressive Web App by tapping Share → Add to Home Screen. Then a YouTube video can be shared directly to it from anywhere on iOS.' },
      { type: 'h2', text: 'Method 2 — Shortcuts app + the Save47 share target' },
      { type: 'p', text: 'If you do this often, build a one-tap Shortcut.' },
      { type: 'ol', items: [
        'Open Shortcuts and tap +.',
        'Add the action "Get URLs from Input".',
        'Add "Get Contents of URL" with https://save47.com/?url= followed by the magic URL variable.',
        'Add "Open URL" to send the result to Safari.',
        'Save the shortcut as "Download with Save47".',
      ]},
      { type: 'p', text: 'Now in YouTube, Share → Download with Save47 and the file pulls automatically.' },
      { type: 'h2', text: 'Method 3 — Files app + URL Scheme (advanced)' },
      { type: 'p', text: 'Power users can use the Save47 CLI on a Mac and AirDrop the file. This is the most reliable method for very large videos and bulk downloads, and the only one that supports 4K consistently.' },
      { type: 'h2', text: 'Which method should I use?' },
      { type: 'ul', items: [
        'One video, occasionally → Method 1 (Safari paste).',
        'Many videos, daily → Method 2 (Shortcut).',
        'Whole channels or playlists → Method 3 (CLI on a desktop).',
      ]},
      { type: 'h2', text: 'Frequently asked questions about iPhone downloads' },
      { type: 'p', text: 'See the FAQ below for the most common iPhone-specific issues.' },
    ],
    faq: [
      { q: 'Why can\'t I save videos directly from YouTube on iPhone?', a: 'Apple\'s App Store guidelines prohibit apps that download from YouTube without YouTube\'s consent. YouTube\'s own Premium tier is the only sanctioned offline-save option inside their app.' },
      { q: 'Where are downloaded videos saved?', a: 'iOS saves them to Files → On My iPhone → Downloads by default. From there you can move them to Photos, share them, or open them in any video app.' },
      { q: 'Does this work with YouTube Shorts?', a: 'Yes — the same paste-and-download flow handles Shorts. Save47 detects vertical Shorts and saves them in their native aspect ratio.' },
      { q: 'Can I get 4K on iPhone?', a: 'iPhones from the 11 Pro onward play 4K video natively. Save47 will offer 4K when the source video is 4K. If only 1080p is offered, the YouTube video itself was uploaded at 1080p maximum.' },
    ],
    related: ['how-to-download-instagram-reels', 'youtube-to-mp3-best-quality'],
  },
  {
    slug: 'how-to-download-instagram-reels',
    title: 'How to download Instagram Reels (no login required)',
    description:
      'Save Reels from any public Instagram account as MP4 or MP3. Works on iPhone, Android, and desktop without an Instagram account.',
    publishedAt: '2024-09-15',
    updatedAt: '2024-12-01',
    authorName: 'Save47 Team',
    body: [
      { type: 'p', text: 'Instagram Reels are short, vertical, and addictive — and Instagram makes them deliberately hard to save. There is no built-in download button for content from other people\'s accounts, only for your own posts. Here is how to save any public Reel in 30 seconds, without an Instagram account.' },
      { type: 'h2', text: 'Step-by-step on mobile' },
      { type: 'ol', items: [
        'Open the Reel in the Instagram app.',
        'Tap the three-dot menu (•••) below the video and choose Copy Link.',
        'Open Save47 in your browser and paste the link.',
        'Pick MP4 quality. Tap download. The file goes straight to your phone.',
      ]},
      { type: 'h2', text: 'Why Save47 works without an Instagram login' },
      { type: 'p', text: 'Instagram\'s public CDN serves Reel media to anyone with the URL — that\'s how the embed previews work on news sites. Save47 fetches the original CDN URL using the same protocol Instagram\'s own embed widget uses, then streams the bytes straight to your browser. No proxy, no re-encoding, no quality loss.' },
      { type: 'h2', text: 'What about private accounts and Stories?' },
      { type: 'p', text: 'Save47 does not bypass Instagram privacy. If a Reel is from a private account, you need to be a follower with an active session — and we do not request your login. For Stories, the public URL expires after 24 hours; if you grab it within that window, Save47 can save it.' },
      { type: 'h2', text: 'Bulk-saving Reels from a creator' },
      { type: 'p', text: 'If you want every Reel from a public account, use the Save47 CLI:' },
      { type: 'code', lang: 'bash', text: 'npm i -g save47-cli\nsave47 login YOUR_API_KEY\nsave47 download "https://www.instagram.com/<account>/reels/" --quality 1080p --out ./reels' },
      { type: 'p', text: 'The CLI walks the Reels grid, queues each video, and saves them with deterministic filenames so you can re-run safely.' },
      { type: 'h2', text: 'Frequently asked questions about Instagram downloads' },
      { type: 'p', text: 'See the FAQ below for the most common Instagram-specific issues.' },
    ],
    faq: [
      { q: 'Is downloading Instagram Reels legal?', a: 'Downloading public content for personal use is generally fine. Re-uploading it as your own, monetizing it, or using it commercially without permission may violate copyright. Always credit creators.' },
      { q: 'Why does the Reel sometimes fail to download?', a: 'Instagram occasionally rotates their CDN URLs and we have to update extraction. If a Reel fails, try again in a few minutes — we monitor and patch within hours.' },
      { q: 'Can I download Stories?', a: 'Yes, public Stories within the 24-hour window. Highlights work too. Private Stories are not supported by design.' },
      { q: 'Does Save47 add a watermark?', a: 'No. We deliver the original Instagram CDN file. There is no Save47 branding on the video.' },
    ],
    related: ['how-to-download-tiktok-without-watermark', 'how-to-download-youtube-videos-on-iphone'],
  },
  {
    slug: 'how-to-download-tiktok-without-watermark',
    title: 'How to download TikTok videos without watermark (2024)',
    description:
      'TikTok\'s download button bakes a watermark into the video. Here is how to save TikToks without the watermark, in original 1080p.',
    publishedAt: '2024-10-01',
    updatedAt: '2024-12-01',
    authorName: 'Save47 Team',
    body: [
      { type: 'p', text: 'Every TikTok you save through the official app gets a moving username watermark in the corner. For personal archiving, repost compilations, or video editing it\'s a problem. The good news: TikTok\'s CDN serves a clean, watermark-free copy of every public video — you just have to ask for it correctly.' },
      { type: 'h2', text: 'The 30-second method' },
      { type: 'ol', items: [
        'Tap Share on the TikTok and choose Copy Link.',
        'Paste it into Save47.',
        'Pick MP4 1080p. Tap download. Done.',
      ]},
      { type: 'h2', text: 'Why this works (and why most other tools fail)' },
      { type: 'p', text: 'TikTok serves two versions of every video: the watermarked "playable" version their app shows, and the original "source" version uploaded by the creator. The source version is accessible via the unauthenticated TikTok web API used for embeds. Save47 fetches the source version directly — no watermark, no re-encoding, no quality loss.' },
      { type: 'p', text: 'Many sketchy free downloaders only grab the watermarked version because it\'s easier to scrape. Save47 does the extra work to get the clean copy.' },
      { type: 'h2', text: 'Bulk download from a TikTok account' },
      { type: 'p', text: 'For creators or archivists who want every video from an account:' },
      { type: 'code', lang: 'bash', text: 'save47 download "https://www.tiktok.com/@username" --quality 1080p --out ./tiktok' },
      { type: 'h2', text: 'FAQ' },
    ],
    faq: [
      { q: 'Will TikTok know I downloaded the video?', a: 'No. Save47 fetches publicly accessible URLs without an authenticated session. There is no signal sent to TikTok that ties the download to you.' },
      { q: 'What about private videos?', a: 'Private TikToks require a logged-in session that follows the creator. Save47 does not bypass that — we only handle public videos.' },
      { q: 'Why is the audio sometimes missing?', a: 'TikTok occasionally serves video and audio as separate streams. Save47 merges them automatically using ffmpeg before delivering the file.' },
    ],
    related: ['how-to-download-instagram-reels', 'how-to-download-youtube-videos-on-iphone'],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function listGuideSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
}
