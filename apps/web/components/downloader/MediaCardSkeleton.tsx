import { Card, CardContent } from '@/components/ui/card';

export function MediaCardSkeleton() {
  return (
    <Card className="border-l-4 border-l-[var(--card-border)]">
      <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="shimmer aspect-video w-full rounded-xl sm:aspect-auto sm:h-24 sm:w-40" />
          <div className="flex-1 space-y-2">
            <div className="shimmer h-5 w-24 rounded-full" />
            <div className="shimmer h-5 w-3/4 rounded" />
            <div className="shimmer h-4 w-1/2 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="shimmer h-9 w-20 rounded-xl" />
          <div className="shimmer h-9 w-24 rounded-xl" />
          <div className="shimmer h-9 w-20 rounded-xl" />
        </div>
        <div className="shimmer h-12 w-full rounded-xl" />
      </CardContent>
    </Card>
  );
}
