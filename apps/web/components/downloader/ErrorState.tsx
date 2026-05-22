'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { errorMessage } from '@/lib/types';

interface ErrorStateProps {
  code?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ code, message, onRetry }: ErrorStateProps) {
  const text = message || errorMessage(code);
  return (
    <Card className="border-[var(--error)]/40 bg-[var(--error)]/5">
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--error)]/10 text-[var(--error)]">
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-base font-medium text-[var(--foreground)]">
              We couldn&apos;t download this
            </p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{text}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {onRetry && (
              <Button variant="primary" size="sm" onClick={onRetry}>
                <RefreshCw size={14} />
                Try again
              </Button>
            )}
            <Button asChild variant="secondary" size="sm">
              <Link href="/">Paste a different link</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
