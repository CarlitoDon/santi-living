# Feature Specification: Santi Living - Website Sewa Kasur Jogja

**Feature Branch**: `001-seo-living-marketing`  
**Created**: 2026-01-02  
**Status**: Draft  
**Input**: Website SEO-friendly untuk pemasaran produk living, fokus sewa kasur Jogja

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Menghitung Harga dan Pesan via WhatsApp (Priority: P1) 🎯 MVP

Calon pelanggan dari Jogja mencari "sewa kasur Jogja" di Google. Mereka menemukan website, langsung melihat harga kasur, menggunakan kalkulator untuk menghitung total biaya sewa, lalu klik tombol WhatsApp yang sudah auto-compose pesanan lengkap.

**Why this priority**: Ini adalah **core conversion flow**. Tanpa ini, website tidak menghasilkan order. Sesuai konstitusi: "Jika tidak mendukung conversion, fitur tidak perlu ada."

**Independent Test**: Dapat diuji dengan mengakses landing page, mengisi kalkulator (jenis kasur, jumlah, tanggal, durasi), dan memverifikasi bahwa tombol WhatsApp generate pesan terformat dengan semua data booking.

**Acceptance Scenarios**:

1. **Given** user di landing page, **When** mereka scroll, **Then** mereka melihat hero, harga kasur, kalkulator, dan CTA WhatsApp dalam satu halaman linear
2. **Given** user mengisi kalkulator dengan Double 2 unit untuk 3 hari mulai 15 Jan, **When** mereka lihat hasil, **Then** mereka melihat total harga real-time (misal: Rp 150.000)
3. **Given** user sudah mengisi kalkulator dan form booking (nama, WA, alamat), **When** mereka klik "Pesan via WhatsApp", **Then** WhatsApp terbuka dengan pesan terformat:
   ```
   Halo, saya mau sewa:
   - Kasur: Double
   - Jumlah: 2
   - Tanggal: 15-18 Jan
   - Total: Rp 150.000
   - Nama: [nama]
   - Alamat: [alamat]
   ```

---

### User Story 2 - Membangun Kepercayaan sebelum Order (Priority: P2)

Pengunjung baru belum yakin dengan layanan. Mereka perlu melihat bukti bahwa Santi Living terpercaya sebelum memutuskan order.

**Why this priority**: Trust signals meningkatkan conversion rate. Tanpa ini, user mungkin ragu meskipun sudah sampai di kalkulator.

**Independent Test**: Dapat diuji dengan memverifikasi bahwa landing page menampilkan foto kasur asli, area layanan Jogja, dan minimal 3 testimoni.

**Acceptance Scenarios**:

1. **Given** user di landing page, **When** mereka scroll section trust, **Then** mereka melihat foto kasur asli (bukan stock photo)
2. **Given** user ingin tahu area layanan, **When** mereka lihat section area, **Then** mereka melihat daftar kecamatan/area Jogja yang dilayani
3. **Given** user ingin baca review, **When** mereka lihat section testimoni, **Then** mereka melihat minimal 3 testimoni dengan nama dan rating

---

### User Story 3 - Memahami Cara Sewa (Priority: P2)

Pengunjung baru tidak familiar dengan proses sewa kasur. Mereka perlu tahu step-by-step bagaimana cara sewa.

**Why this priority**: Mengurangi pertanyaan repetitif ke CS dan mempercepat decision making.

**Independent Test**: Dapat diuji dengan memverifikasi bahwa landing page menampilkan section "Cara Sewa" dengan 3 step sederhana.

**Acceptance Scenarios**:

1. **Given** user di landing page, **When** mereka lihat section cara sewa, **Then** mereka melihat 3 step: (1) Pilih kasur, (2) Konfirmasi via WA, (3) Kasur diantar
2. **Given** user membaca cara sewa, **When** mereka selesai, **Then** mereka langsung melihat CTA untuk mulai proses

---

### Edge Cases

- **Tanggal lewat**: Kalkulator menampilkan error "Pilih tanggal hari ini atau setelahnya" dan disable tombol submit
- **Field wajib kosong**: Form menampilkan inline error merah di bawah field yang kosong, tombol submit disabled
- **Alamat di luar area**: Form tetap bisa submit, CS akan konfirmasi via WA (tidak ada auto-reject)
- **Layar < 320px**: Gunakan viewport minimum 320px, konten tetap readable dengan horizontal scroll minimal
- **WhatsApp tidak terinstall**: Link wa.me akan fallback ke web.whatsapp.com otomatis. Jika gagal, tampilkan nomor WA yang bisa di-copy manual

## Requirements _(mandatory)_

### Functional Requirements

**Kalkulator Sewa (Critical)**

- **FR-001**: Kalkulator HARUS menerima input: jenis kasur (Single/Double/Extra Bed), jumlah (1-10), tanggal mulai, durasi sewa (1-30 hari)
- **FR-002**: Kalkulator HARUS menampilkan hasil real-time: total harga dan estimasi pengantaran ("Bisa antar hari ini" jika order sebelum jam 15:00, atau "Antar besok pagi" jika setelah)
- **FR-003**: Kalkulator HARUS validasi input: tanggal tidak boleh lewat, jumlah 1-10, durasi 1-30 hari

**Pre-Booking Form**

- **FR-004**: Form HARUS memiliki field minimal: Nama, No WhatsApp, Alamat (textarea)
- **FR-005**: Form HARUS memiliki field opsional: Catatan tambahan
- **FR-006**: Form HARUS validasi format nomor WhatsApp Indonesia

**WhatsApp Auto-Compose**

- **FR-007**: Tombol "Pesan via WhatsApp" HARUS generate pesan dengan format terstruktur
- **FR-008**: Pesan HARUS include semua data: jenis kasur, jumlah, tanggal, durasi, total harga, nama, alamat
- **FR-009**: Pesan HARUS dikirim ke nomor WhatsApp bisnis Santi Living

**Landing Page**

- **FR-010**: Page HARUS memiliki struktur linear: Hero → Harga → Kalkulator → Cara Sewa → Area Layanan → Testimoni → CTA
- **FR-011**: Page HARUS memiliki LCP (Largest Contentful Paint) < 2.5 detik di mobile 3G
- **FR-012**: Page HARUS mobile-responsive dengan touch targets minimal 44x44px
- **FR-013**: Page HARUS memiliki sticky CTA WhatsApp di mobile

**Trust Signals**

- **FR-014**: Page HARUS menampilkan foto kasur asli (bukan stock photo)
- **FR-015**: Page HARUS menampilkan daftar area layanan di Jogja
- **FR-016**: Page HARUS menampilkan minimal 3 testimoni pelanggan

**SEO**

- **FR-017**: Page HARUS memiliki meta title dan description yang optimized untuk "sewa kasur Jogja"
- **FR-018**: Page HARUS memiliki structured data (LocalBusiness + Product schema)
- **FR-019**: Page HARUS memiliki heading structure yang proper (H1, H2, H3)

### Key Entities

- **Jenis Kasur (Mattress Type)**: Tipe kasur yang tersedia untuk disewa. Atribut: nama (Single/Double/Extra Bed), harga per hari, gambar, deskripsi singkat.
- **Booking Request**: Data pemesanan yang dikirim via WhatsApp. Atribut: jenis kasur, jumlah, tanggal mulai, durasi, total harga, nama pelanggan, no WA, alamat, catatan.
- **Area Layanan (Service Area)**: Wilayah Jogja yang dilayani. Atribut: nama area/kecamatan.
- **Testimoni (Testimonial)**: Review pelanggan. Atribut: nama, rating, ulasan singkat, foto (opsional).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: > 5% visitor yang sampai di kalkulator melanjutkan ke klik WhatsApp
- **SC-002**: Drop-off rate di kalkulator < 40%
- **SC-003**: Website LCP (Largest Contentful Paint) < 2.5 detik pada mobile 3G
- **SC-004**: Core Web Vitals dalam kategori "Good" (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **SC-005**: Website muncul di halaman 1 Google untuk "sewa kasur Jogja" dalam 3 bulan
- **SC-006**: Rata-rata 5+ chat WhatsApp per hari dalam 1 bulan setelah launch

## Assumptions

- Target pasar: Yogyakarta (Jogja) dan sekitarnya
- Bahasa: Indonesia (informal, tidak salesy)
- Proses pemesanan: Manual via WhatsApp (CS handle closing)
- Konten dan foto produk: Disediakan oleh pemilik bisnis
- Backend fase awal: Form data ke Google Sheets / Airtable (tanpa backend custom)
- Tidak ada login user, payment gateway, atau real-time stok di MVP

## Constitution Alignment

Spesifikasi ini selaras dengan Santi Living Constitution v1.0.0:

| Principle              | Alignment                                             |
| ---------------------- | ----------------------------------------------------- |
| Mobile-First           | ✅ Landing page linear, touch-friendly, < 2s load     |
| One Intent, One Page   | ✅ Semua info dalam satu scroll, CTA tunggal          |
| Zero Cognitive Load    | ✅ Form minimal, kalimat pendek, no dropdown berlebih |
| WhatsApp as Final Gate | ✅ Semua conversion berakhir di WA auto-compose       |
