import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Issue, PlaceConfig } from '@/types';
import { computeIssuePriority } from '@/lib/issuePriority';

/** Transparent composite-score ranking with a visible per-component breakdown + formula. */
export function PriorityList({ issues, place }: { issues: Issue[]; place: PlaceConfig }) {
  const { t } = useTranslation();
  const ranked = useMemo(
    () =>
      issues
        .map((i) => ({ issue: i, p: computeIssuePriority(i) }))
        .sort((a, b) => b.p.total - a.p.total)
        .slice(0, 10),
    [issues],
  );
  const formula = ranked[0]?.p.formula ?? '';

  return (
    <div className="rounded-2xl border border-line bg-white p-3">
      <h3 className="font-display font-bold text-ink">{t('dashboard.priorityList')}</h3>
      {formula && <p className="mb-2 text-xs text-ink-muted">{t('dashboard.formula', { formula })}</p>}
      <ol className="flex flex-col gap-2">
        {ranked.map(({ issue, p }, i) => {
          const segs = [
            { v: p.upvotesComponent, c: '#D7263D' },
            { v: p.severityComponent, c: '#B71C30' },
            { v: p.ageComponent, c: '#6B7280' },
            { v: p.populationComponent, c: '#D97706' },
          ];
          return (
            <li key={issue.id} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-right font-display font-bold text-ink-muted">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/${place.id}/issues/${issue.id}`}
                  className="block truncate text-sm font-medium text-ink hover:text-brand"
                >
                  {issue.title}
                </Link>
                <div className="mt-1 flex h-2 w-full overflow-hidden rounded-full bg-line">
                  {segs.map((s, k) => (
                    <span key={k} style={{ width: `${(s.v / p.total) * 100}%`, backgroundColor: s.c }} />
                  ))}
                </div>
              </div>
              <span className="w-10 shrink-0 text-right font-display font-bold text-brand">{p.total}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
