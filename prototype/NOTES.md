# Prototype — budget consolidate UI

## Branch

**UI** (sub-shape B: throwaway route at `/prototype/ui`).

## Question

> Which layout best supports a simple team outing budget UI: central pot + per-team member entry + transparent totals — while making 98% near-limit and overage obvious?

Three structurally different variants on one route, switchable via `?variant=A|B|C`.

## Status

**Promoted to production** at repo root (`npm run dev`). Variants B/C and the switcher were removed. This folder keeps the verdict only.

## Variants


| Key | Name        | Idea                                                      |
| --- | ----------- | --------------------------------------------------------- |
| A   | Hero pot    | Full-width central meter on top; team cards below         |
| B   | Sidebar pot | Vertical gauge + figures in left rail; teams on the right |
| C   | Table first | Overview table is primary; compact pot strip in header    |


## Verdict

**Winner: A — Hero pot** (2026-05-21)

- **Layout:** Full-width central pot strip on top (meter, labeled figures, alerts); team cards in a grid below with inline member entry.
- **Why:** Central budget is the primary mental model; the hero meter makes 98% near-limit and overage obvious at a glance without splitting attention to a sidebar or table.
- **Folded into production:** `src/App.tsx` + `src/budget.ts` at repo root (2026-05-21).
- **Not taking from B/C:** Sidebar rail (B); table-first overview as primary (C) — optional overview table from C can be added later if needed.