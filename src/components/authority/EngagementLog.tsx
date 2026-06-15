import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AuthorityId, EngagementLogEntry, ISODateString, PlaceConfig, UserId } from '@/types';
import { EngagementKind } from '@/types';
import { api } from '@/data/api';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/Button';

interface Props {
  issueId: EngagementLogEntry['issueId'];
  authorityId?: AuthorityId;
  currentUserId: UserId;
  entries: EngagementLogEntry[];
  place: PlaceConfig;
  userName: (id: UserId) => string;
  onChange: (entries: EngagementLogEntry[]) => void;
}

export function EngagementLog({
  issueId,
  authorityId,
  currentUserId,
  entries,
  place,
  userName,
  onChange,
}: Props) {
  const { t } = useTranslation();
  const [kind, setKind] = useState<EngagementKind>(EngagementKind.Meeting);
  const [summary, setSummary] = useState('');
  const [outcome, setOutcome] = useState('');
  const [open, setOpen] = useState(false);

  const add = async () => {
    if (!authorityId || !summary.trim()) return;
    const created = await api.addEngagement({
      issueId,
      authorityId,
      kind,
      byUserId: currentUserId,
      summary: summary.trim(),
      outcome: outcome.trim() || undefined,
    });
    onChange([...entries, created]);
    setSummary('');
    setOutcome('');
    setOpen(false);
  };

  const sorted = [...entries].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <div>
      {authorityId && (
        <div className="mb-2">
          <Button variant="ghost" className="text-sm" onClick={() => setOpen((v) => !v)}>
            + {t('account.addEntry')}
          </Button>
          {open && (
            <div className="mt-2 rounded-xl border border-line p-3">
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as EngagementKind)}
                className="mb-2 min-h-touch w-full rounded-lg border border-line px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                {Object.values(EngagementKind).map((k) => (
                  <option key={k} value={k}>
                    {t(`account.kind.${k}`)}
                  </option>
                ))}
              </select>
              <input
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder={t('account.summary')}
                className="mb-2 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
              <input
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder={t('account.outcome')}
                className="mb-2 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
              <Button onClick={add} disabled={!summary.trim()} className="text-sm">
                {t('account.save')}
              </Button>
            </div>
          )}
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="py-3 text-sm text-ink-muted">{t('account.noEngagement')}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sorted.map((e) => (
            <li key={e.id} className="rounded-xl border border-line bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-brand-tint px-2 py-0.5 text-xs font-medium text-brand">
                  {t(`account.kind.${e.kind}`)}
                </span>
                <span className="text-xs text-ink-muted">{formatDate(e.date as ISODateString, place)}</span>
              </div>
              <p className="mt-1 text-sm text-ink">{e.summary}</p>
              {e.outcome && <p className="mt-0.5 text-xs text-ink-muted">→ {e.outcome}</p>}
              <p className="mt-1 text-xs text-ink-muted">{userName(e.byUserId)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
