# Budget consolidate

Consolidate one **central outing budget** across teams. Each attendee allocates **7,000 LKR**; team budget = `headcount × 7,000 LKR`. See [PRODUCT.md](./PRODUCT.md).

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

State is stored in **`data/state.json`** (loaded on open, auto-saved after edits). Copy `data/state.example.json` to reset a template.

## Layout

**Hero pot** (promoted from prototype Variant A): central meter and alerts on top, team cards below.

## Spec & history

- [PRODUCT.md](./PRODUCT.md) — rules (98% near-limit, warn-only overage, central pot meter)
- [prototype/NOTES.md](./prototype/NOTES.md) — UI prototype verdict (Variant A)
