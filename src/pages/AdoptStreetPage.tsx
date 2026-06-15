import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Adoption, LocalityId, OrgId, Organization } from '@/types';
import { AdoptionTargetType } from '@/types';
import { api } from '@/data/api';
import { usePlaceStore } from '@/store/usePlaceStore';
import { daysAgoISO, nowISO } from '@/lib/ids';
import { formatMoney } from '@/lib/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { AdoptedBadge } from '@/components/adoption/AdoptedBadge';

export function AdoptStreetPage() {
  const { t } = useTranslation();
  const place = usePlaceStore((s) => s.activePlace)();
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    orgId: '' as OrgId | '',
    targetType: AdoptionTargetType.Street,
    targetName: '',
    funds: 500000,
    hours: 200,
    localityId: '' as LocalityId | '',
  });

  const load = () => {
    void api.listAdoptions(place.id).then(setAdoptions);
  };

  useEffect(() => {
    let active = true;
    void api.listAdoptions(place.id).then((a) => active && setAdoptions(a));
    void api.getOrganizations(place.id).then((o) => {
      if (!active) return;
      setOrgs(o);
      setForm((f) => ({ ...f, orgId: o[0]?.id ?? '' }));
    });
    return () => {
      active = false;
    };
  }, [place.id]);

  const orgName = (id: OrgId) => orgs.find((o) => o.id === id)?.name ?? '';

  const create = async () => {
    if (!form.orgId || !form.targetName.trim()) return;
    await api.createAdoption({
      orgId: form.orgId,
      placeId: place.id,
      targetType: form.targetType,
      targetName: form.targetName.trim(),
      localityIds: form.localityId ? [form.localityId] : [],
      commitment: {
        csrFunds: { amount: form.funds, currency: place.currency },
        employeeVolunteerHours: form.hours,
      },
      periodStart: nowISO(),
      periodEnd: daysAgoISO(-365),
    });
    setForm((f) => ({ ...f, targetName: '' }));
    setOpen(false);
    load();
  };

  const selectCls =
    'min-h-touch w-full rounded-xl border border-line bg-white px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand';

  return (
    <div>
      <PageHeader
        title={t('adopt.title')}
        action={
          <Button className="text-sm" onClick={() => setOpen((v) => !v)}>
            {t('adopt.create')}
          </Button>
        }
      />

      {open && (
        <div className="mb-4 rounded-2xl border border-line p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <select className={selectCls} value={form.orgId} onChange={(e) => setForm({ ...form, orgId: e.target.value as OrgId })}>
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            <select
              className={selectCls}
              value={form.targetType}
              onChange={(e) => setForm({ ...form, targetType: e.target.value as AdoptionTargetType })}
            >
              {Object.values(AdoptionTargetType).map((tt) => (
                <option key={tt} value={tt}>
                  {t(`adopt.targetType.${tt}`)}
                </option>
              ))}
            </select>
            <input
              className={selectCls}
              placeholder={t('adopt.targetName')}
              value={form.targetName}
              onChange={(e) => setForm({ ...form, targetName: e.target.value })}
            />
            <select
              className={selectCls}
              value={form.localityId}
              onChange={(e) => setForm({ ...form, localityId: e.target.value as LocalityId })}
            >
              <option value="">{place.localityLabel}…</option>
              {place.localities.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              className={selectCls}
              placeholder={t('adopt.funds')}
              value={form.funds}
              onChange={(e) => setForm({ ...form, funds: Number(e.target.value) })}
            />
            <input
              type="number"
              className={selectCls}
              placeholder={t('adopt.hours')}
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })}
            />
          </div>
          <Button className="mt-2" onClick={create} disabled={!form.targetName.trim() || !form.orgId}>
            {t('adopt.create')}
          </Button>
        </div>
      )}

      <h2 className="mb-2 font-display font-bold text-ink">{t('adopt.browse')}</h2>
      {adoptions.length === 0 ? (
        <p className="py-6 text-sm text-ink-muted">{t('adopt.noAdoptions')}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {adoptions.map((a) => (
            <li key={a.id}>
              <Link
                to={`/${place.id}/adopt/${a.id}`}
                className="block rounded-2xl border border-line bg-white p-3 shadow-card hover:bg-brand-tint/30"
              >
                <p className="font-display font-bold text-ink">{a.targetName}</p>
                <p className="text-xs text-ink-muted">{t(`adopt.targetType.${a.targetType}`)}</p>
                <div className="mt-2">
                  <AdoptedBadge adoption={a} orgName={orgName(a.orgId)} placeId={place.id} />
                </div>
                <p className="mt-2 text-sm text-ink-muted">
                  {t('adopt.funds')}: {formatMoney(a.commitment.csrFunds, place.locale)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
