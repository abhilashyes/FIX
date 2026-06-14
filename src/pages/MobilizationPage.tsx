import { useTranslation } from 'react-i18next';
import { ComingSoon, PageHeader } from '@/components/layout/PageHeader';

export function MobilizationPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t('page.mobilize.title')} />
      <ComingSoon note={t('page.comingSoon')} />
    </div>
  );
}
