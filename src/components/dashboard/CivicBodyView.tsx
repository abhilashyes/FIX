import { useTranslation } from 'react-i18next';
import type { Issue, PlaceConfig, SlaAging } from '@/types';
import { Button } from '@/components/ui/Button';

interface Props {
  place: PlaceConfig;
  sla: SlaAging[];
  issues: Issue[];
}

/** SLA-style aging report + a mock export for ward committees / gram sabhas. */
export function CivicBodyView({ place, sla, issues }: Props) {
  const { t } = useTranslation();
  const titleFor = (id: SlaAging['issueId']) => issues.find((i) => i.id === id)?.title ?? id;

  const rows = [...sla].sort((a, b) => Number(b.breached) - Number(a.breached) || b.daysInStatus - a.daysInStatus);

  const exportSummary = () => {
    const header = 'Issue,Status,Days in status,SLA threshold,Breached';
    const lines = rows.map(
      (r) => `"${titleFor(r.issueId)}",${r.status},${r.daysInStatus},${r.slaThresholdDays},${r.breached ? 'yes' : 'no'}`,
    );
    const csv = [header, ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${place.name}-sla-summary.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-display font-bold text-ink">{t('dashboard.slaAging')}</h3>
        <Button variant="secondary" className="text-sm" onClick={exportSummary}>
          ⤓ {t('dashboard.export')}
        </Button>
      </div>
      <ul className="flex flex-col divide-y divide-line">
        {rows.map((r) => (
          <li key={r.issueId} className="flex items-center justify-between gap-2 py-2">
            <span className="min-w-0 flex-1 truncate text-sm text-ink">{titleFor(r.issueId)}</span>
            <span className="text-xs text-ink-muted">{t(`status.${r.status}`)}</span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                r.breached ? 'bg-severity-critical/10 text-severity-critical' : 'bg-brand-tint text-ink-muted'
              }`}
            >
              {t('dashboard.daysInStatus', { days: r.daysInStatus })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
