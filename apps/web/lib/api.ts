import type { MediaInfo } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class DownloadError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'DownloadError';
    this.code = code;
  }
}

export async function probeUrl(url: string, signal?: AbortSignal): Promise<MediaInfo> {
  const res = await fetch(`${API_BASE}/probe?url=${encodeURIComponent(url)}`, {
    signal: signal ?? AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    let body: { code?: string; message?: string } = {};
    try {
      body = await res.json();
    } catch {
      /* ignore */
    }
    throw new DownloadError(body.code || 'default', body.message || `Probe failed (${res.status})`);
  }
  return (await res.json()) as MediaInfo;
}

export interface BuildDownloadUrlParams {
  url: string;
  formatId: string;
  quality: string;
  turnstileToken?: string;
  filename?: string;
}

export function buildDownloadUrl(params: BuildDownloadUrlParams): string {
  const q = new URLSearchParams({
    url: params.url,
    formatId: params.formatId,
    quality: params.quality,
  });
  if (params.turnstileToken) q.set('token', params.turnstileToken);
  if (params.filename) q.set('filename', params.filename);
  return `${API_BASE}/download?${q.toString()}`;
}

export function triggerBrowserDownload(downloadUrl: string, filename?: string) {
  const a = document.createElement('a');
  a.href = downloadUrl;
  if (filename) a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export const API_BASE_URL = API_BASE;
