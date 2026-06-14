import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePlaceStore } from '@/store/usePlaceStore';
import { NAV_ITEMS } from './navItems';

/** Desktop sidebar navigation (hidden on mobile). */
export function SideNav() {
  const { t } = useTranslation();
  const placeId = usePlaceStore((s) => s.activePlaceId);

  return (
    <nav
      aria-label={t('nav.home')}
      className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-56 shrink-0 border-r border-line p-3 md:block"
    >
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.key}>
            <NavLink
              to={`/${placeId}/${item.path}`}
              end={item.path === ''}
              className={({ isActive }) =>
                `flex min-h-touch items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-tint text-brand' : 'text-ink hover:bg-brand-tint'
                }`
              }
            >
              {item.icon}
              <span>{t(item.labelKey)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
