import { useTranslation } from 'react-i18next';
import type { Commitment, ISODateString, PlaceConfig } from '@/types';
import { CommitmentStatus } from '@/types';
import { api } from '@/data/api';
import { formatDate } from '@/lib/format';
import { COMMITMENT_COLOR } from '@/lib/statusColors';

interface Props {
  commitments: Commitment[];
  place: PlaceConfig;
  onChange: (items: Commitment[]) => void;
}

export function CommitmentTracker({ commitments, place, onChange }: Props) {
  const { t } = useTranslation();

  const setStatus = async (c: Commitment, status: CommitmentStatus) => {
    const updated = await api.upsertCommitment({
      id: c.id,
      issueId: c.issueId,
      authorityId: c.authorityId,
      description: c.description,
      status,
      promisedBy: c.promisedBy,
    });
    onChange(commitments.map((x) => (x.id === c.id ? updated : x)));
  };

  if (commitments.length === 0) {
    return <p className="py-3 text-sm text-ink-muted">{t('account.noCommitments')}</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {commitments.map((c) => {
        const color = COMMITMENT_COLOR[c.status];
        return (
          <li key={c.id} className="rounded-2xl border border-line bg-white p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-ink">{c.description}</p>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ color, backgroundColor: `${color}1A` }}
              >
                {t(`account.status.${c.status}`)}
              </span>
            </div>
            {c.promisedBy && (
              <p className="mt-1 text-xs text-ink-muted">
                {t('account.promisedBy')}: {formatDate(c.promisedBy as ISODateString, place)}
              </p>
            )}

            {/* History */}
            {c.history.length > 0 && (
              <ol className="mt-2 border-l border-line pl-3 text-xs text-ink-muted">
                {c.history.map((h, i) => (
                  <li key={i} className="mb-1">
                    <span className="font-medium" style={{ color: COMMITMENT_COLOR[h.status] }}>
                      {t(`account.status.${h.status}`)}
                    </span>{' '}
                    · {formatDate(h.at, place)}
                    {h.note ? ` — ${h.note}` : ''}
                  </li>
                ))}
              </ol>
            )}

            {/* Update status (demo: any persona) */}
            <div className="mt-2 flex flex-wrap gap-1">
              {Object.values(CommitmentStatus).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(c, s)}
                  disabled={c.status === s}
                  className="min-h-0 rounded-lg border border-line px-2 py-1 text-xs font-medium text-ink hover:bg-brand-tint disabled:opacity-40"
                >
                  {t(`account.status.${s}`)}
                </button>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
