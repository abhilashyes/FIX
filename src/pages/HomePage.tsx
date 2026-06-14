import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Issue } from '@/types';
import { api } from '@/data/api';
import { usePlaceStore } from '@/store/usePlaceStore';
import { PageHeader } from '@/components/layout/PageHeader';

/**
 * Home (read-only preview for M1): proves the data layer + place switching + i18n.
 * The Leaflet map and rich issue cards arrive in Milestone 2.
 */
export function HomePage() {
  const { t } = useTranslation();
  const placeId = usePlaceStore((s) => s.activePlaceId);
  const place = usePlaceStore((s) => s.activePlace)();
  const [issues, setIssues] = useState<Issue[] | null>(null);

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

  const localityName = (id: Issue['localityId']) =>
    place.localities.find((l) => l.id === id)?.name ?? '';

  return (
    <div>
      <PageHeader title={t('page.home.title')} subtitle={t('page.home.subtitle')} />

      <div className="mb-4 rounded-2xl border border-line bg-brand-tint/40 p-4 text-sm">
        <span className="font-display font-bold text-ink">{place.name}</span>
        <span className="text-ink-muted">
          {' '}· {place.civicBodyName} · {place.localities.length}{' '}
          {t('place.ward')}s
        </span>
      </div>

      {issues === null ? (
        <p className="py-10 text-center text-sm text-ink-muted">{t('common.loading')}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {issues.map((issue) => (
            <li key={issue.id}>
              <Link
                to={`/${placeId}/issues/${issue.id}`}
                className="block rounded-xl border border-line bg-white p-3 shadow-card transition-colors hover:bg-brand-tint/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-medium text-ink">{issue.title}</span>
                  <span className="shrink-0 rounded-full bg-brand-tint px-2 py-0.5 text-xs font-medium text-brand">
                    {t(`status.${issue.status}`)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  {t(`category.${issue.categoryId.replace('cat-', '')}`)} · {localityName(issue.localityId)} ·{' '}
                  {t('common.upvotes', { count: issue.upvoteCount })}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
