import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Issue, ResponsibleChain } from '@/types';
import { EngagementKind } from '@/types';
import { api } from '@/data/api';
import { useSessionStore } from '@/store/useSessionStore';
import { OfficialProfileCard } from './OfficialProfileCard';
import { Button } from '@/components/ui/Button';

/** Per-issue panel: both responsible chains for this location + a respectful escalation ladder. */
export function ResponsiblePanel({ issue }: { issue: Issue }) {
  const { t } = useTranslation();
  const currentUserId = useSessionStore((s) => s.currentUserId);
  const [chain, setChain] = useState<ResponsibleChain | null>(null);
  const [informed, setInformed] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void api.resolveResponsibleChain(issue.id).then((c) => active && setChain(c));
    return () => {
      active = false;
    };
  }, [issue.id]);

  if (!chain) return null;
  const ladder = chain.escalationLadder;
  const next = ladder[informed + 1];

  const escalate = async () => {
    if (!next || busy) return;
    setBusy(true);
    try {
      if (issue.responsibleAuthorityId) {
        await api.addEngagement({
          issueId: issue.id,
          authorityId: issue.responsibleAuthorityId,
          kind: EngagementKind.Escalation,
          byUserId: currentUserId,
          summary: `Kept ${next.title} (${next.officeHolder?.name ?? ''}) informed.`,
          escalatedToRoleId: next.id,
        });
      }
      setInformed((i) => i + 1);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6">
      <h2 className="mb-2 font-display font-bold text-ink">{t('authorities.responsible')}</h2>

      {/* Most-local office-holder in each chain */}
      <div className="grid gap-2 sm:grid-cols-2">
        {chain.administrative[0] && <OfficialProfileCard role={chain.administrative[0]} highlight />}
        {chain.elected[0] && <OfficialProfileCard role={chain.elected[0]} highlight />}
      </div>

      {/* Escalation ladder */}
      {ladder.length > 1 && (
        <div className="mt-4 rounded-2xl border border-line bg-brand-tint/30 p-3">
          <p className="mb-2 text-sm font-semibold text-ink">{t('authorities.escalationLadder')}</p>
          <ol className="flex flex-col gap-1">
            {ladder.map((role, i) => (
              <li
                key={role.id}
                className={`flex items-center gap-2 rounded-lg px-2 py-1 text-sm ${
                  i <= informed ? 'text-ink' : 'text-ink-muted'
                } ${i === informed ? 'bg-white' : ''}`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    i <= informed ? 'bg-brand text-white' : 'bg-line text-ink-muted'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="font-medium">{role.title}</span>
                <span className="truncate text-xs text-ink-muted">· {role.officeHolder?.name}</span>
              </li>
            ))}
          </ol>

          {next ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-ink-muted">
                {t('authorities.nextPerson')}: <span className="font-medium text-ink">{next.title}</span>
              </p>
              <Button variant="secondary" className="text-sm" onClick={escalate} disabled={busy}>
                ↑ {t('authorities.escalate')}
              </Button>
            </div>
          ) : (
            <p className="mt-3 text-xs text-ink-muted">
              {t('authorities.escalatedTo', { name: ladder[informed]?.officeHolder?.name ?? '' })}
            </p>
          )}
        </div>
      )}

      <p className="mt-2 text-xs italic text-ink-muted">{t('authorities.sampleNote')}</p>
    </section>
  );
}
