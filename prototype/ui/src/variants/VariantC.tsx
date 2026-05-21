import type { VariantProps } from './shared';
import { PotAlert, StateDump, TeamMemberEditor } from './shared';

/** C — Table first: overview table is primary; compact pot in page header. */
export function VariantC(api: VariantProps) {
  const { state, pot, setCentralBudget, addTeam, removeTeam, renameTeam, formatLkr } = api;
  const fill = pot.budget > 0 ? Math.min(100, pot.percentUsed) : 0;

  return (
    <div className="variant variant-c">
      <header className="compact-pot" aria-labelledby="pot-heading-c">
        <div>
          <span className="proto-tag">PROTOTYPE · C</span>
          <h1 id="pot-heading-c">Outing budget</h1>
        </div>
        <div className="compact-controls">
          <label>
            Central (Y)
            <input
              type="number"
              min={0}
              step={7000}
              value={state.centralBudget || ''}
              onChange={(e) => setCentralBudget(Number(e.target.value) || 0)}
            />
          </label>
          <div className="compact-stats">
            <span>X {formatLkr(pot.used)}</span>
            <span>{pot.status === 'over' ? `+${formatLkr(pot.overBy)}` : `Z ${formatLkr(pot.remaining)}`}</span>
            <span>{pot.percentUsed.toFixed(0)}%</span>
          </div>
          <div className={`meter meter--thin ${pot.status === 'over' ? 'meter--over' : ''}`}>
            <div className="meter-fill" style={{ width: `${fill}%` }} />
          </div>
        </div>
        <PotAlert pot={pot} />
      </header>

      <section className="table-section">
        <div className="section-head">
          <h2>All teams</h2>
          <button type="button" onClick={addTeam}>
            + Team
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>Headcount</th>
              <th>Allocation</th>
              <th>% of central used</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {state.teams.map((t) => {
              const alloc = api.teamAllocation(t.members);
              const share = api.used > 0 ? (alloc / api.used) * 100 : 0;
              return (
                <tr key={t.id}>
                  <td>
                    <input
                      value={t.name}
                      onChange={(e) => renameTeam(t.id, e.target.value)}
                    />
                  </td>
                  <td>{api.headcount(t.members)}</td>
                  <td>{formatLkr(alloc)}</td>
                  <td>{share.toFixed(1)}%</td>
                  <td>
                    <button type="button" className="btn-ghost" onClick={() => removeTeam(t.id)}>
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th>{state.teams.reduce((n, t) => n + api.headcount(t.members), 0)}</th>
              <th>{formatLkr(api.used)}</th>
              <th>100%</th>
              <th />
            </tr>
          </tfoot>
        </table>
      </section>

      <section className="edit-panels">
        <h2>Edit members</h2>
        {state.teams.map((t) => (
          <div key={t.id} className="edit-panel">
            <h3>{t.name}</h3>
            <TeamMemberEditor api={api} teamId={t.id} members={t.members} />
          </div>
        ))}
      </section>

      <StateDump api={api} />
    </div>
  );
}
