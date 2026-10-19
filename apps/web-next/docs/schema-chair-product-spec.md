# Spesifikasi JSON-LD Schema: Product & AggregateOffer Katalog Kursi Acara Jogja

Dokumen perancangan terstruktur resmi untuk money page `https://santiliving.com/id/sewa-kursi-acara`.
Tujuan: Menginjeksikan entitas harga sewa kursi transparan (Rp 3.000 – Rp 7.000) ke Knowledge Graph Google dan mesin penjawab AI (ChatGPT/Perplexity/Google SGE).

---

## 1. Schema JSON-LD (Product + AggregateOffer)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Layanan Sewa Kursi Acara Jogja — Santi Living",
  "description": "Persewaan kursi acara di Yogyakarta: kursi plastik hajatan warga mulai Rp 3.000, kursi lipat seminar mulai Rp 5.000, dan kursi hotel rapat dinas mulai Rp 7.000 per unit/hari. Siap antar jemput langsung dari workshop Jl. Godean KM 10 ke Sleman, Kota Jogja, dan Bantul.",
  "image": [
    "https://files.catbox.moe/ogww4f.jpg"
  ],
  "brand": {
    "@type": "Brand",
    "name": "Santi Living"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "IDR",
    "lowPrice": "3000",
    "highPrice": "7000",
    "offerCount": "3",
    "offers": [
      {
        "@type": "Offer",
        "name": "Sewa Kursi Plastik Acara Jogja",
        "price": "3000",
        "priceCurrency": "IDR",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/UsedCondition",
        "url": "https://santiliving.com/id/sewa-kursi-acara"
      },
      {
        "@type": "Offer",
        "name": "Sewa Kursi Lipat Seminar Jogja",
        "price": "5000",
        "priceCurrency": "IDR",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/UsedCondition",
        "url": "https://santiliving.com/id/sewa-kursi-acara"
      },
      {
        "@type": "Offer",
        "name": "Sewa Kursi Hotel VIP Rapat Jogja",
        "price": "7000",
        "priceCurrency": "IDR",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/UsedCondition",
        "url": "https://santiliving.com/id/sewa-kursi-acara"
      }
    ]
  }
}
```

---

## 2. Checklist Kepatuhan & Eksekusi
- [x] Schema menggunakan JSON-LD sesuai standar Google Search Central.
- [x] Harga tertera sesuai tarif resmi: Rp 3.000, Rp 5.000, dan Rp 7.000 (tidak ada hidden fee).
- [x] Sesuai guardrail Don Santo: implementasi kode Next.js didelegasikan ke OMP (`omp -p "..."`) saat sprint kode aplikasi berlangsung.
