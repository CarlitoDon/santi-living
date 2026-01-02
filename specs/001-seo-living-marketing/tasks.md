# Tasks: Santi Living - Website Sewa Kasur Jogja

**Input**: Design documents from `/specs/001-seo-living-marketing/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Astro project and configure development environment

- [ ] T001 Create Astro project with `npm create astro@latest ./ -- --template minimal --typescript strict`
- [ ] T002 Configure astro.config.mjs with site URL and integrations
- [ ] T003 [P] Setup TypeScript configuration in tsconfig.json
- [ ] T004 [P] Create base CSS design system in src/styles/global.css with CSS custom properties
- [ ] T005 [P] Create utility CSS classes in src/styles/utilities.css
- [ ] T006 Create MainLayout component in src/layouts/MainLayout.astro with meta tags, SEO, and structure

**Checkpoint**: Project runs with `npm run dev`, empty page loads

---

## Phase 2: Foundational (Static Data & Shared Components)

**Purpose**: Create static data files and reusable components that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create products data file in src/data/products.json with mattress types and prices
- [ ] T008 [P] Create areas data file in src/data/areas.json with Jogja service areas
- [ ] T009 [P] Create testimonials data file in src/data/testimonials.json with sample reviews
- [ ] T010 [P] Create business config in src/data/config.json with WhatsApp number and settings
- [ ] T011 Create TypeScript types in src/types/index.ts matching data-model.md entities
- [ ] T012 [P] Add Google Fonts (Inter) to MainLayout
- [ ] T013 [P] Create favicon and add to public/favicon.ico
- [ ] T014 Create robots.txt in public/robots.txt

**Checkpoint**: Foundation ready - all static data accessible, layout renders correctly

---

## Phase 3: User Story 1 - Menghitung Harga dan Pesan via WhatsApp (Priority: P1) 🎯 MVP

**Goal**: User can calculate rental price and send pre-filled WhatsApp message

**Independent Test**: Access landing page → fill calculator → click WhatsApp button → verify pre-filled message opens

### Implementation for User Story 1

**Landing Page Structure**

- [ ] T015 [US1] Create index page structure in src/pages/index.astro with all section placeholders
- [ ] T016 [P] [US1] Create Hero component in src/components/Hero.astro with headline and CTA

**Price Display**

- [ ] T017 [P] [US1] Create PriceCard component in src/components/PriceCard.astro for single mattress type
- [ ] T018 [US1] Create PriceList component in src/components/PriceList.astro displaying all mattress types

**Calculator (Critical)**

- [ ] T019 [P] [US1] Create calculator styles in src/styles/components/calculator.css
- [ ] T020 [US1] Create Calculator component in src/components/Calculator.astro with form UI
- [ ] T021 [US1] Implement calculator logic in src/scripts/calculator.ts with real-time price calculation and delivery estimate ("Bisa antar hari ini" if before 15:00, else "Antar besok pagi")
- [ ] T022 [US1] Add input validation in calculator: no past dates, quantity 1-10, duration 1-30 days with inline error messages

**Booking Form**

- [ ] T023 [P] [US1] Create form styles in src/styles/components/form.css with inline error states
- [ ] T024 [US1] Create BookingForm component in src/components/BookingForm.astro with name, WA, address fields
- [ ] T025 [US1] Implement form validation in src/scripts/form-validation.ts (WA format, required fields with inline errors)

**WhatsApp Integration**

- [ ] T026 [US1] Implement WhatsApp message composer in src/scripts/whatsapp-compose.ts with wa.me URL
- [ ] T027 [US1] Create WhatsAppButton component in src/components/WhatsAppButton.astro with fallback display (show copyable WA number if link fails)
- [ ] T028 [US1] Create StickyWhatsApp component in src/components/StickyWhatsApp.astro for mobile sticky CTA
- [ ] T029 [US1] Integrate calculator, form, and WhatsApp button in index.astro following constitution page structure

**Checkpoint**: User Story 1 complete - calculator works, WhatsApp message opens with correct data

---

## Phase 4: User Story 2 - Membangun Kepercayaan (Priority: P2)

**Goal**: User sees trust signals (real photos, service areas, testimonials) that increase confidence

**Independent Test**: Scroll landing page → verify real product photos, area list, and 3+ testimonials visible

### Implementation for User Story 2

- [ ] T030 [P] [US2] Add placeholder product images to src/assets/images/ (800x600px WebP format, to be replaced with real photos)
- [ ] T031 [US2] Update PriceCard to display product images
- [ ] T032 [P] [US2] Create ServiceArea component in src/components/ServiceArea.astro with Jogja districts
- [ ] T033 [P] [US2] Create TestimonialCard component in src/components/TestimonialCard.astro
- [ ] T034 [US2] Create Testimonials component in src/components/Testimonials.astro displaying 3 reviews
- [ ] T035 [US2] Add trust sections to index.astro (service area + testimonials)

**Checkpoint**: User Story 2 complete - trust signals visible on landing page

---

## Phase 5: User Story 3 - Memahami Cara Sewa (Priority: P2)

**Goal**: User understands the 3-step rental process clearly

**Independent Test**: Scroll to "Cara Sewa" section → see 3 clear steps with icons

### Implementation for User Story 3

- [ ] T036 [P] [US3] Create step icons or use emoji/SVG in src/assets/
- [ ] T037 [US3] Create HowToRent component in src/components/HowToRent.astro with 3 steps
- [ ] T038 [US3] Add HowToRent section to index.astro between calculator and service area

**Checkpoint**: User Story 3 complete - rental process clearly explained

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: SEO, performance optimization, responsive refinements

**SEO & Metadata**

- [ ] T039 [P] Add structured data (LocalBusiness + Product schema) to MainLayout
- [ ] T040 [P] Create sitemap.xml in public/sitemap.xml
- [ ] T041 Update meta title and description for SEO in MainLayout

**Performance**

- [ ] T042 [P] Optimize all images using Astro Image component
- [ ] T043 [P] Add loading="lazy" to below-fold images
- [ ] T044 Audit and minimize CSS bundle size

**Mobile Refinements**

- [ ] T045 [P] Add responsive breakpoints to all components (min-width: 320px, 640px, 768px, 1024px)
- [ ] T046 Verify touch targets >= 44x44px on all interactive elements
- [ ] T047 Test and fix sticky WhatsApp button on various mobile devices

**Final Validation**

- [ ] T048 Run Lighthouse audit and fix any issues (target: LCP < 2.5s, 90+ all categories)
- [ ] T049 Test full conversion flow on mobile device
- [ ] T050 Verify WhatsApp fallback works when app not installed (wa.me → web.whatsapp.com → copy number)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (BLOCKS all user stories)
    ↓
┌───────────────────────────────────────────────┐
│  User Stories can proceed in priority order:  │
│  Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3)│
│  OR in parallel if multiple developers        │
└───────────────────────────────────────────────┘
    ↓
Phase 6: Polish
```

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 only - **CAN BE DEPLOYED AS MVP**
- **User Story 2 (P2)**: Depends on Phase 2 + some US1 components (PriceCard)
- **User Story 3 (P3)**: Depends on Phase 2 only - independent of US1/US2

### Within Each Phase

- Tasks marked [P] can run in parallel
- Non-[P] tasks must run sequentially in order
- Complete Phase 2 before starting any US phase

---

## Parallel Execution Examples

### Phase 1: Setup (Parallel Group)

```
# Can run in parallel:
T003: Setup TypeScript configuration
T004: Create base CSS design system
T005: Create utility CSS classes
```

### Phase 2: Foundational (Parallel Group)

```
# Can run in parallel:
T008: Create areas data file
T009: Create testimonials data file
T010: Create business config
T012: Add Google Fonts
T013: Create favicon
```

### Phase 3: User Story 1 (Parallel Group)

```
# Can run in parallel:
T016: Create Hero component
T017: Create PriceCard component
T019: Create calculator styles
T023: Create form styles
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) ⭐ RECOMMENDED

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test calculator → WhatsApp flow
5. **Deploy to Vercel** - MVP is live!
6. Continue with Phase 4, 5, 6 iteratively

### Incremental Delivery

| Milestone     | What's Delivered      | Value                     |
| ------------- | --------------------- | ------------------------- |
| After Phase 3 | Calculator + WhatsApp | **Core conversion works** |
| After Phase 4 | + Trust signals       | Higher conversion rate    |
| After Phase 5 | + How to rent         | Fewer CS questions        |
| After Phase 6 | + SEO + Performance   | Better rankings           |

---

## Task Summary

| Phase                 | Tasks        | Parallel Opportunities |
| --------------------- | ------------ | ---------------------- |
| Phase 1: Setup        | 6 tasks      | 3 parallel             |
| Phase 2: Foundational | 8 tasks      | 5 parallel             |
| Phase 3: US1 (MVP)    | 15 tasks     | 5 parallel             |
| Phase 4: US2          | 6 tasks      | 3 parallel             |
| Phase 5: US3          | 3 tasks      | 1 parallel             |
| Phase 6: Polish       | 12 tasks     | 6 parallel             |
| **Total**             | **50 tasks** | **23 parallelizable**  |

---

## Notes

- [P] tasks = different files, no dependencies
- [US#] label maps task to specific user story
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **MVP = Phase 1 + Phase 2 + Phase 3 (User Story 1)** = 29 tasks
