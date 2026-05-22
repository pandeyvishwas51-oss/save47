'use client';

import { motion } from 'framer-motion';
import { Check, Music } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';
import type { FormatOption, MediaInfo } from '@/lib/types';

interface FormatPickerProps {
  media: MediaInfo;
  value: FormatOption | null;
  onChange: (f: FormatOption) => void;
  accent: string;
}

export function FormatPicker({ media, value, onChange, accent }: FormatPickerProps) {
  const audioOption = media.formats.find((f) => f.isAudioOnly);
  const videoOptions = media.formats.filter((f) => !f.isAudioOnly);

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
        Quality
      </p>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
        {videoOptions.map((f) => {
          const selected = value?.formatId === f.formatId;
          return (
            <button
              key={f.formatId}
              type="button"
              onClick={() => onChange(f)}
              className={cn(
                'group relative flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm transition-all',
                selected
                  ? 'text-white'
                  : 'border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--muted)]'
              )}
              style={
                selected
                  ? { background: accent, borderColor: accent }
                  : undefined
              }
            >
              {selected && (
                <motion.span
                  layoutId="format-check"
                  className="flex h-4 w-4 items-center justify-center"
                >
                  <Check size={14} />
                </motion.span>
              )}
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

        {audioOption && (
          <button
            type="button"
            onClick={() => onChange(audioOption)}
            className={cn(
              'group relative flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm transition-all',
              value?.formatId === audioOption.formatId
                ? 'text-white'
                : 'border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--muted)]'
            )}
            style={
              value?.formatId === audioOption.formatId
                ? { background: accent, borderColor: accent }
                : undefined
            }
          >
            <Music size={14} />
            <span className="font-medium">MP3 Audio</span>
            {(audioOption.filesize || audioOption.filesizeApprox) && (
              <span
                className={cn(
                  'text-xs',
                  value?.formatId === audioOption.formatId
                    ? 'text-white/80'
                    : 'text-[var(--muted-foreground)]'
                )}
              >
                ~{formatBytes(audioOption.filesize || audioOption.filesizeApprox)}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
