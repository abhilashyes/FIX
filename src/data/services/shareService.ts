import type { LanguageCode, ShareEntityRef, SharePayload } from '@/types';
import { ShareKind, ShareTarget } from '@/types';
import { afterImage } from '@/lib/placeholderImages';

export interface ShareResult {
  target: ShareTarget;
  ok: boolean;
  method: 'web-share' | 'fallback' | 'clipboard';
}

export interface ShareService {
  canWebShare(): boolean;
  buildPayload(kind: ShareKind, entityRef: ShareEntityRef, language: LanguageCode): SharePayload;
  share(payload: SharePayload, target?: ShareTarget): Promise<ShareResult>;
  buildFallbackUrl(payload: SharePayload, target: ShareTarget): string;
  copyLink(payload: SharePayload): Promise<ShareResult>;
}

/** Deep link for an entity ref (real router routes resolve these). */
function deepLink(ref: ShareEntityRef): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fix.app';
  switch (ref.type) {
    case 'issue':
      return `${origin}/#/i/${ref.id}`;
    case 'event':
      return `${origin}/#/e/${ref.id}`;
    case 'plan':
      return `${origin}/#/m/${ref.id}`;
    case 'adoption':
      return `${origin}/#/a/${ref.id}`;
    case 'official':
      return `${origin}/#/o/${ref.id}`;
    case 'referral':
      return `${origin}/#/${ref.placeId}?ref=invite`;
  }
}

const TITLES: Record<ShareKind, string> = {
  [ShareKind.ShareIssue]: 'This affects our area — add your voice',
  [ShareKind.InviteToEvent]: 'Join our fix-it day',
  [ShareKind.RallyMobilization]: 'Help us reach our goal',
  [ShareKind.CelebrateResolution]: 'We fixed it!',
  [ShareKind.NeighbourReferral]: 'Join fix in our area',
  [ShareKind.AdopterRecognition]: 'Proud to support our neighbourhood',
  [ShareKind.ThankOfficial]: 'Thanks for resolving this',
};

const mockShareService: ShareService = {
  canWebShare: () =>
    typeof navigator !== 'undefined' && typeof navigator.share === 'function',

  buildPayload: (kind, entityRef, language) => {
    const url = deepLink(entityRef);
    const title = TITLES[kind];
    const text = `${title} — via fix.`;
    return {
      kind,
      url,
      title,
      text,
      entityRef,
      card: {
        kind,
        title,
        summary: text,
        ogImageUrl: afterImage('fix.'),
        language,
        brand: 'fix',
      },
    };
  },

  buildFallbackUrl: (payload, target) => {
    const u = encodeURIComponent(payload.url);
    const t = encodeURIComponent(`${payload.title} ${payload.url}`);
    switch (target) {
      case ShareTarget.WhatsApp:
        return `https://wa.me/?text=${t}`;
      case ShareTarget.Telegram:
        return `https://t.me/share/url?url=${u}&text=${encodeURIComponent(payload.title)}`;
      case ShareTarget.Facebook:
        return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
      case ShareTarget.X:
        return `https://twitter.com/intent/tweet?text=${t}`;
      case ShareTarget.Email:
        return `mailto:?subject=${encodeURIComponent(payload.title)}&body=${t}`;
      default:
        return payload.url;
    }
  },

  share: async (payload, target) => {
    if (!target && mockShareService.canWebShare()) {
      try {
        await navigator.share({ title: payload.title, text: payload.text, url: payload.url });
        return { target: ShareTarget.WebShare, ok: true, method: 'web-share' };
      } catch {
        return { target: ShareTarget.WebShare, ok: false, method: 'web-share' };
      }
    }
    const chosen = target ?? ShareTarget.CopyLink;
    if (chosen === ShareTarget.CopyLink) return mockShareService.copyLink(payload);
    const url = mockShareService.buildFallbackUrl(payload, chosen);
    if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
    return { target: chosen, ok: true, method: 'fallback' };
  },

  copyLink: async (payload) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(payload.url);
        return { target: ShareTarget.CopyLink, ok: true, method: 'clipboard' };
      }
    } catch {
      /* fall through */
    }
    return { target: ShareTarget.CopyLink, ok: false, method: 'clipboard' };
  },
};

export const shareService: ShareService = mockShareService;
