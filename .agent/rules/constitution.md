---
trigger: model_decision
---

<!--
  ============================================================================
  SYNC IMPACT REPORT
  ============================================================================
  Version Change: 0.0.0 → 1.0.0 (MAJOR - Initial constitution ratification)

  Modified Principles: N/A (new document)

  Added Sections:
  - Core Principles (4 principles)
  - Scope Definition (MVP vs Not Needed)
  - Technical Architecture
  - Operational Flow
  - Metrics & Success Criteria
  - Development Roadmap
  - Governance

  Removed Sections: N/A

  Templates Requiring Updates:
  - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
  - .specify/templates/spec-template.md: ✅ Compatible (user stories align with conversion focus)
  - .specify/templates/tasks-template.md: ✅ Compatible (phase structure aligns with roadmap)

  Follow-up TODOs: None
  ============================================================================
-->

# Santi Living Constitution

> Website sewa kasur Jogja dengan fokus **seamless experience**, cepat closing, dan mudah dioperasikan tim non-teknis.

## North Star (Tujuan Utama)

**Primary Objective**
Mengubah traffic lokal Jogja menjadi **order WhatsApp / form booking** dengan friksi minimum.

**Secondary Objectives**

- Mengurangi beban CS
- Menghindari salah jadwal, salah alamat, dan double booking
- Menjadi fondasi sistem operasional (inventory + jadwal)

> ⚠️ Jika fitur tidak mendukung salah satu dari poin di atas, fitur tersebut TIDAK PERLU ADA.

## Core Principles

### I. Mobile-First

≥80% user akan dari HP. Desktop hanya pendukung.

**Rules**:

- Semua desain HARUS dimulai dari viewport mobile (375px)
- Touch targets HARUS minimal 44x44px
- Form input HARUS menggunakan keyboard type yang sesuai (tel, email, text)
- Scroll HARUS linear dan smooth
- Desktop view adalah scaling up dari mobile, bukan sebaliknya

### II. One Intent, One Page

User datang, langsung paham: Harga, Cara Sewa, Ketersediaan, Cara Order.

**Rules**:

- Landing page HARUS menjawab semua pertanyaan user dalam satu scroll
- Setiap section HARUS memiliki satu tujuan yang jelas
- Navigation HARUS minimal (scroll-based, bukan menu kompleks)
- CTA utama HARUS terlihat di viewport pertama (above the fold)
- Informasi harga HARUS transparan dan langsung terlihat

### III. Zero Cognitive Load

Tidak ada hambatan mental yang menghalangi user dari conversion.

**Prohibited Elements**:

- ❌ Dropdown berlebihan
- ❌ Copy marketing panjang dan salesy
- ❌ Animasi berat yang mengganggu
- ❌ Multi-step forms yang tidak perlu
- ❌ Loading spinners yang lama

**Required Elements**:

- ✅ Kalimat pendek dan jelas
- ✅ Bahasa lokal, tidak formal berlebihan
- ✅ Visual hierarchy yang jelas
- ✅ Instant feedback pada setiap interaksi

### IV. WhatsApp as Final Gate

Website bukan ERP. Website adalah mesin pre-qualification dan validasi data.

**Rules**:

- Semua conversion flow HARUS berakhir di WhatsApp
- Form HARUS auto-compose pesan WhatsApp dengan format terstruktur
- Data yang dikumpulkan HARUS cukup untuk CS langsung closing
- Tidak ada payment gateway di fase awal
- Tidak ada login user di fase awal

## Scope Definition

### WAJIB ADA (MVP)

| Component                 | Description                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| **Landing Page**          | Hero dengan CTA tunggal "Cek Harga & Pesan"                                |
| **Trust Signals**         | Foto kasur asli, area layanan Jogja, testimoni singkat                     |
| **Kalkulator Sewa**       | Input: jenis kasur, jumlah, tanggal, durasi. Output: total harga real-time |
| **Pre-Booking Form**      | Nama, No WhatsApp, Alamat (textarea), Catatan (opsional)                   |
| **WhatsApp Auto-Compose** | Tombol yang generate pesan terformat otomatis                              |

### TIDAK PERLU (Fase Awal)

| Component        | Reason                                             |
| ---------------- | -------------------------------------------------- |
| Login user       | Menambah friction tanpa value                      |
| Payment gateway  | CS handle manual, conversion lebih tinggi          |
| Real-time stok   | Manual cukup, kompleksitas tidak justified         |
| Blog SEO panjang | Traffic dari lokal search, bukan content marketing |
| Chatbot          | WhatsApp CS lebih personal dan effective           |

## Technical Architecture

### Frontend

**Stack**: Next.js atau Astro (static + client interactivity)

**Requirements**:

- Load time HARUS < 2 detik
- Core Web Vitals HARUS dalam kategori "Good"
- SEO lokal teroptimasi
- Hosting murah dan stabil

### Backend

**Phase 1 (MVP)**:

- Tanpa backend berat
- Form → Google Sheets / Airtable

**Phase 2+ (Scale)**:

- API ringan (Node / Bun) ketika order > 5/hari stabil
- Database sederhana: Orders, Inventory, Schedule

> ⚠️ JANGAN bangun backend sebelum order > 5/hari stabil.

## Page Structure

```
/
├── Hero + CTA
├── Jenis Kasur + Harga
├── Kalkulator
├── Cara Sewa (3 step)
├── Area Layanan (Jogja)
├── Testimoni
└── CTA WhatsApp (sticky)
```

Tidak perlu menu kompleks. Scroll linear dari atas ke bawah.

## Copywriting Rules

| ❌ Don't                              | ✅ Do                                 |
| ------------------------------------- | ------------------------------------- |
| "Solusi terbaik kebutuhan tidur Anda" | "Kasur bersih, antar hari ini, Jogja" |
| Paragraf panjang                      | Kalimat pendek                        |
| Bahasa formal salesy                  | Bahasa lokal natural                  |
| Buzzwords marketing                   | Informasi konkret                     |

## Operational Flow

```
User → Website → Kalkulator → WA → CS → Konfirmasi → Antar
```

Website hanya bertugas sampai **WA siap closing**. Setelah itu tanggung jawab CS.

## Metrics (Wajib Dipantau)

| Metric                 | Target            | Priority     |
| ---------------------- | ----------------- | ------------ |
| CTR ke WhatsApp        | > 5% dari visitor | 🔴 Critical  |
| Drop-off di kalkulator | < 40%             | 🔴 Critical  |
| Jumlah chat per hari   | Growth MoM        | 🟡 Important |

**Tidak Perlu Dipantau**:

- Pageview vanity metrics
- Bounce rate obsesif (tidak relevan untuk single-page)

## Development Roadmap

### Phase 1: MVP Website

- Landing page + Kalkulator + WhatsApp integration
- Target: Live dalam 2 minggu

### Phase 2: Admin Sederhana

- Order tracking sederhana
- Kalender manual anti double booking
- Trigger: Order > 5/hari

### Phase 3: Automation

- Inventory otomatis
- Repeat customer handling
- Trigger: Order > 20/hari

## Governance

### Constitution Authority

Konstitusi ini adalah dokumen tertinggi untuk pengambilan keputusan proyek. Semua fitur, desain, dan implementasi HARUS selaras dengan prinsip yang tercantum.

### Amendment Process

1. Perubahan HARUS didokumentasikan dengan alasan yang jelas
2. Perubahan MAJOR (scope/prinsip) memerlukan evaluasi dampak bisnis
3. Perubahan HARUS di-track dalam version history

### Compliance Check

Sebelum merge fitur apapun, verifikasi:

- [ ] Fitur mendukung North Star objective?
- [ ] Fitur selaras dengan 4 Core Principles?
- [ ] Fitur tidak masuk dalam daftar "TIDAK PERLU"?
- [ ] Fitur tidak menambah cognitive load?

**Version**: 1.0.0 | **Ratified**: 2026-01-02 | **Last Amended**: 2026-01-02