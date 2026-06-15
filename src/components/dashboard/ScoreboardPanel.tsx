import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CommunityScore, DepartmentScore, PlaceConfig } from '@/types';
import { api } from '@/data/api';

function Responsiveness({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-status-resolved" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-ink-muted">{value}%</span>
    </div>
  );
}

/** Shared scoreboard: per-department and per-locality delivery — celebrates resolution. */
export function ScoreboardPanel({ place }: { place: PlaceConfig }) {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState<DepartmentScore[]>([]);
  const [communities, setCommunities] = useState<CommunityScore[]>([]);

  useEffect(() => {
    let active = true;
    void Promise.all([api.getDepartmentScores(place.id), api.getCommunityScores(place.id)]).then(
      ([d, c]) => {
        if (!active) return;
        setDepartments([...d].sort((a, b) => b.responsivenessScore - a.responsivenessScore));
        setCommunities([...c].sort((a, b) => b.responsivenessScore - a.responsivenessScore));
      },
    );
    return () => {
      active = false;
    };
  }, [place.id]);

  const localityName = (id: CommunityScore['localityId']) =>
    place.localities.find((l) => l.id === id)?.name ?? '';

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section>
        <h3 className="mb-2 font-display font-bold text-ink">{t('account.byDepartment')}</h3>
        <div className="flex flex-col gap-2">
          {departments.map((d) => (
            <div key={d.department} className="rounded-xl border border-line bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-ink">{d.department}</p>
                <Responsiveness value={d.responsivenessScore} />
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                {t('account.openIssues')}: {d.reportedCount - d.resolvedCount} · {t('account.resolved')}:{' '}
                {d.resolvedCount}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-display font-bold text-ink">{t('account.byCommunity')}</h3>
        <div className="flex flex-col gap-2">
          {communities.map((c) => (
            <div key={c.localityId} className="rounded-xl border border-line bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-ink">{localityName(c.localityId)}</p>
                <Responsiveness value={c.responsivenessScore} />
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                {t('account.members')}: {c.activeMembers} · {t('account.resolved')}: {c.resolvedCount}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
