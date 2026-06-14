import { useTranslation } from 'react-i18next';
import { ComingSoon, PageHeader } from '@/components/layout/PageHeader';

export function DiscussPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t('page.discuss.title')} />
      <ComingSoon note={t('page.comingSoon')} />
    </div>
  );
}
