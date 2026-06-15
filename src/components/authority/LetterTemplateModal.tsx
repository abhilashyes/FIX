import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Issue, LetterTemplate, PlaceConfig } from '@/types';
import { api } from '@/data/api';
import { daysSince } from '@/lib/format';
import { Button } from '@/components/ui/Button';

interface Props {
  issue: Issue;
  place: PlaceConfig;
  officialName: string;
  officeName: string;
  nextOfficialName: string;
  promisedBy: string;
  localityName: string;
  onClose: () => void;
}

/** Pre-filled, respectful request/follow-up letters citing the issue's data (partnership tone). */
export function LetterTemplateModal({
  issue,
  officialName,
  officeName,
  nextOfficialName,
  promisedBy,
  localityName,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<LetterTemplate[]>([]);
  const [selected, setSelected] = useState<LetterTemplate | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    void api.getLetterTemplates().then((tpls) => {
      if (!active) return;
      setTemplates(tpls);
      setSelected(tpls[0] ?? null);
    });
    return () => {
      active = false;
    };
  }, []);

  const vars = {
    officialName,
    nextOfficialName,
    officeName,
    issueTitle: issue.title,
    locality: localityName,
    votes: issue.upvoteCount,
    ageDays: daysSince(issue.createdAt),
    promisedBy,
  };

  const title = selected ? t(selected.titleKey, vars) : '';
  const body = selected ? t(selected.bodyKey, vars) : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-4 shadow-sheet sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display font-bold text-ink">{t('account.letterTitle')}</h2>
          <button onClick={onClose} className="min-h-touch px-2 text-ink-muted" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setSelected(tpl)}
              className={`min-h-touch rounded-xl border px-3 text-sm font-medium ${
                selected?.id === tpl.id ? 'border-brand bg-brand-tint text-brand' : 'border-line text-ink'
              }`}
            >
              {tpl.kind}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-line bg-brand-tint/30 p-3">
          <p className="font-semibold text-ink">{title}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{body}</p>
        </div>

        <div className="mt-3 flex justify-end">
          <Button onClick={copy}>{copied ? t('account.copied') : t('account.copy')}</Button>
        </div>
      </div>
    </div>
  );
}
