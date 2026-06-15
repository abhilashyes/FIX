import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Issue } from '@/types';
import { api } from '@/data/api';
import { useSessionStore } from '@/store/useSessionStore';

interface Props {
  issue: Issue;
  onChange?: (issue: Issue) => void;
  compact?: boolean;
}

/** "Affects me too" — joins the affected community and drives priority. */
export function UpvoteButton({ issue, onChange, compact }: Props) {
  const { t } = useTranslation();
  const currentUserId = useSessionStore((s) => s.currentUserId);
  const [busy, setBusy] = useState(false);
  const joined = issue.affectedUserIds.includes(currentUserId);

  const handle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (joined || busy) return;
    setBusy(true);
    try {
      const updated = await api.upvoteIssue(issue.id, currentUserId);
      onChange?.(updated);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={joined || busy}
      aria-pressed={joined}
      className={`inline-flex min-h-touch items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors ${
        joined
          ? 'border-brand bg-brand text-white'
          : 'border-line bg-white text-ink hover:bg-brand-tint'
      } ${compact ? 'min-h-0 py-1' : ''}`}
      title={t('action.upvote')}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 11v9" />
        <path d="M4 11h3v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z" />
        <path d="M7 11l4-7a2 2 0 0 1 3 2l-1 5h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16 21H7" />
      </svg>
      <span>{issue.upvoteCount}</span>
      {!compact && <span className="hidden sm:inline">{t('action.upvote')}</span>}
    </button>
  );
}
