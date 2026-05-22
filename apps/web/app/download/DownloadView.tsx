'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Turnstile } from '@marsidev/react-turnstile';
import { MediaCard } from '@/components/downloader/MediaCard';
import { MediaCardSkeleton } from '@/components/downloader/MediaCardSkeleton';
import { ErrorState } from '@/components/downloader/ErrorState';
import { UrlInput } from '@/components/downloader/UrlInput';
import { DownloadError, probeUrl } from '@/lib/api';
import type { MediaInfo } from '@/lib/types';

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY;

export function DownloadView() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url') ?? '';

  const [media, setMedia] = useState<MediaInfo | null>(null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!url) {
      setError({ code: 'no_video_found', message: 'No URL provided.' });
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setMedia(null);

    probeUrl(url)
      .then((info) => {
        if (cancelled) return;
        setMedia(info);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        if (e instanceof DownloadError) {
          setError({ code: e.code, message: e.message });
        } else if ((e as Error).name === 'AbortError') {
          return;
        } else {
          setError({ code: 'default', message: (e as Error).message });
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url, retryKey]);

  return (
    <div className="space-y-5">
      <div className="pt-2">
        <UrlInput initialValue={url} key={url} />
      </div>

      {loading && <MediaCardSkeleton />}

      {!loading && error && (
        <ErrorState
          code={error.code}
          message={error.message}
          onRetry={() => setRetryKey((k) => k + 1)}
        />
      )}

      {!loading && media && <MediaCard media={media} turnstileToken={turnstileToken} />}

      {/* Invisible Turnstile widget — only mounts when site key is configured */}
      {TURNSTILE_KEY && (
        <div className="sr-only">
          <Turnstile
            siteKey={TURNSTILE_KEY}
            onSuccess={(t) => setTurnstileToken(t)}
            options={{ size: 'invisible', appearance: 'interaction-only' }}
          />
        </div>
      )}
    </div>
  );
}
