import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '@/types';
import { api } from '@/data/api';
import { useSessionStore } from '@/store/useSessionStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { PersonaSwitcher } from '@/components/layout/PersonaSwitcher';

export function ProfilePage() {
  const { t } = useTranslation();
  const currentUserId = useSessionStore((s) => s.currentUserId);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;
    void api
      .getUser(currentUserId)
      .then((u) => active && setUser(u))
      .catch(() => active && setUser(null));
    return () => {
      active = false;
    };
  }, [currentUserId]);

  return (
    <div>
      <PageHeader title={t('page.profile.title')} action={<PersonaSwitcher />} />
      {user ? (
        <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
          <p className="font-display text-lg font-bold text-ink">{user.displayName}</p>
          <p className="text-sm text-ink-muted">{user.role}</p>
          <p className="mt-2 text-sm text-ink">
            {t('common.priorityScore')}: {user.reputation.points} pts · level {user.reputation.level}
          </p>
          <p className="mt-2 inline-block rounded-full bg-brand-tint px-2 py-0.5 text-xs text-brand">
            {t('common.sampleData')}
          </p>
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-ink-muted">{t('common.loading')}</p>
      )}
    </div>
  );
}
