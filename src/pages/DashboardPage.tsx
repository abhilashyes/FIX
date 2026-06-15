import { useTranslation } from 'react-i18next';
import { usePlaceStore } from '@/store/usePlaceStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { ScoreboardPanel } from '@/components/dashboard/ScoreboardPanel';

export function DashboardPage() {
  const { t } = useTranslation();
  const place = usePlaceStore((s) => s.activePlace)();

  return (
    <div>
      <PageHeader title={t('page.dashboard.title')} subtitle={t('account.scoreboard')} />
      <ScoreboardPanel place={place} />
      <p className="mt-4 text-xs italic text-ink-muted">{t('page.comingSoon')}</p>
    </div>
  );
}
