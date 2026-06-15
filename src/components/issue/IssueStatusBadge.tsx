import { useTranslation } from 'react-i18next';
import type { IssueStatus } from '@/types';
import { STATUS_COLOR } from '@/lib/statusColors';

export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  const { t } = useTranslation();
  const color = STATUS_COLOR[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ color, backgroundColor: `${color}1A` }}
    >
      {t(`status.${status}`)}
    </span>
  );
}
