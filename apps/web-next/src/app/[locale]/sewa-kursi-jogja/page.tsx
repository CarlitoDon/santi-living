import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChairLeadForm } from '@/components/landing/ChairLeadForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { config } from '@/data/config';
import { localizedSiteUrl, primarySiteUrl, PRIMARY_SITE_URL } from '@/lib/site-url';

export function generateStaticParams() {
  return [{ locale: 'id' }, { locale: 'en' }];
}

type Locale = 'id' | 'en';

const PAGE_PATH = '/sewa-kursi-jogja';
const WHATSAPP_DISPLAY = '0895-1911-9092';

const TITLE_ID = 'Sewa Kursi Jogja Mulai Rp3.000 | Siap Antar H-1 Sleman, Jogja & Bantul';
const TITLE_EN = 'Event Chair Rental Yogyakarta — Plastic, Folding & Hotel Chairs';

const DESCRIPTION_ID =
  'Sewa kursi Jogja mulai Rp3.000/unit untuk hajatan, seminar & pengajian. Siap antar H-1 Sleman, Kota Jogja & Bantul. Pesan cepat WhatsApp 0895-1911-9092!';
const DESCRIPTION_EN =
  'Affordable event chair rental in Yogyakarta for celebrations, gatherings, meetings & weddings in Sleman, Yogyakarta City, Bantul, Kulon Progo. Hundreds of units ready for delivery.';

const KEYWORDS_ID = [
  'sewa kursi jogja',
  'sewa kursi acara jogja',
  'rental kursi jogja',
  'sewa kursi plastik jogja',
  'sewa kursi lipat jogja',
  'sewa kursi hotel jogja',
  'sewa kursi hajatan jogja',
  'sewa kursi seminar jogja',
];

const KEYWORDS_EN = [
  'event chair rental yogyakarta',
  'chair rental jogja',
  'plastic chair rental yogyakarta',
  'folding chair rental yogyakarta',
  'hotel chair rental yogyakarta',
  'event chair rental indonesia',
];

const WA_TEXT_ID = [
  'Halo Santi Living, saya ingin cek sewa kursi Jogja.',
  '',
  'Jenis acara:',
  'Jenis kursi:',
  'Jumlah kursi:',
  'Tanggal acara:',
  'Lokasi pengantaran:',
  'Akses venue (lantai/jam bongkar):',
  '',
  'Mohon info ketersediaan, harga, dan ongkir. Terima kasih.',
].join('\n');

const WA_TEXT_EN = [
  'Hello Santi Living, I would like to check event chair rental in Yogyakarta.',
  '',
  'Event type:',
  'Chair type:',
  'Quantity:',
  'Event date:',
  'Delivery address:',
  'Venue access (floor/unloading hours):',
  '',
  'Please share availability, price, and delivery fee. Thank you.',
].join('\n');

function waHref(text: string) {
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

type CatalogItem = {
  name: string;
  price: string;
  numericPrice?: number;
  tag: string;
  image: string;
  imageAlt: string;
  description: string;
};

type HeroPriceItem = { name: string; price: string; note: string };
type PriceRow = { type: string; price: string; bestFor: string };
type PackageItem = { name: string; unitCount: string; price: string; basis: string; tag: string; description: string };
type AreaItem = { name: string; detail: string };
type StepItem = { number: string; title: string; description: string };
type Testimonial = { name: string; text: string };
type Faq = { question: string; answer: string };
type ReadingLink = { label: string; href: string };

type PageCopy = {
  h1: string;
  eyebrow: string;
  heroLead: string;
  heroIntro: string;
  heroCta: string;
  phoneLabel: string;
  trust: string[];
  heroPricesTitle: string;
  heroPricesBadge: string;
  heroPrices: HeroPriceItem[];
  catalogEyebrow: string;
  catalogTitle: string;
  catalogIntro: string;
  priceEyebrow: string;
  priceTitle: string;
  priceIntro: string;
  priceDisclaimer: string;
  priceColumns: [string, string, string];
  priceTips: string[];
  fitEyebrow: string;
  fitTitle: string;
  fitItems: { title: string; description: string }[];
  coverageText: string;
  detailsTitle: string;
  detailsIntro: string;
  details: string[];
  offerCatalogName: string;
  packageEyebrow: string;
  packageTitle: string;
  packageIntro: string;
  packageNote: string;
  packageCta: string;
  areaEyebrow: string;
  areaTitle: string;
  areaIntro: string;
  areaNote: string;
  workshopLabel: string;
  processEyebrow: string;
  processTitle: string;
  testimonialEyebrow: string;
  testimonialTitle: string;
  faqEyebrow: string;
  faqTitle: string;
  readingEyebrow: string;
  readingTitle: string;
  finalCtaTitle: string;
  finalCtaText: string;
  finalCtaLabel: string;
  footerNote: string;
  waText: string;
  catalog: CatalogItem[];
  priceRows: PriceRow[];
  packages: PackageItem[];
  areas: AreaItem[];
  processSteps: StepItem[];
  testimonials: Testimonial[];
  faqs: Faq[];
  readingLinks: ReadingLink[];
};

const CONTENT: Record<Locale, PageCopy> = {
  id: {
    h1: 'Sewa Kursi Jogja',
    eyebrow: 'Sewa kursi Jogja / Santi Living',
    heroLead: 'Mulai Rp3.000/Unit per Hari — Bersih, Kokoh & Siap Kirim Hari Ini',
    heroIntro:
      'Sewa kursi Jogja untuk hajatan, pengajian, seminar, dan pernikahan. Kursi plastik Rp3.000, kursi lipat seminar Rp5.000, dan kursi hotel VIP Rp7.000 per unit per hari. Antar ke Sleman, Kota Jogja, dan Bantul dari workshop Jl. Godean KM 10.',
    heroCta: 'Cek stok via WhatsApp',
    phoneLabel: `WhatsApp ${WHATSAPP_DISPLAY}`,
    trust: ['Ketersediaan dicek berdasarkan tanggal', 'Antar jemput terjadwal', 'Harga transparan tanpa biaya tersembunyi'],
    heroPricesTitle: 'Ringkasan Harga Sewa Kursi',
    heroPricesBadge: 'Siap Antar Jemput',
    heroPrices: [
      {
        name: 'Kursi Plastik Hajatan',
        price: 'Rp 3.000 / unit / hari',
        note: 'Hajatan & syukuran warga',
      },
      {
        name: 'Kursi Lipat Seminar',
        price: 'Rp 5.000 / unit / hari',
        note: 'Rapat, seminar & training',
      },
      {
        name: 'Kursi Hotel VIP',
        price: 'Rp 7.000 / unit / hari',
        note: 'Resepsi & area tamu formal',
      },
    ],
    catalogEyebrow: 'Katalog & harga',
    catalogTitle: 'Pilihan Kursi, Meja & Karpet Permadani',
    catalogIntro:
      'Tarif kursi dihitung per unit per hari. Meja acara dan karpet permadani dikonfirmasi sesuai jumlah, ukuran, dan rute pengantaran.',
    priceEyebrow: 'Daftar harga',
    priceTitle: 'Harga Sewa Kursi Jogja per Unit per Hari',
    priceIntro:
      'Harga di bawah adalah patokan awal agar Anda bisa memperkirakan anggaran sebelum menghubungi admin. Kursi plastik paling hemat untuk tamu banyak, kursi lipat seminar ada di tengah untuk susunan yang fleksibel, dan kursi hotel VIP lebih tinggi karena tampilannya lebih rapi. Harga final tetap mengikuti jumlah unit, tanggal acara, lokasi pengantaran, dan akses venue seperti lantai, tangga, atau jam bongkar.',
    priceDisclaimer: 'Harga dapat berubah — konfirmasi via WhatsApp.',
    priceColumns: ['Jenis', 'Harga', 'Cocok untuk'],
    offerCatalogName: 'Penawaran sewa kursi Jogja',
    packageEyebrow: 'Paket hajatan warga',
    packageTitle: 'Paket Hemat untuk Acara RT, RW & Keluarga',
    packageIntro:
      'Paket di bawah memakai kursi plastik sebagai dasar perhitungan. Untuk hajatan di rumah atau tenda, kursi plastik biasanya menutup barisan utama lalu beberapa kursi hotel VIP merapikan area tamu. Untuk pengajian dan arisan warga, susunan dibuat sederhana agar bongkar dan beres-beres cepat. Untuk rapat dan training kantor, kursi lipat seminar membuat ruangan lebih fleksibel. Campuran jenis kursi dihitung ulang oleh admin sesuai kebutuhan acara.',
    packageNote: 'Estimasi memakai tarif kursi plastik Rp3.000/unit/hari. Ongkir dihitung terpisah.',
    packageCta: 'Pesan paket ini',
    areaEyebrow: 'Cakupan wilayah',
    areaTitle: 'Area Antar Kursi Jogja',
    areaIntro:
      'Armada pickup Santi Living mengantar dari workshop Jl. Godean KM 10, Sleman ke wilayah berikut. Kirim alamat lengkap dan akses bongkar agar rute bisa dicek.',
    priceTips: [
      'Ongkir dihitung terpisah mengikuti jumlah kursi, rute, dan akses bongkar di venue.',
      'Tanggal akhir pekan dan musim hajatan lebih cepat penuh — kabari lebih awal untuk jumlah besar.',
      'Sampaikan info lantai, tangga, dan jam bongkar agar rencana pengantaran realistis.',
      'Kalau layout belum fix, kirim dulu perkiraan jumlah dan tanggal agar stok bisa dicek.',
      'Untuk acara dua hari atau lebih, sebutkan durasinya di awal agar jadwal ambil ikut diatur.',
    ],
    fitEyebrow: 'Untuk acara Anda',
    fitTitle: 'Kursi yang Cocok untuk Setiap Format Acara',
    fitItems: [
      { title: 'Hajatan dan syukuran keluarga', description: 'Kursi plastik menutup barisan utama karena ringan dan cepat ditata, sementara kursi hotel VIP merapikan area tamu. Kirim tanggal, jumlah tamu, dan alamat agar kebutuhan serta jadwal antar bisa dihitung.' },
      { title: 'Pengajian dan kumpul warga', description: 'Susunan kursi dibuat sederhana dan rapat supaya jamaah nyaman dan bongkarnya cepat. Cocok untuk masjid, musala, balai warga, dan halaman rumah. Kabari jam mulai dan jam selesai agar jadwal antar dan ambil bisa diatur.' },
      { title: 'Seminar, rapat, dan acara kantor', description: 'Kursi lipat seminar gampang dipindah dan dilipat lagi setelah sesi selesai. Kirim jumlah peserta, durasi acara, serta akses gedung termasuk lantai dan jam bongkar.' },
    ],
    coverageText:
      'Kami mengantar dari workshop Jl. Godean KM 10, Sleman ke Sleman, Kota Jogja, Bantul, dan Kulon Progo. Kirim alamat venue lengkap plus patokan dan akses bongkarnya. Admin akan mengecek rute, waktu tempuh, dan jadwal armada hari itu sebelum konfirmasi. Kalau aksesnya gang sempit atau harus naik lantai, ceritakan di awal agar tim datang dengan persiapan yang pas.',
    detailsTitle: 'Tiga Informasi Membantu Kami Menjawab Lebih Cepat',
    detailsIntro: 'Siapkan informasi ini sebelum mengirim pertanyaan:',
    details: ['Tanggal dan jam acara', 'Jumlah kursi yang dibutuhkan', 'Lokasi pengantaran dan akses venue'],
    areaNote: 'Untuk menjaga ketepatan waktu, kami tidak melayani pengiriman ke Gunungkidul maupun Solo.',
    workshopLabel: 'Workshop',
    processEyebrow: 'Cara sewa',
    processTitle: 'Tiga Langkah untuk Mendapat Jawaban yang Realistis',
    testimonialEyebrow: 'Cerita penyewa',
    testimonialTitle: 'Cerita Penyewa Kursi di Jogja',
    faqEyebrow: 'Sebelum pesan',
    faqTitle: 'Pertanyaan Seputar Sewa Kursi Jogja',
    readingEyebrow: 'Baca juga',
    readingTitle: 'Panduan Sewa Kursi untuk Acara Anda',
    finalCtaTitle: 'Siap cek kursi untuk acara Anda?',
    finalCtaText:
      'Kirim tanggal, jumlah, pilihan kursi, dan alamat venue. Admin akan mengecek stok serta jadwal pengantaran sebelum Anda konfirmasi.',
    finalCtaLabel: 'Cek Kursi via WhatsApp',
    footerNote:
      'Layanan resmi persewaan kursi acara & perlengkapan acara Yogyakarta. Workshop Jl. Godean KM 10 & Pangkalan Pelemgurih Gamping.',
    waText: WA_TEXT_ID,
    catalog: [
      {
        name: 'Kursi Plastik',
        price: 'Rp3.000/unit/hari',
        numericPrice: 3000,
        tag: 'Paling Laris',
        image: '/images/kursi-plastik-biru.webp',
        imageAlt: 'Kursi plastik biru untuk sewa kursi Jogja',
        description:
          'Plastik polimer tebal, kokoh, ringan, dan mudah ditata. Pilihan paling hemat untuk syukuran, pengajian warga, dan hajatan.',
      },
      {
        name: 'Kursi Lipat Seminar',
        price: 'Rp5.000/unit/hari',
        numericPrice: 5000,
        tag: 'Praktis & Rapi',
        image: '/images/kursi-lipat-merah.webp',
        imageAlt: 'Kursi lipat seminar untuk sewa kursi Jogja',
        description:
          'Rangka besi lipat dengan dudukan dan sandaran empuk. Praktis untuk seminar, rapat dinas, training, dan acara kantor.',
      },
      {
        name: 'Kursi Hotel VIP',
        price: 'Rp7.000/unit/hari',
        numericPrice: 7000,
        tag: 'Elegan & Nyaman',
        image: '/images/kursi-susun-merah.webp',
        imageAlt: 'Kursi hotel VIP untuk sewa kursi Jogja',
        description:
          'Dudukan busa empuk dengan rangka elegan. Nyaman untuk resepsi pernikahan, akad, dan acara formal berdurasi lama.',
      },
      {
        name: 'Meja Acara / Prasmanan',
        price: 'Harga via WhatsApp',
        tag: 'Perlengkapan tambahan',
        image: '/images/kursi-acara-jogja-katalog.webp',
        imageAlt: 'Meja acara dan perlengkapan sewa kursi Jogja',
        description:
          'Meja panjang untuk prasmanan, registrasi tamu, transit katering, atau meja VIP. Jumlah dan ukuran disesuaikan layout acara.',
      },
      {
        name: 'Karpet Permadani',
        price: 'Harga via WhatsApp',
        tag: 'Pelengkap area acara',
        image: '/images/permadani-merah.webp',
        imageAlt: 'Karpet permadani untuk area acara di Jogja',
        description:
          'Permadani untuk area tamu, pelaminan, dan pengajian. Ukuran serta motif dikonfirmasi sesuai kebutuhan venue.',
      },
    ],
    priceRows: [
      { type: 'Kursi plastik', price: 'Rp3.000/unit/hari', bestFor: 'Hajatan, syukuran, dan pengajian dengan tamu banyak.' },
      { type: 'Kursi lipat seminar', price: 'Rp5.000/unit/hari', bestFor: 'Seminar, rapat, training, dan acara kantor.' },
      { type: 'Kursi hotel VIP', price: 'Rp7.000/unit/hari', bestFor: 'Resepsi, akad, dan area tamu yang butuh tampilan rapi.' },
      { type: 'Meja acara / prasmanan', price: 'Konfirmasi via WhatsApp', bestFor: 'Prasmanan, registrasi tamu, dan meja VIP.' },
      { type: 'Karpet permadani', price: 'Konfirmasi via WhatsApp', bestFor: 'Area tamu, pelaminan, dan pengajian.' },
    ],
    packages: [
      { name: 'Paket 50 Unit', unitCount: '50 kursi plastik', price: 'Rp150.000', basis: '50 × Rp3.000', tag: 'Hemat RT/RW', description: 'Untuk syukuran rumah, pengajian rutin, rapat panitia, atau arisan keluarga.' },
      { name: 'Paket 100 Unit', unitCount: '100 kursi plastik', price: 'Rp300.000', basis: '100 × Rp3.000', tag: 'Paling Populer', description: 'Untuk hajatan warga, kenduri, tasyakuran pernikahan, atau halal bihalal.' },
      { name: 'Paket 200 Unit', unitCount: '200 kursi plastik', price: 'Rp600.000', basis: '200 × Rp3.000', tag: 'Kapasitas besar', description: 'Untuk resepsi pernikahan warga, pengajian akbar, atau event instansi dan kampus.' },
    ],
    areas: [
      { name: 'Sleman', detail: 'Depok, Mlati, Godean, Ngaglik & sekitarnya' },
      { name: 'Kota Jogja', detail: 'Gondokusuman, Umbulharjo, Kraton & seluruh kota' },
      { name: 'Bantul', detail: 'Kasihan, Sewon, Banguntapan, Bantul Kota' },
      { name: 'Kulon Progo', detail: 'Wates, Sentolo, Pengasih & sekitarnya' },
    ],
    processSteps: [
      { number: '01', title: 'Kirim detail acara', description: 'Sampaikan jenis kursi, jumlah, tanggal acara, dan alamat pengantaran.' },
      { number: '02', title: 'Cek stok dan rute', description: 'Admin mengecek stok, rute, akses venue, dan jadwal pengantaran.' },
      { number: '03', title: 'Konfirmasi pesanan', description: 'Lanjutkan setelah pilihan, estimasi, dan rencana pengantaran cocok dengan acara.' },
    ],
    testimonials: [
      { name: 'Bu Ratna — syukuran, Sleman', text: 'Sewa 100 kursi plastik untuk syukuran keluarga. Admin tanya tanggal dan alamat dulu, baru kasih jadwal antar yang pasti. Bongkarnya cepat.' },
      { name: 'Mas Dimas — pengajian, Bantul', text: 'Butuh tambahan kursi dua hari sebelum acara. Stok dicek berdasarkan tanggal, rute dikonfirmasi dulu sebelum kami sepakat.' },
      { name: 'Mbak Sari — rapat, Kota Yogyakarta', text: 'Pakai kursi lipat untuk training dua hari. Layout gampang diubah antar sesi, komunikasi WhatsApp jelas dari awal sampai pengambilan.' },
    ],
    faqs: [
      { question: 'Berapa tarif sewa kursi di Jogja?', answer: 'Kursi plastik Rp3.000/unit/hari, kursi lipat seminar Rp5.000/unit/hari, dan kursi hotel VIP Rp7.000/unit/hari. Meja acara dan karpet permadani dihitung terpisah sesuai jumlah dan ukuran — konfirmasi via WhatsApp 0895-1911-9092.' },
      { question: 'Jenis kursi apa yang bisa ditanyakan?', answer: 'Kursi plastik, kursi lipat seminar, dan kursi hotel VIP. Pilihan akhir mengikuti tanggal acara, jumlah, dan stok. Meja acara serta karpet permadani juga tersedia.' },
      { question: 'Berapa minimal order sewa kursi dan bagaimana pengirimannya?', answer: 'Tidak ada minimal order yang kaku — tergantung stok, tanggal, dan rute. Santi Living menyediakan armada pickup dengan antar jemput terjadwal langsung ke lokasi acara.' },
      { question: 'Apakah bisa diantar ke venue saya?', answer: 'Ya, selama venue berada di Sleman, Kota Jogja, Bantul, atau Kulon Progo. Kirim alamat lengkap dan akses bongkar agar rute serta jadwal pengantaran bisa dikonfirmasi.' },
      { question: 'Wilayah mana saja yang dicakup untuk pengiriman kursi?', answer: 'Kami mengantar ke Sleman, Kota Jogja, Bantul, dan Kulon Progo. Kirim alamat venue lengkap beserta akses bongkar via WhatsApp. Kami tidak melayani pengiriman ke Gunungkidul maupun Solo.' },
      { question: 'Apakah kondisi kursi bersih, higienis, dan terawat?', answer: 'Setiap unit disortir dan dibersihkan sebelum dikirim. Kami memastikan kursi bersih, tidak goyang, dan kokoh untuk kenyamanan tamu.' },
      { question: 'Bagaimana alur pemesanan sewa kursi Jogja?', answer: 'Isi formulir di halaman ini atau hubungi WhatsApp admin. Cantumkan jumlah kursi, tanggal acara, dan alamat pengantaran untuk mendapatkan estimasi biaya serta konfirmasi stok.' },
      { question: 'Sebaiknya pesan berapa lama sebelumnya?', answer: 'Semakin awal semakin baik, terutama untuk jumlah besar atau tanggal acara yang sudah tetap. Permintaan mendadak tetap dicek stok dan rutenya terlebih dahulu.' },
      { question: 'Apakah harga sudah termasuk ongkir?', answer: 'Belum. Ongkir dihitung terpisah mengikuti jumlah unit, rute, dan akses bongkar di venue. Kirim alamat lengkap agar admin bisa menghitung estimasi pengantaran.' },
      { question: 'Di mana workshop dan titik layanan Santi Living?', answer: 'Workshop kami di Jl. Godean KM 10, Sleman, dengan pangkalan armada di Pelemgurih, Banyuraden, Gamping, Sleman, DI Yogyakarta 55293.' },
    ],
    readingLinks: [
      { label: 'Panduan sewa kursi plastik untuk acara & hajatan', href: '/id/artikel/sewa-kursi-plastik-jogja-acara-hajatan' },
      { label: 'Checklist kursi untuk tenda hajatan & pernikahan di Sleman', href: '/id/artikel/sewa-kursi-plastik-sleman-tenda-hajatan-pernikahan' },
      { label: 'Tips kursi untuk pengajian & syukuran warga di Bantul', href: '/id/artikel/sewa-kursi-plastik-bantul-pengajian-syukuran-warga' },
    ],
  },
  en: {
    h1: 'Event Chair Rental Yogyakarta',
    eyebrow: 'Event chair rental / Santi Living',
    heroLead: 'From Rp3,000 per Unit per Day — Clean, Sturdy & Ready Today',
    heroIntro:
      'Event chair rental in Yogyakarta for celebrations, gatherings, seminars, and weddings. Plastic chairs Rp3,000, seminar folding chairs Rp5,000, and VIP hotel chairs Rp7,000 per unit per day. Delivered to Sleman, Yogyakarta City, and Bantul from our Jl. Godean KM 10 workshop.',
    heroCta: 'Check stock on WhatsApp',
    phoneLabel: `WhatsApp ${WHATSAPP_DISPLAY}`,
    trust: ['Availability checked by date', 'Scheduled pickup and delivery', 'Transparent pricing without hidden fees'],
    heroPricesTitle: 'Quick Chair Rental Rates',
    heroPricesBadge: 'Delivery & Pickup Ready',
    heroPrices: [
      {
        name: 'Plastic Event Chairs',
        price: 'Rp 3,000 / unit / day',
        note: 'Celebrations & community gatherings',
      },
      {
        name: 'Seminar Folding Chairs',
        price: 'Rp 5,000 / unit / day',
        note: 'Meetings, seminars & training',
      },
      {
        name: 'VIP Hotel Chairs',
        price: 'Rp 7,000 / unit / day',
        note: 'Receptions & formal guest areas',
      },
    ],
    catalogEyebrow: 'Catalog & prices',
    catalogTitle: 'Chairs, Tables & Carpets',
    catalogIntro:
      'Chair rates are per unit per day. Tables and carpets are confirmed by quantity, size, and delivery route.',
    priceEyebrow: 'Price list',
    priceTitle: 'Chair Rental Prices in Yogyakarta per Unit per Day',
    priceIntro:
      'The list below is a starting point so you can estimate a budget before contacting admin. Plastic chairs are the most economical for large guest lists, seminar folding chairs sit in the middle for flexible layouts, and VIP hotel chairs cost more because the look is tidier. The final price still follows quantity, event date, delivery location, and venue access such as floors, stairs, or unloading hours.',
    priceDisclaimer: 'Prices may change — confirm via WhatsApp.',
    priceColumns: ['Type', 'Price', 'Best for'],
    offerCatalogName: 'Event chair rental offers in Yogyakarta',
    packageEyebrow: 'Community packages',
    packageTitle: 'Value Packages for Neighborhood & Family Events',
    packageIntro:
      'These packages use plastic chairs as the base calculation. For home or tent celebrations, plastic chairs usually cover the main rows while a few VIP hotel chairs tidy up the guest area. For community prayers and gatherings, seating is kept simple so packing up is fast. For office meetings and training, seminar folding chairs keep the room flexible. Mixed chair types are recalculated by the admin based on your event.',
    packageNote: 'Estimates use the plastic chair rate of Rp3,000/unit/day. Delivery fees are calculated separately.',
    packageCta: 'Book this package',
    areaEyebrow: 'Service coverage',
    areaTitle: 'Chair Delivery Areas in Yogyakarta',
    areaIntro:
      'The Santi Living pickup fleet delivers from our Jl. Godean KM 10 workshop in Sleman to the areas below. Send the full address and unloading access so the route can be checked.',
    areaNote: 'To keep delivery times reliable, we do not deliver to Gunungkidul or Solo.',
    priceTips: [
      'Delivery fees are calculated separately based on quantity, route, and unloading access.',
      'Weekend and peak-season dates fill up faster — inquire early for large quantities.',
      'Share the floor, stairs, and unloading hours so the delivery plan is realistic.',
      'If the layout is not final yet, send an estimated quantity and date so stock can be checked.',
      'For events lasting two days or more, mention the duration upfront so pickup scheduling is included.',
    ],
    fitEyebrow: 'For your event',
    fitTitle: 'Chairs That Fit Every Event Format',
    fitItems: [
      { title: 'Family celebrations and syukuran', description: 'Plastic chairs cover the main rows because they are light and quick to arrange, while VIP hotel chairs tidy up the guest area. Send the date, guest count, and address so needs and delivery scheduling can be calculated.' },
      { title: 'Community prayers and gatherings', description: 'Seating is arranged simply and densely so guests are comfortable and packing up is fast. Suitable for mosques, prayer rooms, community halls, and home yards. Share the start and end times so delivery and pickup can be scheduled.' },
      { title: 'Seminars, meetings, and office events', description: 'Seminar folding chairs are easy to move and fold away after each session. Send the participant count, event duration, and building access including floor and unloading hours.' },
    ],
    coverageText:
      'We deliver from our Jl. Godean KM 10 workshop in Sleman to Sleman, Yogyakarta City, Bantul, and Kulon Progo. Send the full venue address plus landmarks and unloading access. Admin will check the route, travel time, and fleet schedule for that day before confirming. If access is a narrow alley or requires stairs, tell us upfront so the team arrives prepared.',
    detailsTitle: 'Three Details Help Us Answer Faster',
    detailsIntro: 'Prepare these details before sending an inquiry:',
    details: ['Event date and time', 'Number of chairs needed', 'Delivery location and venue access'],
    workshopLabel: 'Workshop',
    processEyebrow: 'How it works',
    processTitle: 'Three Steps to a Realistic Answer',
    testimonialEyebrow: 'From renters',
    testimonialTitle: 'Notes from Chair Renters in Yogyakarta',
    faqEyebrow: 'Before you order',
    faqTitle: 'Questions About Chair Rental in Yogyakarta',
    readingEyebrow: 'Read next',
    readingTitle: 'Chair Rental Guides for Your Event',
    finalCtaTitle: 'Ready to check chairs for your event?',
    finalCtaText:
      'Send the date, quantity, chair preference, and venue address. Admin will check stock and the delivery schedule before you confirm.',
    finalCtaLabel: 'Check Chairs on WhatsApp',
    footerNote:
      'Official event chair and event equipment rental service in Yogyakarta. Workshop Jl. Godean KM 10 & Pelemgurih Gamping fleet base.',
    waText: WA_TEXT_EN,
    catalog: [
      {
        name: 'Plastic Chair',
        price: 'Rp3,000/unit/day',
        numericPrice: 3000,
        tag: 'Most popular',
        image: '/images/kursi-plastik-biru.webp',
        imageAlt: 'Blue plastic chair available for event chair rental',
        description:
          'Thick polymer plastic, sturdy, light, and easy to arrange. The most economical choice for family gatherings, community prayers, and celebrations.',
      },
      {
        name: 'Seminar Folding Chair',
        price: 'Rp5,000/unit/day',
        numericPrice: 5000,
        tag: 'Practical & tidy',
        image: '/images/kursi-lipat-merah.webp',
        imageAlt: 'Red folding seminar chair available for event chair rental',
        description:
          'Steel folding frame with padded seat and backrest. Practical for seminars, office meetings, and training sessions.',
      },
      {
        name: 'VIP Hotel Chair',
        price: 'Rp7,000/unit/day',
        numericPrice: 7000,
        tag: 'Elegant & comfortable',
        image: '/images/kursi-susun-merah.webp',
        imageAlt: 'VIP hotel chair available for event chair rental',
        description:
          'Padded foam seat with an elegant frame. Comfortable for wedding receptions, ceremonies, and long formal events.',
      },
      {
        name: 'Event Table / Buffet',
        price: 'Price via WhatsApp',
        tag: 'Additional equipment',
        image: '/images/kursi-acara-jogja-katalog.webp',
        imageAlt: 'Event tables and equipment for chair rental',
        description:
          'Long tables for buffet service, guest registration, catering transit, or VIP tables. Quantity and size follow the event layout.',
      },
      {
        name: 'Carpet / Rug',
        price: 'Price via WhatsApp',
        tag: 'Event area complement',
        image: '/images/permadani-merah.webp',
        imageAlt: 'Carpet and rug for event areas in Yogyakarta',
        description:
          'Rugs for guest areas, wedding stages, and community gatherings. Size and pattern are confirmed against the venue.',
      },
    ],
    priceRows: [
      { type: 'Plastic chair', price: 'Rp3,000/unit/day', bestFor: 'Celebrations and community gatherings with many guests.' },
      { type: 'Seminar folding chair', price: 'Rp5,000/unit/day', bestFor: 'Seminars, meetings, training, and office events.' },
      { type: 'VIP hotel chair', price: 'Rp7,000/unit/day', bestFor: 'Receptions, ceremonies, and guest areas that need a tidy look.' },
      { type: 'Event table / buffet', price: 'Confirm via WhatsApp', bestFor: 'Buffet service, guest registration, and VIP tables.' },
      { type: 'Carpet / rug', price: 'Confirm via WhatsApp', bestFor: 'Guest areas, wedding stages, and community gatherings.' },
    ],
    packages: [
      { name: '50-Unit Package', unitCount: '50 plastic chairs', price: 'Rp150,000', basis: '50 × Rp3,000', tag: 'Neighborhood value', description: 'For home gatherings, routine prayers, committee meetings, or family events.' },
      { name: '100-Unit Package', unitCount: '100 plastic chairs', price: 'Rp300,000', basis: '100 × Rp3,000', tag: 'Most popular', description: 'For community celebrations, weddings, and neighborhood events.' },
      { name: '200-Unit Package', unitCount: '200 plastic chairs', price: 'Rp600,000', basis: '200 × Rp3,000', tag: 'Large capacity', description: 'For larger weddings, big community gatherings, or institutional events.' },
    ],
    areas: [
      { name: 'Sleman', detail: 'Depok, Mlati, Godean, Ngaglik & surrounding areas' },
      { name: 'Yogyakarta City', detail: 'Gondokusuman, Umbulharjo, Kraton & the whole city' },
      { name: 'Bantul', detail: 'Kasihan, Sewon, Banguntapan, Bantul town' },
      { name: 'Kulon Progo', detail: 'Wates, Sentolo, Pengasih & surrounding areas' },
    ],
    processSteps: [
      { number: '01', title: 'Send event details', description: 'Share the chair type, quantity, event date, and delivery address.' },
      { number: '02', title: 'Check stock and route', description: 'Admin checks stock, route, venue access, and the delivery schedule.' },
      { number: '03', title: 'Confirm the booking', description: 'Continue once the option, estimate, and delivery plan fit your event.' },
    ],
    testimonials: [
      { name: 'Bu Ratna — family gathering, Sleman', text: 'Rented 100 plastic chairs for a family gathering. Admin asked for the date and address first, then confirmed the delivery schedule. Unloading was quick.' },
      { name: 'Mas Dimas — community prayers, Bantul', text: 'Needed extra chairs two days before the event. Stock was checked by date and the route was confirmed before we agreed.' },
      { name: 'Mbak Sari — meeting, Yogyakarta City', text: 'Used folding chairs for a two-day training. The layout was easy to rearrange between sessions, and WhatsApp communication was clear.' },
    ],
    faqs: [
      { question: 'How much does chair rental cost in Yogyakarta?', answer: 'Plastic chairs are Rp3,000/unit/day, seminar folding chairs Rp5,000/unit/day, and VIP hotel chairs Rp7,000/unit/day. Tables and carpets are calculated separately by quantity and size — confirm via WhatsApp 0895-1911-9092.' },
      { question: 'Which chair types can I ask about?', answer: 'Plastic chairs, seminar folding chairs, and VIP hotel chairs. The final option follows the event date, quantity, and stock. Tables and carpets are also available.' },
      { question: 'Is there a minimum order and how is delivery handled?', answer: 'There is no rigid minimum order — it depends on stock, date, and route. Santi Living provides a pickup fleet with scheduled delivery directly to your event location.' },
      { question: 'Can you deliver to my venue?', answer: 'Yes, as long as the venue is in Sleman, Yogyakarta City, Bantul, or Kulon Progo. Send the full address and unloading access so the route and schedule can be confirmed.' },
      { question: 'Which delivery areas do you cover?', answer: 'We deliver to Sleman, Yogyakarta City, Bantul, and Kulon Progo. Send the full venue address and unloading access via WhatsApp. We do not deliver to Gunungkidul or Solo.' },
      { question: 'Are the chairs clean and well maintained?', answer: 'Every unit is sorted and cleaned before delivery. We make sure the chairs are clean, stable, and sturdy for your guests.' },
      { question: 'How do I book chair rental in Yogyakarta?', answer: 'Fill in the form on this page or contact the WhatsApp admin. Include the chair quantity, event date, and delivery address to receive a cost estimate and stock confirmation.' },
      { question: 'How early should I inquire?', answer: 'Earlier is better, especially for large quantities or fixed event dates. Short-notice requests still need a stock and route check first.' },
      { question: 'Does the price include delivery?', answer: 'No. Delivery is calculated separately based on quantity, route, and unloading access at the venue. Send the full address so admin can estimate delivery.' },
      { question: 'Where is the Santi Living workshop and service point?', answer: 'Our workshop is at Jl. Godean KM 10, Sleman, with a fleet base at Pelemgurih, Banyuraden, Gamping, Sleman, DI Yogyakarta 55293.' },
    ],
    readingLinks: [
      { label: 'Plastic chair rental guide for events & celebrations', href: '/en/artikel/sewa-kursi-plastik-jogja-acara-hajatan' },
      { label: 'Chair checklist for tent celebrations & weddings in Sleman', href: '/en/artikel/sewa-kursi-plastik-sleman-tenda-hajatan-pernikahan' },
      { label: 'Chair tips for community prayers & gatherings in Bantul', href: '/en/artikel/sewa-kursi-plastik-bantul-pengajian-syukuran-warga' },
    ],
  },
};

function buildServiceSchema(locale: Locale) {
  const copy = CONTENT[locale];
  const pageUrl = localizedSiteUrl(PAGE_PATH, locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#sewa-kursi-jogja`,
    name: copy.h1,
    serviceType: 'Chair Rental',
    description: locale === 'en' ? DESCRIPTION_EN : DESCRIPTION_ID,
    url: pageUrl,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${PRIMARY_SITE_URL}#santi-living`,
      name: 'Santi Living',
      telephone: `+${config.whatsappNumber}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Godean KM 10',
        addressLocality: 'Sleman',
        addressRegion: 'DI Yogyakarta',
        addressCountry: 'ID',
      },
    },
    areaServed: copy.areas.map((area) => ({
      '@type': 'AdministrativeArea',
      name: area.name,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: copy.offerCatalogName,
      itemListElement: copy.catalog.flatMap((item) =>
        item.numericPrice === undefined
          ? []
          : [
              {
                '@type': 'Offer',
                priceCurrency: 'IDR',
                price: item.numericPrice,
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  priceCurrency: 'IDR',
                  price: item.numericPrice,
                  unitCode: 'DAY',
                  unitText: locale === 'en' ? 'per unit per day' : 'per unit per hari',
                },
                availability: 'https://schema.org/InStock',
                url: pageUrl,
                itemOffered: {
                  '@type': 'Service',
                  name: item.name,
                  description: item.description,
                },
              },
            ],
      ),
    },
  };
}

function buildFaqSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CONTENT[locale].faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'en' ? 'en' : 'id';
  const copy = CONTENT[locale];
  const isEn = locale === 'en';
  const title = isEn ? TITLE_EN : TITLE_ID;
  const description = isEn ? DESCRIPTION_EN : DESCRIPTION_ID;
  const pageUrl = localizedSiteUrl(PAGE_PATH, locale);
  const heroImageUrl = primarySiteUrl('/images/kursi-acara-jogja-pickup.webp');

  return {
    metadataBase: new URL(PRIMARY_SITE_URL),
    title,
    description,
    keywords: isEn ? KEYWORDS_EN : KEYWORDS_ID,
    alternates: {
      canonical: pageUrl,
      languages: {
        id: localizedSiteUrl(PAGE_PATH, 'id'),
        en: localizedSiteUrl(PAGE_PATH, 'en'),
        'x-default': localizedSiteUrl(PAGE_PATH, 'id'),
      },
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      locale: isEn ? 'en_US' : 'id_ID',
      siteName: 'Santi Living',
      images: [
        {
          url: heroImageUrl,
          width: 1200,
          height: 630,
          alt: copy.catalog[0].imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [heroImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SewaKursiJogjaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === 'en' ? 'en' : 'id';
  const copy = CONTENT[locale];
  const whatsappHref = waHref(copy.waText);

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-stone-900">
      <JsonLd data={buildServiceSchema(locale)} />
      <JsonLd data={buildFaqSchema(locale)} />

      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3" aria-label="Santi Living">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#315a72] text-base font-black text-white shadow-sm"
            >
              S
            </span>
            <div>
              <span className="block text-lg font-black tracking-tight text-stone-900">Santi Living</span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                {locale === 'en' ? 'Chair rental DIY' : 'Persewaan Kursi DIY'}
              </span>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {WHATSAPP_DISPLAY}
          </span>
        </div>
      </header>

      <section className="border-b border-stone-200/70 py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
            <div className="lg:col-span-7">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-bold shadow-sm">
                <span className="text-amber-500">★★★★★ 5.0</span>
                <span className="text-stone-300">•</span>
                <span className="font-semibold text-stone-700">100+ Ulasan Maps</span>
                <span className="text-stone-300">•</span>
                <span className="text-[#315a72]">{locale === 'en' ? 'Delivered across DIY' : 'Siap Antar se-DIY'}</span>
              </div>

              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#315a72]">{copy.eyebrow}</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl md:text-5xl">{copy.h1}</h1>
              <p className="mt-2 text-xl font-bold text-[#315a72]">{copy.heroLead}</p>
              <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">{copy.heroIntro}</p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={whatsappHref}
                  data-wa-source="chair_lp_hero"
                  data-wa-location="chair_hero"
                  data-product-category="kursi"
                  data-page-type="landing"
                  data-wa-intent="sewa_kursi_jogja"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#315a72] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#28495c]"
                >
                  {copy.heroCta} <span aria-hidden="true">↗</span>
                </a>
                <span className="text-sm font-semibold text-stone-700">{copy.phoneLabel}</span>
              </div>

              <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#D95D24]" aria-hidden="true" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#315a72]">
                      {copy.heroPricesTitle}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    {copy.heroPricesBadge}
                  </span>
                </div>
                <div className="divide-y divide-stone-100">
                  {copy.heroPrices.map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col py-2.5 first:pt-3 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <div>
                        <span className="text-sm font-bold text-stone-900">{item.name}</span>
                        <span className="block text-xs text-stone-500 sm:inline sm:before:content-['—_']">
                          ({item.note})
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-black text-[#D95D24] sm:mt-0 sm:text-right sm:text-base">
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 shadow-md">
                <Image
                  src="/images/kursi-acara-jogja-pickup.webp"
                  alt={locale === 'en' ? 'Santi Living pickup fleet ready to deliver event chairs' : 'Armada pickup sewa kursi Jogja Santi Living siap antar'}
                  width={640}
                  height={400}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>

              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label={locale === 'en' ? 'Service highlights' : 'Keunggulan layanan'}>
                {copy.trust.map((item) => (
                  <li key={item} className="rounded-xl border border-stone-200/80 bg-white p-3 shadow-sm">
                    <p className="text-xs font-bold text-stone-900">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div id="form-pemesanan" className="mt-8 scroll-mt-20 lg:col-span-5 lg:mt-0">
              <ChairLeadForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              {copy.catalogEyebrow}
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">{copy.catalogTitle}</h2>
            <p className="mt-2 text-sm text-stone-600">{copy.catalogIntro}</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {copy.catalog.map((item) => (
              <article key={item.name} className="flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div>
                  <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-stone-50">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="rounded-xl object-contain p-2"
                    />
                  </div>
                  <span className="inline-block rounded-md bg-[#315a72]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#315a72]">{item.tag}</span>
                  <h3 className="mt-2.5 text-base font-bold text-stone-900">{item.name}</h3>
                  <p className="mt-1.5 text-lg font-black text-[#D95D24]">{item.price}</p>
                  <p className="mt-2 text-xs leading-relaxed text-stone-600">{item.description}</p>
                </div>
                <div className="pt-5">
                  <a
                    href={whatsappHref}
                    data-wa-source="chair_lp_catalog"
                    data-wa-location="chair_catalog"
                    data-product-category="kursi"
                    data-page-type="landing"
                    data-wa-intent="sewa_kursi_jogja"
                    className="block w-full rounded-xl bg-[#315a72] py-2 text-center text-xs font-bold text-white shadow-sm transition hover:bg-[#28495c]"
                  >
                    {locale === 'en' ? `Ask about ${item.name}` : `Tanya ${item.name}`}
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 overflow-x-auto">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D95D24]/10 px-3 py-1 text-xs font-bold text-[#D95D24]">
                {copy.priceEyebrow}
              </span>
              <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">{copy.priceTitle}</h2>
              <p className="mt-2 text-sm text-stone-600">{copy.priceIntro}</p>
            </div>
            <table className="mx-auto mt-8 w-full max-w-4xl border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-stone-300">
                  {copy.priceColumns.map((column) => (
                    <th key={column} scope="col" className="px-3 py-3 font-bold text-stone-900">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {copy.priceRows.map((row) => (
                  <tr key={row.type} className="border-b border-stone-200">
                    <td className="px-3 py-3 font-bold text-stone-900">{row.type}</td>
                    <td className="px-3 py-3 font-semibold text-[#315a72]">{row.price}</td>
                    <td className="px-3 py-3 text-stone-600">{row.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mx-auto mt-4 max-w-4xl text-xs text-stone-500">{copy.priceDisclaimer}</p>
            <ul className="mx-auto mt-4 max-w-4xl list-disc space-y-1 pl-5 text-xs text-stone-600">
              {copy.priceTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200/80 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              {copy.fitEyebrow}
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">{copy.fitTitle}</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {copy.fitItems.map((item, index) => (
              <article key={item.title} className="rounded-2xl border border-stone-200/90 bg-[#FDFBF7] p-6 shadow-sm">
                <span className="text-sm font-black text-[#D95D24]">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-base font-bold text-stone-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200/80 bg-stone-50/60 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D95D24]/10 px-3 py-1 text-xs font-bold text-[#D95D24]">
              {copy.packageEyebrow}
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">{copy.packageTitle}</h2>
            <p className="mt-2 text-sm text-stone-600">{copy.packageIntro}</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {copy.packages.map((pkg, index) => (
              <article
                key={pkg.name}
                className={`flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                  index === 1 ? 'border-[#315a72] ring-2 ring-[#315a72]/15' : 'border-stone-200/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#315a72]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#315a72]">{pkg.tag}</span>
                    <span className="text-xs font-semibold text-stone-500">{pkg.unitCount}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-black text-stone-900">{pkg.name}</h3>
                  <p className="mt-2 text-2xl font-black text-[#D95D24]">{pkg.price}</p>
                  <p className="mt-1 text-xs font-semibold text-stone-500">{pkg.basis}</p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">{pkg.description}</p>
                </div>
                <div className="pt-6">
                  <a
                    href={whatsappHref}
                    data-wa-source="chair_lp_package"
                    data-wa-location="chair_package"
                    data-product-category="kursi"
                    data-page-type="landing"
                    data-wa-intent="sewa_kursi_jogja"
                    className="block w-full rounded-xl bg-[#315a72] py-2.5 text-center text-xs font-bold text-white shadow-sm transition hover:bg-[#28495c]"
                  >
                    {copy.packageCta}
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-stone-500">{copy.packageNote}</p>
        </div>
      </section>

      <section className="border-t border-stone-200/80 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              {copy.areaEyebrow}
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">{copy.areaTitle}</h2>
            <p className="mt-2 text-sm text-stone-600">{copy.areaIntro}</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {copy.areas.map((area) => (
              <div key={area.name} className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 text-center">
                <span className="text-lg font-black text-emerald-700">✓ {area.name}</span>
                <p className="mt-1 text-xs text-stone-600">{area.detail}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-stone-600">{copy.coverageText}</p>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center">
            <p className="text-xs font-bold text-stone-900">
              {copy.workshopLabel}: Jl. Godean KM 10, Sleman
            </p>
            <p className="mt-1 text-xs leading-relaxed text-stone-600">{copy.areaNote}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200/80 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              {copy.processEyebrow}
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">{copy.processTitle}</h2>
          </div>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {copy.processSteps.map((step) => (
              <li key={step.number} className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-sm">
                <span className="text-sm font-black text-[#D95D24]">{step.number}</span>
                <h3 className="mt-2 text-base font-bold text-stone-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{step.description}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 rounded-2xl border border-stone-200/90 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-stone-900">{copy.detailsTitle}</h3>
            <p className="mt-1 text-sm text-stone-600">{copy.detailsIntro}</p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-3">
              {copy.details.map((detail, index) => (
                <li key={detail} className="rounded-xl bg-stone-50 p-3 text-sm font-semibold text-stone-800">
                  {String(index + 1).padStart(2, '0')}. {detail}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200/80 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              {copy.testimonialEyebrow}
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">{copy.testimonialTitle}</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {copy.testimonials.map((item) => (
              <figure key={item.name} className="flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-[#FDFBF7] p-6 shadow-sm">
                <blockquote className="text-sm leading-relaxed text-stone-700">&ldquo;{item.text}&rdquo;</blockquote>
                <figcaption className="mt-4 border-t border-stone-200/60 pt-3 text-xs font-bold text-stone-800">{item.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200/80 bg-[#FDFBF7] py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              {copy.faqEyebrow}
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">{copy.faqTitle}</h2>
          </div>
          <div className="mt-10 space-y-4">
            {copy.faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm transition open:shadow-md">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-stone-900 sm:text-base">
                  <span>{faq.question}</span>
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition group-open:rotate-180" aria-hidden="true">
                    ↓
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200/80 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              {copy.readingEyebrow}
            </span>
            <h2 className="mt-3 text-2xl font-black text-stone-900 sm:text-3xl">{copy.readingTitle}</h2>
          </div>
          <ul className="mt-8 space-y-3">
            {copy.readingLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-semibold text-[#315a72] underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-stone-200/80 bg-[#315a72] py-12 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-black">{copy.finalCtaTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/85">{copy.finalCtaText}</p>
            <p className="mt-2 text-sm font-semibold">{copy.phoneLabel}</p>
          </div>
          <a
            href={whatsappHref}
            data-wa-source="chair_lp_bottom"
            data-wa-location="chair_bottom"
            data-product-category="kursi"
            data-page-type="landing"
            data-wa-intent="sewa_kursi_jogja"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#315a72] shadow-sm transition hover:bg-stone-100"
          >
            {copy.finalCtaLabel} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer className="border-t border-stone-300 bg-slate-950 py-10 text-center text-slate-300">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#315a72] text-xs font-black text-white">S</span>
              <span className="text-base font-black text-white">Santi Living</span>
            </div>
            <p className="max-w-xl text-xs leading-relaxed text-slate-400">{copy.footerNote}</p>
            <p className="text-xs font-semibold text-slate-300">{copy.phoneLabel}</p>
            <p className="mt-2 text-[11px] text-slate-500">&copy; 2026 Santi Living. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
