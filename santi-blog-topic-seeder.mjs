#!/usr/bin/env node
/**
 * SANTI BLOG TOPIC SEEDER
 * 
 * Populates blog_topics.db from wiki research data:
 * - 35 areas × multiple services → area-specific topics
 * - Scenario-based topics
 * - How-to / comparison topics
 * - Transactional, commercial, informational variants
 * 
 * Run: node santi-blog-topic-seeder.mjs
 * DB: /Users/wecik/.hermes/profiles/don-santo/scripts/blog_topics.db
 */

import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { open } from "node:fs/promises";
import path from "node:path";

const DB_PATH = path.resolve(
  new URL(".", import.meta.url).pathname,
  "blog_topics.db"
);

/** Slugify Indonesian text */
function slug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function slugFrom(title) {
  return slug(title).replace(/[^a-z0-9-]/g, "");
}

function json(v) {
  return JSON.stringify(v);
}

// ============ TOPIC DEFINITIONS ============

const AREAS = [
  // Kota Jogja
  { area: "jogja", label: "Jogja", parent: "kota jogja" },
  { area: "yogyakarta", label: "Yogyakarta", parent: "kota jogja" },
  { area: "gondokusuman", label: "Gondokusuman", parent: "kota jogja" },
  { area: "umbulharjo", label: "Umbulharjo", parent: "kota jogja" },
  { area: "kotagede", label: "Kotagede", parent: "kota jogja" },
  { area: "ngampilan", label: "Ngampilan", parent: "kota jogja" },
  { area: "danurejan", label: "Danurejan", parent: "kota jogja" },
  { area: "pakualaman", label: "Pakualaman", parent: "kota jogja" },
  { area: "kraton", label: "Kraton", parent: "kota jogja" },
  { area: "mergangsan", label: "Mergangsan", parent: "kota jogja" },
  // Sleman
  { area: "sleman", label: "Sleman", parent: "sleman" },
  { area: "seturan", label: "Seturan", parent: "sleman" },
  { area: "babarsari", label: "Babarsari", parent: "sleman" },
  { area: "condongcatur", label: "Condongcatur", parent: "sleman" },
  { area: "kaliurang", label: "Kaliurang", parent: "sleman" },
  { area: "ngaglik", label: "Ngaglik", parent: "sleman" },
  { area: "gejayan", label: "Gejayan", parent: "sleman" },
  { area: "mlati", label: "Mlati", parent: "sleman" },
  { area: "ngemplak", label: "Ngemplak", parent: "sleman" },
  { area: "prambanan", label: "Prambanan", parent: "sleman" },
  { area: "gamping", label: "Gamping", parent: "sleman" },
  { area: "moyudan", label: "Moyudan", parent: "sleman" },
  { area: "minggir", label: "Minggir", parent: "sleman" },
  { area: "depok-sleman", label: "Depok Sleman", parent: "sleman" },
  { area: "godean", label: "Godean", parent: "sleman" },
  // Bantul
  { area: "bantul", label: "Bantul", parent: "bantul" },
  { area: "kasihan", label: "Kasihan", parent: "bantul" },
  { area: "sewon", label: "Sewon", parent: "bantul" },
  { area: "jetis-bantul", label: "Jetis Bantul", parent: "bantul" },
  // Kulonprogo
  { area: "kulonprogo", label: "Kulonprogo", parent: "kulonprogo" },
];

const SERVICES = [
  { service: "sewa kasur", label: "Sewa Kasur", cat: "kasur" },
  { service: "rental kasur", label: "Rental Kasur", cat: "kasur" },
  { service: "extra bed", label: "Extra Bed", cat: "kasur" },
  { service: "karpet", label: "Karpet", cat: "perlengkapan" },
  { service: "permadani", label: "Permadani", cat: "perlengkapan" },
  { service: "kipas angin", label: "Kipas Angin", cat: "elektronik" },
  { service: "air cooler", label: "Air Cooler", cat: "elektronik" },
  { service: "tv", label: "TV", cat: "elektronik" },
  { service: "bantal", label: "Bantal", cat: "perlengkapan tidur" },
  { service: "guling", label: "Guling", cat: "perlengkapan tidur" },
  { service: "selimut", label: "Selimut", cat: "perlengkapan tidur" },
  { service: "spre", label: "Sprei", cat: "perlengkapan tidur" },
  { service: "perlengkapan acara", label: "Perlengkapan Acara", cat: "acara" },
  { service: "kompor", label: "Kompor", cat: "perlengkapan" },
  { service: "meja kursi", label: "Meja Kursi", cat: "perlengkapan" },
];

const SCENARIOS = [
  {
    slugSuffix: "tamu-keluarga",
    title: "Tamu Keluarga",
    desc: "keluarga yang kedatangan saudara atau tamu menginap",
    scenario:
      "rumah terasa cukup luas untuk berkumpul tetapi jumlah kasur tidak cukup untuk semua tamu",
    focus: "kasur, bantal, guling, dan selimut",
    audience: "keluarga yang sering menerima tamu luar kota",
  },
  {
    slugSuffix: "kos-dan-kontrakan-mahasiswa",
    title: "Kos dan Kontrakan Mahasiswa",
    desc: "mahasiswa dan penghuni kos yang butuh perlengkapan tidur sementara",
    scenario:
      "kasur pribadi belum datang, ada teman menginap, atau kamar kontrakan perlu disiapkan cepat",
    focus: "kasur lipat, bantal, guling, dan kipas angin",
    audience: "mahasiswa dan penghuni kos di Jogja",
  },
  {
    slugSuffix: "homestay-dan-penginapan",
    title: "Homestay dan Penginapan",
    desc: "pemilik homestay yang butuh extra bed untuk tamu tambahan",
    scenario:
      "jumlah tamu bertambah sementara kapasitas tempat tidur utama terbatas",
    focus: "extra bed, bantal, guling, selimut, dan kipas angin",
    audience: "pemilik homestay dan pengelola guest house",
  },
  {
    slugSuffix: "acara-pengajian",
    title: "Acara Pengajian",
    desc: "keluarga yang mengadakan pengajian, yasinan, atau tahlilan",
    scenario:
      "acara pengajian di rumah dengan tamu lesehan dalam jumlah banyak",
    focus: "karpet, kasur, bantal, guling, kipas angin, dan air cooler",
    audience: "keluarga dan panitia yang mengadakan pengajian",
  },
  {
    slugSuffix: "reuni-keluarga",
    title: "Reuni Keluarga",
    desc: "reuni keluarga besar yang butuh banyak tempat tidur",
    scenario:
      "anggota keluarga datang dari luar kota dan semua butuh tempat tidur di satu lokasi",
    focus: "kasur, extra bed, bantal, guling, selimut, dan kipas angin",
    audience: "keluarga yang merencanakan reuni",
  },
  {
    slugSuffix: "wedding-dan-resepsi",
    title: "Wedding dan Resepsi",
    desc: "persiapan pernikahan dengan pengiring dan keluarga yang menginap",
    scenario:
      "hari H pernikahan dan banyak pengiring serta saudara yang butuh tempat istirahat sementara",
    focus: "kasur, extra bed, karpet, kipas angin, air cooler, bantal, dan guling",
    audience: "keluarga yang menyiapkan acara pernikahan",
  },
  {
    slugSuffix: "open-house",
    title: "Open House",
    desc: "open house keluarga, kantor kecil, atau komunitas",
    scenario:
      "tamu datang bertahap sepanjang hari dan area rumah perlu tetap nyaman",
    focus: "karpet, kipas angin, air cooler, kasur cadangan",
    audience: "keluarga, komunitas, dan tim kecil yang mengadakan open house",
  },
  {
    slugSuffix: "tamu-menginap-mendadak",
    title: "Tamu Menginap Mendadak",
    desc: "tamu yang datang tanpa rencana panjang dan butuh perlengkapan cepat",
    scenario:
      "kabar tamu menginap datang di hari yang sama dan perlengkapan tidur di rumah belum cukup",
    focus: "kasur, bantal, guling, selimut, kipas angin",
    audience: "keluarga yang sering menerima tamu luar kota",
  },
  {
    slugSuffix: "study-tour-rombongan",
    title: "Study Tour dan Rombongan",
    desc: "sekolah atau rombongan yang menginap di Jogja",
    scenario:
      "rombongan besar datang untuk study tour dan butuh perlengkapan tidur di satu tempat",
    focus: "kasur, bantal, guling, selimut, kipas angin",
    audience: "panitia study tour dan sekolah yang membawa rombongan ke Jogja",
  },
  {
    slugSuffix: "liburan-keluarga",
    title: "Liburan Keluarga",
    desc: "wisatawan keluarga yang menginap di Jogja",
    scenario:
      "keluarga berlibur ke Jogja dan penginapan tidak menyediakan kasur cukup",
    focus: "kasur, extra bed, bantal, guling, selimut",
    audience: "wisatawan keluarga yang berlibur ke Jogja",
  },
];

const HOW_TOS = [
  {
    slug: "cara-memilih-kasur-sewa-yang-nyaman",
    title: "Cara Memilih Kasur Sewa yang Nyaman di Jogja",
    description:
      "Tips memilih kasur sewa yang nyaman untuk tidur di Jogja: jenis busa, ukuran, ketebalan, dan kondisi kebersihan.",
    tags: ["tips", "sewa kasur", "jogja", "kenyamanan"],
    intent: [
      "tips memilih kasur sewa",
      "cara memilih kasur sewa",
      "kasur sewa nyaman",
    ],
    audience: "calon penyewa kasur di Jogja",
    scenario:
      "pertama kali sewa kasur dan tidak tahu kriteria apa yang harus diperhatikan",
    focus: "kasur busa, ukuran kasur, ketebalan, kebersihan",
    area: "",
    service: "sewa kasur",
    type: "howto",
  },
  {
    slug: "perbedaan-kasur-busa-vs-springbed-untuk-sewa",
    title: "Perbedaan Kasur Busa vs Springbed untuk Sewa",
    description:
      "Perbandingan kasur busa dan springbed untuk kebutuhan sewa di Jogja: kenyamanan, harga, daya tahan, dan cocok untuk siapa.",
    tags: ["perbandingan", "kasur busa", "springbed", "sewa kasur", "jogja"],
    intent: [
      "perbedaan kasur busa vs springbed",
      "kasur busa atau springbed",
      "jenis kasur sewa",
    ],
    audience: "calon penyewa yang bingung memilih jenis kasur",
    scenario:
      "tidak tahu perbedaan antara kasur busa dan springbed untuk disewa",
    focus: "kasur busa, springbed, kasur lipat",
    area: "",
    service: "sewa kasur",
    type: "comparison",
  },
  {
    slug: "keuntungan-sewa-vs-beli-kasur",
    title: "Sewa vs Beli Kasur: Mana yang Lebih Hemat?",
    description:
      "Perbandingan biaya dan keuntungan menyewa vs membeli kasur untuk kebutuhan sementara di Jogja.",
    tags: ["perbandingan", "sewa kasur", "beli kasur", "jogja", "hemat"],
    intent: [
      "keuntungan menyewa kasur",
      "sewa vs beli kasur",
      "lebih hemat sewa atau beli kasur",
    ],
    audience: "orang yang ragu antara sewa atau beli kasur baru",
    scenario:
      "butuh kasur untuk sementara tapi bingung lebih ekonomis sewa atau beli",
    focus: "kasur, biaya, durasi pemakaian",
    area: "",
    service: "sewa kasur",
    type: "comparison",
  },
  {
    slug: "tips-menjaga-kebersihan-kasur-sewa",
    title: "Tips Menjaga Kebersihan Kasur Sewa",
    description:
      "Panduan menjaga kebersihan kasur sewaan di Jogja: alas kasur, sprei, ventilasi, dan perawatan sederhana.",
    tags: ["tips", "kebersihan", "kasur sewa", "jogja"],
    intent: [
      "tips menjaga kebersihan kasur sewa",
      "apakah kasur sewaan bersih",
      "merawat kasur sewa",
    ],
    audience: "penyewa kasur yang peduli kebersihan",
    scenario: "khawatir kasur sewaan kurang bersih atau higienis",
    focus: "spre, alas kasur, pembersihan, ventilasi",
    area: "",
    service: "sewa kasur",
    type: "howto",
  },
  {
    slug: "berapa-biaya-sewa-kasur-di-jogja",
    title: "Berapa Biaya Sewa Kasur di Jogja? Simulasi Lengkap",
    description:
      "Rincian biaya sewa kasur di Jogja: harga per hari, per minggu, per bulan, biaya antar jemput, dan simulasi total.",
    tags: [
      "biaya",
      "harga",
      "sewa kasur",
      "jogja",
      "simulasi",
    ],
    intent: [
      "berapa biaya sewa kasur jogja",
      "harga sewa kasur per hari jogja",
      "daftar harga sewa kasur jogja",
    ],
    audience: "calon penyewa yang ingin tahu estimasi biaya",
    scenario:
      "ingin sewa kasur tapi tidak tahu kisaran harga dan biaya tambahan",
    focus: "harga sewa, biaya antar, durasi, deposit",
    area: "",
    service: "sewa kasur",
    type: "howto",
  },
  {
    slug: "berapa-minimal-sewa-kasur-di-jogja",
    title: "Berapa Minimal Sewa Kasur di Jogja?",
    description:
      "Informasi durasi minimal sewa kasur di Jogja: apakah bisa sewa 1 hari, berapa lama minimal, dan tips efisiensi biaya.",
    tags: [
      "minimal sewa",
      "durasi",
      "sewa kasur",
      "jogja",
      "FAQ",
    ],
    intent: [
      "minimal sewa kasur jogja",
      "berapa lama sewa kasur jogja",
      "apakah bisa sewa kasur 1 hari",
    ],
    audience: "calon penyewa yang butuh jangka pendek",
    scenario: "butuh kasur hanya untuk 1-2 malam dan khawatir ada minimal sewa",
    focus: "minimal sewa, durasi, biaya per hari",
    area: "",
    service: "sewa kasur",
    type: "howto",
  },
  {
    slug: "tips-memilih-extra-bed-untuk-tamu",
    title: "Tips Memilih Extra Bed untuk Tamu di Jogja",
    description:
      "Panduan memilih extra bed atau kasur tambahan untuk tamu di Jogja: ukuran, jenis, dan perlengkapan pendukung.",
    tags: ["extra bed", "tips", "tamu", "jogja"],
    intent: [
      "tips memilih extra bed",
      "extra bed untuk tamu",
      "kasur tambahan tamu",
    ],
    audience: "tuan rumah yang akan kedatangan tamu menginap",
    scenario:
      "tamu datang dan kasur yang ada tidak cukup, perlu extra bed yang nyaman",
    focus: "extra bed, kasur lipat, bantal, guling",
    area: "",
    service: "extra bed",
    type: "howto",
  },
  {
    slug: "cara-memilih-karpet-untuk-acara-di-rumah",
    title: "Cara Memilih Karpet untuk Acara di Rumah",
    description:
      "Panduan memilih karpet untuk acara di rumah: ukuran ruang, jumlah tamu, motif, dan tips kebersihan.",
    tags: ["karpet", "acara", "tips", "jogja"],
    intent: ["cara memilih karpet acara", "tips memilih karpet", "karpet untuk acara rumah"],
    audience: "keluarga yang akan mengadakan acara lesehan",
    scenario: "acara di rumah dengan tamu duduk lesehan dan butuh karpet yang pas",
    focus: "karpet, ukuran, motif, kebersihan",
    area: "",
    service: "karpet",
    type: "howto",
  },
  {
    slug: "perbedaan-kipas-angin-berdiri-vs-dinding",
    title: "Kipas Angin Berdiri vs Tempel Dinding: Mana untuk Acara?",
    description:
      "Perbandingan kipas angin berdiri dan tempel dinding untuk acara di Jogja: sirkulasi udara, portabilitas, dan efisiensi.",
    tags: ["perbandingan", "kipas angin", "acara", "jogja"],
    intent: ["perbedaan kipas angin berdiri vs dinding", "kipas angin untuk acara", "jenis kipas angin"],
    audience: "penyelenggara acara yang butuh sirkulasi udara",
    scenario: "acara di ruang tertutup dan bingung pilih jenis kipas angin yang tepat",
    focus: "kipas angin berdiri, kipas dinding, air cooler",
    area: "",
    service: "kipas angin",
    type: "comparison",
  },
  {
    slug: "panduan-sewa-tv-untuk-acara-dan-nobar",
    title: "Panduan Sewa TV untuk Acara dan Nobar di Jogja",
    description:
      "Panduan menyewa TV untuk nonton bareng, presentasi, dan acara di Jogja: ukuran, jenis, dan perlengkapan pendukung.",
    tags: ["sewa tv", "nobar", "acara", "jogja", "panduan"],
    intent: ["panduan sewa tv jogja", "sewa tv untuk nobar", "sewa tv untuk presentasi"],
    audience: "keluarga, komunitas, dan panitia acara",
    scenario: "butuh layar besar untuk acara tapi tidak ingin membeli TV baru",
    focus: "TV LED, smart TV, ukuran, perlengkapan pendukung",
    area: "",
    service: "tv",
    type: "howto",
  },
  {
    slug: "perbedaan-air-cooler-vs-ac-portable",
    title: "Air Cooler vs AC Portable: Mana yang Cocok untuk Sewa?",
    description:
      "Perbandingan air cooler dan AC portable untuk kebutuhan sewa acara di Jogja: biaya, efektivitas, dan kemudahan penggunaan.",
    tags: ["perbandingan", "air cooler", "ac portable", "sewa", "jogja"],
    intent: ["perbedaan air cooler vs ac portable", "air cooler atau ac portable", "pendingin ruangan sewa"],
    audience: "penyelenggara acara di ruang panas",
    scenario: "ruangan gerah saat acara dan perlu pendingin portabel",
    focus: "air cooler, AC portable, biaya sewa",
    area: "",
    service: "air cooler",
    type: "comparison",
  },
  {
    slug: "cara-menghitung-kebutuhan-bantal-guling-rombongan",
    title: "Cara Menghitung Kebutuhan Bantal Guling untuk Rombongan",
    description:
      "Cara praktis menghitung jumlah bantal dan guling untuk rombongan keluarga, tamu acara, atau peserta kegiatan di Jogja.",
    tags: ["bantal", "guling", "rombongan", "jogja", "tips"],
    intent: ["menghitung kebutuhan bantal guling", "jumlah bantal guling rombongan", "bantal guling untuk rombongan"],
    audience: "panitia kecil, keluarga, dan pengelola penginapan",
    scenario: "kasur sudah tersedia tetapi perlengkapan tidur pendukung belum cukup",
    focus: "bantal, guling, selimut",
    area: "",
    service: "bantal",
    type: "howto",
  },
  {
    slug: "tips-memilih-vendor-sewa-kasur-jogja",
    title: "Tips Memilih Vendor Sewa Kasur di Jogja",
    description:
      "Panduan memilih penyedia jasa sewa kasur di Jogja: reputasi, kualitas barang, layanan antar jemput, dan testimoni pelanggan.",
    tags: ["tips", "vendor", "sewa kasur", "jogja", "rekomendasi"],
    intent: ["tips memilih vendor sewa kasur", "tempat sewa kasur terpercaya jogja", "rekomendasi sewa kasur jogja"],
    audience: "pertama kali sewa kasur dan tidak tahu vendor mana yang terpercaya",
    scenario: "banyak pilihan vendor sewa kasur di Jogja dan bingung memilih",
    focus: "vendor, kualitas, testimoni, harga",
    area: "",
    service: "sewa kasur",
    type: "howto",
  },
  {
    slug: "area-layanan-sewa-kasur-santi-living-jogja",
    title: "Area Layanan Sewa Kasur Santi Living di Jogja",
    description:
      "Cakupan area pengiriman sewa kasur Santi Living: Sleman, Bantul, Kota Jogja, Kulonprogo, dan area mana yang tidak terlayani.",
    tags: ["area layanan", "pengiriman", "sewa kasur", "santi living", "jogja"],
    intent: ["area layanan sewa kasur jogja", "area delivery sewa kasur", "cakupan pengiriman sewa kasur"],
    audience: "calon penyewa yang ingin tahu apakah area mereka terlayani",
    scenario: "tinggal di area tertentu dan ingin pastikan ada layanan antar jemput",
    focus: "area layanan, pengiriman, Sleman, Bantul, Kota Jogja, Kulonprogo",
    area: "",
    service: "sewa kasur",
    type: "howto",
  },
  {
    slug: "testimoni-pelanggan-sewa-kasur-santi-living",
    title: "Testimoni Pelanggan Sewa Kasur Santi Living Jogja",
    description:
      "Pengalaman dan review pelanggan yang pernah menyewa kasur dan perlengkapan di Santi Living Jogja.",
    tags: ["testimoni", "review", "santi living", "sewa kasur", "jogja"],
    intent: ["testimoni sewa kasur jogja", "review sewa kasur santi living", "pengalaman sewa kasur santi living"],
    audience: "calon penyewa yang ingin lihat bukti nyata dari pelanggan sebelumnya",
    scenario: "ragu-ragu dan ingin lihat pengalaman orang lain sebelum sewa",
    focus: "testimoni, review, pengalaman pelanggan",
    area: "",
    service: "sewa kasur",
    type: "general",
  },
  {
    slug: "syarat-dan-ketentuan-sewa-kasur-jogja",
    title: "Syarat dan Ketentuan Sewa Kasur di Jogja",
    description:
      "Informasi syarat sewa kasur di Jogja: KTP, deposit, durasi minimal, biaya antar, dan kebijakan kerusakan.",
    tags: ["syarat", "ketentuan", "sewa kasur", "jogja", "FAQ"],
    intent: ["syarat sewa kasur jogja", "ketentuan sewa kasur", "deposit sewa kasur"],
    audience: "calon penyewa yang ingin tahu persyaratan sebelum memesan",
    scenario: "ingin pesan kasur tapi tidak tahu dokumen atau syarat apa yang diperlukan",
    focus: "KTP, deposit, durasi, biaya antar",
    area: "",
    service: "sewa kasur",
    type: "howto",
  },
  {
    slug: "panduan-menata-ruang-untuk-kasur-tambahan",
    title: "Panduan Menata Ruang untuk Kasur Tambahan",
    description:
      "Tips menata ruang tengah, kamar, atau area kos agar bisa dipakai untuk kasur tambahan tanpa mengganggu aktivitas.",
    tags: ["tips", "menata ruang", "kasur tambahan", "jogja", "keluarga"],
    intent: ["menata ruang untuk kasur tambahan", "tips tata ruang kasur", "ruang tengah untuk kasur"],
    audience: "keluarga yang perlu mengubah ruang menjadi area tidur sementara",
    scenario: "kamar tidur penuh dan ruang lain harus dipakai untuk tamu menginap",
    focus: "tata ruang, kasur tambahan, jalur, pintu",
    area: "",
    service: "sewa kasur",
    type: "howto",
  },
  {
    slug: "panduan-jadwal-antar-jemput-sewa-kasur",
    title: "Panduan Jadwal Antar Jemput Sewa Kasur",
    description:
      "Cara menentukan jadwal antar jemput sewa kasur agar barang datang sebelum tamu tiba dan pengembalian tidak mengganggu.",
    tags: ["antar jemput", "jadwal", "sewa kasur", "jogja", "tips"],
    intent: ["jadwal antar jemput sewa kasur", "koordinasi antar jemput", "cara atur jadwal antar"],
    audience: "keluarga dan penghuni kos yang perlu koordinasi waktu",
    scenario: "tamu datang jam tertentu sementara rumah masih dipakai aktivitas lain",
    focus: "jadwal antar, jadwal jemput, koordinasi",
    area: "",
    service: "sewa kasur",
    type: "howto",
  },
  {
    slug: "checklist-alamat-dan-akses-untuk-pengiriman",
    title: "Checklist Alamat dan Akses untuk Pengiriman Sewa Kasur",
    description:
      "Checklist informasi alamat, akses gang, titik parkir, dan kontak lokasi sebelum memesan sewa kasur di Jogja.",
    tags: ["checklist", "alamat", "akses", "pengiriman", "sewa kasur", "jogja"],
    intent: ["checklist alamat akses", "akses gang", "titik parkir sewa perlengkapan"],
    audience: "panitia acara dan keluarga yang mengatur pengiriman",
    scenario: "lokasi di gang, area padat, kos, atau akses terbatas",
    focus: "alamat, akses, parkir, kontak",
    area: "",
    service: "sewa kasur",
    type: "howto",
  },
  {
    slug: "tips-sewa-perlengkapan-acara-lengkap-jogja",
    title: "Tips Sewa Perlengkapan Acara Lengkap di Jogja",
    description:
      "Panduan menyewa perlengkapan acara di Jogja untuk pengajian, arisan, syukuran: karpet, kipas, kursi, dan lainnya.",
    tags: ["perlengkapan acara", "tips", "acara", "jogja"],
    intent: ["tips sewa perlengkapan acara", "perlengkapan acara lengkap jogja", "sewa perlengkapan acara"],
    audience: "keluarga yang akan mengadakan acara di rumah",
    scenario: "acara mendadak dan perlu semua perlengkapan dari satu tempat",
    focus: "karpet, kursi, kipas, perlengkapan acara",
    area: "",
    service: "perlengkapan acara",
    type: "howto",
  },
];

const AREA_TOPIC_TEMPLATES = [
  // Area-specific sewa kasur
  {
    titleTpl: (a) =>
      `Sewa ${a.service} di ${a.areaLabel} — Solusi Praktis`,
    descTpl: (a) =>
      `Butuh ${a.service} di ${a.areaLabel}? Layanan antar jemput cepat untuk ${a.audience} di area ${a.areaLabel} dan sekitarnya.`,
    tagsTpl: (a) => [a.areaSlug, "sewa kasur", "jogja", a.audSlug],
    intentTpl: (a) => [
      `${a.service} ${a.areaSlug}`,
      `rental ${a.service} ${a.areaSlug}`,
      `${a.areaSlug} ${a.service}`,
    ],
    focusTpl: (a) => `${a.service}, bantal, guling, selimut`,
    scenarioTpl: (a) =>
      `tinggal di ${a.areaLabel} dan butuh ${a.service} untuk kebutuhan sementara`,
    audienceTpl: (a) => a.audience,
    service: "sewa kasur",
    type: "area-specific",
  },
  // Area-specific extra bed
  {
    titleTpl: (a) =>
      `Sewa Extra Bed di ${a.areaLabel} untuk Tamu Menginap`,
    descTpl: (a) =>
      `Butuh extra bed di ${a.areaLabel}? Sewa kasur tambahan untuk tamu di area ${a.areaLabel} dengan antar jemput kilat.`,
    tagsTpl: (a) => [a.areaSlug, "extra bed", "jogja", "tamu", "kos"],
    intentTpl: (a) => [
      `extra bed ${a.areaSlug}`,
      `sewa extra bed ${a.areaSlug}`,
      `${a.areaSlug} extra bed`,
    ],
    focusTpl: () => "extra bed, bantal, guling, selimut",
    scenarioTpl: (a) =>
      `keluarga atau tamu datang ke ${a.areaLabel} dan butuh tempat tidur tambahan`,
    audienceTpl: (a) => a.audience,
    service: "extra bed",
    type: "area-specific",
  },
  // Area-specific karpet
  {
    titleTpl: (a) =>
      `Sewa Karpet di ${a.areaLabel} untuk Acara`,
    descTpl: (a) =>
      `Cari sewa karpet di ${a.areaLabel}? Untuk acara pengajian, arisan, atau kumpul keluarga di area ${a.areaLabel}.`,
    tagsTpl: (a) => [a.areaSlug, "karpet", "acara", "jogja"],
    intentTpl: (a) => [
      `sewa karpet ${a.areaSlug}`,
      `karpet acara ${a.areaSlug}`,
      `${a.areaSlug} karpet`,
    ],
    focusTpl: () => "karpet, permadani",
    scenarioTpl: (a) =>
      `acara di ${a.areaLabel} butuh karpet untuk tamu lesehan`,
    audienceTpl: (a) => a.audience,
    service: "karpet",
    type: "area-specific",
  },
  // Area-specific kipas angin
  {
    titleTpl: (a) =>
      `Sewa Kipas Angin di ${a.areaLabel} untuk Acara`,
    descTpl: (a) =>
      `Butuh sewa kipas angin di ${a.areaLabel}? Untuk acara, pengajian, atau ruang gerah di area ${a.areaLabel}.`,
    tagsTpl: (a) => [a.areaSlug, "kipas angin", "acara", "jogja"],
    intentTpl: (a) => [
      `sewa kipas angin ${a.areaSlug}`,
      `kipas angin acara ${a.areaSlug}`,
      `${a.areaSlug} kipas angin`,
    ],
    focusTpl: () => "kipas angin, air cooler",
    scenarioTpl: (a) =>
      `ruangan di ${a.areaLabel} gerah dan butuh sirkulasi udara saat acara`,
    audienceTpl: (a) => a.audience,
    service: "kipas angin",
    type: "area-specific",
  },
  // Area-specific TV
  {
    titleTpl: (a) =>
      `Sewa TV di ${a.areaLabel} untuk Nobar dan Acara`,
    descTpl: (a) =>
      `Sewa TV di ${a.areaLabel} untuk nonton bareng, presentasi, atau acara keluarga di area ${a.areaLabel}.`,
    tagsTpl: (a) => [a.areaSlug, "sewa tv", "nobar", "jogja", "acara"],
    intentTpl: (a) => [
      `sewa tv ${a.areaSlug}`,
      `tv acara ${a.areaSlug}`,
      `${a.areaSlug} sewa tv`,
    ],
    focusTpl: () => "TV LED, smart TV",
    scenarioTpl: (a) =>
      `acara di ${a.areaLabel} butuh layar tambahan untuk menampilkan konten`,
    audienceTpl: (a) => a.audience,
    service: "tv",
    type: "area-specific",
  },
  // Area-specific sewa perlengkapan acara
  {
    titleTpl: (a) =>
      `Sewa Perlengkapan Acara di ${a.areaLabel} — Satu Atap`,
    descTpl: (a) =>
      `Sewa perlengkapan acara di ${a.areaLabel}: karpet, kursi, kipas, dan lainnya. Satu tempat, antar jemput area ${a.areaLabel}.`,
    tagsTpl: (a) => [a.areaSlug, "perlengkapan acara", "jogja"],
    intentTpl: (a) => [
      `sewa perlengkapan acara ${a.areaSlug}`,
      `perlengkapan acara ${a.areaSlug}`,
      `${a.areaSlug} perlengkapan acara`,
    ],
    focusTpl: () => "karpet, kursi, kipas, perlengkapan acara",
    scenarioTpl: (a) =>
      `acara di ${a.areaLabel} butuh berbagai perlengkapan dari satu penyedia`,
    audienceTpl: (a) => a.audience,
    service: "perlengkapan acara",
    type: "area-specific",
  },
  // Area-specific bantal guling
  {
    titleTpl: (a) =>
      `Sewa Bantal dan Guling di ${a.areaLabel}`,
    descTpl: (a) =>
      `Butuh bantal dan guling tambahan di ${a.areaLabel}? Untuk kos, homestay, atau tamu menginap di area ${a.areaLabel}.`,
    tagsTpl: (a) => [a.areaSlug, "bantal", "guling", "jogja", "kos"],
    intentTpl: (a) => [
      `sewa bantal ${a.areaSlug}`,
      `bantal guling ${a.areaSlug}`,
      `${a.areaSlug} bantal guling`,
    ],
    focusTpl: () => "bantal, guling, selimut",
    scenarioTpl: (a) =>
      `butuh perlengkapan tidur tambahan di ${a.areaLabel} untuk tamu atau penghuni kos`,
    audienceTpl: (a) => a.audience,
    service: "bantal",
    type: "area-specific",
  },
];

// ============ HELPER ============

function localDate() {
  const d = new Date();
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(d)
      .map((part) => [part.type, part.value])
  );
  return `${p.year}-${p.month}-${p.day}`;
}

function run(cmd, args, options = {}) {
  return execFileSync(cmd, args, {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  }).trim();
}

// ============ MAIN ============

async function main() {
  console.log(`[SEEDER] DB: ${DB_PATH}`);

  // Init schema
  run("sqlite3", [DB_PATH, ".read " + path.resolve(new URL(".", import.meta.url).pathname, "blog-schema.sql")]);
  console.log("[SEEDER] Schema ready");

  // Clear existing
  run("sqlite3", [DB_PATH, "DELETE FROM topic_log; DELETE FROM topics;"]);

  let total = 0;
  const inserts = [];

  function makeTopic({
    slug,
    title,
    description,
    tags,
    intent,
    audience,
    scenario,
    itemFocus,
    area,
    service,
    topicType,
  }) {
    total++;
    return {
      slug,
      title,
      description,
      tags: json(tags || []),
      intent: json(intent || []),
      audience: audience || "",
      scenario: scenario || "",
      item_focus: itemFocus || "",
      area: area || "",
      service: service || "",
      topic_type: topicType || "general",
    };
  }

  // --- 1. Add how-to / comparison topics ---
  for (const t of HOW_TOS) {
    inserts.push(
      makeTopic({
        slug: t.slug,
        title: t.title,
        description: t.description,
        tags: t.tags,
        intent: t.intent,
        audience: t.audience,
        scenario: t.scenario,
        itemFocus: t.focus,
        area: t.area,
        service: t.service,
        topicType: t.type,
      })
    );
  }

  // --- 2. Add scenario-based topics (from existing static topics) ---
  const scenarioTopics = [
    {
      slug: "checklist-sewa-kasur-untuk-tamu-keluarga-jogja",
      title: "Checklist Sewa Kasur untuk Tamu Keluarga di Jogja",
      description:
        "Panduan praktis menyiapkan kasur tambahan untuk tamu keluarga di Jogja, mulai dari jumlah orang, ruang kamar, akses antar, sampai perlengkapan pendukung.",
      tags: ["tips", "sewa kasur", "jogja", "keluarga"],
      intent: ["tamu keluarga", "kasur tambahan", "sewa kasur keluarga"],
      audience: "keluarga yang kedatangan saudara menginap beberapa malam",
      scenario:
        "rumah cukup luas untuk berkumpul tetapi jumlah kasur tidak cukup",
      focus: "kasur, bantal, guling, selimut",
      area: "",
      service: "sewa kasur",
      type: "scenario",
    },
    {
      slug: "sewa-kasur-untuk-kos-dan-kontrakan-mahasiswa-jogja",
      title: "Sewa Kasur untuk Kos dan Kontrakan Mahasiswa Jogja",
      description:
        "Solusi sewa kasur sementara untuk mahasiswa Jogja saat pindah kos, menunggu barang datang, atau menerima teman dan keluarga yang menginap.",
      tags: ["kos", "mahasiswa", "sewa kasur", "jogja"],
      intent: ["kos", "kontrakan", "mahasiswa"],
      audience: "mahasiswa dan penghuni kos di area Jogja",
      scenario:
        "kasur pribadi belum datang atau ada teman menginap di kos",
      focus: "kasur lipat, bantal, guling, kipas angin",
      area: "",
      service: "sewa kasur",
      type: "scenario",
    },
    {
      slug: "panduan-sewa-extra-bed-homestay-jogja",
      title: "Panduan Sewa Extra Bed untuk Homestay di Jogja",
      description:
        "Cara menyiapkan extra bed untuk homestay, guest house, dan penginapan keluarga di Jogja agar tamu tetap nyaman tanpa membeli perlengkapan baru.",
      tags: ["extra bed", "homestay", "penginapan", "jogja"],
      intent: ["extra bed", "homestay", "guest house"],
      audience: "pemilik homestay dan pengelola guest house",
      scenario: "jumlah tamu bertambah sementara kapasitas tempat tidur utama terbatas",
      focus: "extra bed, bantal, guling, selimut, kipas angin",
      area: "",
      service: "extra bed",
      type: "scenario",
    },
    {
      slug: "sewa-kipas-angin-dan-air-cooler-acara-rumah-jogja",
      title: "Sewa Kipas Angin dan Air Cooler untuk Acara Rumah Jogja",
      description:
        "Checklist memilih kipas angin atau air cooler untuk acara rumah di Jogja, termasuk jumlah tamu, titik panas, akses listrik, dan jadwal antar.",
      tags: ["kipas angin", "air cooler", "acara", "jogja"],
      intent: ["kipas angin", "air cooler", "acara rumah"],
      audience: "keluarga yang menyiapkan pengajian, arisan, atau kumpul keluarga",
      scenario: "ruang tamu dipakai banyak orang dan butuh sirkulasi udara tambahan",
      focus: "kipas angin, air cooler, perlengkapan pendukung acara",
      area: "",
      service: "kipas angin",
      type: "scenario",
    },
    {
      slug: "sewa-tv-untuk-nobar-dan-presentasi-jogja",
      title: "Sewa TV untuk Nobar dan Presentasi Kecil di Jogja",
      description:
        "Panduan praktis sewa TV di Jogja untuk nonton bareng, presentasi, briefing komunitas, atau acara kecil tanpa membeli perangkat baru.",
      tags: ["sewa tv", "nobar", "presentasi", "jogja"],
      intent: ["sewa tv", "nonton bareng", "presentasi"],
      audience: "keluarga, komunitas, dan penyelenggara acara kecil",
      scenario: "butuh layar tambahan untuk menampilkan konten",
      focus: "TV dan perlengkapan pendukung acara",
      area: "",
      service: "tv",
      type: "scenario",
    },
    {
      slug: "sewa-kasur-untuk-acara-pengajian-jogja",
      title: "Sewa Kasur untuk Acara Pengajian di Jogja — Panduan Lengkap",
      description:
        "Panduan menyewa kasur dan perlengkapan untuk acara pengajian di Jogja. Mulai dari karpet, bantal, sampai kipas angin untuk tamu lesehan.",
      tags: ["pengajian", "acara", "karpet", "sewa kasur", "jogja"],
      intent: ["sewa kasur pengajian", "perlengkapan pengajian jogja", "acara pengajian"],
      audience: "keluarga dan panitia yang mengadakan pengajian",
      scenario: "acara pengajian dengan tamu lesehan dalam jumlah banyak",
      focus: "karpet, kasur, bantal, guling, kipas angin, air cooler",
      area: "",
      service: "sewa kasur",
      type: "scenario",
    },
    {
      slug: "sewa-kasur-untuk-reuni-keluarga-jogja",
      title: "Sewa Kasur untuk Reuni Keluarga di Jogja — Tips dan Checklist",
      description:
        "Rencanakan reuni keluarga besar di Jogja dengan sewa kasur dan perlengkapan tidur. Panduan jumlah, area, dan koordinasi antar jemput.",
      tags: ["reuni", "keluarga", "acara", "sewa kasur", "jogja"],
      intent: ["sewa kasur reuni", "reuni keluarga jogja", "acara keluarga"],
      audience: "keluarga yang merencanakan reuni atau kumpul saudara",
      scenario: "anggota keluarga datang dari luar kota dan butuh tempat tidur",
      focus: "kasur, extra bed, bantal, guling, selimut, kipas angin",
      area: "",
      service: "sewa kasur",
      type: "scenario",
    },
    {
      slug: "sewa-kasur-untuk-persiapan-wedding-jogja",
      title: "Sewa Kasur untuk Persiapan Wedding di Jogja",
      description:
        "Checklist sewa kasur dan perlengkapan untuk wedding preparation di Jogja. Keluarga dan pengiring butuh tempat istirahat selama acara.",
      tags: ["wedding", "pernikahan", "acara", "sewa kasur", "jogja"],
      intent: ["sewa kasur wedding", "perlengkapan pernikahan jogja", "persiapan wedding"],
      audience: "keluarga yang menyiapkan acara pernikahan",
      scenario: "hari H pernikahan dan banyak pengiring butuh tempat istirahat",
      focus: "kasur, extra bed, karpet, kipas angin, air cooler",
      area: "",
      service: "sewa kasur",
      type: "scenario",
    },
    {
      slug: "checklist-sewa-perlengkapan-untuk-open-house-jogja",
      title: "Checklist Sewa Perlengkapan untuk Open House di Jogja",
      description:
        "Daftar perlengkapan sewa yang perlu dipertimbangkan saat mengadakan open house keluarga, kantor kecil, atau komunitas di Jogja.",
      tags: ["open house", "acara", "perlengkapan", "jogja"],
      intent: ["perlengkapan open house", "sewa perlengkapan open house"],
      audience: "keluarga dan komunitas yang mengadakan open house",
      scenario: "tamu datang bertahap sepanjang hari",
      focus: "karpet, kipas angin, air cooler, kasur cadangan",
      area: "",
      service: "perlengkapan acara",
      type: "scenario",
    },
    {
      slug: "panduan-sewa-perlengkapan-tamu-menginap-mendadak",
      title: "Panduan Sewa Perlengkapan Tamu Menginap Mendadak",
      description:
        "Langkah cepat menyiapkan perlengkapan tidur saat ada keluarga atau kerabat yang menginap mendadak di Jogja.",
      tags: ["tamu menginap", "sewa kasur", "keluarga", "jogja"],
      intent: ["perlengkapan tamu menginap mendadak", "tamu menginap mendadak"],
      audience: "keluarga yang sering menerima tamu luar kota",
      scenario: "kabar tamu menginap datang di hari yang sama",
      focus: "kasur, bantal, guling, selimut, kipas angin",
      area: "",
      service: "sewa kasur",
      type: "scenario",
    },
    {
      slug: "cara-menghitung-kebutuhan-bantal-guling-rombongan",
      title: "Cara Menghitung Kebutuhan Bantal Guling untuk Rombongan",
      description:
        "Cara praktis menghitung jumlah bantal dan guling untuk rombongan keluarga, tamu acara, atau peserta kegiatan di Jogja.",
      tags: ["bantal", "guling", "rombongan", "jogja"],
      intent: ["menghitung kebutuhan bantal guling", "jumlah bantal guling rombongan"],
      audience: "panitia kecil dan keluarga yang menyiapkan banyak tempat tidur",
      scenario: "kasur sudah tersedia tetapi perlengkapan tidur pendukung belum cukup",
      focus: "bantal, guling, selimut",
      area: "",
      service: "bantal",
      type: "scenario",
    },
    {
      slug: "panduan-menata-ruang-tengah-untuk-kasur-tambahan",
      title: "Panduan Menata Ruang Tengah untuk Kasur Tambahan",
      description:
        "Tips menata ruang tengah agar bisa dipakai untuk kasur tambahan tanpa mengganggu jalur lewat, pintu, dan aktivitas keluarga.",
      tags: ["ruang tengah", "kasur tambahan", "keluarga", "jogja"],
      intent: ["menata ruang tengah kasur tambahan", "ruang tengah untuk kasur tambahan"],
      audience: "keluarga yang perlu mengubah ruang tengah jadi area tidur",
      scenario: "kamar tidur penuh dan ruang tengah jadi pilihan realistis",
      focus: "kasur tambahan, bantal, guling, selimut, kipas angin",
      area: "",
      service: "sewa kasur",
      type: "scenario",
    },
  ];

  for (const t of scenarioTopics) {
    inserts.push(
      makeTopic({
        slug: t.slug,
        title: t.title,
        description: t.description,
        tags: t.tags,
        intent: t.intent,
        audience: t.audience,
        scenario: t.scenario,
        itemFocus: t.focus,
        area: t.area,
        service: t.service,
        topicType: t.type,
      })
    );
  }

  // --- 3. Add area-specific topics ---
  const audMap = {
    seturan: "mahasiswa kos di Seturan",
    babarsari: "mahasiswa di Babarsari",
    condongcatur: "penghuni kos dan perumahan Condongcatur",
    kaliurang: "mahasiswa UII dan UTY di Kaliurang",
    ngaglik: "penghuni kos dan keluarga di Ngaglik",
    gejayan: "mahasiswa USD dan Sanata Dharma",
    mlati: "penghuni kos dan penginapan Mlati",
    ngemplak: "keluarga di Ngemplak Sleman",
    prambanan: "keluarga dan pekerja di Prambanan",
    gamping: "penghuni kos dan perumahan Gamping",
    "depok-sleman": "penghuni kos Depok Sleman",
    godean: "keluarga dan pekerja di Godean",
    kasihan: "mahasiswa UMY di Kasihan Bantul",
    sewon: "penghuni kos dan mahasiswa ISI Sewon",
    "jetis-bantul": "keluarga dan penghuni kos Jetis Bantul",
    gondokusuman: "penghuni kos dan warga Gondokusuman",
    umbulharjo: "keluarga di Umbulharjo",
    kotagede: "keluarga dan pekerja di Kotagede",
    jogja: "keluarga di Kota Jogja",
    yogyakarta: "keluarga di Yogyakarta",
    sleman: "keluarga dan mahasiswa di Sleman",
    bantul: "keluarga dan pekerja di Bantul",
    kulonprogo: "keluarga dan pekerja di Kulonprogo",
  };
  const defaultAud = "keluarga dan penghuni kos";

  for (const areaInfo of AREAS) {
    for (const tpl of AREA_TOPIC_TEMPLATES) {
      const areaVar = {
        areaLabel: areaInfo.label,
        areaSlug: areaInfo.area,
        audience: audMap[areaInfo.area] || defaultAud,
        audSlug: areaInfo.area,
        service: tpl.service,
      };

      const title = tpl.titleTpl(areaVar);
      const topicSlug = slugFrom(title);

      inserts.push(
        makeTopic({
          slug: topicSlug,
          title,
          description: tpl.descTpl(areaVar),
          tags: tpl.tagsTpl(areaVar),
          intent: tpl.intentTpl(areaVar),
          audience: tpl.audienceTpl(areaVar),
          scenario: tpl.scenarioTpl(areaVar),
          itemFocus: tpl.focusTpl(areaVar),
          area: areaInfo.area,
          service: tpl.service,
          topicType: tpl.type,
        })
      );
    }
  }

  // --- 4. Add scenario + area combination topics ---
  for (const areaInfo of AREAS) {
    for (const sc of SCENARIOS) {
      const title = `${sc.title} di ${areaInfo.label} — Sewa Perlengkapan`;
      const topicSlug = slugFrom(title);
      inserts.push(
        makeTopic({
          slug: topicSlug,
          title,
          description: `Panduan ${sc.desc} di ${areaInfo.label}. ${sc.scenario}.`,
          tags: [areaInfo.area, "sewa", "perlengkapan", sc.slugSuffix],
          intent: [
            `${sc.slugSuffix} ${areaInfo.area}`,
            `${areaInfo.area} ${sc.slugSuffix}`,
          ],
          audience: sc.audience,
          scenario: `${sc.scenario} di area ${areaInfo.area}`,
          itemFocus: sc.focus,
          area: areaInfo.area,
          service: "perlengkapan acara",
          topicType: "scenario",
        })
      );
    }
  }

  // --- 5. Add transactional area-service combos (for landing pages) ---
  const highValueServices = [
    { s: "sewa kasur", label: "Sewa Kasur" },
    { s: "extra bed", label: "Extra Bed" },
  ];
  for (const areaInfo of AREAS) {
    for (const svc of highValueServices) {
      const title = `${svc.label} ${areaInfo.label} — ${areaInfo.parent}`;
      const topicSlug = slugFrom(title + " " + areaInfo.area);
      inserts.push(
        makeTopic({
          slug: topicSlug,
          title,
          description: `Cari ${svc.s.toLowerCase()} di ${areaInfo.label}, ${areaInfo.parent}? Layanan antar jemput cepat.`,
          tags: [areaInfo.area, svc.s.toLowerCase().replace(/ /g, "-"), "jogja"],
          intent: [
            `${svc.s} ${areaInfo.area}`,
            `${areaInfo.area} ${svc.s}`,
            `sewa ${svc.s} ${areaInfo.area} jogja`,
          ],
          audience: audMap[areaInfo.area] || defaultAud,
          scenario: `butuh ${svc.s.toLowerCase()} di ${areaInfo.label} untuk kebutuhan sementara`,
          itemFocus: `${svc.label}, bantal, guling, selimut`,
          area: areaInfo.area,
          service: svc.s,
          topicType: "area-specific",
        })
      );
    }
  }

  // --- Batch insert ---
  const stmtInsert = `INSERT OR IGNORE INTO topics (slug, title, description, tags, intent, audience, scenario, item_focus, area, service, topic_type) VALUES `;

  // Insert in batches of 50
  const BATCH = 50;
  for (let i = 0; i < inserts.length; i += BATCH) {
    const batch = inserts.slice(i, i + BATCH);
    const values = batch
      .map(
        (t) =>
          `('${t.slug.replace(/'/g, "''")}', '${t.title.replace(/'/g, "''")}', '${t.description.replace(/'/g, "''")}', '${t.tags.replace(/'/g, "''")}', '${t.intent.replace(/'/g, "''")}', '${t.audience.replace(/'/g, "''")}', '${t.scenario.replace(/'/g, "''")}', '${t.item_focus.replace(/'/g, "''")}', '${t.area.replace(/'/g, "''")}', '${t.service.replace(/'/g, "''")}', '${t.topic_type.replace(/'/g, "''")}')`
      )
      .join(",\n");

    run("sqlite3", [DB_PATH, `${stmtInsert} ${values}`]);
  }

  // --- Stats ---
  const countResult = run("sqlite3", [
    DB_PATH,
    "SELECT COUNT(*) FROM topics;",
  ]);
  console.log(`[SEEDER] Done. ${countResult} topics inserted.`);

  // Show distribution
  const distResult = run("sqlite3", [
    DB_PATH,
    "SELECT topic_type, COUNT(*) FROM topics GROUP BY topic_type ORDER BY COUNT(*) DESC;",
  ]);
  console.log(`\nDistribution:\n${distResult}`);

  const areaDist = run("sqlite3", [
    DB_PATH,
    "SELECT area, COUNT(*) FROM topics WHERE area != '' GROUP BY area ORDER BY COUNT(*) DESC LIMIT 15;",
  ]);
  console.log(`\nTop areas:\n${areaDist}`);

  const serviceDist = run("sqlite3", [
    DB_PATH,
    "SELECT service, COUNT(*) FROM topics WHERE service != '' GROUP BY service ORDER BY COUNT(*) DESC;",
  ]);
  console.log(`\nServices:\n${serviceDist}`);
}

main().catch((err) => {
  console.error(`[SEEDER ERROR] ${err.message}`);
  process.exitCode = 1;
});