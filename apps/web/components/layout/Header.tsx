'use client';

import Link from 'next/link';
import { Github, Smartphone, Terminal } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          {/* Inline mark — three descending chevrons. Scales perfectly at any size
              and ships zero extra requests. */}
          <svg
            viewBox="0 0 32 32"
            width="28"
            height="28"
            aria-hidden
            className="shrink-0"
          >
            <defs>
              <linearGradient id="hdr-mark" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#a78bfa" />
                <stop offset="0.6" stopColor="#6366f1" />
                <stop offset="1" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <path d="M7 8 L16 13 L25 8" stroke="url(#hdr-mark)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
            <path d="M6 15 L16 21 L26 15" stroke="url(#hdr-mark)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
            <path d="M5 22 L16 28 L27 22" stroke="url(#hdr-mark)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="text-lg">Save47</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/api"
            className="hidden items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-[var(--muted-foreground)] transition hover:bg-[var(--card)] hover:text-[var(--foreground)] sm:inline-flex"
          >
            <Terminal size={14} />
            API
          </Link>
          <Link
            href="/pricing"
            className="hidden rounded-xl px-3 py-1.5 text-sm text-[var(--muted-foreground)] transition hover:bg-[var(--card)] hover:text-[var(--foreground)] sm:inline-flex"
          >
            Pricing
          </Link>
          <Link
            href="/download/apk"
            className="hidden items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-[var(--muted-foreground)] transition hover:bg-[var(--card)] hover:text-[var(--foreground)] sm:inline-flex"
          >
            <Smartphone size={14} />
            APK
          </Link>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-[var(--muted-foreground)] transition hover:text-[var(--foreground)] sm:flex"
          >
            <Github size={16} />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
