import { create } from 'zustand';
import type { PlaceConfig, PlaceId } from '@/types';
import { LanguageCode } from '@/types';
import { DEFAULT_PLACE_ID, getPlace } from '@/config/places';
import { setLanguage } from '@/i18n';

interface PlaceState {
  activePlaceId: PlaceId;
  language: LanguageCode;
  /** True until the user manually picks a language, so place changes can set the default. */
  languageIsAuto: boolean;
  activePlace: () => PlaceConfig;
  setActivePlace: (id: PlaceId) => void;
  setLanguage: (code: LanguageCode) => void;
}

const initialPlace = getPlace(DEFAULT_PLACE_ID);
const initialLanguage = initialPlace?.defaultLanguage ?? LanguageCode.En;
setLanguage(initialLanguage);

export const usePlaceStore = create<PlaceState>((set, get) => ({
  activePlaceId: DEFAULT_PLACE_ID,
  language: initialLanguage,
  languageIsAuto: true,
  activePlace: () => getPlace(get().activePlaceId) ?? (initialPlace as PlaceConfig),
  setActivePlace: (id) => {
    const place = getPlace(id);
    if (!place) return;
    set({ activePlaceId: id });
    // Follow the place's default language until the user overrides it.
    if (get().languageIsAuto) {
      setLanguage(place.defaultLanguage);
      set({ language: place.defaultLanguage });
    }
  },
  setLanguage: (code) => {
    setLanguage(code);
    set({ language: code, languageIsAuto: false });
  },
}));
