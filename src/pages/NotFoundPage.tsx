import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePlaceStore } from '@/store/usePlaceStore';

export function NotFoundPage() {
  const { t } = useTranslation();
  const placeId = usePlaceStore((s) => s.activePlaceId);
  return (
    <div className="py-16 text-center">
      <p className="font-display text-2xl font-extrabold text-ink">{t('page.notFound.title')}</p>
      <Link to={`/${placeId}`} className="mt-3 inline-block text-sm font-medium text-brand hover:text-brand-hover">
        {t('nav.home')}
      </Link>
    </div>
  );
}
