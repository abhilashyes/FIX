import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Issue, IssueId, User } from '@/types';
import { ImageGenStatus } from '@/types';
import { api } from '@/data/api';
import { usePlaceStore } from '@/store/usePlaceStore';
import { getCategory } from '@/config/categories';
import { formatDate, relativeTime } from '@/lib/format';
import { computeIssuePriority } from '@/lib/issuePriority';
import { STATUS_COLOR } from '@/lib/statusColors';
import { IssueStatusBadge } from '@/components/issue/IssueStatusBadge';
import { SeverityBadge } from '@/components/issue/SeverityBadge';
import { UpvoteButton } from '@/components/issue/UpvoteButton';
import { BeforeAfterSlider } from '@/components/issue/BeforeAfterSlider';
import { IssueMap } from '@/components/map/IssueMap';
import { DiscussionSection } from '@/components/discussion/DiscussionSection';
import { ResponsiblePanel } from '@/components/authority/ResponsiblePanel';

export function IssueDetailPage() {
  const { t } = useTranslation();
  const { issueId } = useParams();
  const place = usePlaceStore((s) => s.activePlace)();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [reporter, setReporter] = useState<User | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!issueId) return;
    let active = true;
    setIssue(null);
    setMissing(false);
    void api
      .getIssue(issueId as IssueId)
      .then((i) => {
        if (!active) return;
        setIssue(i);
        void api.getUser(i.reporterId).then((u) => active && setReporter(u));
      })
      .catch(() => active && setMissing(true));
    return () => {
      active = false;
    };
  }, [issueId]);

  if (missing) {
    return <p className="py-10 text-center text-sm text-ink-muted">{t('page.notFound.title')}</p>;
  }
  if (!issue) {
    return <p className="py-10 text-center text-sm text-ink-muted">{t('common.loading')}</p>;
  }

  const locality = place.localities.find((l) => l.id === issue.localityId)?.name ?? '';
  const categoryKey = getCategory(issue.categoryId)?.labelKey ?? 'category.other';
  const priority = computeIssuePriority(issue);
  const hasVision = issue.beforeAfter?.status === ImageGenStatus.Ready;

  return (
    <article className="mx-auto max-w-3xl">
      <Link to={`/${place.id}`} className="text-sm text-ink-muted hover:text-brand">
        ← {t('nav.home')}
      </Link>

      <header className="mt-2">
        <h1 className="font-display text-2xl font-extrabold leading-tight text-ink">{issue.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <IssueStatusBadge status={issue.status} />
          <SeverityBadge severity={issue.severity} />
          <span className="text-sm text-ink-muted">
            {t(categoryKey)} · {locality}
          </span>
        </div>
      </header>

      {/* Show the fix — before/after vision */}
      <section className="mt-4">
        {hasVision && issue.beforeAfter ? (
          <BeforeAfterSlider pair={issue.beforeAfter} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line">
            <img
              src={issue.beforePhoto.url}
              alt={issue.beforePhoto.caption ?? issue.title}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <UpvoteButton issue={issue} onChange={setIssue} />
        <span className="rounded-xl bg-brand-tint px-3 py-2 text-sm font-medium text-brand" title={priority.formula}>
          {t('common.priorityScore')}: {priority.total}
        </span>
        <span className="text-sm text-ink-muted">
          {t('common.affected', { count: issue.affectedUserIds.length })}
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 text-ink">{issue.description}</p>
      {issue.proposedCountermeasure && (
        <p className="mt-3 rounded-xl border border-line bg-brand-tint/30 p-3 text-sm">
          <span className="font-semibold">{t('report.field.countermeasure')}: </span>
          {issue.proposedCountermeasure}
        </p>
      )}

      {/* Location map */}
      <section className="mt-6">
        <h2 className="mb-2 font-display font-bold text-ink">{t('common.location')}</h2>
        <div className="h-64 overflow-hidden rounded-2xl border border-line">
          <IssueMap place={{ ...place, mapCenter: issue.location, mapZoom: 15 }} issues={[issue]} />
        </div>
      </section>

      {/* Responsible chains + escalation ladder */}
      <ResponsiblePanel issue={issue} />
      <Link
        to={`/${place.id}/authorities`}
        className="mt-2 inline-block text-sm font-medium text-brand hover:text-brand-hover"
      >
        {t('page.authorities.subtitle')} →
      </Link>

      {/* Status timeline */}
      <section className="mt-6">
        <h2 className="mb-2 font-display font-bold text-ink">{t('common.statusTimeline')}</h2>
        <ol className="relative ml-2 border-l border-line">
          {issue.statusHistory.map((change, i) => (
            <li key={i} className="mb-3 ml-4">
              <span
                className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-white"
                style={{ backgroundColor: STATUS_COLOR[change.to] }}
              />
              <p className="text-sm font-medium text-ink">{t(`status.${change.to}`)}</p>
              <p className="text-xs text-ink-muted">{formatDate(change.at, place)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Reporter + affected community */}
      <section className="mt-4 rounded-2xl border border-line bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted">{t('common.reportedBy')}</p>
            <p className="font-medium text-ink">{reporter?.displayName ?? '…'}</p>
            <p className="text-xs text-ink-muted">{relativeTime(issue.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-ink-muted">{t('common.affectedCommunity')}</p>
            <p className="font-display text-xl font-extrabold text-brand">{issue.upvoteCount}</p>
          </div>
        </div>
        <p className="mt-2 inline-block rounded-full bg-brand-tint px-2 py-0.5 text-xs text-brand">
          {t('common.sampleData')}
        </p>
      </section>

      {/* Discussion: countermeasures + voting + threaded comments */}
      <DiscussionSection issueId={issue.id} place={place} />
    </article>
  );
}
