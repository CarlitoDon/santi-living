# 90-Day Local SEO Domination Plan untuk Sewa Kasur Jogja

Berdasarkan report Local Falcon kamu, posisi #3 dengan SoLV 42.86% punya potensi besar untuk naik ke #1. Fokus utama: **review velocity, geographic coverage, dan on-page optimization**. Ini plan action yang prioritasnya sudah disortir berdasarkan impact terhadang ranking.

---

## Fase 1: Foundation & Quick Wins (Minggu 1-2)

**Tujuan:** Perbaiki critical gap yang bikin ranking drop di area timur dan kurangnya authority signal.

### Action Items:

#### 1. Perpanjang Business Description
- Current: 39 words
- Target: 250+ words
- Include keywords: "sewa kasur Jogja", "rental kasur Sleman", "kasur kost Godean", "extrabed murah Yogyakarta"
- Mention service area spesifik: Godean, Gamping, Sleman, sampe area timur (Condongcatur, Depok)
- Highlight unique selling points: kualitas kasur, harga kompetitif, free delivery area tertentu, proses order cepat

**Template:**
```
Sewa Kasur Jogja - Solusi Kasur Berkualitas untuk Kost, Kontrakan, dan Hunian Sementara di Yogyakarta. 

Kami menyediakan layanan sewa kasur dengan berbagai pilihan: kasur single, double, extrabed, dan springbed berkualitas hotel. 

Melayani area: Godean, Gamping, Sleman, Condongcatur, Depok, dan sekitarnya.

Keunggulan:
- Kasur bersih dan terawat
- Harga terjangkau mulai dari Rp50.000/hari
- Gratis delivery & pickup area Godean-Gamping
- Proses order mudah via WhatsApp
- Customer service responsif 24/7
- Rating 5.0 dari pelanggan puas

Cocok untuk mahasiswa, karyawan baru, tamu yang menginap, atau kebutuhan hunian sementara lainnya.
```

#### 2. Activate GBP Products Feature
- Buat 5-10 produk listings
- Contoh produk:
  - "Sewa Kasur Single Jogja - Harian/Mingguan/Bulanan"
  - "Sewa Kasur Double Springbed - Berkualitas Hotel"
  - "Extrabed Murah Yogyakarta - Untuk Tamu Tambahan"
  - "Paket Sewa Kasur Mahasiswa - Hemat & Berkualitas"
  - "Rental Kasur Kost Godean - Area Kampus"
- Tiap produk: deskripsi 150 words + 3-5 foto
- Include: harga, cara order, delivery info

#### 3. Fix NAP Consistency
- Cek semua platform: Tokopedia, Shopee, Instagram, Facebook, TikTok
- Pastikan identik 100%:
  - Business name: "Sewa Kasur Jogja | Santi Living | by Santi Mebel Jogja"
  - Address: "Jl. Godean KM10 Geneng, RT.05/RW04, Sidoagung, Kec. Godean, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55264"
  - Phone: [your phone number]
- Beda satu koma aja bikin Google ragu

#### 4. Geo-tagging Foto
- Upload 20 foto baru dengan location tag di area lemah
- Fokus area: Timur, Tenggara, Timur Laut Godean
- Jenis foto:
  - Kasur dipasang di lokasi customer (8 foto)
  - Proses delivery & setup (5 foto)
  - Tim kamu bekerja (3 foto)
  - Koleksi kasur di gudang (4 foto)

**Target:** ARP turun ke bawah 5.0 dalam 14 hari.

**Checklist Minggu 1-2:**
- [ ] Description diperpanjang & di-publish
- [ ] 8 produk dibuat dengan foto & deskripsi lengkap
- [ ] NAP audit selesai & diupdate di semua platform
- [ ] 20 foto geo-tagged diupload

---

## Fase 2: Review Velocity Blitz (Minggu 3-6)

**Tujuan:** Naikkan review dari 16 ke 50+ untuk overtake competitor #1 (108 reviews) dan #2 (36 reviews).

### Action Items:

#### 1. Review Request System (WhatsApp Automation)
Kamu bisa implement pakai TypeScript + Prisma:

**Flow:**
- Transaction selesai → Wait 2 days → Send WA request
- Message template: "Halo [Nama], terima kasih sudah sewa kasur di Santi Living! Review 5 bintang kamu sangat membantu kami improve layanan 🙏 [link review Google Maps]"

**Database schema:**
```typescript
model Transaction {
  id: String @id
  customerName: String
  customerPhone: String
  transactionDate: DateTime
  status: String // "completed", "pending", etc
  reviewRequested: Boolean @default(false)
  reviewRequestedAt: DateTime?
}
```

#### 2. Incentive Program
- Diskon 10% untuk next sewa bagi yang review
- Free delivery untuk review verified dengan foto kasur
- Mention di invoice / digital receipt:
  "📍 Bantu kami berkembang! Review di Google Maps dan dapatkan diskon 10% untuk sewa berikutnya"

#### 3. QR Code Placement
- Print QR code review (ke Google Maps review link)
- Tempel di setiap kasur yang di-install
- Format: sticker A6 warna merah + white background
- Text: "Puas dengan layanan kami? Tap untuk review 5 bintang!"

#### 4. Target Area Kuat Dulu
- Prioritaskan West, Northwest, Southwest (area dominan kamu)
- Strengthen posisi ini → easier to defend ketika attack area lemah
- Request 15-20 review dari area kuat sebelum expand ke area timur

**Weekly Target:** 8-10 review baru per minggu, rating maintain 5.0

**Checklist Minggu 3-6:**
- [ ] WhatsApp automation setup (Minggu 1)
- [ ] Incentive program published di semua channel (Minggu 1)
- [ ] QR codes printed & di-install (Minggu 2)
- [ ] 32-40 review baru terkumpul (Minggu 3-6)
- [ ] Rating maintain 5.0 dengan respond semua negative

---

## Fase 3: Geographic Domination (Minggu 7-10)

**Tujuan:** Improve ATRP di area lemah:
- Timur: 14.8 → <5
- Tenggara: 10.6 → <5
- Timur Laut: 10.1 → <5

### Action Items:

#### 1. Area-Specific Google Posts (3x/minggu)
**Minggu 7-10 Post Calendar:**

**Minggu 7:**
- Post 1: "Sewa Kasur Godean & Gamping - Free Ongkir Hari Ini" + foto kasur
- Post 2: "Melayani Extrabed untuk Kost sekitar UGM & UNY - Harga Terjangkau" + testimoni
- Post 3: "Kasur Baru Stok - Melayani Sewa Harian Condongcatur & Depok" + foto

**Minggu 8:**
- Post 1: "Promo Awal Bulan - Sewa Kasur Sleman Diskon 15% 🎉" + countdown
- Post 2: "Customer Puas dari Area Godean - Baca Testimoni Mereka" + screenshot review
- Post 3: "Cara Mudah Pesan: Hubungi WhatsApp, Kasur Siap dalam 2 Jam" + CTA

**Minggu 9:**
- Post 1: "Kasur Hotel Quality untuk Kontrakan di Gamping - Booking Sekarang" + foto
- Post 2: "Sewa Kasur Bulanan Hemat - Area Timur Sleman Terlayani" + benefit list
- Post 3: "Tim Delivery Profesional - Kasur Dipasang Rapi, Area Godean-Depok" + foto

**Minggu 10:**
- Post 1: "Stok Update: Kasur Single, Double, Extrabed Ready - Order Sekarang" + foto
- Post 2: "Testimoni Pelanggan: Kasur Bagus, Harga Murah, Pelayanan Oke!" + review
- Post 3: "Melayani Event Besar - Sewa Kasur dalam Jumlah Banyak Siap!" + CTA

#### 2. Hyperlocal Landing Pages (Website)
Buat di santiliving.com:

**Landing Page 1: /sewa-kasur-godean**
- Title: "Sewa Kasur Godean - Harga Terjangkau, Kualitas Terjangkau | Santi Living"
- H1: "Sewa Kasur Godean - Solusi Kasur Berkualitas untuk Kost & Kontrakan"
- Content sections:
  - "Mengapa Sewa Kasur di Godean?"
  - "Tipe Kasur yang Tersedia"
  - "Area Layanan di Godean" (list spesifik: Sidoagung, Kramat, Sidokarto, dll)
  - "Harga dan Paket" (transparency)
  - "Testimoni Pelanggan Godean" (3-5 review)
  - "FAQ: Sewa Kasur Godean"
- Word count: 500-600 words
- Schema: LocalBusiness + schema:Product

**Landing Page 2: /sewa-kasur-gamping**
- Similar structure tapi fokus area Gamping
- Mention: UGM, UNY, Baturan, area kampus

**Landing Page 3: /sewa-kasur-condongcatur**
- Fokus area timur: Condongcatur, Depok, Wedomartani
- Mention: Titikuning, area bisnis Depok

**Landing Page 4: /sewa-kasur-sleman**
- Umbrella page untuk semua area Sleman
- Link ke sub-pages

**Landing Page 5: /harga-sewa-kasur-jogja**
- Transparency pricing
- Tabel: tipe kasur, harga harian/mingguan/bulanan, durasi min

#### 3. Citations di Direktori Area
Daftar ke 10+ direktori lokal:

1. Qraved.com
2. Yellow Pages Indonesia
3. Dicariin.com
4. Pagesjaune.id
5. Bisnis lokal Facebook groups (10+ grup "Info Jogja", "Jual Beli Jogja", "Sewa Menyewa Jogja")
6. Tokopedia Bisnis
7. Google My Business (sudah ada, consolidate)
8. Direktori Bisnis Yogyakarta
9. Klasifikasi bisnis lokal Bantul
10. Platform agregator lainnya

**NAP harus identik di semua:**
- Nama: Sewa Kasur Jogja | Santi Living | by Santi Mebel Jogja
- Alamat: [lengkap sesuai GBP]
- Phone: [sesuai GBP]

#### 4. Backlink Lokal (3-5 per bulan)
**Target blogs/media:**
- "Info Jogja" blog + guest post "Panduan Sewa Kasur untuk Mahasiswa di Jogja"
- "Kost Jogja Murah" - sponsorship mention
- "Mahasiswa Jogja" - artikel "5 Tips Memilih Kasur Sewa yang Berkualitas"
- Local news "Tribun Jogja" - buat press release tentang bisnis kamu
- YouTube Jogja channels - feature interview + backlink di deskripsi video

**Template outreach email:**
```
Halo [Admin Blog],

Saya interest untuk guest post di blog [Blog Name] tentang topik "Panduan Sewa Kasur Berkualitas untuk Mahasiswa Jogja" (600-800 kata).

Artikel ini valuable untuk audience kamu karena:
- Banyak mahasiswa butuh kasur
- Content actionable dengan tips praktis
- Authentic dari pengalaman nyata

Apakah ada interest? Saya siap bagikan draft article.

Best regards,
[Name]
```

**Checklist Minggu 7-10:**
- [ ] 12 Google Posts published (3/minggu)
- [ ] 5 hyperlocal landing pages live di website
- [ ] NAP audit & daftar di 10+ direktori (Minggu 7)
- [ ] 3 backlink acquired (guest posts / press release)
- [ ] ATRP area timur monitoring mingguan

---

## Fase 4: Authority & Scale (Minggu 11-12)

**Tujuan:** Konsolidasi posisi #1 dengan authority signals dan automation.

### Action Items:

#### 1. GBP Events Feature
- Event: "Promo Awal Tahun Akademik - Sewa Kasur Mahasiswa 20% OFF"
- Mulai: Akhir Juli (persiapan mahasiswa baru)
- Duration: 1 bulan
- Include: foto, deskripsi, link order
- Repeat setiap musim: awal semester, akhir tahun

#### 2. Review Response Strategy (Daily)
- Set reminder: reply dalam 24 jam max
- Review positif: "Terima kasih [Nama]! Kami senang kasur kami nyaman untuk kost Anda di [Area]. Jangan ragu hubungi kami lagi untuk next sewa! 🙏"
- Review negatif: "Terima kasih feedback Anda. Kami serius dengan kualitas. Boleh kami diskusikan offline? Hubungi WA kami di [number]"

#### 3. Video Content (GBP + YouTube)
Upload 5 video short di GBP + repost di YouTube/TikTok:

1. "Cara Order Sewa Kasur di Santi Living" (30 detik)
   - Intro (5s) + steps (20s) + CTA (5s)
   - Include: WA number, website

2. "Quality Check Kasur Sebelum Delivery" (30 detik)
   - Tampilkan proses cleaning, inspection
   - Subtitle: "Standar kualitas kami"

3. "Testimoni Customer Kost Godean" (30 detik)
   - Interview singkat customer
   - Rating 5 bintang terang-terangan

4. "Setup Kasur di Rumah Customer" (30 detik)
   - Time-lapse setup process
   - Show final result

5. "Why Choose Santi Living?" (60 detik)
   - Unique selling points
   - 5 bintang rating, xx reviews
   - Fast delivery, friendly service

**Equipment needed:** Smartphone + tripod. DIY production, budget minimal.

#### 4. Build Simple Tracking Dashboard
Pakai TypeScript + Express + Vite:

**Stack:**
- Backend: Express.js + TypeScript + Prisma (query GBP API)
- Frontend: Vite + React
- Database: PostgreSQL (atau SQLite untuk local)

**Features:**
- Real-time review count & rating
- Weekly comparison chart (reviews trend)
- ATRP per area chart (based on Local Falcon scans)
- Geographic heat map (where customers from)
- Action item checklist (review requests sent, posts published, etc)

**GBP API Integration:**
- Google My Business API untuk pull: reviews, photos, insights
- Automate weekly scan & store data di Prisma

**Example Dashboard Layout:**
```
┌─────────────────────────────┐
│ SANTI LIVING - SEO DASHBOARD │
├─────────────────────────────┤
│ Reviews: 45 (+5 this week)   │
│ Rating: 5.0 ⭐              │
│ SoLV: 52% (target 65%)      │
├─────────────────────────────┤
│ Chart: Review Trend         │
│ [Line chart - 12 weeks]     │
├─────────────────────────────┤
│ ATRP by Region:             │
│ West: 1.0 ✓                 │
│ East: 8.5 (target <5)       │
│ Southeast: 6.2 (target <5)  │
├─────────────────────────────┤
│ Weekly Checklist:           │
│ ✓ Posts (3/3)               │
│ ✓ Reviews (8/10)            │
│ ✗ Backlinks (1/2)           │
└─────────────────────────────┘
```

**Checklist Minggu 11-12:**
- [ ] Event "Promo Akademik" published
- [ ] Reply system daily (track dalam spreadsheet)
- [ ] 5 videos uploaded ke GBP
- [ ] Dashboard basic version live
- [ ] Local Falcon scan final untuk compare hasil 90 hari

---

## Weekly KPI Dashboard

Track ini setiap Minggu Malam (Jumat/Sabtu):

| Metric | Current | Target 30d | Target 60d | Target 90d |
|--------|---------|------------|------------|------------|
| **Total Reviews** | 16 | 35 | 55 | 80 |
| **SoLV** | 42.86% | 50% | 58% | 65% |
| **ARP Timur** | 14.8 | 10 | 7 | 5 |
| **ARP Tenggara** | 10.6 | 8 | 6 | 4 |
| **ARP Timur Laut** | 10.1 | 8 | 6 | 4 |
| **GBP Profile Views** | - | +50% | +100% | +150% |
| **Direction Requests** | - | +30% | +60% | +100% |
| **Website Organic Traffic** | - | +20% | +50% | +100% |
| **Google Posts Engagement** | - | 100+ | 200+ | 300+ |

---

## Competitor Attack Strategy

Berdasarkan Local Falcon report:

### Priority 1: Sewa kasur Jogja Bersih Wangi (Jeje Bed)
- Current: 0 reviews, 0 rating, SoLV 18.37%
- Action:
  - Target area sama (Sidokarto) dengan aggressive review campaign
  - Google Posts mention "kasur bersih & wangi"
  - Approach competitor customers via area-specific campaigns
  - Target overtake: Minggu 6

### Priority 2: Sewa Kasur Jogja PRATAMA
- Current: 9 reviews, 4.1 rating, SoLV 4.08%
- Action:
  - Highlight keunggulan rating 5.0 di posts
  - Offer superior service / faster delivery
  - Target area Depok/Caturtunggal
  - Target overtake: Minggu 8

### Priority 3: JOGJA Extra Bed Series (3 locations)
- Current: 12-26 reviews each, SoLV 2-8%
- Action:
  - Monitor mereka
  - Maintain lead dengan consistent review growth
  - Target overtake: Minggu 10+

---

## Tech Stack & Automation Recommendations

### 1. Review Request Bot (WhatsApp)
**Tech Stack:** TypeScript + Node.js + Whatsapp Business API + Prisma

```typescript
// Example: send review request after 2 days
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function sendReviewRequests() {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  
  const completedTransactions = await prisma.transaction.findMany({
    where: {
      status: 'completed',
      transactionDate: { lte: twoDaysAgo },
      reviewRequested: false
    }
  });

  for (const transaction of completedTransactions) {
    const message = `Halo ${transaction.customerName}, terima kasih sudah sewa kasur di Santi Living! Review 5 bintang kamu sangat membantu kami improve layanan 🙏 [link Google Maps]`;
    
    await sendWhatsAppMessage(transaction.customerPhone, message);
    
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { 
        reviewRequested: true, 
        reviewRequestedAt: new Date() 
      }
    });
  }
}

// Run this function daily via cron job
```

### 2. GBP Post Scheduler
**Tech Stack:** Vite + React (Frontend) + Express (Backend) + Google My Business API

- Schedule posts 1 bulan ke depan
- UI sederhana: date picker, text editor, image upload
- Auto-publish on schedule

### 3. Rank Tracker Scraper
**Tech Stack:** Python + Selenium (for local dev) / BrightData (production)

```python
# Manual tracking backup kalau Local Falcon credits habis
from selenium import webdriver
from selenium.webdriver.common.by import By

def track_ranking(keyword, location):
    options = webdriver.ChromeOptions()
    options.add_argument('--incognito')
    
    driver = webdriver.Chrome(options=options)
    driver.get(f"https://www.google.com/maps/search/{keyword}")
    
    # Find your business position
    results = driver.find_elements(By.CLASS_NAME, "result-container")
    
    for i, result in enumerate(results):
        if "Santi Living" in result.text:
            print(f"Ranking: #{i+1} for {keyword} in {location}")
            break
```

### 4. Tracking Dashboard
**Frontend:** Vite + React + Recharts (for charts)
```
Dashboard features:
- Real-time review counter (connected to GBP)
- Weekly review trend chart
- ATRP progress per region
- Action item checklist
- Local Falcon report integration (manual upload)
```

---

## Expected Outcome (90 Hari)

Dengan eksekusi konsisten:

### Ranking Target
- **Sekarang:** #3 untuk "sewa kasur" di radius 10km Jogja
- **Target 90 hari:** #1 local pack

### SoLV Target
- **Sekarang:** 42.86%
- **Target 90 hari:** 65% (mengalahkan competitor #1 yang sekarang 59.18%)

### Review Target
- **Sekarang:** 16 reviews
- **Target 90 hari:** 80+ reviews (velocity 8-10/minggu)
- **Action:** Maintain rating 5.0

### Geographic Coverage
- **East ATRP:** 14.8 → <5
- **Southeast ATRP:** 10.6 → <5
- **Northeast ATRP:** 10.1 → <5

### Traffic & Conversion
- **Direction requests:** +100%
- **Website organic traffic:** +100% (dari hyperlocal pages)
- **Phone calls/WA inquiries:** +80%
- **Conversion rate:** Expected +50% dari improved ranking

---

## Execution Tips

1. **Consistency > Perfection**: 80% execution konsisten lebih baik dari 100% yang inconsistent
2. **Track Everything**: Update KPI dashboard mingguan. Data-driven optimization.
3. **Respond to Feedback**: Kalau strategy tidak bekerja, adjust di minggu depan
4. **Team Alignment**: Semua tim (sales, operation, delivery) harus tahu tentang review generation
5. **Customer Experience First**: SEO ranking akan naik kalau customer experience bagus
6. **Compound Effect**: Review, posts, dan backlinks bekerja together. Jangan skip satu area.

---

## Kontrol Checkpoints

### Minggu 2 Checkpoint
- Business description updated ✓
- Products setup (8+) ✓
- NAP consistency 100% ✓
- ARP East < 12 ✓

### Minggu 6 Checkpoint
- 32-40 reviews terkumpul ✓
- Rating maintain 5.0 ✓
- SoLV > 45% ✓
- Review velocity 8-10/minggu ✓

### Minggu 10 Checkpoint
- 55+ reviews ✓
- SoLV > 55% ✓
- ARP all regions < 7 ✓
- 3-5 backlinks acquired ✓

### Minggu 12 Final Checkpoint
- 80+ reviews ✓
- SoLV > 60% ✓
- Ranking #1-2 untuk "sewa kasur" ✓
- Dashboard operational ✓

---

**Plan ini aggressive tapi achievable dengan eksekusi konsisten. Sukses! 🚀**
