import { PLATFORMS } from '@/lib/platforms';

export function PlatformGrid() {
  return (
    <section id="supported" className="mt-20">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Supported platforms</h2>
        <span className="text-xs text-[var(--muted-foreground)]">+ 1,000 more via yt-dlp</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {PLATFORMS.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-sm"
          >
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: p.color }}
            />
            <span className="font-medium">{p.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
