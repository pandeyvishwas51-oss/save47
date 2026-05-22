'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Download, Music, Play, Video as VideoIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from './ProgressBar';
import { API_BASE_URL, buildDownloadUrl, triggerBrowserDownload } from '@/lib/api';
import { platformColor } from '@/lib/platforms';
import { cn, formatBytes, formatDuration } from '@/lib/utils';
import type { FormatOption, MediaInfo } from '@/lib/types';

interface MediaCardProps {
  media: MediaInfo;
  turnstileToken?: string;
}

// Route external thumbnails through the API so hotlink-protected platforms
// (Instagram, TikTok, FB) actually render. Falls back to original on error.
function thumbProxy(url: string): string {
  if (!url) return '';
  return `${API_BASE_URL}/proxy/thumb?url=${encodeURIComponent(url)}`;
}

export function MediaCard({ media, turnstileToken }: MediaCardProps) {
  const accent = platformColor(media.platform);
  const videoFormats = media.formats.filter((f) => !f.isAudioOnly);
  const audioFmt = media.formats.find((f) => f.isAudioOnly) ?? null;

  // Selected video quality (independent from audio).
  const [selectedVideo, setSelectedVideo] = React.useState<FormatOption | null>(
    () => videoFormats.find((f) => f.formatId === 'best') ?? videoFormats[0] ?? null
  );

  // Independent download state for each track so video + audio can run in parallel.
  type TrackKind = 'video' | 'audio';
  type Stage = 'idle' | 'downloading' | 'complete';
  const [stages, setStages] = React.useState<Record<TrackKind, Stage>>({ video: 'idle', audio: 'idle' });
  const [progress, setProgress] = React.useState<Record<TrackKind, number>>({ video: 0, audio: 0 });
  const timers = React.useRef<Record<TrackKind, ReturnType<typeof setInterval> | null>>({
    video: null,
    audio: null,
  });

  // Inline preview toggle.
  const [showPreview, setShowPreview] = React.useState(false);
  const [thumbErr, setThumbErr] = React.useState(false);

  const startDownload = (kind: TrackKind) => {
    const fmt = kind === 'video' ? selectedVideo : audioFmt;
    if (!fmt) return;

    setStages((s) => ({ ...s, [kind]: 'downloading' }));
    setProgress((p) => ({ ...p, [kind]: 5 }));

    if (timers.current[kind]) clearInterval(timers.current[kind]!);
    timers.current[kind] = setInterval(() => {
      setProgress((p) => ({
        ...p,
        [kind]: p[kind] < 92 ? p[kind] + Math.max(0.5, (95 - p[kind]) * 0.05) : p[kind],
      }));
    }, 250);

    const url = buildDownloadUrl({
      url: media.originalUrl,
      formatId: fmt.formatId,
      quality: fmt.quality,
      turnstileToken,
    });
    triggerBrowserDownload(url);

    setTimeout(() => {
      if (timers.current[kind]) clearInterval(timers.current[kind]!);
      setProgress((p) => ({ ...p, [kind]: 100 }));
      setStages((s) => ({ ...s, [kind]: 'complete' }));
    }, 4000);
  };

  const cancelDownload = (kind: TrackKind) => {
    if (timers.current[kind]) clearInterval(timers.current[kind]!);
    setStages((s) => ({ ...s, [kind]: 'idle' }));
    setProgress((p) => ({ ...p, [kind]: 0 }));
  };

  React.useEffect(() => {
    return () => {
      if (timers.current.video) clearInterval(timers.current.video);
      if (timers.current.audio) clearInterval(timers.current.audio);
    };
  }, []);

  const videoLabel = selectedVideo
    ? `Download ${selectedVideo.label}${
        selectedVideo.filesize || selectedVideo.filesizeApprox
          ? ` · ${formatBytes(selectedVideo.filesize || selectedVideo.filesizeApprox)}`
          : ''
      }`
    : 'Download video';
  const audioLabel = audioFmt
    ? `Download MP3${
        audioFmt.filesize || audioFmt.filesizeApprox
          ? ` · ${formatBytes(audioFmt.filesize || audioFmt.filesizeApprox)}`
          : ''
      }`
    : 'Audio not available';

  const previewSrc = `${API_BASE_URL}/download?url=${encodeURIComponent(media.originalUrl)}&formatId=720p&quality=720p`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Card
        className="overflow-hidden border-l-4 backdrop-blur-sm bg-white/[0.02]"
        style={{ borderLeftColor: accent }}
      >
        <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
          {/* Thumbnail / preview row */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-[var(--muted)] sm:aspect-auto sm:h-28 sm:w-44">
              {showPreview ? (
                <video
                  src={previewSrc}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : !thumbErr && media.thumbnail ? (
                <>
                  <Image
                    src={thumbProxy(media.thumbnail)}
                    alt={media.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 176px"
                    className="object-cover"
                    unoptimized
                    onError={() => setThumbErr(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    aria-label="Play preview"
                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition hover:opacity-100 focus:opacity-100"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black">
                      <Play size={18} fill="currentColor" />
                    </span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="flex h-full w-full items-center justify-center bg-[var(--card)] text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
                >
                  <VideoIcon size={28} />
                </button>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1.5">
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ background: `${accent}1a`, color: accent }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                {capitalize(media.platform)}
              </div>
              <h2 className="line-clamp-2 text-base font-semibold leading-snug sm:text-lg">
                {media.title}
              </h2>
              <p className="truncate text-sm text-[var(--muted-foreground)]">
                {media.uploader}
                {media.duration > 0 && (
                  <>
                    {' · '}
                    <span className="font-mono text-xs">{formatDuration(media.duration)}</span>
                  </>
                )}
              </p>
              {!showPreview && (
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
                >
                  <Play size={12} />
                  Preview
                </button>
              )}
            </div>
          </div>

          {/* Quality picker for the VIDEO track only */}
          {videoFormats.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Video quality
              </p>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
                {videoFormats.map((f) => {
                  const selected = selectedVideo?.formatId === f.formatId;
                  return (
                    <button
                      key={f.formatId}
                      type="button"
                      onClick={() => setSelectedVideo(f)}
                      className={cn(
                        'flex shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition-all',
                        selected
                          ? 'text-white'
                          : 'border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--muted)]'
                      )}
                      style={selected ? { background: accent, borderColor: accent } : undefined}
                    >
                      {selected && <Check size={12} />}
                      <span className="font-medium">{f.label}</span>
                      {(f.filesize || f.filesizeApprox) && (
                        <span
                          className={cn(
                            'text-xs',
                            selected ? 'text-white/80' : 'text-[var(--muted-foreground)]'
                          )}
                        >
                          ~{formatBytes(f.filesize || f.filesizeApprox)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TWO independent download buttons — pick either or both. */}
          <div className="grid gap-3 sm:grid-cols-2">
            {/* VIDEO */}
            {stages.video === 'idle' ? (
              <button
                type="button"
                onClick={() => startDownload('video')}
                disabled={!selectedVideo}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-40"
                style={{ background: accent }}
              >
                <Download size={16} />
                {videoLabel}
              </button>
            ) : (
              <ProgressBar
                progress={progress.video}
                stage={stages.video === 'complete' ? 'complete' : 'downloading'}
                accent={accent}
                onCancel={() => cancelDownload('video')}
                label="Video"
              />
            )}

            {/* AUDIO */}
            {audioFmt && stages.audio === 'idle' && (
              <button
                type="button"
                onClick={() => startDownload('audio')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-5 py-3 font-medium transition hover:border-[var(--accent)]"
              >
                <Music size={16} />
                {audioLabel}
              </button>
            )}
            {audioFmt && stages.audio !== 'idle' && (
              <ProgressBar
                progress={progress.audio}
                stage={stages.audio === 'complete' ? 'complete' : 'downloading'}
                accent="var(--success)"
                onCancel={() => cancelDownload('audio')}
                label="Audio"
              />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex items-center justify-center">
        <Link
          href="/"
          className="text-sm text-[var(--muted-foreground)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
        >
          Download another
        </Link>
      </div>
    </motion.div>
  );
}

function capitalize(s: string) {
  if (!s) return '';
  return s[0].toUpperCase() + s.slice(1);
}
