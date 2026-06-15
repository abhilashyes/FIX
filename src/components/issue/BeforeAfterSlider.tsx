import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BeforeAfterPair } from '@/types';
import { ImageGenStatus } from '@/types';

interface Props {
  pair: BeforeAfterPair;
}

/** Draggable before/after comparison slider for the "Show the fix" AI vision. */
export function BeforeAfterSlider({ pair }: Props) {
  const { t } = useTranslation();
  const [pos, setPos] = useState(50);

  if (pair.status !== ImageGenStatus.Ready || !pair.after) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-line bg-brand-tint/40">
        <p className="text-sm text-ink-muted">
          {pair.status === ImageGenStatus.Pending ? t('report.generating') : t('common.empty')}
        </p>
      </div>
    );
  }

  return (
    <figure className="m-0">
      <div className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl border border-line">
        {/* After (full) */}
        <img
          src={pair.after.url}
          alt={pair.after.caption ?? t('common.after')}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {/* Before (clipped to slider position) */}
        <img
          src={pair.before.url}
          alt={pair.before.caption ?? t('common.before')}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          draggable={false}
        />
        <span className="absolute left-2 top-2 rounded-full bg-ink-muted px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
          {t('common.before')}
        </span>
        <span className="absolute right-2 top-2 rounded-full bg-brand px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
          {t('common.after')}
        </span>
        {/* Divider line at the slider position */}
        <span
          className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow"
          style={{ left: `${pos}%` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={t('common.beforeAfter')}
        className="mt-3 h-touch w-full cursor-ew-resize accent-brand"
      />
      {pair.after.caption && (
        <figcaption className="mt-1 text-center text-xs text-ink-muted">
          {pair.after.caption}
        </figcaption>
      )}
    </figure>
  );
}
