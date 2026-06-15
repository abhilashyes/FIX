import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ShareEntityRef, SharePayload } from '@/types';
import { ShareKind } from '@/types';
import { shareService } from '@/data/services/shareService';
import { usePlaceStore } from '@/store/usePlaceStore';
import { ShareSheet } from './ShareSheet';

interface Props {
  kind: ShareKind;
  entityRef: ShareEntityRef;
  /** Optional richer preview overrides (issue photo, before/after, etc.). */
  image?: string;
  summary?: string;
  label?: string;
  variant?: 'primary' | 'secondary';
}

/** Opens an on-brand, language-aware share sheet for any entity. */
export function ShareButton({ kind, entityRef, image, summary, label, variant = 'secondary' }: Props) {
  const { t } = useTranslation();
  const language = usePlaceStore((s) => s.language);
  const [payload, setPayload] = useState<SharePayload | null>(null);

  const open = () => {
    const base = shareService.buildPayload(kind, entityRef, language);
    // Localize + enrich the card (service stays generic).
    const title = t(`share.kind.${kind}`);
    const text = `${title} — ${t('share.via')}`;
    setPayload({
      ...base,
      title,
      text,
      card: {
        ...base.card,
        title,
        summary: summary ?? text,
        ogImageUrl: image ?? base.card.ogImageUrl,
      },
    });
  };

  const cls =
    variant === 'primary'
      ? 'bg-brand text-white hover:bg-brand-hover'
      : 'border border-line bg-white text-ink hover:bg-brand-tint';

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={`inline-flex min-h-touch items-center gap-1.5 rounded-xl px-3 text-sm font-medium ${cls}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        {label ?? t('share.title')}
      </button>
      {payload && <ShareSheet payload={payload} onClose={() => setPayload(null)} />}
    </>
  );
}
