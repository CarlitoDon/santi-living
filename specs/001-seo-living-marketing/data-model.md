# Data Model: Santi Living - Website Sewa Kasur Jogja

**Feature**: 001-seo-living-marketing  
**Date**: 2026-01-02  
**Status**: Complete

## Overview

Data model untuk static website sewa kasur. Semua data disimpan sebagai JSON files (static) dan Google Sheets (form submissions). Tidak ada database - sesuai konstitusi Phase 1 MVP.

---

## Entities

### 1. MattressType (Jenis Kasur)

Representasi tipe kasur yang tersedia untuk disewa.

**Storage**: `src/data/products.json`

```typescript
interface MattressType {
  id: string; // "single" | "double" | "extra-bed"
  name: string; // "Kasur Single"
  shortName: string; // "Single"
  description: string; // "Kasur single nyaman untuk 1 orang"
  pricePerDay: number; // 25000 (dalam Rupiah)
  dimensions: string; // "90 x 200 cm"
  capacity: string; // "1 orang"
  image: string; // "/images/kasur-single.webp"
  available: boolean; // true
}
```

**Sample Data**:

```json
[
  {
    "id": "single",
    "name": "Kasur Single",
    "shortName": "Single",
    "description": "Kasur single nyaman untuk 1 orang",
    "pricePerDay": 25000,
    "dimensions": "90 x 200 cm",
    "capacity": "1 orang",
    "image": "/images/kasur-single.webp",
    "available": true
  },
  {
    "id": "double",
    "name": "Kasur Double",
    "shortName": "Double",
    "description": "Kasur double luas untuk 2 orang",
    "pricePerDay": 40000,
    "dimensions": "160 x 200 cm",
    "capacity": "2 orang",
    "image": "/images/kasur-double.webp",
    "available": true
  },
  {
    "id": "extra-bed",
    "name": "Extra Bed",
    "shortName": "Extra Bed",
    "description": "Kasur lipat portable untuk tamu tambahan",
    "pricePerDay": 20000,
    "dimensions": "80 x 190 cm",
    "capacity": "1 orang",
    "image": "/images/extra-bed.webp",
    "available": true
  }
]
```

**Validation Rules**:

- `id`: Required, unique, lowercase with dashes
- `pricePerDay`: Required, positive integer
- `available`: Default true

---

### 2. ServiceArea (Area Layanan)

Wilayah Jogja yang dilayani untuk antar-jemput.

**Storage**: `src/data/areas.json`

```typescript
interface ServiceArea {
  id: string; // "sleman"
  name: string; // "Sleman"
  districts: string[]; // ["Depok", "Mlati", "Ngaglik", ...]
  deliveryNote?: string; // "Gratis ongkir" | "Ongkir Rp 10.000"
}
```

**Sample Data**:

```json
[
  {
    "id": "kota-jogja",
    "name": "Kota Yogyakarta",
    "districts": [
      "Gondokusuman",
      "Danurejan",
      "Gedongtengen",
      "Jetis",
      "Tegalrejo",
      "Umbulharjo",
      "Kotagede",
      "Mergangsan",
      "Wirobrajan",
      "Mantrijeron",
      "Kraton",
      "Ngampilan",
      "Pakualaman",
      "Gondomanan"
    ],
    "deliveryNote": "Gratis ongkir"
  },
  {
    "id": "sleman",
    "name": "Sleman",
    "districts": [
      "Depok",
      "Mlati",
      "Ngaglik",
      "Godean",
      "Gamping",
      "Berbah",
      "Kalasan",
      "Prambanan"
    ],
    "deliveryNote": "Gratis ongkir"
  },
  {
    "id": "bantul",
    "name": "Bantul",
    "districts": ["Kasihan", "Sewon", "Banguntapan", "Pandak"],
    "deliveryNote": "Ongkir Rp 10.000"
  }
]
```

---

### 3. Testimonial (Testimoni)

Review dari pelanggan yang sudah menggunakan layanan.

**Storage**: `src/data/testimonials.json`

```typescript
interface Testimonial {
  id: string; // "testi-001"
  name: string; // "Budi S."
  rating: number; // 5 (1-5)
  text: string; // "Kasur bersih, antar tepat waktu..."
  date: string; // "2026-01-01" (ISO date)
  location?: string; // "Sleman"
  verified: boolean; // true
}
```

**Sample Data**:

```json
[
  {
    "id": "testi-001",
    "name": "Budi S.",
    "rating": 5,
    "text": "Kasur bersih banget, wangi. Diantar tepat waktu. Recommended!",
    "date": "2026-01-01",
    "location": "Sleman",
    "verified": true
  },
  {
    "id": "testi-002",
    "name": "Dewi R.",
    "rating": 5,
    "text": "Sewa buat acara keluarga, pelayanan ramah. Pasti repeat order.",
    "date": "2025-12-28",
    "location": "Kota Jogja",
    "verified": true
  },
  {
    "id": "testi-003",
    "name": "Andi P.",
    "rating": 4,
    "text": "Harga terjangkau, kasur nyaman. Next time sewa lagi.",
    "date": "2025-12-25",
    "location": "Bantul",
    "verified": true
  }
]
```

**Validation Rules**:

- `rating`: 1-5 integer
- `text`: Max 200 characters (keep UI clean)
- `verified`: Only show verified testimonials

---

### 4. BookingRequest (Form Submission)

Data yang dikirim saat user submit form pre-booking.

**Storage**: Google Sheets (external)

```typescript
interface BookingRequest {
  timestamp: string; // "2026-01-02T17:30:00+07:00"

  // Customer Info
  name: string; // "John Doe"
  whatsapp: string; // "081234567890"
  address: string; // "Jl. Kaliurang KM 5, Sleman"
  notes?: string; // "Tolong antar sebelum jam 10"

  // Booking Details
  mattressType: string; // "double"
  quantity: number; // 2
  startDate: string; // "2026-01-15"
  duration: number; // 3 (days)
  endDate: string; // "2026-01-18" (calculated)

  // Pricing
  pricePerDay: number; // 40000
  subtotal: number; // 240000 (pricePerDay * quantity * duration)
  total: number; // 240000 (same as subtotal, no additional fees for MVP)

  // Tracking
  source: string; // "website"
  status: string; // "new" | "contacted" | "confirmed" | "completed"
}
```

**Google Sheets Columns**:
| Column | Description |
|--------|-------------|
| A - Timestamp | Auto-generated |
| B - Nama | Customer name |
| C - WhatsApp | Phone number |
| D - Alamat | Full address |
| E - Jenis Kasur | Mattress type |
| F - Jumlah | Quantity |
| G - Tanggal Mulai | Start date |
| H - Durasi (Hari) | Duration in days |
| I - Tanggal Selesai | End date |
| J - Total Harga | Total price |
| K - Catatan | Notes |
| L - Status | Order status |

---

### 5. CalculatorState (Runtime State)

State untuk kalkulator - tidak disimpan, hanya di browser.

```typescript
interface CalculatorState {
  // Input
  mattressType: string | null; // Selected mattress ID
  quantity: number; // Default: 1, range: 1-10
  startDate: string | null; // Selected start date (>= today)
  duration: number; // Default: 1, range: 1-30

  // Calculated (derived)
  endDate: string | null; // startDate + duration
  pricePerDay: number; // From MattressType
  subtotal: number; // pricePerDay * quantity * duration
  total: number; // subtotal (no fees for MVP)
  deliveryEstimate: string; // "Bisa antar hari ini" (if before 15:00) or "Antar besok pagi"

  // Validation
  isValid: boolean; // All required fields filled and valid
  errors: Record<string, string>; // Field-specific error messages for inline display
}
```

---

### 6. BusinessConfig (Konfigurasi Bisnis)

Konfigurasi statis untuk bisnis.

**Storage**: `src/data/config.json`

```typescript
interface BusinessConfig {
  businessName: string; // "Santi Living"
  tagline: string; // "Sewa Kasur Jogja, Antar Jemput"

  // Contact
  whatsappNumber: string; // "6281234567890" (dengan kode negara)
  whatsappDisplay: string; // "0812-3456-7890"
  email?: string; // "hello@santiliving.com"
  instagram?: string; // "@santiliving"

  // Address
  city: string; // "Yogyakarta"
  fullAddress?: string; // "Jl. ..."

  // Business Rules
  minDuration: number; // 1 (minimum sewa 1 hari)
  maxDuration: number; // 30 (maximum sewa 30 hari)
  minBookingDays: number; // 0 (bisa booking hari ini)

  // Operating Hours
  operatingHours: string; // "08:00 - 21:00"
}
```

**Sample Data**:

```json
{
  "businessName": "Santi Living",
  "tagline": "Sewa Kasur Jogja, Antar Jemput",
  "whatsappNumber": "6281234567890",
  "whatsappDisplay": "0812-3456-7890",
  "city": "Yogyakarta",
  "minDuration": 1,
  "maxDuration": 30,
  "minBookingDays": 0,
  "operatingHours": "08:00 - 21:00"
}
```

---

## Entity Relationships

```
┌─────────────────┐
│  BusinessConfig │ (singleton)
└────────┬────────┘
         │ provides settings
         ▼
┌─────────────────┐     ┌─────────────────┐
│  MattressType   │────▶│ CalculatorState │
└─────────────────┘     └────────┬────────┘
   (static data)                 │
                                 │ generates
                                 ▼
                        ┌─────────────────┐
                        │ BookingRequest  │───▶ Google Sheets
                        └─────────────────┘
                                 │
                                 │ relates to
                                 ▼
┌─────────────────┐     ┌─────────────────┐
│   ServiceArea   │     │   Testimonial   │
└─────────────────┘     └─────────────────┘
   (static data)           (static data)
```

---

## Data Flow

```
1. User lands on page
   └── Load: MattressType[], ServiceArea[], Testimonial[], BusinessConfig

2. User interacts with Calculator
   └── Update: CalculatorState (local)

3. User fills BookingForm
   └── Validate: CalculatorState + CustomerInfo

4. User clicks "Pesan via WhatsApp"
   ├── Option A: WhatsApp opens with pre-filled message
   └── Option B: Form submits to Google Sheets (backup)

5. CS receives WhatsApp message
   └── Manual: Update BookingRequest status in Sheets
```

---

## Validation Summary

| Entity              | Field       | Rule                                     |
| ------------------- | ----------- | ---------------------------------------- |
| **MattressType**    | pricePerDay | > 0                                      |
| **Testimonial**     | rating      | 1-5                                      |
| **Testimonial**     | text        | max 200 chars                            |
| **BookingRequest**  | whatsapp    | Indonesian phone format (08xx or +628xx) |
| **BookingRequest**  | quantity    | 1-10                                     |
| **BookingRequest**  | duration    | 1-30 days                                |
| **BookingRequest**  | startDate   | >= today                                 |
| **CalculatorState** | quantity    | 1-10 with inline error                   |
| **CalculatorState** | duration    | 1-30 days with inline error              |
| **CalculatorState** | startDate   | >= today with inline error               |
