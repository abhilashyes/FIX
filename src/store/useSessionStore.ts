import { create } from 'zustand';
import type { UserId } from '@/types';
import { USER_IDS } from '@/data/fixtures/users';

interface SessionState {
  /** Current demo persona (mock "session" held in memory). */
  currentUserId: UserId;
  /** Civic Body View toggle for the dashboard. */
  civicBodyView: boolean;
  setPersona: (id: UserId) => void;
  setCivicBodyView: (on: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentUserId: USER_IDS.asha,
  civicBodyView: false,
  setPersona: (id) => set({ currentUserId: id }),
  setCivicBodyView: (on) => set({ civicBodyView: on }),
}));
