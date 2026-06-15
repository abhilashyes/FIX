import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  Commitment,
  EngagementLogEntry,
  ISODateString,
  Issue,
  PlaceConfig,
  ResponsibleChain,
  User,
  UserId,
} from '@/types';
import { api } from '@/data/api';
import { useSessionStore } from '@/store/useSessionStore';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { CommitmentTracker } from './CommitmentTracker';
import { EngagementLog } from './EngagementLog';
import { LetterTemplateModal } from './LetterTemplateModal';

/** Engagement log + commitment tracker + respectful letter generator for an issue. */
export function AccountabilitySection({ issue, place }: { issue: Issue; place: PlaceConfig }) {
  const { t } = useTranslation();
  const currentUserId = useSessionStore((s) => s.currentUserId);
  const [engagement, setEngagement] = useState<EngagementLogEntry[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [chain, setChain] = useState<ResponsibleChain | null>(null);
  const [users, setUsers] = useState<Map<UserId, User>>(new Map());
  const [letterOpen, setLetterOpen] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all([
      api.listEngagement(issue.id),
      api.getCommitments(issue.id),
      api.resolveResponsibleChain(issue.id),
      api.getUsers(place.id),
    ]).then(([e, c, ch, u]) => {
      if (!active) return;
      setEngagement(e);
      setCommitments(c);
      setChain(ch);
      setUsers(new Map(u.map((user) => [user.id, user])));
    });
    return () => {
      active = false;
    };
  }, [issue.id, place.id]);

  const userName = (id: UserId) => users.get(id)?.displayName ?? 'Someone';
  const localityName = place.localities.find((l) => l.id === issue.localityId)?.name ?? '';
  const officialName = chain?.administrative[0]?.officeHolder?.name ?? '';
  const nextOfficialName = chain?.escalationLadder[1]?.officeHolder?.name ?? officialName;
  const officeName = chain?.administrative[0]?.title ?? place.civicBodyName;
  const promised = commitments.find((c) => c.promisedBy)?.promisedBy;
  const promisedBy = promised ? formatDate(promised as ISODateString, place) : '—';

  return (
    <section className="mt-8 border-t border-line pt-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-extrabold text-ink">{t('account.title')}</h2>
        <Button variant="secondary" className="text-sm" onClick={() => setLetterOpen(true)}>
          ✉ {t('account.generateLetter')}
        </Button>
      </div>

      <h3 className="mb-2 font-display font-bold text-ink">{t('account.commitments')}</h3>
      <CommitmentTracker commitments={commitments} place={place} onChange={setCommitments} />

      <h3 className="mb-2 mt-5 font-display font-bold text-ink">{t('account.engagement')}</h3>
      <EngagementLog
        issueId={issue.id}
        authorityId={issue.responsibleAuthorityId}
        currentUserId={currentUserId}
        entries={engagement}
        place={place}
        userName={userName}
        onChange={setEngagement}
      />

      {letterOpen && (
        <LetterTemplateModal
          issue={issue}
          place={place}
          officialName={officialName}
          officeName={officeName}
          nextOfficialName={nextOfficialName}
          promisedBy={promisedBy}
          localityName={localityName}
          onClose={() => setLetterOpen(false)}
        />
      )}
    </section>
  );
}
