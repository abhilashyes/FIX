import type { ReactNode } from 'react';

export interface NavItem {
  key: string;
  /** Path relative to /:placeId (empty string = index/home). */
  path: string;
  labelKey: string;
  icon: ReactNode;
  /** Show in the mobile bottom tab bar. */
  bottom: boolean;
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const Icon = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
    {children}
  </svg>
);

export const NAV_ITEMS: readonly NavItem[] = [
  {
    key: 'home',
    path: '',
    labelKey: 'nav.home',
    bottom: true,
    icon: <Icon><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></Icon>,
  },
  {
    key: 'report',
    path: 'report',
    labelKey: 'nav.report',
    bottom: true,
    icon: <Icon><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></Icon>,
  },
  {
    key: 'discuss',
    path: 'discuss',
    labelKey: 'nav.discuss',
    bottom: true,
    icon: <Icon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>,
  },
  {
    key: 'dashboard',
    path: 'dashboard',
    labelKey: 'nav.dashboard',
    bottom: true,
    icon: <Icon><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></Icon>,
  },
  {
    key: 'authorities',
    path: 'authorities',
    labelKey: 'nav.authorities',
    bottom: false,
    icon: <Icon><path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-6h6v6" /></Icon>,
  },
  {
    key: 'adopt',
    path: 'adopt',
    labelKey: 'nav.adopt',
    bottom: false,
    icon: <Icon><path d="M12 21s8-4.5 8-11a8 8 0 0 0-16 0c0 6.5 8 11 8 11z" /><path d="M9 11l2 2 4-4" /></Icon>,
  },
  {
    key: 'pitch',
    path: 'pitch',
    labelKey: 'nav.pitch',
    bottom: false,
    icon: <Icon><rect x="3" y="4" width="18" height="12" rx="1" /><path d="M8 20h8M12 16v4" /></Icon>,
  },
  {
    key: 'profile',
    path: 'profile',
    labelKey: 'nav.profile',
    bottom: true,
    icon: <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0 1 16 0v1" /></Icon>,
  },
];
