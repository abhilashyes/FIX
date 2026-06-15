import L from 'leaflet';

/** Teardrop pin (brand red by default), echoing the wordmark figure's white centre. */
export function pinIcon(color = '#D7263D'): L.DivIcon {
  const html = `
    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 39 C5 26 1 20 1 13 A14 14 0 0 1 29 13 C29 20 25 26 15 39 Z"
        fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="15" cy="13" r="5.5" fill="white"/>
    </svg>`;
  return L.divIcon({
    html,
    className: 'fix-pin',
    iconSize: [30, 40],
    iconAnchor: [15, 39],
    popupAnchor: [0, -34],
  });
}
