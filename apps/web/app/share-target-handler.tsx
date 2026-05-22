'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirects shared URLs from the PWA share target straight to /download.
// Rendered only when a share-target URL is present.
export function ShareTargetHandler({ url }: { url: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/download?url=${encodeURIComponent(url)}`);
  }, [url, router]);
  return null;
}
