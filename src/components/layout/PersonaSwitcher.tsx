import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { User, UserId } from '@/types';
import { api } from '@/data/api';
import { usePlaceStore } from '@/store/usePlaceStore';
import { useSessionStore } from '@/store/useSessionStore';

/** Mock "session" persona switcher — pick which demo user you're acting as. */
export function PersonaSwitcher() {
  const { t } = useTranslation();
  const placeId = usePlaceStore((s) => s.activePlaceId);
  const currentUserId = useSessionStore((s) => s.currentUserId);
  const setPersona = useSessionStore((s) => s.setPersona);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    let active = true;
    void api.getUsers(placeId).then((u) => {
      if (active) setUsers(u);
    });
    return () => {
      active = false;
    };
  }, [placeId]);

  // Fall back to all-place personas if this place has none seeded yet.
  const options = users.length > 0 ? users : [];

  return (
    <label className="flex items-center gap-1.5 text-sm">
      <span className="sr-only">{t('nav.profile')}</span>
      <select
        aria-label={t('nav.profile')}
        className="min-h-touch max-w-[10rem] truncate rounded-xl border border-line bg-white px-3 py-1.5 font-medium text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        value={options.some((u) => u.id === currentUserId) ? currentUserId : ''}
        onChange={(e) => setPersona(e.target.value as UserId)}
      >
        {!options.some((u) => u.id === currentUserId) && <option value="">{t('nav.profile')}…</option>}
        {options.map((u) => (
          <option key={u.id} value={u.id}>
            {u.displayName} · {u.role}
          </option>
        ))}
      </select>
    </label>
  );
}
