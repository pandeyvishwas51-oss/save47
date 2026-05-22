export interface FormatOption {
  formatId: string;
  label: string;
  ext: string;
  quality: string;
  filesize?: number;
  filesizeApprox?: number;
  hasVideo: boolean;
  hasAudio: boolean;
  isAudioOnly: boolean;
  vcodec?: string;
  acodec?: string;
}

export interface MediaInfo {
  id: string;
  title: string;
  uploader: string;
  uploaderUrl?: string;
  thumbnail: string;
  duration: number;
  platform: string;
  formats: FormatOption[];
  originalUrl: string;
}

export const ERROR_MESSAGES: Record<string, string> = {
  instagram_login_required:
    'This Instagram content requires login. Try a public post or reel.',
  youtube_rate_limited:
    'YouTube is temporarily blocking downloads. Try again in a few minutes.',
  private_video: 'This video is private. Only public content can be downloaded.',
  geo_blocked: 'This video is not available in the server region.',
  unsupported_platform:
    'This website is not supported yet. Try pasting a direct video URL.',
  expired_link: 'This link has expired. Please get a fresh link from the platform.',
  no_video_found: 'No downloadable video found at this URL. Make sure the link is correct.',
  dmca_blocked: 'This content cannot be downloaded due to copyright restrictions.',
  default: 'Something went wrong. Please try again or paste a different link.',
};

export function errorMessage(code?: string): string {
  return ERROR_MESSAGES[code ?? 'default'] ?? ERROR_MESSAGES.default;
}
