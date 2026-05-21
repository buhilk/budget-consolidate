# Restore point — budget-consolidate

| Field | Value |
|-------|--------|
| **Created** | 2026-05-21T10:34:33Z |
| **Project** | `budget-consolidate` |
| **Phase** | Requirements fenced — **no app code yet** |
| **Stack decision** | Vite + React (discussed; not scaffolded) |

## Status at this point

- **Done:** Product spec, README, allocation rules, central-pot UX (warn-only, 98% near-limit, visualization).
- **Not done:** Vite scaffold, UI implementation, persistence, tests.

## Locked decisions (quick reference)

| Topic | Decision |
|-------|----------|
| Allocation | `team_budget = team_headcount × 7_000 LKR` |
| Consumption | Allocation-only (no expense ledger) |
| Central used | Sum of all team allocations |
| Enforcement | Warn only — never block edits |
| Near-limit | **≥ 98%** of central budget used (`X/Y`), while `X ≤ Y` |
| Full pot | **100% allocation (`X = Y`) is OK** — not danger |
| Over budget | `X > Y` — danger alert + overflow on meter |
| Visibility | Transparent (all teams see central totals) |
| MVP screens | Central pot strip, per-team members, optional overview table |

## Formulas

```
allocation(team)     = headcount(team) × 7_000
central_used (X)     = Σ allocation(team)
central_budget (Y)   = organizer-set total LKR
central_remaining (Z)  = Y - X
overage (W)          = X - Y   (when X > Y)
near_limit             = X/Y >= 0.98 && X <= Y
within               = X/Y < 0.98
over                 = X > Y
```

## Files in this restore point

| Path | Role |
|------|------|
| `../PRODUCT.md` | Full product spec (source of truth) |
| `../README.md` | Short project summary |
| `restore-point-2026-05-21.md` | This file |
| `PRODUCT.md` | Snapshot copy of spec at restore time |
| `README.md` | Snapshot copy of readme at restore time |

## How to restore

1. Compare current `PRODUCT.md` / `README.md` with snapshots in this folder.
2. To roll back docs: `cp backup/PRODUCT.md ../PRODUCT.md` and `cp backup/README.md ../README.md`
3. Re-read **Locked decisions** above before continuing implementation.

## Conversation context (for agents / future you)

- App consolidates a **team outing budget** across multiple teams against one **central pot**.
- Each team enters **member names**; headcount drives budget at **7k LKR/person**.
- UI must show per-team budget and central consumption with a **visual central pot meter** and **labeled alerts** (within / near 98% / over).
- User chose **warn** over **block** when over cap.
- **Vite** favored over Next for dashboard-style internal prototype unless backend/SEO needed later.

---

## Snapshot: PRODUCT.md

```markdown
# Team outing budget — product spec (v1)

## Purpose

Consolidate a **single central outing budget** across **multiple teams**. Teams enter attendee names; the app shows **each team’s allocated budget** and **how much of the central pool is used**.

## Locked rules

### (A) Per-team allocation (allocation-only)

- **Currency:** LKR  
- **Per person rate:** **7,000 LKR** per attendee  
- **Team allocation:**

  \[
    \textbf{allocation(team)} = \textbf{team\_headcount} \times 7{,}000 \ \text{LKR}
  \]

- **Headcount** = number of entered member names (non-empty rows) for that team.

### (B) What “consumption” means

- **Allocation-only:** there is no separate “spend” ledger.  
- **Central used** = sum of all teams’ **allocations** (not expenses).

### Central cap & pot math

- **Central budget (**Y**):** one positive amount (LKR); the **planned** size of the pot.
- **Central used (**X**):** sum of all team allocations (`Σ allocation(team)`).

  \[
    \textbf{central\_remaining} = \textbf{central\_budget} - \textbf{central\_used}
  \]

- **Over-allocation:** when \(X > Y\), show **overage** \(W = X - Y\) (still allow edits).

- **Capacity hint** (reference only): approximate max people who fit exactly at **7,000 LKR**/person:

  \[
    \bigg\lfloor \frac{\textbf{central\_budget}}{7{,}000} \bigg\rfloor
  \]

### Enforcement: warn only (no blocking)

- **Do not block** adding or removing members. All edits apply immediately.
- **Alerts** must use clear, consistent **labels** and severity:
  - **Within budget** (**X/Y < 98%**) — neutral/success copy, e.g. “Central pot: **X** LKR used of **Y** LKR (**Z** LKR left).”
  - **Near limit** (**98% ≤ X/Y** and **still** \(X \le Y\)) — **warning** (informational — **full allocation \(X=Y\) is expected and acceptable**): e.g. “Most of the pot is allocated — only **Z** LKR remains,” or when **Z = 0** use calm copy such as “Central pot fully allocated (**X / Y** LKR — no slack left before overage).”
  - **Over budget** (\(X > Y\)) — **danger**, e.g. “Over central budget by **W** LKR — reduce attendees or raise the central pot.”  
  Alerts must not rely on color alone; expose text and use an accessible live region (`role="alert"` or `aria-live` as appropriate).

### Central pot visualization (required)

Persist a **central pot** control that complements the numbers:

- **Primary:** horizontal **stack / meter**: **Used** vs **Remaining** relative to **Y**.
- **Within budget:** filled segment = \(X\); remainder shows unused pot; label **percent used** \((X / Y × 100%)\). When **X = Y** (100% allocated), the fill may reach the end with **success/neutral** or **near-limit** messaging per above — **never** the over-budget (danger) treatment.
- **Over budget:** show **overflow** visually (segment past “full”, different pattern/color, dashed extension) plus numeric **overage** **W** LKR.
- Always adjoin **labeled figures:** **Central budget (**Y**)**, **Used (**X**)**, and either **Remaining** or **Over by**.
- **LKR**: show on first prominent amount or header; shorten consistently where space is tight.

Teams may change over time until you add a “frozen” cutoff.

## Actors / visibility

*Default MVP:* **transparent summary** — every team sees the same central totals and optionally a small table of all teams’ allocations. (Restrict per-team visibility later if needed.)

## Data (conceptual)

- **CentralBudget:** total LKR amount (single number).
- **Team:** label + ordered list of **Member** display names.

## Screens (minimal)

1. **Central pot strip:** editable **central budget**; numeric **Used / Remaining / Over**; **alert** by state (within / near / over); **visual meter** as above.
2. **Per team:** add/remove names; live **allocation = headcount × 7,000**; optionally a small secondary line **“This team’s share of central used: allocation / central_used”.**
3. **Optional:** overview table — team | headcount | allocation | % of central used (`allocation / central_used`).

## Out of scope (v1)

- Expenses / receipts  
- Roles, auth, multi-device sync (unless added later)

## Acceptance

- Editing members updates headcounts and allocations immediately.
- Totals reconcile: sum of displayed team allocations equals **Central used.**
- **Never block** edits; **over-cap** surfaces via **labeled alerts** and **distinct overflow visualization** on the central pot meter.
- **Near-limit** threshold is pinned at **usage ≥ 98%** of central budget (**X/Y**) while \(X \le Y\); **100% utilization is acceptable** and must not surface as danger (that state is success-with-zero-slack unless copy above uses the calm variant).
```

---

## Snapshot: README.md

```markdown
# Budget consolidate

Small web app prototype: consolidate one **central outing budget** across teams using **allocation-only** math.

**Rules (v1):** each attendee allocates **7,000 LKR** from the central pool; a team’s budget is `headcount × 7,000 LKR`. **Fully using** the central pot is OK; amber **near-limit from 98%** usage onward; **over** the pot is danger. Alerts + visual **central pot** meter ([PRODUCT.md](./PRODUCT.md)).
```
