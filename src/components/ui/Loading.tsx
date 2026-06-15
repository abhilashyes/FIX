import { useTranslation } from 'react-i18next';

/** Lightweight loading fallback (used for lazy routes and async sections). */
export function Loading() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-brand" />
      <span className="ml-3 text-sm text-ink-muted">{t('common.loading')}</span>
    </div>
  );
}
