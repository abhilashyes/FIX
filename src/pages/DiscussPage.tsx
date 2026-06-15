import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Issue } from '@/types';
import { api } from '@/data/api';
import { usePlaceStore } from '@/store/usePlaceStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { IssueCard } from '@/components/issue/IssueCard';

/** Discuss tab — issues ranked by community engagement, linking into each discussion. */
export function DiscussPage() {
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

  const sorted = useMemo(
    () => (issues ? [...issues].sort((a, b) => b.upvoteCount - a.upvoteCount) : []),
    [issues],
  );

  const onIssueChange = (updated: Issue) =>
    setIssues((prev) => prev?.map((i) => (i.id === updated.id ? updated : i)) ?? prev);

  return (
    <div>
      <PageHeader title={t('page.discuss.title')} subtitle={t('discuss.activity')} />
      {issues === null ? (
        <p className="py-10 text-center text-sm text-ink-muted">{t('common.loading')}</p>
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
