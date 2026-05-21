import { maxPeopleAtBudget } from '../budget';
import type { VariantProps } from './shared';
import { PotAlert, StateDump, TeamMemberEditor } from './shared';

/** A — Hero pot: central meter dominates; team cards in a grid below. */
export function VariantA(api: VariantProps) {
  const { state, pot, setCentralBudget, addTeam, removeTeam, renameTeam, formatLkr } =
    api;
  const fill = pot.budget > 0 ? Math.min(100, pot.percentUsed) : 0;
  const overflow = pot.status === 'over' && pot.budget > 0 ? pot.percentUsed - 100 : 0;

  return (
    <div className="variant variant-a">
      <header className="proto-banner">
        <span>PROTOTYPE</span> Team outing budget — Variant A (Hero pot)
      </header>

      <section className="pot-hero" aria-labelledby="pot-heading-a">
        <h2 id="pot-heading-a">Central pot</h2>
        <label className="budget-input">
          Central budget (LKR)
          <input
            type="number"
            min={0}
            step={7000}
            value={state.centralBudget || ''}
            onChange={(e) => setCentralBudget(Number(e.target.value) || 0)}
          />
        </label>

        <div className="pot-figures">
          <div>
            <span className="label">Budget (Y)</span>
            <strong>{formatLkr(pot.budget)}</strong>
          </div>
          <div>
            <span className="label">Used (X)</span>
            <strong>{formatLkr(pot.used)}</strong>
          </div>
          <div>
            <span className="label">{pot.status === 'over' ? 'Over by' : 'Remaining'}</span>
            <strong>
              {pot.status === 'over' ? formatLkr(pot.overBy) : formatLkr(pot.remaining)}
            </strong>
          </div>
          <div>
            <span className="label">% used</span>
            <strong>{pot.percentUsed.toFixed(1)}%</strong>
          </div>
        </div>

        <div
          className={`meter meter--h ${pot.status === 'over' ? 'meter--over' : ''}`}
          role="img"
          aria-label={`Central pot ${pot.percentUsed.toFixed(0)} percent used`}
        >
          <div className="meter-fill" style={{ width: `${fill}%` }} />
          {overflow > 0 && (
            <div className="meter-overflow" style={{ width: `${Math.min(overflow, 40)}%` }} />
          )}
        </div>

        <PotAlert pot={pot} />
        <p className="hint">~{maxPeopleAtBudget(state.centralBudget)} people at 7,000 LKR each</p>
      </section>

      <section className="teams-grid">
        <div className="section-head">
          <h2>Teams</h2>
          <button type="button" onClick={addTeam}>
            + Team
          </button>
        </div>
        <div className="cards">
          {state.teams.map((t) => {
            const alloc = api.teamAllocation(t.members);
            const share = api.used > 0 ? (alloc / api.used) * 100 : 0;
            return (
              <article key={t.id} className="team-card">
                <input
                  className="team-name"
                  value={t.name}
                  onChange={(e) => renameTeam(t.id, e.target.value)}
                />
                <TeamMemberEditor api={api} teamId={t.id} members={t.members} />
                <p className="team-stats">
                  <strong>{formatLkr(alloc)} LKR</strong> · {api.headcount(t.members)} people
                  <br />
                  <span className="muted">{share.toFixed(0)}% of central used</span>
                </p>
                <button type="button" className="btn-danger" onClick={() => removeTeam(t.id)}>
                  Remove team
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <StateDump api={api} />
    </div>
  );
}
