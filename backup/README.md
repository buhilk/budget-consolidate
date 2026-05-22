# Budget consolidate

Small web app prototype: consolidate one **central outing budget** across teams using **allocation-only** math.

**Rules (v1):** each attendee allocates **7,000 LKR** from the central pool; a team’s budget is `headcount × 7,000 LKR`. **Fully using** the central pot is OK; amber **near-limit from 98%** usage onward; **over** the pot is danger. Alerts + visual **central pot** meter ([PRODUCT.md](./PRODUCT.md)).

## Prototype (throwaway UI)

```bash
cd prototype/ui && npm run prototype
```

**Design winner: Variant A (Hero pot).** See [prototype/NOTES.md](./prototype/NOTES.md).
