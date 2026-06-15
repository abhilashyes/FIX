import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DashboardFilters as ApiFilters, FunnelBucket, HeatmapCell, Issue, SlaAging, TrendPoint } from '@/types';
import { api } from '@/data/api';
import { usePlaceStore } from '@/store/usePlaceStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { DashboardFilters, type DashboardFilterState } from '@/components/dashboard/DashboardFilters';
import { LocalityHotspots, StatusFunnel, TrendChart } from '@/components/dashboard/DashboardCharts';
import { PriorityList } from '@/components/dashboard/PriorityList';
import { CivicBodyView } from '@/components/dashboard/CivicBodyView';
import { ScoreboardPanel } from '@/components/dashboard/ScoreboardPanel';

export function DashboardPage() {
  const { t } = useTranslation();
  const place = usePlaceStore((s) => s.activePlace)();
  const [filters, setFilters] = useState<DashboardFilterState>({
    categoryId: '',
    localityId: '',
    status: '',
    civicBodyView: false,
  });
  const [issues, setIssues] = useState<Issue[]>([]);
  const [funnel, setFunnel] = useState<FunnelBucket[]>([]);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapCell[]>([]);
  const [sla, setSla] = useState<SlaAging[]>([]);

  const apiFilters: ApiFilters = useMemo(
    () => ({
      placeId: place.id,
      categoryIds: filters.categoryId ? [filters.categoryId] : undefined,
      localityIds: filters.localityId ? [filters.localityId] : undefined,
      statuses: filters.status ? [filters.status] : undefined,
      civicBodyView: filters.civicBodyView,
    }),
    [place.id, filters],
  );

  useEffect(() => {
    let active = true;
    void Promise.all([
      api.listIssues(apiFilters),
      api.getStatusFunnel(apiFilters),
      api.getTrends(place.id, 6),
      api.getHeatmap(apiFilters),
      api.getSlaAging(place.id),
    ]).then(([i, f, tr, h, s]) => {
      if (!active) return;
      setIssues(i);
      setFunnel(f);
      setTrends(tr);
      setHeatmap(h);
      setSla(s);
    });
    return () => {
      active = false;
    };
  }, [apiFilters, place.id]);

  return (
    <div>
      <PageHeader title={t('page.dashboard.title')} subtitle={place.name} />
      <DashboardFilters place={place} value={filters} onChange={setFilters} />

      {filters.civicBodyView && (
        <div className="mb-4">
          <CivicBodyView place={place} sla={sla} issues={issues} />
        </div>
      )}

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <StatusFunnel buckets={funnel} />
        <TrendChart points={trends} />
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <PriorityList issues={issues} place={place} />
        <LocalityHotspots cells={heatmap} />
      </div>

      <h2 className="mb-2 mt-6 font-display text-lg font-extrabold text-ink">{t('account.scoreboard')}</h2>
      <ScoreboardPanel place={place} />
    </div>
  );
}
