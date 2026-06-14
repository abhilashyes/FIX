import { useTranslation } from 'react-i18next';
import { ComingSoon, PageHeader } from '@/components/layout/PageHeader';

export function ReportIssuePage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t('report.title')} subtitle={t('report.intro')} />
      <ComingSoon note={t('page.comingSoon')} />
    </div>
  );
}
