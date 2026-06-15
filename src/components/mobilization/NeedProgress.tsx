import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Need, PlaceConfig } from '@/types';
import { NeedKind, PledgeKind } from '@/types';
import { formatMoney } from '@/lib/format';
import { Button } from '@/components/ui/Button';

interface Props {
  need: Need;
  place: PlaceConfig;
  onPledge: (need: Need, kind: PledgeKind, quantity: number, amount?: number) => void;
}

export function NeedProgress({ need, place, onPledge }: Props) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const isFunds = need.kind === NeedKind.Funds;
  const done = isFunds ? need.fundsRaised?.amount ?? 0 : need.fulfilledQuantity;
  const target = isFunds ? need.fundsTarget?.amount ?? need.targetQuantity : need.targetQuantity;
  const pct = target > 0 ? Math.min(100, Math.round((done / target) * 100)) : 0;

  const pledgeLabel =
    isFunds ? t('mobilize.pledgeMoney') : need.kind === NeedKind.Volunteers ? t('mobilize.pledgeTime') : t('mobilize.pledgeResource');

  const doPledge = () => {
    if (isFunds) {
      const amt = Number(amount);
      if (!amt) return;
      onPledge(need, PledgeKind.Money, 1, amt);
      setAmount('');
    } else {
      onPledge(need, need.kind === NeedKind.Volunteers ? PledgeKind.VolunteerTime : PledgeKind.Resource, 1);
    }
  };

  return (
    <li className="rounded-2xl border border-line bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-ink">
          <span className="mr-1 rounded-full bg-brand-tint px-2 py-0.5 text-xs text-brand">
            {t(`mobilize.kind.${need.kind}`)}
          </span>
          {need.label}
        </p>
        <span className="text-xs text-ink-muted">
          {isFunds
            ? `${formatMoney({ amount: done, currency: place.currency }, place.locale)} / ${formatMoney(
                { amount: target, currency: place.currency },
                place.locale,
              )}`
            : t('mobilize.goalProgress', { done, target })}
        </span>
      </div>
      {need.requiredSkills && need.requiredSkills.length > 0 && (
        <p className="mt-1 text-xs text-ink-muted">{need.requiredSkills.join(', ')}</p>
      )}
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-2 flex items-center gap-2">
        {isFunds && (
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('mobilize.amount')}
            className="min-h-touch w-28 rounded-lg border border-line px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
        )}
        <Button variant="secondary" className="text-sm" onClick={doPledge} disabled={isFunds && !amount}>
          {pledgeLabel}
        </Button>
      </div>
    </li>
  );
}
