# Implementation Plan: Checkout & Payment Flow

**Branch**: `003-checkout-payment-flow` | **Date**: 2026-01-10 | **Spec**: [spec.md](file:///Users/wecik/Documents/Offline/Professional/Coding/santi-living/specs/003-checkout-payment-flow/spec.md)  
**Input**: Feature specification from `/specs/003-checkout-payment-flow/spec.md`

## Summary

Menambahkan halaman `/checkout` dengan multi-step UI (Step 1: Summary + Pilih Metode, Step 2: Instruksi Bayar) dan halaman `/thank-you`. Mengubah flow dari "success message in-place" menjadi "redirect ke checkout" setelah WA bot terkirim. Menambahkan halaman `/cart` dengan data prefilled untuk edit order.

**Pendekatan Teknis:**

- Semua halaman menggunakan Astro static pages + client-side JavaScript
- Data order disimpan di sessionStorage
- Tidak ada backend baru (existing `sendOrderToBot()` dipertahankan)
- Copy-to-clipboard menggunakan Clipboard API
- QRIS download menggunakan native download link

## Technical Context

**Language/Version**: TypeScript 5.x, Astro 4.x  
**Primary Dependencies**: Astro, Vanilla CSS, sessionStorage API, Clipboard API  
**Storage**: sessionStorage (client-side only)  
**Testing**: Manual browser testing (no automated tests in current codebase)  
**Target Platform**: Web (Mobile-first, 375px+)  
**Project Type**: Static site with client interactivity  
**Performance Goals**: < 2 detik load time  
**Constraints**: No backend database, static hosting (Vercel)  
**Scale/Scope**: Single tenant, MVP

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                  | Status  | Notes                                               |
| -------------------------- | ------- | --------------------------------------------------- |
| I. Mobile-First            | ✅ PASS | All new pages will be designed mobile-first (375px) |
| II. One Intent, One Page   | ✅ PASS | Checkout = single page multi-step, clear purpose    |
| III. Zero Cognitive Load   | ✅ PASS | Copy buttons, simple steps, minimal inputs          |
| IV. WhatsApp as Final Gate | ✅ PASS | Flow ends with wa.me for bukti bayar                |

**Scope Check:**

- ❌ Payment gateway: NOT included (aligned with constitution)
- ❌ Login user: NOT included (aligned with constitution)
- ✅ WhatsApp auto-compose: Preserved
- ✅ Kalkulator: Preserved, payment method removed

**No violations detected. Proceeding to implementation.**

## Project Structure

### Documentation (this feature)

```text
specs/003-checkout-payment-flow/
├── spec.md              # Feature specification ✅
├── plan.md              # This file ✅
├── research.md          # Not needed (no unknowns)
├── data-model.md        # Not needed (no new entities)
└── checklists/
    └── requirements.md  # Validation checklist ✅
```

### Source Code (repository root)

```text
src/
├── pages/
│   └── sewa-kasur/
│       ├── index.astro      # [MODIFY] Update WhatsApp button flow
│       ├── checkout.astro   # [NEW] Multi-step checkout page
│       ├── thank-you.astro  # [NEW] Thank you page
│       └── cart.astro       # [NEW] Cart page with prefilled data
├── components/
│   ├── Calculator.astro     # [MODIFY] Remove payment method section
│   ├── CheckoutSummary.astro    # [NEW] Order summary component
│   ├── PaymentMethodBCA.astro   # [NEW] BCA transfer details
│   ├── PaymentMethodQRIS.astro  # [NEW] QRIS with download
│   └── CopyButton.astro         # [NEW] Reusable copy-to-clipboard button
├── scripts/
│   ├── calculator.ts        # [MODIFY] Redirect to /checkout after order
│   ├── checkout.ts          # [NEW] Multi-step UI logic, copy functions
│   └── checkout-session.ts  # [NEW] sessionStorage manager
├── styles/
│   └── index.css            # [MODIFY] Add checkout page styles
└── data/
    └── config.json          # [MODIFY] Add BCA account details
```

## Proposed Changes

### 1. Calculator Changes

#### [MODIFY] [calculator.ts](file:///Users/wecik/Documents/Offline/Professional/Coding/santi-living/src/scripts/calculator.ts)

- Hapus `paymentMethod` dari state dan UI handling
- Setelah `sendOrderToBot()` sukses, simpan order ke sessionStorage via `checkout-session.ts`
- Redirect ke `/sewa-kasur/checkout` via `window.location.href`

#### [MODIFY] [Calculator.astro](file:///Users/wecik/Documents/Offline/Professional/Coding/santi-living/src/components/Calculator.astro)

- Hapus section `.payment-options` dari HTML

---

### 2. Checkout Session Manager

#### [NEW] checkout-session.ts

```typescript
// Key: 'santi-living-checkout'
// Methods: saveOrder(), getOrder(), clearOrder()
// Data: OrderPayload + selectedPaymentMethod
```

---

### 3. Checkout Page (Multi-step)

#### [NEW] checkout.astro

- Import CheckoutSummary, PaymentMethodBCA, PaymentMethodQRIS
- Step 1: Summary + method selection buttons
- Step 2: Payment instructions based on selected method
- Load order dari sessionStorage, redirect jika kosong

#### [NEW] checkout.ts

- Multi-step state management
- Copy-to-clipboard functions
- QRIS download trigger
- Final confirmation → redirect to thank-you + open wa.me

---

### 4. Payment Components

#### [NEW] CheckoutSummary.astro

- Display: nama, alamat, daftar produk, durasi, tanggal, subtotal, ongkir, total
- Tombol "Edit Pesanan" → `/sewa-kasur/cart`

#### [NEW] PaymentMethodBCA.astro

- Rekening: 0374668427 (Muthia Rahma Syamila)
- Nominal dari order total
- CopyButton untuk norek dan nominal

#### [NEW] PaymentMethodQRIS.astro

- Display QRIS image
- Nominal dengan CopyButton
- Download button (native anchor download)

#### [NEW] CopyButton.astro

- Reusable component
- Props: value, label
- Visual feedback on copy success

---

### 5. Thank You Page

#### [NEW] thank-you.astro

- Konfirmasi pesanan sedang diproses
- Link reopen WhatsApp jika tab tertutup
- Clear sessionStorage on load

---

### 6. Cart Page (Edit Order)

#### [NEW] cart.astro

- Same layout as Calculator section
- Load data dari sessionStorage
- Prefill all fields (products, quantities, dates, customer info)
- Tombol submit → same flow as kalkulator

---

### 7. Config Updates

#### [MODIFY] [config.json](file:///Users/wecik/Documents/Offline/Professional/Coding/santi-living/src/data/config.json)

```json
{
  "payment": {
    "bca": {
      "bank": "BCA",
      "accountName": "Muthia Rahma Syamila",
      "accountNumber": "0374668427"
    },
    "qris": {
      "merchantName": "SANTI LIVING",
      "nmid": "ID1026471796650",
      "imagePath": "/images/qris-santi-living.jpg"
    }
  }
}
```

---

### 8. Assets

- Copy QRIS image from spec assets to `/public/images/qris-santi-living.jpg`

## Verification Plan

### Manual Testing

Since there are no automated tests in the current codebase, we'll verify manually:

**Test 1: Calculator → Checkout Flow**

1. Buka http://localhost:4321/sewa-kasur/#calculator
2. Pilih 1x Paket Double, durasi 3 hari, isi nama/alamat/WA
3. Klik "Pesan via WhatsApp"
4. **Expected**:
   - Loading state muncul
   - Setelah sukses, redirect ke `/sewa-kasur/checkout`
   - Summary order tampil dengan data yang benar

**Test 2: Checkout - BCA Payment**

1. Di halaman checkout, klik "Transfer BCA"
2. **Expected**:
   - No. rek 0374668427 tampil
   - Nama: Muthia Rahma Syamila
   - Nominal sesuai total order
3. Klik copy norek, paste di notepad
4. **Expected**: "0374668427" ter-copy
5. Klik copy nominal, paste di notepad
6. **Expected**: nominal ter-copy (e.g., "150000")
7. Klik "Konfirmasi Metode Pembayaran"
8. **Expected**: UI berubah ke step instruksi bayar
9. Klik "Konfirmasi Pembayaran"
10. **Expected**:
    - Redirect ke `/sewa-kasur/thank-you`
    - Tab baru terbuka ke wa.me dengan pesan pre-filled

**Test 3: Checkout - QRIS Payment**

1. Di halaman checkout, klik "QRIS"
2. **Expected**: Gambar QRIS tampil, nominal tampil
3. Klik copy nominal
4. **Expected**: nominal ter-copy
5. Klik "Download QRIS"
6. **Expected**: Gambar QRIS terdownload
7. Klik "Konfirmasi Metode Pembayaran" → "Konfirmasi Pembayaran"
8. **Expected**: Same as BCA test step 10

**Test 4: Edit Order Flow**

1. Di halaman checkout, klik "Edit Pesanan"
2. **Expected**: Redirect ke `/sewa-kasur/cart`
3. **Expected**: Semua field prefilled dengan data sebelumnya
4. Ubah quantity, klik submit
5. **Expected**: WA bot terkirim ulang, redirect ke checkout dengan data baru

**Test 5: Direct Access Guard**

1. Clear sessionStorage (`sessionStorage.clear()` di console)
2. Akses langsung http://localhost:4321/sewa-kasur/checkout
3. **Expected**: Redirect ke `/sewa-kasur` dengan pesan/toast

**Test 6: Thank You Page**

1. Complete checkout flow
2. Di thank-you page, klik link "Buka WhatsApp"
3. **Expected**: wa.me terbuka dengan pesan yang sama

**Test 7: Mobile Responsiveness**

1. Buka DevTools → Toggle device toolbar → iPhone SE
2. Lakukan test 1-6 di mobile viewport
3. **Expected**: Semua touch targets ≥44px, layout tidak broken

### Browser Compatibility

Test di:

- Chrome (desktop + mobile)
- Safari (iOS)
- Firefox

## Complexity Tracking

> No violations detected. All changes align with constitution.

| Aspect               | Decision | Rationale                                            |
| -------------------- | -------- | ---------------------------------------------------- |
| No new backend       | ✅       | Sesuai constitution Phase 1, order < 5/hari          |
| sessionStorage       | ✅       | Simple, no persistence needed, clears on session end |
| Single checkout page | ✅       | Zero cognitive load, no multi-page confusion         |
