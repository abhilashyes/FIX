import { useTranslation } from 'react-i18next';
import { ComingSoon, PageHeader } from '@/components/layout/PageHeader';

export function DashboardPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t('page.dashboard.title')} />
      <ComingSoon note={t('page.comingSoon')} />
    </div>
  );
}
