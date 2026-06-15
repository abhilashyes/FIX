import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { HierarchyConfig, HierarchyRole, LocalityId } from '@/types';
import { api } from '@/data/api';
import { usePlaceStore } from '@/store/usePlaceStore';
import { resolveResponsibleChain } from '@/lib/jurisdiction';
import { PageHeader } from '@/components/layout/PageHeader';
import { OfficialProfileCard } from '@/components/authority/OfficialProfileCard';

export function AuthorityDirectoryPage() {
  const { t } = useTranslation();
  const place = usePlaceStore((s) => s.activePlace)();
  const [hierarchy, setHierarchy] = useState<HierarchyConfig | null>(null);
  const [localityId, setLocalityId] = useState<LocalityId | ''>('');

  useEffect(() => {
    let active = true;
    setHierarchy(null);
    void api.getHierarchy(place.hierarchyStateId).then((h) => active && setHierarchy(h));
    return () => {
      active = false;
    };
  }, [place.hierarchyStateId]);

  const { admin, elected } = useMemo(() => {
    if (!hierarchy) return { admin: [] as HierarchyRole[], elected: [] as HierarchyRole[] };
    if (localityId) {
      const chain = resolveResponsibleChain(hierarchy, localityId as LocalityId);
      return { admin: chain.administrative, elected: chain.elected };
    }
    // Whole structure, most-local first (CM last).
    const byLevelDesc = (a: HierarchyRole, b: HierarchyRole) => b.level - a.level;
    return {
      admin: [...hierarchy.administrativeRoles].sort(byLevelDesc),
      elected: [...hierarchy.electedRoles].sort(byLevelDesc),
    };
  }, [hierarchy, localityId]);

  return (
    <div>
      <PageHeader
        title={t('page.authorities.title')}
        subtitle={`${t('page.authorities.subtitle')} · ${hierarchy?.stateName ?? ''}`}
      />

      <label className="mb-4 flex items-center gap-2 text-sm">
        <span className="text-ink-muted">{t('authorities.selectLocality', { label: place.localityLabel })}</span>
        <select
          value={localityId}
          onChange={(e) => setLocalityId(e.target.value as LocalityId | '')}
          className="min-h-touch rounded-xl border border-line bg-white px-3 py-1.5 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <option value="">{t('authorities.wholeStructure')}</option>
          {place.localities.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </label>

      {!hierarchy ? (
        <p className="py-10 text-center text-sm text-ink-muted">{t('common.loading')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <h2 className="mb-2 font-display font-bold text-ink">{t('authorities.administrative')}</h2>
            <div className="flex flex-col gap-2">
              {admin.map((role) => (
                <OfficialProfileCard key={role.id} role={role} />
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-2 font-display font-bold text-ink">{t('authorities.elected')}</h2>
            <div className="flex flex-col gap-2">
              {elected.map((role) => (
                <OfficialProfileCard key={role.id} role={role} />
              ))}
            </div>
          </section>
        </div>
      )}

      <p className="mt-4 text-xs italic text-ink-muted">{t('authorities.sampleNote')}</p>
    </div>
  );
}
