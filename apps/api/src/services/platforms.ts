// Backend platform detection (mirror of frontend lib/platforms.ts).

export interface PlatformDef {
  id: string;
  name: string;
  domains: RegExp[];
}

export const PLATFORMS: PlatformDef[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    domains: [/youtube\.com\/watch/, /youtu\.be\//, /youtube\.com\/shorts/, /youtube\.com\/live/],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    domains: [/instagram\.com\/p\//, /instagram\.com\/reel\//, /instagram\.com\/stories/, /instagram\.com\/tv\//],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    domains: [/tiktok\.com\/@.*\/video/, /vm\.tiktok\.com/, /tiktok\.com\/t\//],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    domains: [/facebook\.com\/.*\/videos/, /fb\.watch/, /facebook\.com\/share\/v\//, /facebook\.com\/watch/],
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    domains: [/twitter\.com\/.*\/status/, /x\.com\/.*\/status/],
  },
  {
    id: 'reddit',
    name: 'Reddit',
    domains: [/reddit\.com\/r\/.*\/comments/, /v\.redd\.it/, /reddit\.com\/.*\/s\//],
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    domains: [/soundcloud\.com\//],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    domains: [/pinterest\.com\/pin\//, /pin\.it\//],
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    domains: [/vimeo\.com\/\d+/],
  },
  {
    id: 'dailymotion',
    name: 'Dailymotion',
    domains: [/dailymotion\.com\/video/, /dai\.ly\//],
  },
  {
    id: 'twitch',
    name: 'Twitch',
    domains: [/twitch\.tv\/.*\/clip/, /clips\.twitch\.tv/],
  },
];

// Hard-blocked DRM-protected platforms.
const DRM_BLOCKED = [
  /open\.spotify\.com/,
  /spotify\.com\/track/,
  /music\.apple\.com/,
  /netflix\.com/,
  /disneyplus\.com/,
  /hulu\.com/,
  /hbomax\.com/,
  /max\.com\/watch/,
];

export function detectPlatform(url: string): PlatformDef | null {
  for (const platform of PLATFORMS) {
    if (platform.domains.some((re) => re.test(url))) {
      return platform;
    }
  }
  return null;
}

export function isDrmBlocked(url: string): boolean {
  return DRM_BLOCKED.some((re) => re.test(url));
}

export function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}
