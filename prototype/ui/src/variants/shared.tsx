import type { PotSnapshot } from '../budget';
import type { BudgetPrototypeApi } from '../useBudgetState';

export type VariantProps = BudgetPrototypeApi;

export function PotAlert({ pot }: { pot: PotSnapshot }) {
  return (
    <div
      className={`pot-alert pot-alert--${pot.status}`}
      role="alert"
      aria-live="polite"
    >
      {pot.message}
    </div>
  );
}

export function StateDump({ api }: { api: VariantProps }) {
  const { state, pot, used } = api;
  return (
    <details className="state-dump">
      <summary>Full state (prototype)</summary>
      <pre>
        {JSON.stringify(
          {
            centralBudget: state.centralBudget,
            centralUsed: used,
            pot,
            teams: state.teams.map((t) => ({
              name: t.name,
              headcount: api.headcount(t.members),
              allocation: api.teamAllocation(t.members),
              members: t.members,
            })),
          },
          null,
          2,
        )}
      </pre>
    </details>
  );
}

export function TeamMemberEditor({
  api,
  teamId,
  members,
}: {
  api: VariantProps;
  teamId: string;
  members: string[];
}) {
  const rows = members.length ? members : [''];
  return (
    <ul className="member-list">
      {rows.map((m, i) => (
        <li key={`${teamId}-member-${i}`}>
          <input
            type="text"
            placeholder="Member name"
            value={m}
            onChange={(e) => api.setMember(teamId, i, e.target.value)}
          />
          <button
            type="button"
            className="btn-ghost"
            onClick={() => api.removeMemberRow(teamId, i)}
            aria-label="Remove member"
          >
            ×
          </button>
        </li>
      ))}
      <li>
        <button type="button" className="btn-ghost" onClick={() => api.addMemberRow(teamId)}>
          + Add member
        </button>
      </li>
    </ul>
  );
}
