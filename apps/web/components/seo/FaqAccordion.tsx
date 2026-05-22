'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className={cn('divide-y divide-[var(--card-border)] rounded-2xl border border-[var(--card-border)] bg-[var(--card)]', className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium hover:bg-white/[0.02]"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <ChevronDown
                size={18}
                className={cn(
                  'shrink-0 text-[var(--muted-foreground)] transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
