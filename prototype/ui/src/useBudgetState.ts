import { useCallback, useState } from 'react';
import {
  INITIAL_STATE,
  type BudgetState,
  type Team,
  centralUsed,
  computePot,
  teamAllocation,
  headcount,
  formatLkr,
} from './budget';

export type { BudgetState, Team };

export function useBudgetState() {
  const [state, setState] = useState<BudgetState>(INITIAL_STATE);
  const pot = computePot(state);
  const used = centralUsed(state.teams);

  const setCentralBudget = useCallback((n: number) => {
    setState((s) => ({ ...s, centralBudget: Math.max(0, n) }));
  }, []);

  const addTeam = useCallback(() => {
    setState((s) => ({
      ...s,
      teams: [
        ...s.teams,
        { id: crypto.randomUUID(), name: `Team ${s.teams.length + 1}`, members: [] },
      ],
    }));
  }, []);

  const removeTeam = useCallback((id: string) => {
    setState((s) => ({ ...s, teams: s.teams.filter((t) => t.id !== id) }));
  }, []);

  const renameTeam = useCallback((id: string, name: string) => {
    setState((s) => ({
      ...s,
      teams: s.teams.map((t) => (t.id === id ? { ...t, name } : t)),
    }));
  }, []);

  const setMember = useCallback((teamId: string, index: number, value: string) => {
    setState((s) => ({
      ...s,
      teams: s.teams.map((t) => {
        if (t.id !== teamId) return t;
        const members = [...t.members];
        members[index] = value;
        return { ...t, members };
      }),
    }));
  }, []);

  const addMemberRow = useCallback((teamId: string) => {
    setState((s) => ({
      ...s,
      teams: s.teams.map((t) =>
        t.id === teamId ? { ...t, members: [...t.members, ''] } : t,
      ),
    }));
  }, []);

  const removeMemberRow = useCallback((teamId: string, index: number) => {
    setState((s) => ({
      ...s,
      teams: s.teams.map((t) => {
        if (t.id !== teamId) return t;
        const members = t.members.filter((_, i) => i !== index);
        return { ...t, members: members.length ? members : [''] };
      }),
    }));
  }, []);

  return {
    state,
    pot,
    used,
    setCentralBudget,
    addTeam,
    removeTeam,
    renameTeam,
    setMember,
    addMemberRow,
    removeMemberRow,
    teamAllocation,
    headcount,
    formatLkr,
  };
}

export type BudgetPrototypeApi = ReturnType<typeof useBudgetState>;
