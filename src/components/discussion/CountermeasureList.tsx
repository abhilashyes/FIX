import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Countermeasure, IssueId, PlaceConfig, UserId } from '@/types';
import { VoteKind } from '@/types';
import { api } from '@/data/api';
import { formatMoney } from '@/lib/format';
import { Button } from '@/components/ui/Button';

interface Props {
  issueId: IssueId;
  place: PlaceConfig;
  currentUserId: UserId;
  items: Countermeasure[];
  userName: (id: UserId) => string;
  onChange: (items: Countermeasure[]) => void;
}

export function CountermeasureList({ issueId, place, currentUserId, items, userName, onChange }: Props) {
  const { t } = useTranslation();
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [reasonFor, setReasonFor] = useState<Record<string, string>>({});

  const vote = async (cm: Countermeasure, kind: VoteKind) => {
    if (voted.has(cm.id)) return;
    setVoted((s) => new Set(s).add(cm.id));
    const reason = reasonFor[cm.id]?.trim() || undefined;
    await api.voteCountermeasure({ countermeasureId: cm.id, voterId: currentUserId, kind, reason });
    onChange(
      items.map((c) =>
        c.id === cm.id
          ? {
              ...c,
              wouldWorkCount: c.wouldWorkCount + (kind === VoteKind.WouldWork ? 1 : 0),
              wouldNotWorkCount: c.wouldNotWorkCount + (kind === VoteKind.WouldNotWork ? 1 : 0),
            }
          : c,
      ),
    );
  };

  const addProposal = async () => {
    if (!title.trim()) return;
    const created = await api.addCountermeasure({
      issueId,
      authorId: currentUserId,
      title: title.trim(),
      description: desc.trim(),
    });
    onChange([...items, created]);
    setTitle('');
    setDesc('');
    setAdding(false);
  };

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display font-bold text-ink">{t('discuss.countermeasures')}</h2>
        <Button variant="ghost" className="text-sm" onClick={() => setAdding((v) => !v)}>
          + {t('discuss.addProposal')}
        </Button>
      </div>

      {adding && (
        <div className="mb-3 rounded-xl border border-line p-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('discuss.proposalTitle')}
            className="mb-2 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={t('discuss.proposalDesc')}
            rows={2}
            className="mb-2 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
          <Button onClick={addProposal} disabled={!title.trim()} className="text-sm">
            {t('discuss.post')}
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="py-4 text-sm text-ink-muted">{t('discuss.noProposals')}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((cm) => {
            const total = cm.wouldWorkCount + cm.wouldNotWorkCount;
            const pct = total > 0 ? Math.round((cm.wouldWorkCount / total) * 100) : 0;
            return (
              <li key={cm.id} className="rounded-2xl border border-line bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-ink">{cm.title}</p>
                  {cm.accepted && (
                    <span className="shrink-0 rounded-full bg-status-resolved/10 px-2 py-0.5 text-xs font-medium text-status-resolved">
                      ✓ {t('discuss.accepted')}
                    </span>
                  )}
                </div>
                {cm.description && <p className="mt-1 text-sm text-ink-muted">{cm.description}</p>}
                <p className="mt-1 text-xs text-ink-muted">
                  {userName(cm.authorId)}
                  {cm.estimatedCost && ` · ${t('discuss.estCost')} ${formatMoney(cm.estimatedCost, place.locale)}`}
                </p>

                {/* Vote tally bar */}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-status-resolved" style={{ width: `${pct}%` }} />
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={voted.has(cm.id)}
                    onClick={() => vote(cm, VoteKind.WouldWork)}
                    className="inline-flex min-h-touch items-center gap-1 rounded-xl border border-line px-3 text-sm font-medium text-status-resolved hover:bg-status-resolved/10 disabled:opacity-50"
                  >
                    👍 {t('discuss.wouldWork')} · {cm.wouldWorkCount}
                  </button>
                  <button
                    type="button"
                    disabled={voted.has(cm.id)}
                    onClick={() => vote(cm, VoteKind.WouldNotWork)}
                    className="inline-flex min-h-touch items-center gap-1 rounded-xl border border-line px-3 text-sm font-medium text-ink-muted hover:bg-brand-tint disabled:opacity-50"
                  >
                    👎 {t('discuss.wouldNotWork')} · {cm.wouldNotWorkCount}
                  </button>
                </div>
                {!voted.has(cm.id) && (
                  <input
                    value={reasonFor[cm.id] ?? ''}
                    onChange={(e) => setReasonFor((r) => ({ ...r, [cm.id]: e.target.value }))}
                    placeholder={t('discuss.reason')}
                    className="mt-2 w-full rounded-lg border border-line px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
