interface WordmarkProps {
  /** CSS height (the width scales with the viewBox). */
  className?: string;
  title?: string;
}

/**
 * The "fix." wordmark. The dot of the "i" is a small red person with both arms raised;
 * the period is a red dot. In the "x", the top-left→bottom-right stroke is red, the other
 * is ink. The standing figure doubles as the standalone app icon / map marker.
 */
export function Wordmark({ className = 'h-8 w-auto', title = 'fix' }: WordmarkProps) {
  return (
    <svg className={className} viewBox="0 0 240 150" role="img" aria-label={title}>
      <text
        x="0"
        y="116"
        fontFamily="'Baloo 2', sans-serif"
        fontWeight="800"
        fontSize="135"
        fill="#1C1B1A"
      >
        f
      </text>
      {/* i — person with raised arms */}
      <circle cx="92" cy="40" r="14" fill="#D7263D" />
      <rect x="84" y="58" width="16" height="58" rx="8" fill="#D7263D" />
      <line x1="92" y1="68" x2="76" y2="52" stroke="#D7263D" strokeWidth="10" strokeLinecap="round" />
      <line x1="92" y1="68" x2="108" y2="52" stroke="#D7263D" strokeWidth="10" strokeLinecap="round" />
      {/* x — red + ink strokes */}
      <g strokeWidth="19" strokeLinecap="round">
        <line x1="134" y1="64" x2="190" y2="116" stroke="#D7263D" />
        <line x1="190" y1="64" x2="134" y2="116" stroke="#1C1B1A" />
      </g>
      {/* period */}
      <circle cx="214" cy="108" r="11" fill="#D7263D" />
    </svg>
  );
}

/** Standalone standing-figure mark (favicon / map marker / app icon). */
export function FigureMark({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="fix">
      <circle cx="32" cy="18" r="8" fill="#D7263D" />
      <rect x="27" y="28" width="10" height="26" rx="5" fill="#D7263D" />
      <line x1="32" y1="33" x2="20" y2="22" stroke="#D7263D" strokeWidth="6" strokeLinecap="round" />
      <line x1="32" y1="33" x2="44" y2="22" stroke="#D7263D" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
