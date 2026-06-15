import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { FixItDay, Issue, IssueId, MobilizationPlan, Need, PledgeKind } from '@/types';
import { NeedKind } from '@/types';
import { api } from '@/data/api';
import { usePlaceStore } from '@/store/usePlaceStore';
import { useSessionStore } from '@/store/useSessionStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { NeedProgress } from '@/components/mobilization/NeedProgress';
import { FixItDayCard } from '@/components/mobilization/FixItDayCard';

export function MobilizationPage() {
  const { t } = useTranslation();
  const { issueId } = useParams();
  const place = usePlaceStore((s) => s.activePlace)();
  const currentUserId = useSessionStore((s) => s.currentUserId);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [plan, setPlan] = useState<MobilizationPlan | null>(null);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [events, setEvents] = useState<FixItDay[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPlan = useCallback(async (planId: MobilizationPlan['id']) => {
    const [p, n] = await Promise.all([api.getMobilizationPlan(planId), api.getNeeds(planId)]);
    setPlan(p);
    setNeeds(n);
    const evs = await Promise.all(p.fixItDayIds.map((id) => api.getFixItDay(id)));
    setEvents(evs);
  }, []);

  useEffect(() => {
    if (!issueId) return;
    let active = true;
    setLoading(true);
    void api.getIssue(issueId as IssueId).then(async (i) => {
      if (!active) return;
      setIssue(i);
      if (i.mobilizationPlanId) await loadPlan(i.mobilizationPlanId);
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [issueId, loadPlan]);

  const createPlan = async () => {
    if (!issue || !title.trim()) return;
    const created = await api.createMobilizationPlan({
      issueId: issue.id,
      title: title.trim(),
      description: '',
      createdById: currentUserId,
      needs: [
        { kind: NeedKind.Volunteers, label: 'Weekend volunteers', targetQuantity: 15 },
        { kind: NeedKind.Funds, label: 'Materials & refreshments', targetQuantity: 25000, fundsTarget: { amount: 25000, currency: place.currency } },
      ],
    });
    setIssue({ ...issue, mobilizationPlanId: created.id });
    await loadPlan(created.id);
  };

  const pledge = async (need: Need, kind: PledgeKind, quantity: number, amount?: number) => {
    if (!plan) return;
    await api.addPledge({
      needId: need.id,
      planId: plan.id,
      pledgerId: currentUserId,
      kind,
      quantity,
      amount: amount ? { amount, currency: place.currency } : undefined,
    });
    setNeeds(await api.getNeeds(plan.id));
  };

  if (loading) return <p className="py-10 text-center text-sm text-ink-muted">{t('common.loading')}</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t('mobilize.plan')} subtitle={issue?.title} />
      {issue && (
        <Link to={`/${place.id}/issues/${issue.id}`} className="mb-3 inline-block text-sm text-ink-muted hover:text-brand">
          ← {issue.title}
        </Link>
      )}

      {!plan ? (
        <div className="rounded-2xl border border-dashed border-line p-6 text-center">
          <p className="mb-3 text-sm text-ink-muted">{t('mobilize.planHint')}</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('mobilize.newPlanTitle')}
            className="mb-3 w-full rounded-xl border border-line px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
          <Button onClick={createPlan} disabled={!title.trim()}>
            {t('mobilize.create')}
          </Button>
        </div>
      ) : (
        <>
          <h2 className="font-display text-lg font-extrabold text-ink">{plan.title}</h2>
          {plan.description && <p className="mt-1 text-sm text-ink-muted">{plan.description}</p>}

          <h3 className="mb-2 mt-4 font-display font-bold text-ink">{t('mobilize.needs')}</h3>
          <ul className="flex flex-col gap-2">
            {needs.map((n) => (
              <NeedProgress key={n.id} need={n} place={place} onPledge={pledge} />
            ))}
          </ul>

          {events.length > 0 && (
            <>
              <h3 className="mb-2 mt-5 font-display font-bold text-ink">{t('mobilize.fixItDay')}</h3>
              <div className="flex flex-col gap-3">
                {events.map((e) => (
                  <FixItDayCard
                    key={e.id}
                    event={e}
                    place={place}
                    onChange={(updated) => setEvents((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
