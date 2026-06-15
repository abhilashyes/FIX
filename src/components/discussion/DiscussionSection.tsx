import { useEffect, useState } from 'react';
import type { Comment, Countermeasure, IssueId, PlaceConfig, User, UserId } from '@/types';
import { api } from '@/data/api';
import { useSessionStore } from '@/store/useSessionStore';
import { CountermeasureList } from './CountermeasureList';
import { CommentThread } from './CommentThread';

interface Props {
  issueId: IssueId;
  place: PlaceConfig;
}

/** Combines countermeasure proposals (with voting) and the threaded comment thread. */
export function DiscussionSection({ issueId, place }: Props) {
  const currentUserId = useSessionStore((s) => s.currentUserId);
  const [comments, setComments] = useState<Comment[]>([]);
  const [countermeasures, setCountermeasures] = useState<Countermeasure[]>([]);
  const [users, setUsers] = useState<Map<UserId, User>>(new Map());

  useEffect(() => {
    let active = true;
    void Promise.all([
      api.listComments(issueId),
      api.listCountermeasures(issueId),
      api.getUsers(place.id),
    ]).then(([c, cm, u]) => {
      if (!active) return;
      setComments(c);
      setCountermeasures(cm);
      setUsers(new Map(u.map((user) => [user.id, user])));
    });
    return () => {
      active = false;
    };
  }, [issueId, place.id]);

  const userName = (id: UserId) => users.get(id)?.displayName ?? 'Someone';

  return (
    <div className="mt-8 border-t border-line pt-6">
      <CountermeasureList
        issueId={issueId}
        place={place}
        currentUserId={currentUserId}
        items={countermeasures}
        userName={userName}
        onChange={setCountermeasures}
      />
      <CommentThread
        issueId={issueId}
        currentUserId={currentUserId}
        comments={comments}
        userName={userName}
        onChange={setComments}
      />
    </div>
  );
}
