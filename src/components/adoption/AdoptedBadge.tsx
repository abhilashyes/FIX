import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { Adoption, PlaceId } from '@/types';

/** Tasteful "Adopted by …" badge for the map and issue pages. */
export function AdoptedBadge({ adoption, orgName, placeId }: { adoption: Adoption; orgName: string; placeId: PlaceId }) {
  const { t } = useTranslation();
  return (
    <Link
      to={`/${placeId}/adopt/${adoption.id}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand-tint px-3 py-1 text-xs font-medium text-brand"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s8-4.5 8-11a8 8 0 0 0-16 0c0 6.5 8 11 8 11z" />
        <path d="M9 11l2 2 4-4" />
      </svg>
      {t('adopt.adoptedBy', { org: orgName })}
    </Link>
  );
}
