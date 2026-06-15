import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wordmark } from '@/components/brand/Wordmark';
import { usePlaceStore } from '@/store/usePlaceStore';
import { PlaceSwitcher } from './PlaceSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PersonaSwitcher } from './PersonaSwitcher';

/** Sticky top bar: wordmark + place / language / persona switchers. */
export function TopBar() {
  const { t } = useTranslation();
  const placeId = usePlaceStore((s) => s.activePlaceId);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-app flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-2 sm:px-4">
        <Link to={`/${placeId}`} className="flex items-center gap-2" aria-label={t('app.name')}>
          <Wordmark className="h-7 w-auto" />
          <span className="hidden text-xs text-ink-muted sm:inline">{t('app.tagline')}</span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <NavLink
            to={`/${placeId}/pitch`}
            className={({ isActive }) =>
              `min-h-touch rounded-xl px-3 py-1.5 text-sm font-medium md:hidden ${
                isActive ? 'bg-brand-tint text-brand' : 'text-ink hover:bg-brand-tint'
              }`
            }
          >
            {t('nav.pitch')}
          </NavLink>
          <PlaceSwitcher />
          <LanguageSwitcher />
          <div className="hidden sm:block">
            <PersonaSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
