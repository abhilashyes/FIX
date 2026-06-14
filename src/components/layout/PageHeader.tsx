import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Placeholder body for sections that come alive in a later milestone. */
export function ComingSoon({ note }: { note: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-brand-tint/40 p-8 text-center">
      <p className="text-sm text-ink-muted">{note}</p>
    </div>
  );
}
