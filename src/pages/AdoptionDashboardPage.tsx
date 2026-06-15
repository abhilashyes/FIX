import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Adoption, AdoptionId, Organization } from '@/types';
import { api } from '@/data/api';
import { usePlaceStore } from '@/store/usePlaceStore';
import { useSessionStore } from '@/store/useSessionStore';
import { formatDate, formatMoney } from '@/lib/format';
import { nowISO } from '@/lib/ids';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { BeforeAfterSlider } from '@/components/issue/BeforeAfterSlider';
import { ShareButton } from '@/components/share/ShareButton';
import { ShareKind } from '@/types';

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-3">
      <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="font-display text-xl font-extrabold text-ink">{value}</p>
      {sub && <p className="text-xs text-ink-muted">{sub}</p>}
    </div>
  );
}

export function AdoptionDashboardPage() {
  const { t } = useTranslation();
  const { adoptionId } = useParams();
  const place = usePlaceStore((s) => s.activePlace)();
  const currentUserId = useSessionStore((s) => s.currentUserId);
  const [adoption, setAdoption] = useState<Adoption | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);

  useEffect(() => {
    if (!adoptionId) return;
    let active = true;
    void api.getAdoption(adoptionId as AdoptionId).then(async (a) => {
      if (!active) return;
      setAdoption(a);
      const orgs = await api.getOrganizations(a.placeId);
      if (active) setOrg(orgs.find((o) => o.id === a.orgId) ?? null);
    });
    return () => {
      active = false;
    };
  }, [adoptionId]);

  if (!adoption) return <p className="py-10 text-center text-sm text-ink-muted">{t('common.loading')}</p>;

  const logHours = async () => {
    const updated = await api.logEmployeeVolunteering({
      orgId: adoption.orgId,
      volunteerUserId: currentUserId,
      hours: 8,
      date: nowISO(),
      adoptionId: adoption.id,
    });
    setAdoption(updated);
  };

  const exportReport = () => {
    const lines = [
      `CSR Impact Report — ${org?.name ?? ''}`,
      `Asset,${adoption.targetName}`,
      `Period,${formatDate(adoption.periodStart, place)} – ${formatDate(adoption.periodEnd, place)}`,
      `Funds committed,${formatMoney(adoption.commitment.csrFunds, place.locale)}`,
      `Funds deployed,${formatMoney(adoption.impact.fundsDeployed, place.locale)}`,
      `Employee hours committed,${adoption.commitment.employeeVolunteerHours}`,
      `Employee hours logged,${adoption.impact.employeeHoursLogged}`,
      `Issues fixed,${adoption.impact.issuesFixedIds.length}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${adoption.targetName}-csr-impact.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link to={`/${place.id}/adopt`} className="text-sm text-ink-muted hover:text-brand">
        ← {t('adopt.title')}
      </Link>
      <PageHeader
        title={adoption.targetName}
        subtitle={org ? t('adopt.adoptedBy', { org: org.name }) : ''}
        action={
          <Button variant="secondary" className="text-sm" onClick={exportReport}>
            ⤓ {t('adopt.exportReport')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat
          label={t('adopt.fundsDeployed')}
          value={formatMoney(adoption.impact.fundsDeployed, place.locale)}
          sub={`${t('adopt.of')} ${formatMoney(adoption.commitment.csrFunds, place.locale)}`}
        />
        <Stat
          label={t('adopt.employeeHours')}
          value={`${adoption.impact.employeeHoursLogged}`}
          sub={`${t('adopt.of')} ${adoption.commitment.employeeVolunteerHours}`}
        />
        <Stat label={t('adopt.issuesFixed')} value={`${adoption.impact.issuesFixedIds.length}`} />
      </div>

      <p className="mt-3 text-sm text-ink-muted">
        {t('adopt.period')}: {formatDate(adoption.periodStart, place)} – {formatDate(adoption.periodEnd, place)}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={logHours}>+ {t('adopt.logHours')} (8h)</Button>
        <ShareButton
          kind={ShareKind.AdopterRecognition}
          entityRef={{ type: 'adoption', id: adoption.id }}
          image={adoption.impact.beforeAfterPairs[0]?.after?.url}
          summary={`${org?.name ?? ''} · ${adoption.targetName}`}
        />
      </div>

      {adoption.impact.beforeAfterPairs.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 font-display font-bold text-ink">{t('adopt.gallery')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {adoption.impact.beforeAfterPairs.map((pair, i) => (
              <BeforeAfterSlider key={i} pair={pair} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-4 text-xs italic text-ink-muted">{t('common.sampleData')}</p>
    </div>
  );
}
