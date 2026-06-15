import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoPoint } from '@/types';
import { pinIcon } from './pinIcon';

/** Small read-only map marking a single point (e.g. a fix-it day meeting point). */
export function MeetingPointMap({ point, className }: { point: GeoPoint; className?: string }) {
  return (
    <MapContainer
      key={`${point.lat},${point.lng}`}
      center={[point.lat, point.lng]}
      zoom={15}
      scrollWheelZoom={false}
      dragging={false}
      className={className ?? 'h-40 w-full'}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[point.lat, point.lng]} icon={pinIcon()} />
    </MapContainer>
  );
}
