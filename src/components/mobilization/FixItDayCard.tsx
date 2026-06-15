import { useTranslation } from 'react-i18next';
import type { FixItDay, PlaceConfig, RsvpStatus } from '@/types';
import { api } from '@/data/api';
import { useSessionStore } from '@/store/useSessionStore';
import { formatDate } from '@/lib/format';
import { MeetingPointMap } from '@/components/map/MeetingPointMap';

interface Props {
  event: FixItDay;
  place: PlaceConfig;
  onChange: (event: FixItDay) => void;
}

export function FixItDayCard({ event, place, onChange }: Props) {
  const { t } = useTranslation();
  const currentUserId = useSessionStore((s) => s.currentUserId);
  const going = event.attendees.filter((a) => a.rsvp === 'going').length;
  const mine = event.attendees.find((a) => a.userId === currentUserId)?.rsvp;

  const rsvp = async (status: RsvpStatus) => {
    const updated = await api.rsvpFixItDay(event.id, currentUserId, status);
    onChange(updated);
  };

  const opts: RsvpStatus[] = ['going', 'maybe', 'declined'];

  return (
    <div className="rounded-2xl border border-line bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display font-bold text-ink">{event.title}</h3>
        <span className="text-sm text-ink-muted">{formatDate(event.date, place)}</span>
      </div>
      <p className="mt-1 text-sm text-ink-muted">
        {t('mobilize.meetingPoint')}: {event.meetingPointLabel}
      </p>
      <div className="mt-2 overflow-hidden rounded-xl border border-line">
        <MeetingPointMap point={event.meetingPoint} />
      </div>
      <p className="mt-2 text-sm font-medium text-ink">{t('mobilize.attendees', { count: going })}</p>
      <div className="mt-2 flex gap-2">
        {opts.map((o) => (
          <button
            key={o}
            onClick={() => rsvp(o)}
            className={`min-h-touch rounded-xl border px-3 text-sm font-medium ${
              mine === o ? 'border-brand bg-brand text-white' : 'border-line text-ink hover:bg-brand-tint'
            }`}
          >
            {t(`mobilize.${o}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
