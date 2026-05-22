import { Suspense } from 'react';
import { DownloadView } from './DownloadView';

export const dynamic = 'force-dynamic';

export default function DownloadPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Suspense fallback={null}>
        <DownloadView />
      </Suspense>
    </div>
  );
}
