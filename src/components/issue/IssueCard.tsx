import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Issue, PlaceConfig } from '@/types';
import { ImageGenStatus } from '@/types';
import { getCategory } from '@/config/categories';
import { computeIssuePriority } from '@/lib/issuePriority';
import { IssueStatusBadge } from './IssueStatusBadge';
import { SeverityBadge } from './SeverityBadge';
import { UpvoteButton } from './UpvoteButton';

interface Props {
  issue: Issue;
  place: PlaceConfig;
  onChange?: (issue: Issue) => void;
}

export function IssueCard({ issue, place, onChange }: Props) {
  const { t } = useTranslation();
  const locality = place.localities.find((l) => l.id === issue.localityId)?.name ?? '';
  const categoryKey = getCategory(issue.categoryId)?.labelKey ?? 'category.other';
  const hasVision = issue.beforeAfter?.status === ImageGenStatus.Ready && !!issue.beforeAfter.after;
  const thumb = hasVision ? issue.beforeAfter?.after?.url : issue.beforePhoto.url;
  const priority = computeIssuePriority(issue);

  return (
    <Link
      to={`/${issue.placeId}/issues/${issue.id}`}
      className="flex gap-3 rounded-2xl border border-line bg-white p-3 shadow-card transition-colors hover:bg-brand-tint/30"
    >
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-tint/40">
        <img src={thumb} alt="" className="h-full w-full object-cover" loading="lazy" />
        {hasVision && (
          <span className="absolute bottom-1 left-1 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {t('action.showTheFix')}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 font-medium text-ink">{issue.title}</p>
          <IssueStatusBadge status={issue.status} />
        </div>
        <p className="mt-0.5 text-xs text-ink-muted">
          {t(categoryKey)} · {locality}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={issue.severity} />
          <span
            className="rounded-full bg-brand-tint px-2 py-0.5 text-xs font-medium text-brand"
            title={priority.formula}
          >
            {t('common.priorityScore')} {priority.total}
          </span>
          <span onClick={(e) => e.preventDefault()}>
            <UpvoteButton issue={issue} onChange={onChange} compact />
          </span>
        </div>
      </div>
    </Link>
  );
}
