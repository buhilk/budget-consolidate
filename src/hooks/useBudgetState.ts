import { useCallback, useEffect, useRef, useState } from 'react';
import {
  INITIAL_STATE,
  type BudgetState,
  type Team,
  centralUsed,
  computePot,
  teamAllocation,
  headcount,
  formatLkr,
} from '../budget';
import { loadPersistedState, savePersistedState } from '../persistence';

export type { BudgetState, Team };

export type SaveStatus = 'loading' | 'idle' | 'saving' | 'saved' | 'error';

const SAVE_DEBOUNCE_MS = 400;

export function useBudgetState() {
  const [state, setState] = useState<BudgetState>(INITIAL_STATE);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('loading');
  const readyRef = useRef(false);
  const skipNextSaveRef = useRef(true);

  const pot = computePot(state);
  const used = centralUsed(state.teams);

  useEffect(() => {
    let cancelled = false;
    loadPersistedState()
      .then((loaded) => {
        if (cancelled) return;
        if (loaded) setState(loaded);
        readyRef.current = true;
        skipNextSaveRef.current = true;
        setSaveStatus('saved');
      })
      .catch(() => {
        if (cancelled) return;
        readyRef.current = true;
        setSaveStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!readyRef.current) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    setSaveStatus('saving');
    const timer = window.setTimeout(() => {
      savePersistedState(state)
        .then(() => setSaveStatus('saved'))
        .catch(() => setSaveStatus('error'));
    }, SAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [state]);

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
    saveStatus,
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

export type BudgetApi = ReturnType<typeof useBudgetState>;
