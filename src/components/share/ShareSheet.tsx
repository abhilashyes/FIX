import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SharePayload } from '@/types';
import { ShareTarget } from '@/types';
import { shareService } from '@/data/services/shareService';
import { ShareCardPreview } from './ShareCardPreview';

const NETWORKS: { target: ShareTarget; label: string; color: string }[] = [
  { target: ShareTarget.WhatsApp, label: 'WhatsApp', color: '#25D366' },
  { target: ShareTarget.Telegram, label: 'Telegram', color: '#229ED9' },
  { target: ShareTarget.Facebook, label: 'Facebook', color: '#1877F2' },
  { target: ShareTarget.X, label: 'X', color: '#1C1B1A' },
  { target: ShareTarget.Email, label: 'Email', color: '#6B7280' },
];

/** Bottom-sheet share dialog: on-brand preview + Web Share / per-network / copy-link. */
export function ShareSheet({ payload, onClose }: { payload: SharePayload; onClose: () => void }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const onNetwork = (target: ShareTarget) => {
    void shareService.share(payload, target);
  };
  const onCopy = async () => {
    const res = await shareService.copyLink(payload);
    if (res.ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  const onWebShare = () => {
    void shareService.share(payload);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-4 shadow-sheet sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display font-bold text-ink">{t('share.title')}</h2>
          <button onClick={onClose} className="min-h-touch px-2 text-ink-muted" aria-label="Close">
            ✕
          </button>
        </div>

        <ShareCardPreview payload={payload} />

        {shareService.canWebShare() && (
          <button
            onClick={onWebShare}
            className="mt-3 w-full rounded-xl bg-brand py-3 font-medium text-white hover:bg-brand-hover"
          >
            {t('share.title')}…
          </button>
        )}

        <div className="mt-3 grid grid-cols-3 gap-2">
          {NETWORKS.map((n) => (
            <button
              key={n.target}
              onClick={() => onNetwork(n.target)}
              className="flex min-h-touch items-center justify-center gap-1.5 rounded-xl border border-line py-2 text-sm font-medium text-ink hover:bg-brand-tint"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: n.color }} />
              {n.label}
            </button>
          ))}
          <button
            onClick={onCopy}
            className="col-span-3 min-h-touch rounded-xl border border-line py-2 text-sm font-medium text-ink hover:bg-brand-tint"
          >
            {copied ? t('share.copied') : t('share.copyLink')}
          </button>
        </div>
      </div>
    </div>
  );
}
