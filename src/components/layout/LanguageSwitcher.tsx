import { useTranslation } from 'react-i18next';
import { LANGUAGE_META, LanguageCode } from '@/types';
import { usePlaceStore } from '@/store/usePlaceStore';

/** Language switcher — offers the active place's languages, rendered in their own script. */
export function LanguageSwitcher() {
  const { t } = useTranslation();
  const language = usePlaceStore((s) => s.language);
  const setLanguage = usePlaceStore((s) => s.setLanguage);
  const activePlace = usePlaceStore((s) => s.activePlace);
  const langs = activePlace().languages;

  return (
    <label className="flex items-center gap-1.5 text-sm">
      <span className="sr-only">{t('language.switch')}</span>
      <select
        aria-label={t('language.switch')}
        className="min-h-touch rounded-xl border border-line bg-white px-3 py-1.5 font-medium text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
      >
        {langs.map((code) => (
          <option key={code} value={code}>
            {LANGUAGE_META[code].endonym}
          </option>
        ))}
      </select>
    </label>
  );
}
