import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Issue, IssueId } from '@/types';
import { api } from '@/data/api';
import { usePlaceStore } from '@/store/usePlaceStore';
import { ComingSoon, PageHeader } from '@/components/layout/PageHeader';

/** Issue detail (M1 preview: title, status, locality). Full detail in Milestone 2. */
export function IssueDetailPage() {
  const { t } = useTranslation();
  const { issueId } = useParams();
  const place = usePlaceStore((s) => s.activePlace)();
  const [issue, setIssue] = useState<Issue | null>(null);

  useEffect(() => {
    if (!issueId) return;
    let active = true;
    setIssue(null);
    void api
      .getIssue(issueId as IssueId)
      .then((i) => active && setIssue(i))
      .catch(() => active && setIssue(null));
    return () => {
      active = false;
    };
  }, [issueId]);

  if (!issue) {
    return <p className="py-10 text-center text-sm text-ink-muted">{t('common.loading')}</p>;
  }

  const locality = place.localities.find((l) => l.id === issue.localityId)?.name ?? '';

  return (
    <div>
      <PageHeader
        title={issue.title}
        subtitle={`${t(`status.${issue.status}`)} · ${t(`severity.${issue.severity}`)} · ${locality}`}
      />
      <p className="mb-4 text-sm text-ink">{issue.description}</p>
      <ComingSoon note={t('page.comingSoon')} />
    </div>
  );
}
