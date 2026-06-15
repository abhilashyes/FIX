import { useTranslation } from 'react-i18next';
import type { HierarchyRole } from '@/types';
import { getCategory } from '@/config/categories';

interface Props {
  role: HierarchyRole;
  highlight?: boolean;
}

/** Profile card for a (clearly-labelled sample) office-holder in a hierarchy chain. */
export function OfficialProfileCard({ role, highlight }: Props) {
  const { t } = useTranslation();
  const holder = role.officeHolder;
  return (
    <div
      className={`rounded-2xl border bg-white p-3 ${
        highlight ? 'border-brand ring-1 ring-brand/30' : 'border-line'
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-ink-muted">{role.title}</p>
      <p className="font-display font-bold text-ink">{holder?.name ?? '—'}</p>
      {holder?.designation && <p className="text-sm text-ink-muted">{holder.designation}</p>}
      <p className="mt-1 text-xs text-ink-muted">
        {t('authorities.jurisdiction')}: {role.jurisdiction.scopeLabel}
      </p>
      {role.remitCategoryIds && role.remitCategoryIds.length > 0 && (
        <p className="mt-1 text-xs text-ink-muted">
          {t('authorities.remit')}:{' '}
          {role.remitCategoryIds.map((c) => t(getCategory(c)?.labelKey ?? 'category.other')).join(', ')}
        </p>
      )}
      {holder?.contact && (
        <p className="mt-1 text-xs text-ink-muted">
          {t('authorities.contact')}: {holder.contact.email}
        </p>
      )}
      <span className="mt-2 inline-block rounded-full bg-brand-tint px-2 py-0.5 text-[10px] text-brand">
        {t('common.sampleData')}
      </span>
    </div>
  );
}
