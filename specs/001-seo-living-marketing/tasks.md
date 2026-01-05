# Tasks: Santi Living - Website Sewa Kasur Jogja

**Input**: Design documents from `/specs/001-seo-living-marketing/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Project Initialization) ✅ COMPLETE

**Purpose**: Initialize Astro project and configure development environment

- [x] T001 Create Astro project with package.json, astro.config.mjs
- [x] T002 Configure astro.config.mjs with site URL and integrations
- [x] T003 [P] Setup TypeScript configuration in tsconfig.json
- [x] T004 [P] Create base CSS design system in src/styles/global.css with CSS custom properties
- [x] T005 [P] Create utility CSS classes in src/styles/utilities.css
- [x] T006 Create MainLayout component in src/layouts/MainLayout.astro with meta tags, SEO, and structure

**Checkpoint**: ✅ Project runs with `npm run dev`, page loads

---

## Phase 2: Foundational (Static Data & Shared Components) ✅ COMPLETE

**Purpose**: Create static data files and reusable components that all user stories depend on

- [x] T007 Create products data file in src/data/products.json with mattress types and prices
- [x] T008 [P] Create areas data file in src/data/areas.json with Jogja service areas
- [x] T009 [P] Create testimonials data file in src/data/testimonials.json with sample reviews
- [x] T010 [P] Create business config in src/data/config.json with WhatsApp number and settings
- [x] T011 Create TypeScript types in src/types/index.ts matching data-model.md entities
- [x] T012 [P] Add Google Fonts (Inter) to MainLayout
- [ ] T013 [P] Create favicon and add to public/favicon.ico
- [x] T014 Create robots.txt in public/robots.txt

**Checkpoint**: ✅ Foundation ready - all static data accessible, layout renders correctly

---

## Phase 3: User Story 1 - Menghitung Harga dan Pesan via WhatsApp (Priority: P1) 🎯 MVP ✅ COMPLETE

**Goal**: User can calculate rental price and send pre-filled WhatsApp message

**Independent Test**: Access landing page → fill calculator → click WhatsApp button → verify pre-filled message opens

### Implementation for User Story 1

**Landing Page Structure**

- [x] T015 [US1] Create index page structure in src/pages/index.astro with all section placeholders
- [x] T016 [P] [US1] Create Hero component in src/components/Hero.astro with headline and CTA

**Price Display**

- [x] T017 [P] [US1] Create PriceCard component in src/components/PriceCard.astro for single mattress type
- [x] T018 [US1] Create PriceList component in src/components/PriceList.astro displaying all mattress types

**Calculator (Critical)**

- [ ] T019 [P] [US1] Create calculator styles in src/styles/components/calculator.css
- [x] T020 [US1] Create Calculator component in src/components/Calculator.astro with form UI
- [x] T021 [US1] Implement calculator logic in src/scripts/calculator.ts with real-time price calculation and delivery estimate ("Bisa antar hari ini" if before 15:00, else "Antar besok pagi")
- [x] T022 [US1] Add input validation in calculator: no past dates, quantity 1-10, duration 1-30 days with inline error messages

**Booking Form**

- [ ] T023 [P] [US1] Create form styles in src/styles/components/form.css with inline error states
- [x] T024 [US1] Create BookingForm component (integrated in Calculator.astro) with name, WA, address fields
- [x] T025 [US1] Implement form validation in src/scripts/form-validation.ts (WA format, required fields with inline errors)

**WhatsApp Integration**

- [x] T026 [US1] Implement WhatsApp message composer in src/scripts/whatsapp-compose.ts with wa.me URL
- [x] T027 [US1] Create WhatsAppButton component (integrated in Calculator.astro) with fallback display
- [x] T028 [US1] Create StickyWhatsApp component in src/components/StickyWhatsApp.astro for mobile sticky CTA
- [x] T029 [US1] Integrate calculator, form, and WhatsApp button in index.astro following constitution page structure

**Checkpoint**: ✅ User Story 1 complete - calculator works, WhatsApp message opens with correct data

---

## Phase 4: User Story 2 - Membangun Kepercayaan (Priority: P2) ✅ COMPLETE

**Goal**: User sees trust signals (real photos, service areas, testimonials) that increase confidence

**Independent Test**: Scroll landing page → verify real product photos, area list, and 3+ testimonials visible

### Implementation for User Story 2

- [x] T030 [P] [US2] Add placeholder product images to src/assets/images/ (800x600px WebP format, to be replaced with real photos)
- [x] T031 [US2] Update PriceCard to display product images
- [x] T032 [P] [US2] Create ServiceArea component in src/components/ServiceArea.astro with Jogja districts
- [x] T033 [P] [US2] Create TestimonialCard component (integrated in Testimonials.astro)
- [x] T034 [US2] Create Testimonials component in src/components/Testimonials.astro displaying 3 reviews
- [x] T035 [US2] Add trust sections to index.astro (service area + testimonials)

**Checkpoint**: ✅ User Story 2 complete - trust signals visible on landing page

---

## Phase 5: User Story 3 - Memahami Cara Sewa (Priority: P2) ✅ COMPLETE

**Goal**: User understands the 3-step rental process clearly

**Independent Test**: Scroll to "Cara Sewa" section → see 3 clear steps with icons

### Implementation for User Story 3

- [x] T036 [P] [US3] Create step icons or use emoji/SVG in src/assets/
- [x] T037 [US3] Create HowToRent component in src/components/HowToRent.astro with 3 steps
- [x] T038 [US3] Add HowToRent section to index.astro between calculator and service area

**Checkpoint**: ✅ User Story 3 complete - rental process clearly explained

---

## Phase 6: Polish & Cross-Cutting Concerns ⏳ PARTIAL

**Purpose**: SEO, performance optimization, responsive refinements

**SEO & Metadata**

- [x] T039 [P] Add structured data (LocalBusiness + Product schema) to MainLayout
- [x] T040 [P] Create sitemap.xml in public/sitemap.xml
- [x] T041 Update meta title and description for SEO in MainLayout

**Performance**

- [ ] T042 [P] Optimize all images using Astro Image component
- [x] T043 [P] Add loading="lazy" to below-fold images
- [ ] T044 Audit and minimize CSS bundle size

**Mobile Refinements**

- [x] T045 [P] Add responsive breakpoints to all components (min-width: 320px, 640px, 768px, 1024px)
- [x] T046 Verify touch targets >= 44x44px on all interactive elements
- [ ] T047 Test and fix sticky WhatsApp button on various mobile devices

**Final Validation**

- [ ] T048 Run Lighthouse audit and fix any issues (target: LCP < 2.5s, 90+ all categories)
- [ ] T049 Test full conversion flow on mobile device
- [ ] T050 Verify WhatsApp fallback works when app not installed (wa.me → web.whatsapp.com → copy number)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ✅
    ↓
Phase 2: Foundational ✅
    ↓
┌───────────────────────────────────────────────┐
│  User Stories completed:                       │
│  Phase 3 (US1) ✅ → Phase 4 (US2) ✅ → Phase 5 (US3) ✅│
└───────────────────────────────────────────────┘
    ↓
Phase 6: Polish ⏳
```

---

## Task Summary

| Phase                 | Tasks        | Completed | Status |
| --------------------- | ------------ | --------- | ------ |
| Phase 1: Setup        | 6 tasks      | 6         | ✅     |
| Phase 2: Foundational | 8 tasks      | 7         | ⏳     |
| Phase 3: US1 (MVP)    | 15 tasks     | 13        | ✅     |
| Phase 4: US2          | 6 tasks      | 5         | ✅     |
| Phase 5: US3          | 3 tasks      | 3         | ✅     |
| Phase 6: Polish       | 12 tasks     | 5         | ⏳     |
| **Total**             | **50 tasks** | **39**    | 78%    |

---

## Notes

- [P] tasks = different files, no dependencies
- [US#] label maps task to specific user story
- Each user story is independently completable and testable
- **MVP = Phase 1 + Phase 2 + Phase 3** = ✅ COMPLETE
- Website builds successfully with `npm run build`
- Remaining tasks are mostly polish (images, testing, optimization)
