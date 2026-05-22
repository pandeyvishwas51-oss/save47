'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ClipboardPaste, Link2, X } from 'lucide-react';
import { detectPlatform, isValidUrl, platformColor } from '@/lib/platforms';
import { cn } from '@/lib/utils';

interface UrlInputProps {
  initialValue?: string;
  autoSubmit?: boolean;
  onSubmit?: (url: string) => void;
  className?: string;
}

export function UrlInput({ initialValue = '', autoSubmit = false, onSubmit, className }: UrlInputProps) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState(initialValue);
  const trimmed = value.trim();
  const valid = isValidUrl(trimmed);
  const platform = valid ? detectPlatform(trimmed) : null;
  const accent = platformColor(platform?.id);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = React.useCallback(
    (urlValue: string) => {
      const v = urlValue.trim();
      if (!v || !isValidUrl(v)) return;
      if (onSubmit) onSubmit(v);
      else router.push(`/download?url=${encodeURIComponent(v)}`);
    },
    [onSubmit, router]
  );

  React.useEffect(() => {
    if (autoSubmit && initialValue && isValidUrl(initialValue)) {
      submit(initialValue);
    }
    // run once when initialValue first available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSubmit, initialValue]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setValue(text);
        if (isValidUrl(text.trim())) submit(text);
      }
    } catch {
      inputRef.current?.focus();
    }
  };

  return (
    <form
      className={cn('w-full', className)}
      onSubmit={(e) => {
        e.preventDefault();
        submit(value);
      }}
    >
      <div
        className={cn(
          'relative flex items-center gap-2 rounded-2xl border bg-[var(--card)] px-3 py-2 transition-all',
          'min-h-14',
          valid ? 'shadow-[0_0_0_4px_var(--accent-glow)]' : ''
        )}
        style={{ borderColor: valid ? accent : 'var(--card-border)' }}
      >
        {/* Left icon / platform badge */}
        <div className="flex shrink-0 items-center justify-center" aria-hidden>
          <AnimatePresence mode="wait" initial={false}>
            {platform ? (
              <motion.span
                key={platform.id}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-medium"
                style={{ background: `${accent}1a`, color: accent }}
              >
                <Link2 size={14} />
                {platform.name}
              </motion.span>
            ) : (
              <motion.span
                key="link-icon"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted-foreground)]"
              >
                <Link2 size={18} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <input
          ref={inputRef}
          type="url"
          inputMode="url"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="go"
          name="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste a link from YouTube, Instagram, TikTok..."
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
          aria-label="Video URL"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              setValue('');
              inputRef.current?.focus();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Clear"
          >
            <X size={16} />
          </button>
        )}

        {!value && (
          <button
            type="button"
            onClick={handlePaste}
            className="flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-medium text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Paste from clipboard"
          >
            <ClipboardPaste size={14} />
            <span className="hidden sm:inline">Paste</span>
          </button>
        )}

        <AnimatePresence>
          {valid && (
            <motion.button
              key="submit"
              type="submit"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition"
              style={{ background: accent }}
              aria-label="Download"
            >
              <ArrowRight size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
