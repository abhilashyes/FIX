import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LanguageCode } from '@/types';
import en from './locales/en.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';

/** All locale resources. English is the fallback for any missing key (e.g. ta/te stubs). */
export const resources = {
  [LanguageCode.En]: { translation: en },
  [LanguageCode.Hi]: { translation: hi },
  [LanguageCode.Kn]: { translation: kn },
  [LanguageCode.Ta]: { translation: ta },
  [LanguageCode.Te]: { translation: te },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: LanguageCode.En,
  fallbackLng: LanguageCode.En,
  interpolation: { escapeValue: false },
  returnNull: false,
});

/** Switch the active UI language. */
export function setLanguage(code: LanguageCode): void {
  void i18n.changeLanguage(code);
}

export default i18n;
