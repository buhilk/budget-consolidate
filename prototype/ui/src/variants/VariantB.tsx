import type { VariantProps } from './shared';
import { PotAlert, StateDump, TeamMemberEditor } from './shared';

/** B — Sidebar pot: vertical gauge + stacked figures; teams as list on the right. */
export function VariantB(api: VariantProps) {
  const { state, pot, setCentralBudget, addTeam, removeTeam, renameTeam, formatLkr } = api;
  const fill = pot.budget > 0 ? Math.min(100, pot.percentUsed) : 0;

  return (
    <div className="variant variant-b">
      <header className="proto-banner">
        <span>PROTOTYPE</span> Variant B (Sidebar pot)
      </header>

      <div className="split">
        <aside className="pot-rail" aria-labelledby="pot-heading-b">
          <h2 id="pot-heading-b">Central pot</h2>
          <label>
            Y (LKR)
            <input
              type="number"
              min={0}
              step={7000}
              value={state.centralBudget || ''}
              onChange={(e) => setCentralBudget(Number(e.target.value) || 0)}
            />
          </label>

          <div
            className={`meter meter--v ${pot.status === 'over' ? 'meter--over' : ''}`}
            aria-label={`${pot.percentUsed.toFixed(0)} percent`}
          >
            <div className="meter-fill-v" style={{ height: `${fill}%` }} />
          </div>

          <dl className="rail-stats">
            <dt>Used (X)</dt>
            <dd>{formatLkr(pot.used)}</dd>
            <dt>Budget (Y)</dt>
            <dd>{formatLkr(pot.budget)}</dd>
            <dt>{pot.status === 'over' ? 'Over (W)' : 'Left (Z)'}</dt>
            <dd>
              {pot.status === 'over' ? formatLkr(pot.overBy) : formatLkr(pot.remaining)}
            </dd>
            <dt>%</dt>
            <dd>{pot.percentUsed.toFixed(1)}%</dd>
          </dl>

          <PotAlert pot={pot} />
        </aside>

        <main className="team-list">
          <div className="section-head">
            <h2>Teams</h2>
            <button type="button" onClick={addTeam}>
              + Team
            </button>
          </div>
          {state.teams.map((t) => {
            const alloc = api.teamAllocation(t.members);
            return (
              <section key={t.id} className="team-row">
                <div className="team-row-head">
                  <input
                    value={t.name}
                    onChange={(e) => renameTeam(t.id, e.target.value)}
                  />
                  <span className="pill">
                    {formatLkr(alloc)} · {api.headcount(t.members)} pax
                  </span>
                  <button type="button" className="btn-ghost" onClick={() => removeTeam(t.id)}>
                    Remove
                  </button>
                </div>
                <TeamMemberEditor api={api} teamId={t.id} members={t.members} />
              </section>
            );
          })}
        </main>
      </div>

      <StateDump api={api} />
    </div>
  );
}
