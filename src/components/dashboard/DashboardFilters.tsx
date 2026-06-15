import { useTranslation } from 'react-i18next';
import type { CategoryId, LocalityId, PlaceConfig } from '@/types';
import { IssueStatus } from '@/types';

export interface DashboardFilterState {
  categoryId: CategoryId | '';
  localityId: LocalityId | '';
  status: IssueStatus | '';
  civicBodyView: boolean;
}

interface Props {
  place: PlaceConfig;
  value: DashboardFilterState;
  onChange: (next: DashboardFilterState) => void;
}

export function DashboardFilters({ place, value, onChange }: Props) {
  const { t } = useTranslation();
  const set = (patch: Partial<DashboardFilterState>) => onChange({ ...value, ...patch });
  const selectCls =
    'min-h-touch rounded-xl border border-line bg-white px-3 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand';

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <select
        aria-label={t('dashboard.allCategories')}
        className={selectCls}
        value={value.categoryId}
        onChange={(e) => set({ categoryId: e.target.value as CategoryId | '' })}
      >
        <option value="">{t('dashboard.allCategories')}</option>
        {place.issueCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {t(c.labelKey)}
          </option>
        ))}
      </select>

      <select
        aria-label={t('dashboard.allLocalities')}
        className={selectCls}
        value={value.localityId}
        onChange={(e) => set({ localityId: e.target.value as LocalityId | '' })}
      >
        <option value="">{t('dashboard.allLocalities')}</option>
        {place.localities.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>

      <select
        aria-label={t('dashboard.allStatuses')}
        className={selectCls}
        value={value.status}
        onChange={(e) => set({ status: e.target.value as IssueStatus | '' })}
      >
        <option value="">{t('dashboard.allStatuses')}</option>
        {Object.values(IssueStatus).map((s) => (
          <option key={s} value={s}>
            {t(`status.${s}`)}
          </option>
        ))}
      </select>

      <label className="ml-auto flex min-h-touch cursor-pointer items-center gap-2 rounded-xl border border-line px-3 text-sm font-medium">
        <input
          type="checkbox"
          checked={value.civicBodyView}
          onChange={(e) => set({ civicBodyView: e.target.checked })}
          className="h-4 w-4 accent-brand"
        />
        {t('dashboard.civicBodyView')}
      </label>
    </div>
  );
}
