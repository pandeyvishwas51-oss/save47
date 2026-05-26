import type { FormatOption, MediaInfo, RawYtdlpFormat, RawYtdlpMetadata } from '../types.js';
import { detectPlatform } from './platforms.js';

// Build a clean MediaInfo from raw yt-dlp metadata.
// We surface at most 5 options:
//   - "Best (auto)" — bestvideo+bestaudio/best
//   - "MP4 1080p"
//   - "MP4 720p"
//   - "MP4 480p"
//   - "MP3 Audio"
// Only quality tiers actually present in the source video are returned.

const QUALITY_TIERS: Array<{ quality: string; height: number; label: string }> = [
  { quality: '2160p', height: 2160, label: 'MP4 4K' },
  { quality: '1440p', height: 1440, label: 'MP4 1440p' },
  { quality: '1080p', height: 1080, label: 'MP4 1080p' },
  { quality: '720p', height: 720, label: 'MP4 720p' },
  { quality: '480p', height: 480, label: 'MP4 480p' },
  { quality: '360p', height: 360, label: 'MP4 360p' },
];

function pickBestForHeight(formats: RawYtdlpFormat[], height: number): RawYtdlpFormat | null {
  const candidates = formats
    .filter((f) => f.vcodec && f.vcodec !== 'none' && f.height && f.height <= height)
    .sort((a, b) => (b.height ?? 0) - (a.height ?? 0) || (b.tbr ?? 0) - (a.tbr ?? 0));
  return candidates[0] ?? null;
}

function pickBestAudio(formats: RawYtdlpFormat[]): RawYtdlpFormat | null {
  const audio = formats
    .filter((f) => (!f.vcodec || f.vcodec === 'none') && f.acodec && f.acodec !== 'none')
    .sort((a, b) => (b.abr ?? 0) - (a.abr ?? 0));
  return audio[0] ?? null;
}

function estimateMergedSize(video: RawYtdlpFormat, audio: RawYtdlpFormat | null): number | undefined {
  const v = video.filesize ?? video.filesize_approx;
  const a = audio?.filesize ?? audio?.filesize_approx;
  if (!v) return undefined;
  return a ? v + a : v;
}

export function buildMediaInfo(raw: RawYtdlpMetadata, originalUrl: string): MediaInfo {
  const formats = (raw.formats ?? []).filter((f) => f.protocol !== 'mhtml');
  const platform = detectPlatform(originalUrl)?.id ?? raw.extractor?.toLowerCase() ?? 'default';

  const audioFmt = pickBestAudio(formats);
  const options: FormatOption[] = [];
  const seenQualities = new Set<string>();

  // 1. Always include "Best (auto)"
  options.push({
    formatId: 'best',
    label: 'Best (auto)',
    ext: 'mp4',
    quality: 'best',
    hasVideo: true,
    hasAudio: true,
    isAudioOnly: false,
  });

  // 2. Add discovered quality tiers
  for (const tier of QUALITY_TIERS) {
    const match = pickBestForHeight(formats, tier.height);
    if (!match || match.height !== tier.height) continue;
    if (seenQualities.has(tier.quality)) continue;
    seenQualities.add(tier.quality);

    options.push({
      formatId: tier.quality,
      label: tier.label,
      ext: 'mp4',
      quality: tier.quality,
      filesize: estimateMergedSize(match, audioFmt),
      filesizeApprox: estimateMergedSize(match, audioFmt),
      hasVideo: true,
      hasAudio: true,
      isAudioOnly: false,
      vcodec: match.vcodec,
      acodec: audioFmt?.acodec,
    });
    if (options.length >= 5) break;
  }

  // 3. MP3 audio option (always present if any audio track exists)
  if (audioFmt) {
    options.push({
      formatId: 'mp3',
      label: 'MP3 Audio',
      ext: 'mp3',
      quality: 'audio',
      filesize: audioFmt.filesize ?? audioFmt.filesize_approx,
      filesizeApprox: audioFmt.filesize_approx,
      hasVideo: false,
      hasAudio: true,
      isAudioOnly: true,
      acodec: audioFmt.acodec,
    });
  }

  const thumb =
    raw.thumbnail ??
    raw.thumbnails?.slice().sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url ??
    '';

  return {
    id: raw.id,
    title: raw.title || 'Untitled',
    uploader: raw.uploader ?? raw.channel ?? raw.uploader_id ?? 'Unknown',
    uploaderUrl: raw.uploader_url ?? raw.channel_url,
    thumbnail: thumb,
    duration: Math.round(raw.duration ?? 0),
    platform,
    formats: options,
    originalUrl,
  };
}

// Map a (formatId, quality) pair to a yt-dlp -f format selector string.
//
// IMPORTANT: When streaming to stdout (--output -), yt-dlp cannot merge
// separate video+audio streams into a playable file because ffmpeg needs
// seekable output for proper MP4 muxing. The selector MUST prefer
// already-muxed formats (best[ext=mp4]) and only fall back to separate
// streams as a last resort. For separate streams we rely on the
// --merge-output-format mp4 flag + ffmpeg's pipe-friendly movflags.
export function buildFormatSelector(formatId: string, quality?: string): {
  selector: string;
  audioOnly: boolean;
  ext: string;
} {
  if (formatId === 'mp3' || quality === 'audio') {
    return { selector: 'bestaudio/best', audioOnly: true, ext: 'mp3' };
  }
  if (formatId === 'best') {
    // Prefer single-file muxed formats first (works with stdout piping).
    // Fall back to separate streams only if no muxed format exists.
    return {
      selector: 'best[ext=mp4]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best',
      audioOnly: false,
      ext: 'mp4',
    };
  }
  const m = /^(\d+)p$/.exec(formatId);
  if (m) {
    const h = m[1];
    return {
      selector: `best[height<=${h}][ext=mp4]/bestvideo[height<=${h}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${h}]/bestvideo[height<=${h}]+bestaudio/best`,
      audioOnly: false,
      ext: 'mp4',
    };
  }
  // Fallback: prefer muxed
  return {
    selector: 'best[ext=mp4]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best',
    audioOnly: false,
    ext: 'mp4',
  };
}

export function sanitizeFilename(title: string, ext: string): string {
  const cleaned = title
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/[\r\n\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
  return `${cleaned || 'download'}.${ext}`;
}
