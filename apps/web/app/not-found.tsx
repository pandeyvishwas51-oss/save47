import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center pt-20 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted-foreground)]">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Nothing here</h1>
      <p className="mt-3 text-sm text-[var(--muted-foreground)]">
        The page you&apos;re looking for doesn&apos;t exist. Head back home to start a new
        download.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to Save47</Link>
      </Button>
    </div>
  );
}
