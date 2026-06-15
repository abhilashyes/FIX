import { useTranslation } from 'react-i18next';
import type { Severity } from '@/types';
import { SEVERITY_COLOR } from '@/lib/statusColors';

export function SeverityBadge({ severity }: { severity: Severity }) {
  const { t } = useTranslation();
  const color = SEVERITY_COLOR[severity];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ color, backgroundColor: `${color}1A` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {t(`severity.${severity}`)}
    </span>
  );
}
