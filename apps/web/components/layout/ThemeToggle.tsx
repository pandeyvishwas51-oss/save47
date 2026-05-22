'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = (mounted ? resolvedTheme ?? theme : 'dark') === 'dark';

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
