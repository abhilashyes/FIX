import { useTranslation } from 'react-i18next';

/**
 * Pitch deck page — embeds the standalone marketing deck (public/pitch.html) in an iframe so
 * its self-contained styles and scroll animations run in isolation from the app's Tailwind UI.
 */
export function PitchPage() {
  const { t } = useTranslation();
  // BASE_URL respects the Vite base ('./'), so this resolves under the Pages subpath.
  const src = `${import.meta.env.BASE_URL}pitch.html`;

  return (
    <div className="-mx-3 -mt-4 sm:-mx-4">
      <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4">
        <h1 className="font-display text-lg font-extrabold text-ink">{t('nav.pitch')}</h1>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand hover:text-brand-hover"
        >
          {t('pitch.openFull')}
        </a>
      </div>
      <iframe
        src={src}
        title={t('nav.pitch')}
        className="h-[calc(100dvh-9rem)] w-full border-0 md:h-[calc(100dvh-7rem)]"
        loading="lazy"
      />
    </div>
  );
}
