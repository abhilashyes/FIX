import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { BeforeAfterPair, GeoPoint, Locality, PlaceConfig } from '@/types';
import { ImageGenStatus, Severity } from '@/types';
import { api } from '@/data/api';
import { imageService } from '@/data/services/imageService';
import { usePlaceStore } from '@/store/usePlaceStore';
import { useSessionStore } from '@/store/useSessionStore';
import { SEVERITY_COLOR } from '@/lib/statusColors';
import { beforeImage, categoryThumb } from '@/lib/placeholderImages';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { LocationPicker } from '@/components/map/LocationPicker';
import { BeforeAfterSlider } from '@/components/issue/BeforeAfterSlider';

const SAMPLE_PHOTOS = [
  { label: 'Road', url: beforeImage('Now') },
  { label: 'Corner', url: categoryThumb('corner-lot') },
  { label: 'Lane', url: categoryThumb('dark-lane') },
];

function nearestLocality(place: PlaceConfig, point: GeoPoint): Locality | undefined {
  let best: Locality | undefined;
  let bestD = Infinity;
  for (const l of place.localities) {
    const d = (l.center.lat - point.lat) ** 2 + (l.center.lng - point.lng) ** 2;
    if (d < bestD) {
      bestD = d;
      best = l;
    }
  }
  return best;
}

export function ReportIssuePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const place = usePlaceStore((s) => s.activePlace)();
  const reporterId = useSessionStore((s) => s.currentUserId);

  const [categoryId, setCategoryId] = useState(place.issueCategories[0]?.id);
  const [severity, setSeverity] = useState<Severity>(Severity.Medium);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [countermeasure, setCountermeasure] = useState('');
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [vision, setVision] = useState<BeforeAfterPair | null>(null);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = !!title.trim() && !!photoUrl && !!location && !!categoryId;

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoUrl(URL.createObjectURL(file));
      setVision(null);
    }
  };

  const generate = async () => {
    if (!photoUrl || !categoryId) return;
    setGenerating(true);
    setVision({ before: { url: photoUrl }, status: ImageGenStatus.Pending });
    try {
      const pair = await imageService.generateAfterImage({
        beforePhoto: { url: photoUrl },
        countermeasure,
        categoryId,
      });
      setVision(pair);
    } finally {
      setGenerating(false);
    }
  };

  const submit = async () => {
    if (!canSubmit || !categoryId || !location) {
      setError(t('report.missingFields'));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const locality = nearestLocality(place, location);
      const created = await api.createIssue({
        placeId: place.id,
        categoryId,
        title: title.trim(),
        description: description.trim(),
        severity,
        location,
        localityId: locality?.id ?? place.localities[0]!.id,
        beforePhoto: { url: photoUrl!, caption: t('report.field.photo') },
        proposedCountermeasure: countermeasure.trim() || undefined,
        reporterId,
        affectedPopulationEstimate: locality?.population ?? 2000,
      });
      if (vision?.after) await api.attachAfterImage(created.id, vision);
      navigate(`/${place.id}/issues/${created.id}`);
    } catch {
      setError(t('report.missingFields'));
      setSubmitting(false);
    }
  };

  const sectionTitle = (n: number, label: string) => (
    <h2 className="mb-2 mt-6 flex items-center gap-2 font-display font-bold text-ink">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs text-white">
        {n}
      </span>
      {label}
    </h2>
  );

  return (
    <div className="mx-auto max-w-2xl pb-28">
      <PageHeader title={t('report.title')} subtitle={t('report.intro')} />

      {/* 1. Category + severity */}
      {sectionTitle(1, t('report.step.category'))}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {place.issueCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategoryId(c.id)}
            className={`min-h-touch rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
              categoryId === c.id ? 'border-brand bg-brand-tint text-brand' : 'border-line bg-white text-ink hover:bg-brand-tint/50'
            }`}
          >
            {t(c.labelKey)}
          </button>
        ))}
      </div>

      <p className="mb-2 mt-4 text-sm font-medium text-ink">{t('report.field.severity')}</p>
      <div className="flex flex-wrap gap-2">
        {Object.values(Severity).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSeverity(s)}
            className="min-h-touch rounded-xl border px-3 text-sm font-medium"
            style={
              severity === s
                ? { borderColor: SEVERITY_COLOR[s], backgroundColor: `${SEVERITY_COLOR[s]}1A`, color: SEVERITY_COLOR[s] }
                : { borderColor: '#EAE7E4', color: '#1C1B1A' }
            }
          >
            {t(`severity.${s}`)}
          </button>
        ))}
      </div>

      {/* 2. Details */}
      {sectionTitle(2, t('report.step.details'))}
      <label className="mb-1 block text-sm font-medium text-ink" htmlFor="title">
        {t('report.field.title')}
      </label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-3 w-full rounded-xl border border-line px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        placeholder={t('report.field.title')}
      />
      <label className="mb-1 block text-sm font-medium text-ink" htmlFor="desc">
        {t('report.field.description')}
      </label>
      <textarea
        id="desc"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-line px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        placeholder={t('report.field.description')}
      />

      {/* 3. Photo */}
      {sectionTitle(3, t('report.step.photo'))}
      <p className="mb-2 text-sm text-ink-muted">{t('report.choosePhoto')}</p>
      <div className="flex flex-wrap items-center gap-2">
        {SAMPLE_PHOTOS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setPhotoUrl(p.url);
              setVision(null);
            }}
            className={`h-16 w-20 overflow-hidden rounded-xl border-2 ${
              photoUrl === p.url ? 'border-brand' : 'border-line'
            }`}
          >
            <img src={p.url} alt={p.label} className="h-full w-full object-cover" />
          </button>
        ))}
        <label className="flex h-16 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line text-xs text-ink-muted hover:bg-brand-tint/40">
          {t('report.upload')}
          <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
        </label>
      </div>

      {/* 4. Location */}
      {sectionTitle(4, t('report.step.location'))}
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm text-ink-muted">{t('report.tapToPin')}</p>
        <Button variant="secondary" onClick={() => setLocation(place.mapCenter)} className="text-sm">
          {t('action.useMyLocation')}
        </Button>
      </div>
      <div className="h-64 overflow-hidden rounded-2xl border border-line">
        <LocationPicker place={place} value={location} onChange={setLocation} />
      </div>

      {/* 5. Countermeasure + Show the fix */}
      {sectionTitle(5, t('report.step.countermeasure'))}
      <textarea
        value={countermeasure}
        onChange={(e) => setCountermeasure(e.target.value)}
        rows={2}
        className="w-full rounded-xl border border-line px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        placeholder={t('report.field.countermeasure')}
      />
      <p className="mt-2 text-xs text-ink-muted">{t('report.visionHint')}</p>
      <Button
        variant="secondary"
        onClick={generate}
        disabled={!photoUrl || generating}
        className="mt-2"
      >
        {generating ? t('report.generating') : vision?.after ? t('report.regenerate') : t('action.showTheFix')}
      </Button>

      {vision && (
        <div className="mt-3">
          {generating ? (
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-line bg-brand-tint/40">
              <p className="animate-pulse text-sm text-brand">{t('report.generating')}</p>
            </div>
          ) : (
            <>
              <p className="mb-2 text-sm font-medium text-ink">{t('report.visionReady')}</p>
              <BeforeAfterSlider pair={vision} />
            </>
          )}
        </div>
      )}

      {/* Sticky submit bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-white/95 px-3 py-2 backdrop-blur md:bottom-0 md:px-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          {error ? (
            <p className="text-sm text-brand">{error}</p>
          ) : (
            <p className="text-sm text-ink-muted">{place.name}</p>
          )}
          <Button onClick={submit} disabled={!canSubmit || submitting}>
            {submitting ? t('report.submitting') : t('report.createCta')}
          </Button>
        </div>
      </div>
    </div>
  );
}
