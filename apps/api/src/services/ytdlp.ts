import { spawn, type ChildProcessWithoutNullStreams } from 'child_process';
import type { Readable } from 'stream';
import { randomUserAgent } from './userAgents.js';
import { DownloadError, type RawYtdlpMetadata } from '../types.js';

const YTDLP_BINARY = process.env.YTDLP_PATH || 'yt-dlp';

// Optional cookie jar file. When set, yt-dlp uses it to authenticate
// requests — this is the only reliable way to bypass YouTube's "Sign in
// to confirm you're not a bot" gate from a datacenter IP.
//
// Generate a cookies.txt with the "Get cookies.txt LOCALLY" extension on
// any logged-in YouTube tab, then mount it on the server and set
// YTDLP_COOKIES_FILE to the absolute path.
const COOKIES_FILE = process.env.YTDLP_COOKIES_FILE;

// Per-extractor args. The android/ios/tv clients work around YouTube's
// web-based bot detection in many cases, no cookies required.
function youtubeExtractorArgs(): string[] {
  // The order matters — yt-dlp tries clients left-to-right.
  // android_creator + ios + tv have the highest current success rate from
  // datacenter IPs as of late 2024.
  const clients = process.env.YTDLP_YT_CLIENTS || 'android,ios,tv,web';
  return ['--extractor-args', `youtube:player_client=${clients}`];
}

function commonArgs(url: string): string[] {
  const args = [
    '--no-playlist',
    '--no-warnings',
    '--user-agent',
    randomUserAgent(),
    '--add-header',
    'Accept-Language:en-US,en;q=0.9',
    '--geo-bypass',
    ...youtubeExtractorArgs(),
  ];
  if (COOKIES_FILE) {
    args.push('--cookies', COOKIES_FILE);
  }
  // Slight throttle helps avoid 429s on high-volume probes.
  args.push('--retries', '3', '--fragment-retries', '3');
  return args;
}

// Probe a URL — returns parsed metadata JSON.
export async function probeUrl(url: string): Promise<RawYtdlpMetadata> {
  return new Promise((resolve, reject) => {
    const args = ['--dump-json', '--no-download', ...commonArgs(url), url];
    const proc = spawn(YTDLP_BINARY, args);

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (d: Buffer) => {
      stdout += d.toString();
    });
    proc.stderr.on('data', (d: Buffer) => {
      stderr += d.toString();
    });

    const timeout = setTimeout(() => {
      proc.kill('SIGTERM');
      reject(new DownloadError('default', 'Metadata fetch timed out', 504));
    }, 30000);

    proc.on('error', (err) => {
      clearTimeout(timeout);
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(
          new DownloadError(
            'default',
            'yt-dlp binary not found on server. Install yt-dlp or set YTDLP_PATH.',
            500
          )
        );
        return;
      }
      reject(new DownloadError('default', err.message, 500));
    });

    proc.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        reject(parseYtdlpError(stderr));
        return;
      }
      try {
        const trimmed = stdout.trim();
        const firstLine = trimmed.split('\n').find((l) => l.startsWith('{')) ?? trimmed;
        resolve(JSON.parse(firstLine) as RawYtdlpMetadata);
      } catch {
        reject(new DownloadError('default', 'Failed to parse video metadata', 502));
      }
    });
  });
}

export interface StreamHandle {
  stream: Readable;
  process: ChildProcessWithoutNullStreams;
  stderrBuffer: { value: string };
  kill: () => void;
}

// Stream a video — returns a Readable stream that emits raw media bytes.
export function streamVideo(url: string, formatSelector: string, audioOnly = false): StreamHandle {
  const baseArgs = ['--output', '-', ...commonArgs(url)];

  let args: string[];
  if (audioOnly) {
    args = [
      '--format',
      'bestaudio/best',
      '--extract-audio',
      '--audio-format',
      'mp3',
      '--audio-quality',
      '0',
      ...baseArgs,
      url,
    ];
  } else {
    args = [
      '--format',
      formatSelector,
      // When yt-dlp picks separate video+audio and needs to merge, tell it
      // to produce MP4 container. Note: piping merged output to stdout only
      // works reliably with ffmpeg's fragmented MP4 (frag_keyframe) mode.
      '--merge-output-format',
      'mp4',
      '--ppa',
      'Merger+ffmpeg_o:-movflags frag_keyframe+empty_moov -strict -2',
      ...baseArgs,
      url,
    ];
  }

  const proc = spawn(YTDLP_BINARY, args);
  const stderrBuffer = { value: '' };
  proc.stderr.on('data', (d: Buffer) => {
    stderrBuffer.value += d.toString();
    if (stderrBuffer.value.length > 8192) {
      stderrBuffer.value = stderrBuffer.value.slice(-8192);
    }
  });

  return {
    stream: proc.stdout,
    process: proc,
    stderrBuffer,
    kill: () => {
      try {
        proc.kill('SIGTERM');
      } catch {
        /* noop */
      }
    },
  };
}

// Map yt-dlp stderr text to a stable error code consumed by the frontend.
export function parseYtdlpError(stderr: string): DownloadError {
  const lower = stderr.toLowerCase();

  if (
    lower.includes('confirm you') ||
    lower.includes('sign in to confirm') ||
    lower.includes('login required') ||
    lower.includes('sign in')
  ) {
    return new DownloadError(
      'instagram_login_required',
      'Login required (YouTube bot check). The server needs cookies to bypass this.',
      403
    );
  }
  if (lower.includes('429') || lower.includes('too many requests') || lower.includes('rate-limit')) {
    return new DownloadError('youtube_rate_limited', 'Rate limited by source', 429);
  }
  if (lower.includes('private video') || lower.includes('this video is private')) {
    return new DownloadError('private_video', 'Private video', 403);
  }
  if (lower.includes('not available in your country') || lower.includes('geo')) {
    return new DownloadError('geo_blocked', 'Geo-blocked', 451);
  }
  if (lower.includes('unsupported url') || lower.includes('no suitable extractor')) {
    return new DownloadError('unsupported_platform', 'Unsupported URL', 400);
  }
  if (lower.includes('copyright') || lower.includes('dmca')) {
    return new DownloadError('dmca_blocked', 'DMCA blocked', 451);
  }
  if (lower.includes('expired') || lower.includes('410')) {
    return new DownloadError('expired_link', 'Expired link', 410);
  }
  if (
    lower.includes('no video') ||
    lower.includes('unable to extract') ||
    lower.includes('no media')
  ) {
    return new DownloadError('no_video_found', 'No video found', 404);
  }
  return new DownloadError('default', 'Download failed', 500);
}
