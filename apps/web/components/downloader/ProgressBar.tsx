'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const STAGE_LABELS: Record<string, string> = {
  preparing: 'Preparing download…',
  downloading: 'Downloading…',
  complete: 'Complete ✓',
};

interface ProgressBarProps {
  progress: number; // 0-100
  stage: 'preparing' | 'downloading' | 'complete';
  accent: string;
  onCancel?: () => void;
  label?: string;
}

export function ProgressBar({ progress, stage, accent, onCancel, label: trackLabel }: ProgressBarProps) {
  const status =
    progress >= 100
      ? STAGE_LABELS.complete
      : progress >= 60
      ? STAGE_LABELS.downloading
      : STAGE_LABELS.preparing;

  return (
    <div className="space-y-2 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--foreground)]">
          {trackLabel ? <span className="text-[var(--muted-foreground)]">{trackLabel} · </span> : null}
          {status}
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[var(--muted-foreground)]">
            {Math.round(progress)}%
          </span>
          {onCancel && progress < 100 && (
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                'flex h-7 items-center gap-1 rounded-lg px-2 text-xs',
                'text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              )}
            >
              <X size={12} />
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--card-border)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: accent }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        />
      </div>
    </div>
  );
}
