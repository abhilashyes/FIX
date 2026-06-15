import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { FunnelBucket, HeatmapCell, TrendPoint } from '@/types';
import { STATUS_COLOR } from '@/lib/statusColors';

const card = 'rounded-2xl border border-line bg-white p-3';

/** Status funnel — issue counts per lifecycle stage. */
export function StatusFunnel({ buckets }: { buckets: FunnelBucket[] }) {
  const { t } = useTranslation();
  const data = buckets.map((b) => ({ name: t(`status.${b.status}`), count: b.count, fill: STATUS_COLOR[b.status] }));
  return (
    <div className={card}>
      <h3 className="mb-2 font-display font-bold text-ink">{t('dashboard.funnel')}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EAE7E4" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={84} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Reported vs resolved over the last 6 months. */
export function TrendChart({ points }: { points: TrendPoint[] }) {
  const { t } = useTranslation();
  return (
    <div className={card}>
      <h3 className="mb-2 font-display font-bold text-ink">{t('dashboard.trends')}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={points} margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAE7E4" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="reported" name={t('dashboard.reported')} stroke="#6B7280" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="resolved" name={t('dashboard.resolvedLine')} stroke="#16A34A" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Locality hotspots — weighted priority score per locality (the "heatmap"). */
export function LocalityHotspots({ cells }: { cells: HeatmapCell[] }) {
  const { t } = useTranslation();
  const data = [...cells]
    .sort((a, b) => b.weightedScore - a.weightedScore)
    .map((c) => ({ name: c.localityName, score: c.weightedScore, count: c.issueCount }));
  // Colour intensity by rank (hotter = more red).
  const max = Math.max(1, ...data.map((d) => d.score));
  return (
    <div className={card}>
      <h3 className="mb-2 font-display font-bold text-ink">{t('dashboard.hotspots')}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EAE7E4" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={96} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="score" radius={[0, 6, 6, 0]}>
            {data.map((d, i) => {
              const intensity = 0.35 + 0.65 * (d.score / max);
              return <Cell key={i} fill={`rgba(215, 38, 61, ${intensity.toFixed(2)})`} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
