---
trigger: model_decision
---

<!--
  ============================================================================
  MEMORY SYNC REPORT
  ============================================================================
  Version: 1.0.1
  Last Updated: 2026-01-25

  Changes:
  - Added decision: Use `other_qris` for Midtrans Snap
  - Initial memory creation with first decision entry
  ============================================================================
-->

# Santi Living - Project Memory

> Key decisions, known issues, and frequently used patterns for AI agents.

## Key Decisions Log

### [2026-01-08] Always Commit After Changes

**Decision**: Selalu commit setelah perubahan dilakukan.
**Rationale**: Memastikan perubahan tersimpan di version control secara berkala, mencegah kehilangan pekerjaan, dan memudahkan rollback jika diperlukan.
**Reference**: N/A (operational workflow)

### [2026-01-25] Use `other_qris` for Midtrans Snap QRIS

**Decision**: When offering a direct QRIS payment button via Midtrans Snap, use `enabled_payments: ["other_qris"]` instead of `["qris"]` or `["gopay"]`.
**Rationale**: The generic `qris` channel in Snap often throws "No payment channels available" if not explicitly enabled, even if the merchant has "GoPay Dynamic QRIS" active. `other_qris` maps correctly to the generic QRIS display without forcing specific UI modes, providing a cleaner integration.
**Reference**: Midtrans Documentation (Snap API)

---

## Known Issues

| Issue                    | Status | Workaround |
| ------------------------ | ------ | ---------- |
| _No issues recorded yet_ | -      | -          |

---

## Frequently Used Patterns

_No patterns recorded yet._

---

## Quick Reference

### Development Commands

```bash
# Frontend
npm run dev      # Start Astro dev server (localhost:4321)
npm run build    # Build for production

# Bot Service
cd apps/bot-service
npm run dev      # Start with nodemon + ts-node
```

### Key Files

- `.agent/rules/constitution.md` - Project principles
- `src/scripts/calculator.ts` - Main business logic
- `src/data/products.json` - Product catalog
