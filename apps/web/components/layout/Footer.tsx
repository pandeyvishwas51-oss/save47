import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--card-border)] py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 text-xs text-[var(--muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <span className="font-semibold text-[var(--foreground)]">Save47</span>
            <span>No ads</span>
            <span>No tracking</span>
            <span>Open source</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/terms" className="hover:text-[var(--foreground)]">
              Terms of Use
            </Link>
            <Link href="/dmca" className="hover:text-[var(--foreground)]">
              DMCA / Copyright
            </Link>
            <Link href="/privacy" className="hover:text-[var(--foreground)]">
              Privacy Policy
            </Link>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--foreground)]"
            >
              GitHub
            </a>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-[var(--muted-foreground)]">
          Save47 is a tool for downloading content you own or have permission to download. Users
          are responsible for complying with the terms of service of the platforms they use and
          applicable copyright laws. We do not store or redistribute any content.
        </p>
      </div>
    </footer>
  );
}
