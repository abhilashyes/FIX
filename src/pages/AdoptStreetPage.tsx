import { useTranslation } from 'react-i18next';
import { ComingSoon, PageHeader } from '@/components/layout/PageHeader';

export function AdoptStreetPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t('page.adopt.title')} />
      <ComingSoon note={t('page.comingSoon')} />
    </div>
  );
}
