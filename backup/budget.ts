export const PER_PERSON_LKR = 7_000;
export const NEAR_LIMIT_RATIO = 0.98;

export type PotStatus = 'within' | 'near' | 'over';

export interface Team {
  id: string;
  name: string;
  members: string[];
}

export interface BudgetState {
  centralBudget: number;
  teams: Team[];
}

export function headcount(members: string[]): number {
  return members.filter((m) => m.trim().length > 0).length;
}

export function teamAllocation(members: string[]): number {
  return headcount(members) * PER_PERSON_LKR;
}

export function centralUsed(teams: Team[]): number {
  return teams.reduce((sum, t) => sum + teamAllocation(t.members), 0);
}

export function centralRemaining(centralBudget: number, used: number): number {
  return centralBudget - used;
}

export function overage(used: number, centralBudget: number): number {
  return Math.max(0, used - centralBudget);
}

export function usageRatio(used: number, centralBudget: number): number {
  if (centralBudget <= 0) return used > 0 ? Infinity : 0;
  return used / centralBudget;
}

export function potStatus(used: number, centralBudget: number): PotStatus {
  if (used > centralBudget) return 'over';
  if (centralBudget > 0 && used / centralBudget >= NEAR_LIMIT_RATIO) return 'near';
  return 'within';
}

export function formatLkr(n: number): string {
  return new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(n);
}

export function alertMessage(
  used: number,
  centralBudget: number,
  status: PotStatus,
): string {
  const remaining = centralRemaining(centralBudget, used);
  const w = overage(used, centralBudget);

  if (status === 'over') {
    return `Over central budget by ${formatLkr(w)} LKR — reduce attendees or raise the central pot.`;
  }
  if (status === 'near' && remaining === 0) {
    return `Central pot fully allocated (${formatLkr(used)} / ${formatLkr(centralBudget)} LKR — no slack left before overage).`;
  }
  if (status === 'near') {
    return `Most of the pot is allocated — only ${formatLkr(remaining)} LKR remains.`;
  }
  return `Central pot: ${formatLkr(used)} LKR used of ${formatLkr(centralBudget)} LKR (${formatLkr(remaining)} LKR left).`;
}

export function maxPeopleAtBudget(centralBudget: number): number {
  if (centralBudget <= 0) return 0;
  return Math.floor(centralBudget / PER_PERSON_LKR);
}

export interface PotSnapshot {
  used: number;
  budget: number;
  remaining: number;
  overBy: number;
  ratio: number;
  percentUsed: number;
  status: PotStatus;
  message: string;
}

export function computePot(state: BudgetState): PotSnapshot {
  const used = centralUsed(state.teams);
  const budget = state.centralBudget;
  const status = potStatus(used, budget);
  const ratio = usageRatio(used, budget);
  return {
    used,
    budget,
    remaining: centralRemaining(budget, used),
    overBy: overage(used, budget),
    ratio,
    percentUsed: budget > 0 ? (used / budget) * 100 : 0,
    status,
    message: alertMessage(used, budget, status),
  };
}

export const INITIAL_STATE: BudgetState = {
  centralBudget: 350_000,
  teams: [
    { id: '1', name: 'Platform', members: ['Ada', 'Ben'] },
    { id: '2', name: 'Design', members: ['Cara'] },
    { id: '3', name: 'Ops', members: [] },
  ],
};

export function parseBudgetState(raw: unknown): BudgetState | null {
  if (!raw || typeof raw !== 'object') return null;
  const { centralBudget, teams } = raw as Record<string, unknown>;
  if (typeof centralBudget !== 'number' || !Number.isFinite(centralBudget) || centralBudget < 0) {
    return null;
  }
  if (!Array.isArray(teams)) return null;
  const parsedTeams: Team[] = [];
  for (const t of teams) {
    if (!t || typeof t !== 'object') return null;
    const row = t as Record<string, unknown>;
    if (typeof row.id !== 'string' || typeof row.name !== 'string' || !Array.isArray(row.members)) {
      return null;
    }
    if (!row.members.every((m) => typeof m === 'string')) return null;
    parsedTeams.push({
      id: row.id,
      name: row.name,
      members: [...row.members],
    });
  }
  return { centralBudget, teams: parsedTeams };
}
