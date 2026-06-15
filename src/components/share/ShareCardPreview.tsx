import type { SharePayload } from '@/types';
import { Wordmark } from '@/components/brand/Wordmark';

/** On-brand, language-aware preview card (white, red accent, fix wordmark, photo). */
export function ShareCardPreview({ payload }: { payload: SharePayload }) {
  const { card } = payload;
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="aspect-[1.91/1] w-full bg-brand-tint/40">
        <img src={card.ogImageUrl} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <Wordmark className="h-5 w-auto" />
          <span className="text-[10px] uppercase tracking-wide text-ink-muted">{card.language}</span>
        </div>
        <p className="mt-2 font-display font-bold leading-tight text-ink">{card.title}</p>
        <p className="mt-1 text-sm text-ink-muted">{card.summary}</p>
      </div>
    </div>
  );
}
