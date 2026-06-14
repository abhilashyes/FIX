import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePlaceStore } from '@/store/usePlaceStore';
import { NAV_ITEMS } from './navItems';

/** Mobile bottom tab navigation (hidden on desktop). Thumb-reachable, 44px targets. */
export function BottomTabNav() {
  const { t } = useTranslation();
  const placeId = usePlaceStore((s) => s.activePlaceId);
  const tabs = NAV_ITEMS.filter((i) => i.bottom);

  return (
    <nav
      aria-label={t('nav.home')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-app items-stretch justify-around">
        {tabs.map((item) => (
          <li key={item.key} className="flex-1">
            <NavLink
              to={`/${placeId}/${item.path}`}
              end={item.path === ''}
              className={({ isActive }) =>
                `flex min-h-touch flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium ${
                  isActive ? 'text-brand' : 'text-ink-muted'
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
