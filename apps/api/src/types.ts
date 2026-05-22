// Shared TypeScript types for the Save47 backend.

export interface FormatOption {
  formatId: string;
  label: string; // "MP4 1080p" | "MP4 720p" | "MP3 320kbps"
  ext: string; // 'mp4' | 'mp3' | 'webm'
  quality: string; // '1080p' | '720p' | '480p' | '360p' | 'audio'
  filesize?: number; // bytes
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
  duration: number; // seconds
  platform: string;
  formats: FormatOption[];
  originalUrl: string;
}

export interface RawYtdlpFormat {
  format_id: string;
  ext: string;
  format_note?: string;
  height?: number;
  width?: number;
  fps?: number;
  filesize?: number;
  filesize_approx?: number;
  vcodec?: string;
  acodec?: string;
  abr?: number;
  vbr?: number;
  tbr?: number;
  resolution?: string;
  protocol?: string;
}

export interface RawYtdlpMetadata {
  id: string;
  title: string;
  uploader?: string;
  uploader_id?: string;
  channel?: string;
  uploader_url?: string;
  channel_url?: string;
  thumbnail?: string;
  thumbnails?: Array<{ url: string; width?: number; height?: number }>;
  duration?: number;
  webpage_url: string;
  extractor?: string;
  extractor_key?: string;
  formats?: RawYtdlpFormat[];
  is_live?: boolean;
  age_limit?: number;
}

export class DownloadError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = 'DownloadError';
    this.code = code;
    this.status = status;
  }
}
