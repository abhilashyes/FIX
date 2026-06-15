import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Issue } from '@/types';
import { api } from '@/data/api';
import { usePlaceStore } from '@/store/usePlaceStore';
import { computeIssuePriority } from '@/lib/issuePriority';
import { PageHeader } from '@/components/layout/PageHeader';
import { IssueCard } from '@/components/issue/IssueCard';
import { IssueMap } from '@/components/map/IssueMap';

type View = 'list' | 'map';

export function HomePage() {
  const { t } = useTranslation();
  const placeId = usePlaceStore((s) => s.activePlaceId);
  const place = usePlaceStore((s) => s.activePlace)();
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [view, setView] = useState<View>('list');

  useEffect(() => {
    let active = true;
    setIssues(null);
    void api.listIssues({ placeId, civicBodyView: false }).then((data) => {
      if (active) setIssues(data);
    });
    return () => {
      active = false;
    };
  }, [placeId]);

  const sorted = useMemo(
    () =>
      issues
        ? [...issues].sort(
            (a, b) => computeIssuePriority(b).total - computeIssuePriority(a).total,
          )
        : [],
    [issues],
  );

  const onIssueChange = (updated: Issue) =>
    setIssues((prev) => prev?.map((i) => (i.id === updated.id ? updated : i)) ?? prev);

  return (
    <div>
      <PageHeader
        title={t('page.home.title')}
        subtitle={`${place.name} · ${place.civicBodyName}`}
        action={
          <Link
            to={`/${placeId}/report`}
            className="hidden min-h-touch items-center rounded-xl bg-brand px-4 font-medium text-white hover:bg-brand-hover sm:inline-flex"
          >
            {t('action.report')}
          </Link>
        }
      />

      {/* View toggle */}
      <div className="mb-4 inline-flex rounded-xl border border-line bg-white p-1" role="tablist">
        {(['list', 'map'] as const).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`min-h-touch rounded-lg px-4 text-sm font-medium transition-colors ${
              view === v ? 'bg-brand text-white' : 'text-ink hover:bg-brand-tint'
            }`}
          >
            {v === 'list' ? t('common.list') : t('common.map')}
          </button>
        ))}
      </div>

      {issues === null ? (
        <p className="py-10 text-center text-sm text-ink-muted">{t('common.loading')}</p>
      ) : view === 'map' ? (
        <div className="h-[60vh] overflow-hidden rounded-2xl border border-line">
          <IssueMap place={place} issues={issues} />
        </div>
      ) : sorted.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-muted">{t('common.empty')}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sorted.map((issue) => (
            <li key={issue.id}>
              <IssueCard issue={issue} place={place} onChange={onIssueChange} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
