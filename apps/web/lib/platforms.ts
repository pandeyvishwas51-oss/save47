export interface Platform {
  id: string;
  name: string;
  color: string;
  icon: string; // lucide-react icon name
  domains: RegExp[];
}

export const PLATFORM_COLORS: Record<string, string> = {
  youtube: '#ff0000',
  instagram: '#e1306c',
  tiktok: '#69c9d0',
  facebook: '#1877f2',
  twitter: '#1da1f2',
  reddit: '#ff4500',
  soundcloud: '#ff5500',
  pinterest: '#bd081c',
  vimeo: '#1ab7ea',
  dailymotion: '#0066ff',
  twitch: '#9146ff',
  default: '#6366f1',
};

export const PLATFORMS: Platform[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    color: PLATFORM_COLORS.youtube,
    icon: 'youtube',
    domains: [
      /youtube\.com\/watch/,
      /youtu\.be\//,
      /youtube\.com\/shorts/,
      /youtube\.com\/live/,
      /m\.youtube\.com/,
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: PLATFORM_COLORS.instagram,
    icon: 'instagram',
    domains: [
      /instagram\.com\/p\//,
      /instagram\.com\/reel\//,
      /instagram\.com\/stories/,
      /instagram\.com\/tv\//,
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: PLATFORM_COLORS.tiktok,
    icon: 'music',
    domains: [/tiktok\.com\/@.*\/video/, /vm\.tiktok\.com/, /tiktok\.com\/t\//],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: PLATFORM_COLORS.facebook,
    icon: 'facebook',
    domains: [
      /facebook\.com\/.*\/videos/,
      /fb\.watch/,
      /facebook\.com\/share\/v\//,
      /facebook\.com\/watch/,
    ],
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    color: PLATFORM_COLORS.twitter,
    icon: 'twitter',
    domains: [/twitter\.com\/.*\/status/, /x\.com\/.*\/status/],
  },
  {
    id: 'reddit',
    name: 'Reddit',
    color: PLATFORM_COLORS.reddit,
    icon: 'message-circle',
    domains: [/reddit\.com\/r\/.*\/comments/, /v\.redd\.it/, /reddit\.com\/.*\/s\//],
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    color: PLATFORM_COLORS.soundcloud,
    icon: 'audio-lines',
    domains: [/soundcloud\.com\//],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    color: PLATFORM_COLORS.pinterest,
    icon: 'image',
    domains: [/pinterest\.com\/pin\//, /pin\.it\//],
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    color: PLATFORM_COLORS.vimeo,
    icon: 'video',
    domains: [/vimeo\.com\/\d+/],
  },
  {
    id: 'dailymotion',
    name: 'Dailymotion',
    color: PLATFORM_COLORS.dailymotion,
    icon: 'video',
    domains: [/dailymotion\.com\/video/, /dai\.ly\//],
  },
  {
    id: 'twitch',
    name: 'Twitch',
    color: PLATFORM_COLORS.twitch,
    icon: 'twitch',
    domains: [/twitch\.tv\/.*\/clip/, /clips\.twitch\.tv/],
  },
];

export function detectPlatform(url: string): Platform | null {
  for (const p of PLATFORMS) {
    if (p.domains.some((re) => re.test(url))) return p;
  }
  return null;
}

export function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return ['http:', 'https:'].includes(u.protocol);
  } catch {
    return false;
  }
}

export function platformColor(id?: string | null): string {
  return PLATFORM_COLORS[id ?? 'default'] ?? PLATFORM_COLORS.default;
}
