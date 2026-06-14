/**
 * Self-contained SVG placeholder images (data URIs) so the prototype needs no binary assets.
 * "before" = muted hatched surface; "after" = hopeful green gradient. A real image model can
 * replace these behind imageService later.
 */
const enc = (svg: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export function beforeImage(label = 'Now'): string {
  return enc(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
    <defs><pattern id='h' width='28' height='28' patternUnits='userSpaceOnUse' patternTransform='rotate(135)'>
      <rect width='28' height='28' fill='#c7c1bb'/><rect width='14' height='28' fill='#b6afa8'/></pattern></defs>
    <rect width='800' height='600' fill='url(#h)'/>
    <rect x='24' y='24' width='110' height='34' rx='17' fill='#6A6F78'/>
    <text x='79' y='47' font-family='sans-serif' font-size='18' fill='#fff' text-anchor='middle'>${label}</text>
  </svg>`);
}

export function afterImage(label = 'After'): string {
  return enc(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#dff0e6'/><stop offset='0.6' stop-color='#bfe3cf'/><stop offset='1' stop-color='#9fd3b8'/>
    </linearGradient></defs>
    <rect width='800' height='600' fill='url(#g)'/>
    <rect x='24' y='24' width='120' height='34' rx='17' fill='#D7263D'/>
    <text x='84' y='47' font-family='sans-serif' font-size='18' fill='#fff' text-anchor='middle'>${label}</text>
  </svg>`);
}

/** Neutral category thumbnail for issues without a real photo. */
export function categoryThumb(seed: string): string {
  const hue = (seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 40) + 10;
  return enc(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
    <rect width='800' height='600' fill='hsl(${hue},12%,82%)'/>
    <rect width='800' height='600' fill='none' stroke='hsl(${hue},10%,70%)' stroke-width='8'/>
  </svg>`);
}
