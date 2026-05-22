import { parseBudgetState, type BudgetState } from './budget';

const API = '/api/state';

export async function loadPersistedState(): Promise<BudgetState | null> {
  const res = await fetch(API);
  if (!res.ok) return null;
  const raw: unknown = await res.json();
  return parseBudgetState(raw);
}

export async function savePersistedState(state: BudgetState): Promise<void> {
  const res = await fetch(API, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state, null, 2),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `Save failed (${res.status})`);
  }
}
