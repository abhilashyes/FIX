import { useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Issue, PlaceConfig } from '@/types';
import { getCategory } from '@/config/categories';
import { SEVERITY_COLOR } from '@/lib/statusColors';
import { IssueStatusBadge } from '@/components/issue/IssueStatusBadge';
import { pinIcon } from './pinIcon';

interface Props {
  place: PlaceConfig;
  issues: Issue[];
  className?: string;
}

export function IssueMap({ place, issues, className }: Props) {
  const { t } = useTranslation();
  const icons = useMemo(() => {
    const cache = new Map<string, L.DivIcon>();
    for (const issue of issues) {
      const color = SEVERITY_COLOR[issue.severity];
      if (!cache.has(color)) cache.set(color, pinIcon(color));
    }
    return cache;
  }, [issues]);

  return (
    <MapContainer
      key={`${place.id}:${place.mapCenter.lat},${place.mapCenter.lng}:${place.mapZoom}`}
      center={[place.mapCenter.lat, place.mapCenter.lng]}
      zoom={place.mapZoom}
      scrollWheelZoom={false}
      className={className ?? 'h-full w-full'}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {issues.map((issue) => (
        <Marker
          key={issue.id}
          position={[issue.location.lat, issue.location.lng]}
          icon={icons.get(SEVERITY_COLOR[issue.severity]) ?? pinIcon(SEVERITY_COLOR[issue.severity])}
        >
          <Popup>
            <div className="min-w-[12rem]">
              <p className="mb-1 font-semibold text-ink">{issue.title}</p>
              <div className="mb-1">
                <IssueStatusBadge status={issue.status} />
              </div>
              <p className="mb-2 text-xs text-ink-muted">
                {t(getCategory(issue.categoryId)?.labelKey ?? 'category.other')}
              </p>
              <Link
                to={`/${issue.placeId}/issues/${issue.id}`}
                className="text-sm font-medium text-brand hover:text-brand-hover"
              >
                {t('action.viewDetails')} →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
