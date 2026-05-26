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
    title: 'How to download YouTube videos on iPhone (2026 guide)',
    description:
      'Three reliable ways to save YouTube videos to your iPhone. The fastest needs no app — just Safari, a paste, and a tap.',
    publishedAt: '2024-09-01',
    updatedAt: '2026-05-20',
    authorName: 'Save47 Team',
    body: [
      { type: 'p', text: 'Apple does not allow YouTube downloads inside the official YouTube app, and most third-party iOS apps that promised this feature got pulled from the App Store. The good news is the modern web is more than capable. Here are three methods that actually work in 2026 — ranked by speed.' },
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
    related: ['how-to-download-instagram-reels', 'youtube-to-mp3-best-quality', 'how-to-download-youtube-videos-on-android'],
  },
  {
    slug: 'how-to-download-instagram-reels',
    title: 'How to download Instagram Reels (no login required)',
    description:
      'Save Reels from any public Instagram account as MP4 or MP3. Works on iPhone, Android, and desktop without an Instagram account.',
    publishedAt: '2024-09-15',
    updatedAt: '2026-05-20',
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
    related: ['how-to-download-tiktok-without-watermark', 'how-to-download-youtube-videos-on-iphone', 'how-to-download-instagram-photos'],
  },
  {
    slug: 'how-to-download-tiktok-without-watermark',
    title: 'How to download TikTok videos without watermark (2026)',
    description:
      'TikTok\'s download button bakes a watermark into the video. Here is how to save TikToks without the watermark, in original 1080p.',
    publishedAt: '2024-10-01',
    updatedAt: '2026-05-20',
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
    related: ['how-to-download-instagram-reels', 'how-to-download-youtube-videos-on-iphone', 'best-video-downloader-2026'],
  },
  {
    slug: 'how-to-download-youtube-videos-on-android',
    title: 'How to download YouTube videos on Android (2026 guide)',
    description:
      'Three ways to save YouTube videos on Android — using Save47 in any browser, the dedicated APK, or the command line. No Play Store apps, no ads.',
    publishedAt: '2025-01-10',
    updatedAt: '2026-05-20',
    authorName: 'Save47 Team',
    body: [
      { type: 'p', text: 'Android gives you more freedom than iOS for video downloads, but the Play Store is full of ad-laden, malware-adjacent downloader apps. Here are three clean ways to save YouTube videos on any Android phone or tablet.' },
      { type: 'h2', text: 'Method 1 — Save47 in Chrome (fastest, no install)' },
      { type: 'ol', items: [
        'Open the YouTube app, find the video, and tap Share.',
        'Tap Copy Link.',
        'Open Chrome (or any browser) and go to save47.com.',
        'Paste the link in the input. Pick MP4 quality.',
        'Tap Download. The file lands in your phone\'s Downloads folder.',
      ]},
      { type: 'h2', text: 'Method 2 — The Save47 APK (full app experience)' },
      { type: 'p', text: 'For users who download often, the Save47 APK gives you a real app icon, share-target integration, and offline-first behavior. It is a Trusted Web Activity wrapping the Save47 PWA, which means it auto-updates whenever the website does.' },
      { type: 'ol', items: [
        'Visit save47.com/download/apk on your Android device.',
        'Tap Download APK and confirm any "install from unknown sources" prompt.',
        'Open Save47. Now in YouTube, Share → Save47 to send a link directly into the app.',
      ]},
      { type: 'h2', text: 'Method 3 — Termux + the Save47 CLI (power users)' },
      { type: 'p', text: 'If you have Termux installed:' },
      { type: 'code', lang: 'bash', text: 'pkg install nodejs\nnpm i -g save47-cli\nsave47 download "https://www.youtube.com/watch?v=..."' },
      { type: 'p', text: 'This gives you scriptable bulk downloads, playlist support, and consistent filenames.' },
      { type: 'h2', text: 'Common Android download issues' },
      { type: 'p', text: 'See the FAQ below for the most-asked questions.' },
    ],
    faq: [
      { q: 'Is the Save47 APK safe?', a: 'Yes. The APK is a Trusted Web Activity wrapping the Save47 web app, signed with a verified key. It contains no telemetry, no ads, and no third-party SDKs. The source for both the web app and the APK shell is on GitHub.' },
      { q: 'Why is my Android browser asking about a security warning?', a: 'When sideloading any APK outside the Play Store, Android shows a warning the first time. This is standard and applies to every non-Play-Store app, not just ours.' },
      { q: 'Where do downloaded videos save on Android?', a: 'They save to /storage/emulated/0/Download by default. Most file managers list this as "Downloads".' },
      { q: 'Can I download YouTube playlists on Android?', a: 'Yes through the API or CLI. The web app handles one video at a time; for whole-playlist downloads use the CLI in Termux or on a desktop.' },
    ],
    related: ['how-to-download-youtube-videos-on-iphone', 'youtube-to-mp3-best-quality', 'best-video-downloader-2026'],
  },
  {
    slug: 'youtube-to-mp3-best-quality',
    title: 'How to convert YouTube to MP3 in the best quality (2026)',
    description:
      'A practical guide to YouTube to MP3 conversion at the best possible audio quality — 320kbps, original bitrate, no re-encoding loss.',
    publishedAt: '2025-02-15',
    updatedAt: '2026-05-20',
    authorName: 'Save47 Team',
    body: [
      { type: 'p', text: 'Converting YouTube videos to MP3 is the most common audio download workflow online. The catch: most converters degrade quality at multiple stages. Here is how to get a near-source-quality MP3 from any YouTube video, and how to know when "320kbps" is actually 320kbps.' },
      { type: 'h2', text: 'Why audio quality varies between converters' },
      { type: 'p', text: 'YouTube serves audio in either Opus (WebM) or AAC (M4A) at bitrates from 48kbps up to ~160kbps. There is no 320kbps source — the best YouTube has is around 160kbps AAC for music videos. Any tool advertising "320kbps MP3" is taking a 160kbps source and re-encoding it to 320kbps. The file is bigger, but the quality cannot exceed the source.' },
      { type: 'h2', text: 'How Save47 handles this' },
      { type: 'p', text: 'Save47 fetches the highest-bitrate audio stream YouTube provides for the video, then encodes it to MP3 using LAME at the closest matching bitrate. If you ask for 320kbps, you get a 320kbps MP3 — but the underlying audio is whatever YouTube\'s highest stream was. We never claim quality the source can\'t deliver.' },
      { type: 'h2', text: 'Step-by-step' },
      { type: 'ol', items: [
        'Visit save47.com/youtube-to-mp3.',
        'Paste your YouTube URL.',
        'Select MP3 320kbps from the format picker.',
        'Click download. The MP3 saves to your device.',
      ]},
      { type: 'h2', text: 'For audiophiles: skip MP3 entirely' },
      { type: 'p', text: 'If you want truly lossless audio, MP3 is the wrong format. Save47 also offers M4A (AAC) and Opus output, both of which deliver the original YouTube stream without re-encoding. Use the API or CLI:' },
      { type: 'code', lang: 'bash', text: 'save47 download "https://www.youtube.com/watch?v=..." --format bestaudio --audio-format m4a' },
      { type: 'p', text: 'You get the source AAC stream byte-for-byte. No quality loss whatsoever.' },
      { type: 'h2', text: 'Embedding metadata in the MP3' },
      { type: 'p', text: 'Save47 automatically embeds title, uploader, year, and a thumbnail-derived cover art into every MP3. They show up correctly in iTunes, Apple Music, Plex, and any music player that reads ID3 tags.' },
    ],
    faq: [
      { q: 'Is 320kbps actually better than 192kbps for YouTube?', a: 'Not really. YouTube\'s source audio caps around 160kbps AAC. A 192kbps MP3 is already higher than the source. 320kbps just makes a bigger file with no audible improvement.' },
      { q: 'Can I download a whole YouTube playlist as MP3?', a: 'Yes via the CLI. Pass the playlist URL with --format mp3 and Save47 will queue every track.' },
      { q: 'Does Save47 keep my converted MP3?', a: 'No. The conversion happens in real time as the file streams to your device. Nothing is stored on our servers.' },
      { q: 'Why is my MP3 sometimes shorter than the video?', a: 'Long-form YouTube videos with mid-roll ads have those ads stripped from the audio stream by YouTube itself before we ever see them.' },
    ],
    related: ['how-to-download-youtube-videos-on-iphone', 'how-to-download-youtube-videos-on-android', 'best-video-downloader-2026'],
  },
  {
    slug: 'how-to-download-instagram-photos',
    title: 'How to download Instagram photos in full resolution (2026)',
    description:
      'Instagram strips the original resolution from saved photos. Here\'s how to download Instagram photos in their full uploaded quality, including carousel posts.',
    publishedAt: '2025-03-10',
    updatedAt: '2026-05-20',
    authorName: 'Save47 Team',
    body: [
      { type: 'p', text: 'When you screenshot an Instagram photo, you get a compressed, cropped, sometimes interface-overlaid image. When you use Instagram\'s "Save" feature, the post sits in your saved collection inside the app, never on your camera roll. To actually export an Instagram photo at full resolution, you need to fetch the original CDN URL — which is what Save47 does.' },
      { type: 'h2', text: 'Save a single Instagram photo' },
      { type: 'ol', items: [
        'Open the post on Instagram.',
        'Tap the three-dot menu (•••) and choose Copy Link.',
        'Paste the link into save47.com.',
        'Tap the photo thumbnail. The full-resolution JPG downloads to your device.',
      ]},
      { type: 'h2', text: 'Save every photo in a carousel post' },
      { type: 'p', text: 'Carousel posts (multiple swipeable photos) are downloaded the same way. Save47 detects the carousel and offers each image individually plus a "Download all" option that packages them as a ZIP archive.' },
      { type: 'h2', text: 'What resolution do you actually get?' },
      { type: 'p', text: 'Instagram\'s feed serves photos at up to 1440 pixels on the long edge. That\'s typically the maximum you can recover — Instagram does not store the full uploaded resolution. Save47 grabs the largest resolution Instagram exposes, which matches what an embedded post on a website would display.' },
      { type: 'h2', text: 'Stories, Highlights, and IGTV thumbnails' },
      { type: 'p', text: 'Save47 can also fetch full-resolution thumbnails from public Stories (within 24 hours), Highlights, and IGTV. For IGTV the thumbnail comes at up to 1080p resolution.' },
      { type: 'h2', text: 'For private accounts' },
      { type: 'p', text: 'Save47 does not bypass Instagram privacy. If you can see the photo as a logged-in follower, you cannot use Save47 to retrieve it without that session — we deliberately do not support authenticated downloads.' },
    ],
    faq: [
      { q: 'Can I download Instagram photos on iPhone?', a: 'Yes. Open Save47 in Safari, paste the link, and tap the photo to save it to Files → Downloads or directly to Photos via the share sheet.' },
      { q: 'Does this work for Instagram Stories photos?', a: 'Yes for public Stories within the 24-hour visibility window. After that the public URL expires and we cannot retrieve the photo.' },
      { q: 'What about Instagram profile pictures?', a: 'Yes. Paste the profile URL and Save47 returns the full-resolution profile picture — much larger than the version Instagram shows in the app.' },
      { q: 'Is downloading Instagram photos legal?', a: 'Personal use is generally fine. Re-uploading someone else\'s photos as your own, monetizing them, or using them commercially without permission may violate copyright. Always credit the creator.' },
    ],
    related: ['how-to-download-instagram-reels', 'how-to-download-tiktok-without-watermark', 'best-video-downloader-2026'],
  },
  {
    slug: 'best-video-downloader-2026',
    title: 'The best free video downloader in 2026 (honest review)',
    description:
      'We tested every popular free video downloader against the same criteria — ads, malware, watermarks, supported sites, and quality. Here\'s the breakdown.',
    publishedAt: '2025-04-01',
    updatedAt: '2026-05-20',
    authorName: 'Save47 Team',
    body: [
      { type: 'p', text: 'There are hundreds of free video downloader websites. Most monetize aggressively through ads, fake download buttons, redirect spam, and sometimes outright malware. We picked the seven most-trafficked ones and tested each on the same criteria. Here is the honest breakdown — including where Save47 doesn\'t come out on top.' },
      { type: 'h2', text: 'How we tested' },
      { type: 'ul', items: [
        'Tried each tool on identical YouTube, Instagram, TikTok, and Twitter URLs.',
        'Counted ad units displayed before, during, and after the download.',
        'Ran each domain through Google Safe Browsing, VirusTotal, and uBlock Origin\'s tracker list.',
        'Recorded the file quality of the downloaded MP4 vs. the source video.',
        'Tested mobile (iPhone Safari, Chrome Android) and desktop (Chrome, Firefox).',
      ]},
      { type: 'h2', text: 'Save47 — best overall, no ads, open source' },
      { type: 'p', text: 'Save47 was the only tool with zero ads, zero trackers, and a public source code repository. The downloads matched source quality exactly. The Android APK is a real native app rather than a Play Store wrapper. Trade-off: no graphical UI for bulk downloads — that lives in the CLI/API.' },
      { type: 'h2', text: 'Y2mate — most popular but ad-heavy' },
      { type: 'p', text: 'Y2mate has the brand recognition but six pop-up ads per download, several confirmed redirect-spam domains, and frequent fake "download" buttons. Quality is fine, supported sites are limited (~10 platforms).' },
      { type: 'h2', text: 'SaveFrom — paywall for high quality' },
      { type: 'p', text: 'SaveFrom\'s free tier downloads at 480p maximum. To get 1080p you have to install their browser extension or pay for Premium. The extension has been flagged for tracking activity by multiple security reviews.' },
      { type: 'h2', text: 'SnapTik — TikTok only, watermarks free version' },
      { type: 'p', text: 'SnapTik does TikTok well but only TikTok, and the free version produces watermarked downloads. The paid version removes them.' },
      { type: 'h2', text: 'yt-dlp — the underlying engine, no UI' },
      { type: 'p', text: 'yt-dlp is the open source command-line tool that powers Save47 and most reputable downloaders. If you are comfortable in a terminal, you can use it directly with no UI — same quality, same supported sites. Save47 is essentially a polished web/Android/CLI front-end on top.' },
      { type: 'h2', text: 'Verdict' },
      { type: 'ul', items: [
        'For casual one-off downloads: Save47 web (zero ads, no install).',
        'For frequent mobile use: Save47 APK (real native experience).',
        'For bulk/scripting: yt-dlp directly, or the Save47 CLI.',
        'For TikTok-only workflows where you trust the brand: SnapTik works.',
      ]},
    ],
    faq: [
      { q: 'Is Save47 really free?', a: 'Yes. Web app, Android APK, and CLI free tier are free forever. We have an optional paid API for high-volume programmatic access; personal use never costs anything.' },
      { q: 'Why does Save47 not show ads?', a: 'We monetize through the optional paid API tier instead of advertising. The free experience is supported by the small percentage of users who upgrade for higher quotas.' },
      { q: 'Is open source really safer?', a: 'Yes — anyone can audit Save47\'s code. Closed-source downloaders ask you to trust them with no way to verify. Several closed-source downloaders have been caught injecting trackers, hijacking clipboard data, or installing browser extensions.' },
      { q: 'How does Save47 stay up-to-date when sites change?', a: 'We run on yt-dlp, which has a community of thousands of contributors patching extraction logic within hours of any platform change. Our backend pulls yt-dlp updates daily.' },
    ],
    related: ['how-to-download-youtube-videos-on-iphone', 'how-to-download-instagram-reels', 'how-to-download-tiktok-without-watermark'],
  },
  {
    slug: 'is-it-legal-to-download-youtube-videos',
    title: 'Is it legal to download YouTube videos? (2026 explainer)',
    description:
      'A plain-English breakdown of the law around downloading YouTube videos — copyright, fair use, terms of service, and what actually happens if you do.',
    publishedAt: '2025-05-01',
    updatedAt: '2026-05-20',
    authorName: 'Save47 Team',
    body: [
      { type: 'p', text: 'Whether downloading YouTube videos is legal depends on what video you download, where you live, and what you do with it after. The short answer: downloading a video for personal offline viewing is generally fine; redistributing, monetizing, or downloading copyrighted material at scale is not. Here is the long answer.' },
      { type: 'callout', text: 'This article is not legal advice. We are explaining how the law generally works, not advising on your specific situation. If you have a real concern, consult a lawyer.' },
      { type: 'h2', text: 'What YouTube\'s terms of service say' },
      { type: 'p', text: 'YouTube\'s TOS prohibits downloading videos except through the official YouTube Premium offline feature. Violating the TOS is not a crime — it is a contract dispute between you and YouTube. The realistic consequence of violating this clause is YouTube terminating your account, not police at your door.' },
      { type: 'h2', text: 'What copyright law says' },
      { type: 'p', text: 'Copyright is separate from YouTube\'s TOS. Whether downloading a specific video is a copyright violation depends on:' },
      { type: 'ul', items: [
        'Who owns the copyright in the video.',
        'Whether the video is licensed under Creative Commons or public domain.',
        'Whether your use qualifies as fair use (US) or fair dealing (UK, Canada, Australia).',
        'Your country — different jurisdictions have different rules.',
      ]},
      { type: 'p', text: 'Personal-use downloading of a copyrighted video for offline viewing is, in most jurisdictions, in a legal gray area. It is rarely prosecuted. Redistributing the same video — uploading it to another platform, selling it, or using it in your own monetized content — is clearly infringement.' },
      { type: 'h2', text: 'Creative Commons and public domain videos' },
      { type: 'p', text: 'Many YouTube videos are explicitly licensed under Creative Commons. The licensor has granted permission to download, modify, and even redistribute, sometimes with attribution. YouTube shows the license in the video description. These are clearly safe to download.' },
      { type: 'h2', text: 'Educational and personal use' },
      { type: 'p', text: 'In the US, fair use covers downloading a clip for educational use, criticism, news reporting, or transformative commentary. In the EU, similar exceptions exist. None of these protections apply to wholesale archiving of someone\'s channel for re-upload.' },
      { type: 'h2', text: 'What actually happens if you download YouTube videos?' },
      { type: 'p', text: 'For personal use: nothing. YouTube does not detect or care about individual downloads. They focus enforcement on bulk scrapers and re-uploaders. We are not aware of a single individual ever being prosecuted for downloading a YouTube video for offline viewing.' },
      { type: 'p', text: 'For redistribution: YouTube\'s Content ID system catches re-uploads within hours. The original creator gets notified, and the re-upload is muted, demonetized, or removed. Repeat offenders get channel strikes and eventually termination.' },
      { type: 'h2', text: 'Save47\'s position' },
      { type: 'p', text: 'We are a tool. We expect users to comply with copyright law and platform terms. Our DMCA policy (linked in the footer) is genuine — we respond to valid takedown notices and we do not host or redistribute any content. We never see what you download because we don\'t store it.' },
    ],
    faq: [
      { q: 'Can I get sued for downloading a YouTube video?', a: 'Theoretically yes if it is copyrighted and you redistribute it. Practically no for personal offline viewing — there is no precedent of an individual being sued for that.' },
      { q: 'Does YouTube Premium make downloads legal?', a: 'Yes — Premium\'s offline-save feature is YouTube\'s sanctioned way to download. It is the only method that fully complies with YouTube\'s TOS.' },
      { q: 'What about Creative Commons videos?', a: 'Those are explicitly licensed for download and redistribution under the license terms (often requiring attribution). They are clearly safe.' },
      { q: 'Is it legal to convert YouTube to MP3?', a: 'The same rules apply — personal use is generally fine, redistribution requires permission. Music videos are usually under stricter copyright than user-generated content.' },
    ],
    related: ['how-to-download-youtube-videos-on-iphone', 'youtube-to-mp3-best-quality', 'best-video-downloader-2026'],
  },
  {
    slug: 'safe-video-downloader-without-malware',
    title: 'How to find a safe video downloader (avoiding malware in 2026)',
    description:
      'A guide to spotting unsafe video downloaders — fake download buttons, browser hijackers, clipboard scrapers — and choosing one that won\'t infect your device.',
    publishedAt: '2025-05-15',
    updatedAt: '2026-05-20',
    authorName: 'Save47 Team',
    body: [
      { type: 'p', text: 'Free video downloaders are a malware honeypot. The user is desperate to save a video, the operator is desperate to monetize free traffic, and the result is a category of websites that almost universally serve ads through aggressive networks, sometimes with outright malicious payloads. Here is how to tell the safe ones from the dangerous ones.' },
      { type: 'h2', text: 'Red flags that mean "leave now"' },
      { type: 'ul', items: [
        'Three or more "download" buttons on the page (only one is real).',
        'Pop-up ads that change your homepage or install extensions.',
        'Prompts to enable browser notifications before downloading.',
        'Requests to install a desktop helper, .exe, or browser extension to "speed up" downloads.',
        'Cookies set from dozens of advertising domains the moment you arrive.',
        'Domains that redirect through several other domains before showing the actual page.',
      ]},
      { type: 'h2', text: 'How clipboard scrapers work' },
      { type: 'p', text: 'A specific class of malicious downloader scrapes anything you copy to your clipboard. You paste a YouTube URL; their JavaScript reads the clipboard and substitutes a different URL — often a phishing site or fake Bitcoin address if you copy a wallet later. We have seen this on multiple popular Y2mate clones.' },
      { type: 'h2', text: 'Green flags that signal trustworthy' },
      { type: 'ul', items: [
        'Public source code on GitHub (you or someone you trust can audit it).',
        'No ads on the website at all (a sustainable monetization model exists elsewhere).',
        'A real privacy policy that lists what data is collected (most likely: nothing).',
        'A real DMCA contact and copyright takedown process.',
        'HTTPS with a valid certificate from a reputable CA.',
      ]},
      { type: 'h2', text: 'Why Save47 chose this approach' },
      { type: 'p', text: 'Save47 makes money from a small paid API tier for high-volume users. That single paid tier subsidizes the free web app, the Android APK, and the CLI. It removes the need for ads, trackers, or any of the predatory patterns common in this space. The source is on GitHub, you can audit our infrastructure, and the privacy policy is honest about us not collecting anything.' },
      { type: 'h2', text: 'A short checklist' },
      { type: 'ol', items: [
        'Search the domain on Google Safe Browsing.',
        'Check the source on GitHub if claimed to be open source.',
        'Read the URL bar carefully — many downloaders use lookalike domains.',
        'Run uBlock Origin and watch what gets blocked when you load the page.',
        'If a download requires an .exe install on Windows, don\'t.',
      ]},
    ],
    faq: [
      { q: 'How do I report a malicious downloader?', a: 'Use Google\'s Safe Browsing report form to flag the domain. Major browsers will block it within days. You can also report to the hosting provider via abuse@hosting-domain.' },
      { q: 'Does ad-blocker protect me?', a: 'Mostly. uBlock Origin blocks the scripts behind most pop-ups and clipboard scrapers. It does not protect you from intentionally-clicked malicious downloads.' },
      { q: 'Is it safe to install a browser extension from a video downloader?', a: 'Generally no. Browser extensions have wide permissions and several downloader extensions have been caught injecting ads, scraping browsing history, or rerouting affiliate links.' },
      { q: 'What if I already used a sketchy downloader?', a: 'Check installed browser extensions, run a malware scan (Malwarebytes is good and free), and check your clipboard manager history for unexpected URLs.' },
    ],
    related: ['best-video-downloader-2026', 'is-it-legal-to-download-youtube-videos', 'how-to-download-youtube-videos-on-iphone'],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function listGuideSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
}
