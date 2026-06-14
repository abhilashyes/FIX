import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { PlaceId } from '@/types';
import { ALL_PLACES } from '@/config/places';
import { usePlaceStore } from '@/store/usePlaceStore';

/** Header place switcher — demos metro / town / village. Drives URL + default language. */
export function PlaceSwitcher() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const activePlaceId = usePlaceStore((s) => s.activePlaceId);
  const setActivePlace = usePlaceStore((s) => s.setActivePlace);

  return (
    <label className="flex items-center gap-1.5 text-sm">
      <span className="sr-only">{t('place.switch')}</span>
      <select
        aria-label={t('place.switch')}
        className="min-h-touch rounded-xl border border-line bg-white px-3 py-1.5 font-medium text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        value={activePlaceId}
        onChange={(e) => {
          const id = e.target.value as PlaceId;
          setActivePlace(id);
          navigate(`/${id}`);
        }}
      >
        {ALL_PLACES.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} · {p.type}
          </option>
        ))}
      </select>
    </label>
  );
}
