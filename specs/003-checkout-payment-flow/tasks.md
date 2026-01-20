# Tasks: Checkout & Payment Flow

**Input**: Design documents from `/specs/003-checkout-payment-flow/`  
**Prerequisites**: plan.md ✅, spec.md ✅  
**Tests**: Manual testing only (no automated tests in current codebase)

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `src/` at repository root (Astro static site)
- **Pages**: `src/pages/sewa-kasur/`
- **Components**: `src/components/`
- **Scripts**: `src/scripts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create new files and update config

- [x] T001 [P] Add payment config (BCA/QRIS details) to `src/data/config.json`
- [x] T002 [P] Create checkout session manager in `src/scripts/checkout-session.ts`
- [x] T003 [P] Create reusable CopyButton component in `src/components/CopyButton.astro`

**Checkpoint**: Config and utilities ready

---

## Phase 2: Foundational (Modify Calculator Flow)

**Purpose**: Update calculator to redirect to checkout instead of showing success message

**⚠️ CRITICAL**: This phase implements US4 & US5 - must complete before checkout pages work

### US4: Remove Payment Method from Calculator

- [x] T004 [US4] Remove payment method toggle UI from `src/components/Calculator.astro`
- [x] T005 [US4] Remove payment method state and handlers from `src/scripts/calculator.ts`

### US5: Preserve WA Bot + Redirect to Checkout

- [x] T006 [US5] Modify `handleWhatsAppClick()` in `src/scripts/calculator.ts`:
  - Keep `sendOrderToBot()` call
  - After success: save order to sessionStorage via `checkout-session.ts`
  - Redirect to `/sewa-kasur/checkout` instead of showing success message
  - Keep error handling as-is

**Checkpoint**: Calculator now redirects to /checkout after WA bot success

---

## Phase 3: Core Checkout Components

**Purpose**: Create shared components for checkout page

- [x] T007 [P] Create CheckoutSummary component in `src/components/CheckoutSummary.astro`
  - Display: nama, alamat, produk list, durasi, tanggal, subtotal, ongkir, total
  - "Edit Pesanan" button → `/sewa-kasur/cart`
- [x] T008 [P] Create PaymentMethodBCA component in `src/components/PaymentMethodBCA.astro`
  - Bank: BCA, Nama: Muthia Rahma Syamila, Norek: 0374668427
  - CopyButton for norek and nominal
- [x] T009 [P] Create PaymentMethodQRIS component in `src/components/PaymentMethodQRIS.astro`
  - Display QRIS image from `/images/qris-santi-living.jpg`
  - CopyButton for nominal
  - Download button (anchor with download attribute)

**Checkpoint**: All payment components ready

---

## Phase 4: User Story 1 & 2 - Checkout Page (Priority: P1) 🎯 MVP

**Goal**: Multi-step checkout page with BCA transfer and QRIS payment options

**Independent Test**: Navigate to `/sewa-kasur/checkout` with order in sessionStorage, select payment method, complete checkout

### Implementation

- [x] T010 Create checkout page in `src/pages/sewa-kasur/checkout.astro`

  - Import CheckoutSummary, PaymentMethodBCA, PaymentMethodQRIS
  - Layout: Step 1 (summary + method selection), Step 2 (payment instructions + confirm)
  - Client-side script loads order from sessionStorage
  - Redirect to `/sewa-kasur` if no order data

- [x] T011 [US1] [US2] Create checkout logic in `src/scripts/checkout.ts`

  - Multi-step state management (step 1 ↔ step 2)
  - Payment method selection handler
  - Copy-to-clipboard functions using Clipboard API
  - "Konfirmasi Metode Pembayaran" → switch to step 2
  - "Konfirmasi Pembayaran" → redirect to thank-you + open wa.me

- [x] T012 Add checkout page styles to `src/styles/index.css`
  - `.checkout-container`, `.checkout-step`, `.checkout-summary`
  - `.payment-method-card`, `.payment-details`
  - `.copy-button`, `.copy-success` states
  - Mobile-first (375px), touch targets ≥44px

**Checkpoint**: Checkout page fully functional with BCA and QRIS

---

## Phase 5: User Story 3 - Thank You Page (Priority: P2)

**Goal**: Confirmation page after payment with link to reopen WhatsApp

**Independent Test**: Navigate to `/sewa-kasur/thank-you`, verify confirmation message and WA reopen link

### Implementation

- [x] T013 Create thank-you page in `src/pages/sewa-kasur/thank-you.astro`

  - Confirmation message: "Pesanan sedang diproses"
  - Instructions: "Silakan kirim bukti pembayaran via WhatsApp"
  - Button "Buka WhatsApp" → wa.me with pre-filled message
  - Clear sessionStorage on page load
  - Link kembali ke halaman utama

- [x] T014 Add thank-you page styles to `src/styles/index.css`
  - `.thank-you-container`, `.success-icon`, `.confirmation-text`
  - `.wa-reopen-button`

**Checkpoint**: Thank you page complete

---

## Phase 6: User Story 3 - Cart Page / Edit Order (Priority: P2)

**Goal**: Cart page with prefilled data from sessionStorage for order editing

**Independent Test**: Navigate to `/sewa-kasur/cart` with order in sessionStorage, verify all fields prefilled

### Implementation

- [x] T015 Create cart page in `src/pages/sewa-kasur/cart.astro`

  - Same layout as index.astro calculator section
  - Import Calculator component

- [x] T016 Modify Calculator component to support prefilled mode
  - Add prop `prefillFromSession?: boolean`
  - If true: load order from sessionStorage and prefill all fields
  - Update `src/components/Calculator.astro`
  - Update `src/scripts/calculator.ts` with `loadFromSession()` function

**Checkpoint**: Cart page with prefilled data complete

---

## Phase 7: Polish & Integration Testing

**Purpose**: Final integration, mobile testing, and cleanup

- [ ] T017 Manual integration test: Complete flow from calculator → checkout → thank-you
- [ ] T018 Manual mobile test: All pages at 375px viewport, touch targets ≥44px
- [ ] T019 Browser compatibility: Test on Chrome, Safari, Firefox
- [ ] T020 Edge case: Access /checkout direct without sessionStorage data
- [ ] T021 Edge case: Access /thank-you direct
- [ ] T022 [P] Update StickyWhatsApp component if needed for consistency

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on T002 (checkout-session.ts) from Phase 1
- **Phase 3 (Components)**: Depends on T003 (CopyButton) from Phase 1
- **Phase 4 (Checkout)**: Depends on Phase 2 + Phase 3
- **Phase 5 (Thank You)**: Can run parallel with Phase 4 after Phase 2
- **Phase 6 (Cart)**: Depends on Phase 2
- **Phase 7 (Polish)**: Depends on all previous phases

### User Story Dependencies

| Story                   | Depends On        | Can Parallel With |
| ----------------------- | ----------------- | ----------------- |
| US4 (Remove Payment)    | T002              | US5               |
| US5 (WA Bot + Redirect) | T002              | US4               |
| US1 (BCA Checkout)      | US4, US5, Phase 3 | US2               |
| US2 (QRIS Checkout)     | US4, US5, Phase 3 | US1               |
| US3 (Summary/Cart)      | US4, US5          | US1, US2          |

### Parallel Opportunities

```bash
# Phase 1 - All parallel:
T001: Add payment config (config.json)
T002: Create checkout-session.ts
T003: Create CopyButton.astro

# Phase 2 - Calculator changes (sequential within, but T004-T005 parallel with each other):
T004: Remove payment UI (Calculator.astro)
T005: Remove payment state (calculator.ts)

# Phase 3 - All parallel:
T007: CheckoutSummary.astro
T008: PaymentMethodBCA.astro
T009: PaymentMethodQRIS.astro

# Phase 4-6 - Checkout, Thank You, Cart can run in parallel after Phase 2:
Developer A: T010-T012 (Checkout page)
Developer B: T013-T014 (Thank you page)
Developer C: T015-T016 (Cart page)
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T006)
3. Complete Phase 3: Components (T007-T009)
4. Complete Phase 4: Checkout Page (T010-T012)
5. **STOP and VALIDATE**: Test checkout flow
6. Deploy if ready

### Full Feature

1. Complete MVP above
2. Add Phase 5: Thank You Page (T013-T014)
3. Add Phase 6: Cart Page (T015-T016)
4. Complete Phase 7: Polish (T017-T022)

---

## Task Summary

| Phase                       | Task Count | Purpose                  |
| --------------------------- | ---------- | ------------------------ |
| Phase 1: Setup              | 3          | Config, utilities        |
| Phase 2: Foundational       | 3          | Calculator redirect flow |
| Phase 3: Components         | 3          | Checkout UI components   |
| Phase 4: Checkout (US1+US2) | 3          | Main checkout page       |
| Phase 5: Thank You (US3)    | 2          | Confirmation page        |
| Phase 6: Cart (US3)         | 2          | Edit order page          |
| Phase 7: Polish             | 6          | Testing, cleanup         |
| **Total**                   | **22**     |                          |

---

## Notes

- No automated tests (manual testing per verification plan in plan.md)
- All pages must be mobile-first (375px viewport)
- Touch targets minimum 44px
- sessionStorage for data persistence (clears on session end)
- Commit after each task or logical group
