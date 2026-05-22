import type { BudgetApi } from '../hooks/useBudgetState';

export function TeamMemberEditor({
  api,
  teamId,
  members,
}: {
  api: BudgetApi;
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
