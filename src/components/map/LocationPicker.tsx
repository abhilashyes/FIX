import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import type { GeoPoint, PlaceConfig } from '@/types';
import { pinIcon } from './pinIcon';

interface Props {
  place: PlaceConfig;
  value: GeoPoint | null;
  onChange: (point: GeoPoint) => void;
  className?: string;
}

function ClickCapture({ onChange }: { onChange: (p: GeoPoint) => void }) {
  useMapEvents({
    click: (e) => onChange({ lat: e.latlng.lat, lng: e.latlng.lng }),
  });
  return null;
}

/** Tap the map to drop a pin for the issue location. */
export function LocationPicker({ place, value, onChange, className }: Props) {
  const center = value ?? place.mapCenter;
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={place.mapZoom}
      scrollWheelZoom={false}
      className={className ?? 'h-full w-full'}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickCapture onChange={onChange} />
      {value && <Marker position={[value.lat, value.lng]} icon={pinIcon()} />}
    </MapContainer>
  );
}
