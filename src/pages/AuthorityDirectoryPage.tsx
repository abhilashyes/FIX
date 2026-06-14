import { useTranslation } from 'react-i18next';
import { ComingSoon, PageHeader } from '@/components/layout/PageHeader';

export function AuthorityDirectoryPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t('page.authorities.title')} subtitle={t('page.authorities.subtitle')} />
      <ComingSoon note={t('page.comingSoon')} />
    </div>
  );
}
