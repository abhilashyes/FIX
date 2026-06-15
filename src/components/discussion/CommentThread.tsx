import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Comment, CommentId, IssueId, UserId } from '@/types';
import { api } from '@/data/api';
import { relativeTime } from '@/lib/format';
import { Button } from '@/components/ui/Button';

interface Props {
  issueId: IssueId;
  currentUserId: UserId;
  comments: Comment[];
  userName: (id: UserId) => string;
  onChange: (comments: Comment[]) => void;
}

export function CommentThread({ issueId, currentUserId, comments, userName, onChange }: Props) {
  const { t } = useTranslation();
  const [replyTo, setReplyTo] = useState<CommentId | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const childrenOf = useMemo(() => {
    const map = new Map<CommentId | null, Comment[]>();
    for (const c of comments) {
      const arr = map.get(c.parentId) ?? [];
      arr.push(c);
      map.set(c.parentId, arr);
    }
    return map;
  }, [comments]);

  const post = async (parentId: CommentId | null) => {
    const key = parentId ?? 'root';
    const body = drafts[key]?.trim();
    if (!body) return;
    const created = await api.addComment({ issueId, authorId: currentUserId, parentId, body });
    onChange([...comments, created]);
    setDrafts((d) => ({ ...d, [key]: '' }));
    setReplyTo(null);
  };

  const renderForm = (parentId: CommentId | null) => {
    const key = parentId ?? 'root';
    return (
      <div className="mt-2 flex items-start gap-2">
        <textarea
          value={drafts[key] ?? ''}
          onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
          placeholder={t('discuss.addComment')}
          rows={1}
          className="min-h-touch flex-1 rounded-xl border border-line px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
        <Button onClick={() => post(parentId)} disabled={!drafts[key]?.trim()} className="text-sm">
          {t('discuss.post')}
        </Button>
      </div>
    );
  };

  const renderNode = (comment: Comment, depth: number) => {
    const replies = childrenOf.get(comment.id) ?? [];
    return (
      <li key={comment.id} className={depth > 0 ? 'ml-4 border-l border-line pl-3' : ''}>
        <div className="rounded-xl bg-brand-tint/30 p-3">
          <p className="text-sm text-ink">{comment.body}</p>
          <p className="mt-1 text-xs text-ink-muted">
            {userName(comment.authorId)} · {relativeTime(comment.createdAt)}
          </p>
          <button
            type="button"
            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
            className="mt-1 text-xs font-medium text-brand hover:text-brand-hover"
          >
            {t('discuss.reply')}
          </button>
          {replyTo === comment.id && renderForm(comment.id)}
        </div>
        {replies.length > 0 && (
          <ul className="mt-2 flex flex-col gap-2">{replies.map((r) => renderNode(r, depth + 1))}</ul>
        )}
      </li>
    );
  };

  const roots = childrenOf.get(null) ?? [];

  return (
    <section className="mt-6">
      <h2 className="mb-2 font-display font-bold text-ink">{t('discuss.comments')}</h2>
      {renderForm(null)}
      {roots.length === 0 ? (
        <p className="py-4 text-sm text-ink-muted">{t('discuss.noComments')}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">{roots.map((c) => renderNode(c, 0))}</ul>
      )}
    </section>
  );
}
