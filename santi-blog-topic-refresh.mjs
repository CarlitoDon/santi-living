#!/usr/bin/env node
/**
 * Idempotent, additive refresh for the Santi Living topic queue.
 *
 * Usage:
 *   node santi-blog-topic-refresh.mjs [--db PATH] [--dry-run]
 *
 * Existing rows, including status=used rows, are never updated or reset.
 */

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB = path.join(SCRIPT_DIR, "blog_topics.db");

export const TOPIC_DEFINITIONS = [
  {
    slug: "cara-menghitung-total-biaya-sewa-kasur-harian-jogja",
    title: "Cara Menghitung Total Biaya Sewa Kasur Harian di Jogja",
    description: "Panduan menyusun estimasi biaya sewa kasur harian berdasarkan jumlah unit, durasi, paket, dan detail kebutuhan.",
    tags: ["harga", "sewa kasur", "durasi", "jogja"],
    intent: ["menghitung biaya sewa kasur", "harga sewa kasur harian jogja"],
    audience: "calon penyewa kasur di Yogyakarta",
    scenario: "butuh memperkirakan anggaran kasur untuk beberapa hari",
    item_focus: "kasur dan paket perlengkapan tidur",
    en_title: "How to Calculate the Total Cost of Daily Mattress Rental in Yogyakarta",
    en_description: "A practical guide to estimating daily mattress rental costs based on the number of units, rental duration, package choice, and other requirements.",
    en_audience: "prospective mattress renters planning a stay in Yogyakarta",
    en_scenario: "you need to estimate a mattress budget for several days",
    en_item_focus: "mattresses and sleep equipment packages",
    area: "yogyakarta",
    service: "sewa kasur",
    topic_type: "howto",
  },
  {
    slug: "sewa-kasur-dua-hari-jogja-apa-yang-perlu-ditanya",
    title: "Sewa Kasur Dua Hari di Jogja: Apa yang Perlu Ditanyakan?",
    description: "Checklist pertanyaan penting saat memesan kasur sewa untuk kebutuhan dua hari di Jogja.",
    tags: ["harga", "durasi", "sewa kasur", "jogja"],
    intent: ["sewa kasur dua hari", "rental kasur singkat jogja"],
    audience: "keluarga dan tamu yang membutuhkan kasur sementara",
    scenario: "membutuhkan kasur hanya untuk akhir pekan atau dua hari",
    item_focus: "kasur, durasi, dan jadwal pemakaian",
    en_title: "Renting a Mattress for Two Days in Yogyakarta: What Should You Ask?",
    en_description: "A checklist of key questions to ask when arranging a two-day mattress rental in Yogyakarta.",
    en_audience: "families and guests who need temporary sleeping space",
    en_scenario: "you need a mattress only for a weekend or two-day stay",
    en_item_focus: "mattress, rental duration, and usage schedule",
    area: "yogyakarta",
    service: "sewa kasur",
    topic_type: "transactional",
  },
  {
    slug: "panduan-sewa-kasur-mingguan-di-sleman",
    title: "Panduan Sewa Kasur Mingguan di Sleman",
    description: "Hal yang perlu dibandingkan saat memilih kasur sewa mingguan di Sleman berdasarkan durasi dan kebutuhan ruang.",
    tags: ["durasi", "mingguan", "sewa kasur", "sleman"],
    intent: ["sewa kasur mingguan sleman", "rental kasur satu minggu"],
    audience: "pekerja, keluarga, dan penghuni rumah sementara di Sleman",
    scenario: "membutuhkan tempat tidur tambahan selama sekitar satu minggu",
    item_focus: "kasur dan perlengkapan tidur",
    en_title: "Weekly Mattress Rental in Sleman: A Practical Guide",
    en_description: "What to compare when choosing a weekly mattress rental in Sleman, based on duration and room needs.",
    en_audience: "workers, families, and temporary residents in Sleman",
    en_scenario: "you need an extra bed for about one week",
    en_item_focus: "mattresses and sleep equipment",
    area: "sleman",
    service: "sewa kasur",
    topic_type: "area-specific",
  },
  {
    slug: "kapan-memilih-paket-lengkap-sewa-kasur-jogja",
    title: "Kapan Memilih Paket Lengkap Sewa Kasur di Jogja?",
    description: "Panduan menentukan kapan paket lengkap lebih praktis daripada menyewa kasur saja untuk kebutuhan sementara.",
    tags: ["harga", "paket", "sewa kasur", "jogja"],
    intent: ["paket lengkap sewa kasur", "sewa kasur dengan perlengkapan"],
    audience: "keluarga dan pengelola penginapan yang menyiapkan tempat tidur",
    scenario: "kasur tersedia tetapi perlengkapan tidur pendukung belum lengkap",
    item_focus: "kasur, bantal, guling, selimut, dan sprei",
    en_title: "When Should You Choose a Complete Mattress Rental Package in Yogyakarta?",
    en_description: "How to decide whether a complete package is more practical than renting a mattress alone for a temporary need.",
    en_audience: "families and accommodation managers preparing sleeping space",
    en_scenario: "a mattress is available but supporting sleep items are incomplete",
    en_item_focus: "mattress, pillows, bolsters, blankets, and sheets",
    area: "yogyakarta",
    service: "sewa kasur",
    topic_type: "comparison",
  },
  {
    slug: "beda-kisaran-harga-kasur-dan-paket-lengkap-jogja",
    title: "Beda Kisaran Harga Kasur dan Paket Lengkap di Jogja",
    description: "Perbandingan cara membaca kisaran harga sewa kasur dan paket lengkap tanpa menganggapnya sebagai harga tetap.",
    tags: ["harga", "paket", "perbandingan", "jogja"],
    intent: ["harga kasur sewa dan paket lengkap", "perbandingan paket sewa kasur"],
    audience: "orang yang sedang menyusun anggaran sewa perlengkapan tidur",
    scenario: "bingung memilih sewa kasur saja atau paket perlengkapan",
    item_focus: "kasur dan paket lengkap",
    en_title: "Comparing Mattress Rental and Complete Package Price Ranges in Yogyakarta",
    en_description: "How to read indicative price ranges for mattress rentals and complete packages without treating them as fixed prices.",
    en_audience: "people planning a budget for rented sleep equipment",
    en_scenario: "you are deciding between renting a mattress alone and a complete package",
    en_item_focus: "mattresses and complete packages",
    area: "yogyakarta",
    service: "sewa kasur",
    topic_type: "comparison",
  },
  {
    slug: "pertanyaan-penting-sebelum-konfirmasi-harga-sewa-kasur",
    title: "Pertanyaan Penting Sebelum Konfirmasi Harga Sewa Kasur",
    description: "Daftar informasi yang perlu disiapkan dan ditanyakan sebelum mengonfirmasi harga sewa kasur.",
    tags: ["harga", "sewa kasur", "checklist"],
    intent: ["tanya harga sewa kasur", "konfirmasi biaya rental kasur"],
    audience: "calon pelanggan yang ingin memperoleh informasi harga yang sesuai kebutuhan",
    scenario: "ingin menghindari salah paham tentang durasi, jumlah, dan isi paket",
    item_focus: "jumlah kasur, durasi, paket, dan alamat",
    en_title: "Questions to Ask Before Confirming a Mattress Rental Price",
    en_description: "Information to prepare and questions to ask before confirming a mattress rental price.",
    en_audience: "prospective customers seeking pricing information for their specific needs",
    en_scenario: "you want to avoid confusion about duration, quantity, and package contents",
    en_item_focus: "mattress quantity, duration, package, and address",
    area: "",
    service: "sewa kasur",
    topic_type: "howto",
  },
  {
    slug: "sewa-kasur-kota-yogyakarta-untuk-tamu-keluarga",
    title: "Sewa Kasur di Kota Yogyakarta untuk Tamu Keluarga",
    description: "Panduan mencari kasur sewa untuk menyiapkan tempat tidur tambahan bagi tamu keluarga di Kota Yogyakarta.",
    tags: ["sewa kasur", "kota yogyakarta", "tamu keluarga"],
    intent: ["sewa kasur kota yogyakarta", "kasur tambahan tamu jogja"],
    audience: "keluarga di Kota Yogyakarta yang menerima tamu",
    scenario: "jumlah tamu keluarga bertambah dan kasur di rumah belum cukup",
    item_focus: "kasur tambahan dan perlengkapan tidur",
    en_title: "Mattress Rental in Yogyakarta City for Visiting Family",
    en_description: "How to arrange extra sleeping space for visiting family with a mattress rental in Yogyakarta City.",
    en_audience: "families in Yogyakarta City who are hosting guests",
    en_scenario: "more family guests are arriving than the home can accommodate with its existing beds",
    en_item_focus: "extra mattresses and sleep equipment",
    area: "yogyakarta",
    service: "sewa kasur",
    topic_type: "area-specific",
  },
  {
    slug: "rental-kasur-untuk-rumah-sementara-di-sleman",
    title: "Rental Kasur untuk Rumah Sementara di Sleman",
    description: "Pilihan pertimbangan saat menyewa kasur untuk rumah sementara, renovasi, atau perpindahan tempat tinggal di Sleman.",
    tags: ["rental kasur", "sleman", "rumah sementara"],
    intent: ["rental kasur rumah sementara sleman", "sewa kasur saat renovasi"],
    audience: "keluarga dan pekerja yang tinggal sementara di Sleman",
    scenario: "rumah belum siap sepenuhnya tetapi tempat tidur sudah dibutuhkan",
    item_focus: "kasur dan perlengkapan tidur dasar",
    en_title: "Renting a Mattress for Temporary Housing in Sleman",
    en_description: "Considerations for renting a mattress for temporary housing, renovation, or a move in Sleman.",
    en_audience: "families and workers staying temporarily in Sleman",
    en_scenario: "a home is not fully ready but sleeping space is already needed",
    en_item_focus: "mattresses and basic sleep equipment",
    area: "sleman",
    service: "rental kasur",
    topic_type: "area-specific",
  },
  {
    slug: "sewa-kasur-bantul-untuk-keluarga-datang-menginap",
    title: "Sewa Kasur Bantul untuk Keluarga yang Datang Menginap",
    description: "Langkah menyiapkan kasur tambahan untuk keluarga yang datang menginap di wilayah Bantul.",
    tags: ["sewa kasur", "bantul", "keluarga"],
    intent: ["sewa kasur bantul", "kasur tamu menginap bantul"],
    audience: "keluarga di Bantul yang menerima kerabat dari luar kota",
    scenario: "kerabat datang menginap dan kamar yang tersedia terbatas",
    item_focus: "kasur, bantal, guling, dan selimut",
    en_title: "Mattress Rental in Bantul for Visiting Family",
    en_description: "Steps for preparing an extra mattress when family members come to stay in Bantul.",
    en_audience: "families in Bantul hosting relatives from outside the city",
    en_scenario: "relatives are staying over and the available bedrooms are limited",
    en_item_focus: "mattresses, pillows, bolsters, and blankets",
    area: "bantul",
    service: "sewa kasur",
    topic_type: "area-specific",
  },
  {
    slug: "sewa-kasur-kulonprogo-untuk-kebutuhan-sementara",
    title: "Sewa Kasur Kulonprogo untuk Kebutuhan Sementara",
    description: "Panduan menyiapkan permintaan kasur sewa untuk kebutuhan keluarga dan tempat tinggal sementara di Kulonprogo.",
    tags: ["sewa kasur", "kulonprogo", "sementara"],
    intent: ["sewa kasur kulonprogo", "rental kasur kulonprogo"],
    audience: "keluarga dan pekerja di Kulonprogo",
    scenario: "membutuhkan tempat tidur tambahan untuk periode sementara",
    item_focus: "kasur dan perlengkapan tidur",
    en_title: "Temporary Mattress Rental Needs in Kulonprogo",
    en_description: "How to prepare a mattress rental request for a family or temporary living arrangement in Kulonprogo.",
    en_audience: "families and workers in Kulonprogo",
    en_scenario: "you need an extra bed for a temporary period",
    en_item_focus: "mattresses and sleep equipment",
    area: "kulonprogo",
    service: "sewa kasur",
    topic_type: "area-specific",
  },
  {
    slug: "sewa-kasur-dekat-godean-untuk-kos-dan-kontrakan",
    title: "Sewa Kasur Dekat Godean untuk Kos dan Kontrakan",
    description: "Panduan memilih kasur sewa bagi penghuni kos atau kontrakan di sekitar Godean.",
    tags: ["sewa kasur", "godean", "kos", "kontrakan"],
    intent: ["sewa kasur dekat godean", "kasur sewa kos godean"],
    audience: "mahasiswa dan pekerja yang tinggal di kos atau kontrakan sekitar Godean",
    scenario: "kasur belum tersedia atau ada tamu yang perlu tempat tidur tambahan",
    item_focus: "kasur lipat dan perlengkapan tidur",
    en_title: "Mattress Rental near Godean for Boarding Houses and Rentals",
    en_description: "How to choose a rental mattress for people living in a boarding house or rented home around Godean.",
    en_audience: "students and workers living in boarding houses or rented homes around Godean",
    en_scenario: "a mattress is unavailable, or a guest needs an additional sleeping space",
    en_item_focus: "folding mattresses and sleep equipment",
    area: "godean",
    service: "sewa kasur",
    topic_type: "area-specific",
  },
  {
    slug: "rental-kasur-untuk-pindahan-rumah-sleman",
    title: "Rental Kasur untuk Masa Pindahan Rumah di Sleman",
    description: "Ide menyiapkan tempat tidur sementara ketika proses pindahan rumah di Sleman belum selesai.",
    tags: ["rental kasur", "pindahan", "sleman"],
    intent: ["rental kasur pindahan rumah", "sewa kasur sementara sleman"],
    audience: "keluarga yang sedang pindah rumah di Sleman",
    scenario: "barang rumah tangga masih dipindahkan tetapi keluarga perlu segera beristirahat",
    item_focus: "kasur dan paket tidur sementara",
    en_title: "Temporary Mattress Rental During a Move in Sleman",
    en_description: "Ideas for arranging temporary sleeping space while a home move in Sleman is still underway.",
    en_audience: "families moving house in Sleman",
    en_scenario: "household goods are still being moved, but the family needs a place to rest",
    en_item_focus: "mattresses and temporary sleep packages",
    area: "sleman",
    service: "rental kasur",
    topic_type: "scenario",
  },
  {
    slug: "sewa-karpet-permadani-untuk-acara-aqiqah-jogja",
    title: "Sewa Karpet dan Permadani untuk Acara Aqiqah di Jogja",
    description: "Panduan mempertimbangkan karpet dan permadani sewa untuk area tamu acara aqiqah di Jogja.",
    tags: ["karpet", "permadani", "aqiqah", "acara", "jogja"],
    intent: ["sewa karpet aqiqah jogja", "rental permadani acara"],
    audience: "keluarga yang menyiapkan acara aqiqah di rumah",
    scenario: "area berkumpul perlu alas yang lebih nyaman untuk tamu acara",
    item_focus: "karpet dan permadani",
    en_title: "Renting Carpets and Rugs for an Aqiqah Event in Yogyakarta",
    en_description: "Considerations for renting carpets and rugs to prepare a guest area for an aqiqah event in Yogyakarta.",
    en_audience: "families preparing an aqiqah event at home",
    en_scenario: "a gathering area needs a more comfortable floor covering for event guests",
    en_item_focus: "carpets and rugs",
    area: "yogyakarta",
    service: "karpet",
    topic_type: "scenario",
  },
  {
    slug: "cara-memilih-ukuran-karpet-pengajian-di-jogja",
    title: "Cara Memilih Ukuran Karpet Pengajian di Jogja",
    description: "Cara memperkirakan ukuran karpet untuk pengajian berdasarkan kapasitas tamu dan bentuk ruang.",
    tags: ["karpet", "pengajian", "ukuran", "jogja"],
    intent: ["ukuran karpet pengajian", "sewa karpet pengajian jogja"],
    audience: "keluarga dan panitia pengajian",
    scenario: "ingin menyiapkan area duduk lesehan tanpa mengganggu akses ruangan",
    item_focus: "karpet, permadani, dan tata letak ruang",
    en_title: "How to Choose a Carpet Size for a Pengajian in Yogyakarta",
    en_description: "How to estimate carpet size for a pengajian based on guest capacity and room shape.",
    en_audience: "families and pengajian organizers",
    en_scenario: "you want to prepare a floor-seating area without blocking room access",
    en_item_focus: "carpets, rugs, and room layout",
    area: "yogyakarta",
    service: "karpet",
    topic_type: "howto",
  },
  {
    slug: "permadani-ruang-tamu-untuk-acara-keluarga-jogja",
    title: "Permadani Ruang Tamu untuk Acara Keluarga di Jogja",
    description: "Pertimbangan memilih permadani sewa untuk membuat ruang tamu lebih siap menerima banyak anggota keluarga.",
    tags: ["permadani", "ruang tamu", "keluarga", "jogja"],
    intent: ["sewa permadani ruang tamu", "permadani acara keluarga jogja"],
    audience: "keluarga yang mengadakan acara di rumah",
    scenario: "ruang tamu perlu disiapkan untuk tamu yang duduk dan berkumpul",
    item_focus: "permadani dan karpet ruang tamu",
    en_title: "A Living Room Rug for a Family Event in Yogyakarta",
    en_description: "Considerations for choosing a rental rug to prepare a living room for a larger family gathering.",
    en_audience: "families hosting an event at home",
    en_scenario: "a living room needs to be prepared for guests to sit and gather",
    en_item_focus: "rugs and living-room carpets",
    area: "yogyakarta",
    service: "permadani",
    topic_type: "scenario",
  },
  {
    slug: "checklist-karpet-event-kantor-di-sleman",
    title: "Checklist Karpet untuk Event Kantor di Sleman",
    description: "Checklist memilih karpet sewa untuk event kantor dengan memperhatikan area, peserta, akses, dan waktu penggunaan.",
    tags: ["karpet", "event", "kantor", "sleman"],
    intent: ["sewa karpet event kantor sleman", "karpet acara kantor"],
    audience: "tim kantor dan panitia acara di Sleman",
    scenario: "area acara kantor perlu alas yang sesuai dengan susunan peserta",
    item_focus: "karpet dan permadani event",
    en_title: "Carpet Checklist for a Company Event in Sleman",
    en_description: "A checklist for choosing a rental carpet for a company event, considering the area, attendees, access, and usage time.",
    en_audience: "office teams and event organizers in Sleman",
    en_scenario: "a company event area needs floor covering suited to the seating arrangement",
    en_item_focus: "carpets and event rugs",
    area: "sleman",
    service: "karpet",
    topic_type: "howto",
  },
  {
    slug: "karpet-untuk-family-gathering-di-bantul",
    title: "Karpet untuk Family Gathering di Bantul",
    description: "Panduan mempersiapkan karpet sewa untuk family gathering di Bantul dengan daftar kebutuhan yang mudah dikonfirmasi.",
    tags: ["karpet", "family gathering", "bantul"],
    intent: ["sewa karpet family gathering bantul", "karpet acara keluarga bantul"],
    audience: "keluarga dan panitia family gathering",
    scenario: "peserta family gathering membutuhkan area duduk dan berkumpul yang rapi",
    item_focus: "karpet, permadani, dan area duduk",
    en_title: "Carpets for a Family Gathering in Bantul",
    en_description: "How to prepare rental carpets for a family gathering in Bantul with a needs list that is easy to confirm.",
    en_audience: "families and family-gathering organizers",
    en_scenario: "family-gathering attendees need a tidy area for sitting and gathering",
    en_item_focus: "carpets, rugs, and seating area",
    area: "bantul",
    service: "karpet",
    topic_type: "scenario",
  },
  {
    slug: "sewa-permadani-acara-kantor-di-kulonprogo",
    title: "Sewa Permadani untuk Acara Kantor di Kulonprogo",
    description: "Hal yang perlu ditanyakan ketika menyiapkan permadani sewa untuk acara kantor di Kulonprogo.",
    tags: ["permadani", "acara kantor", "kulonprogo"],
    intent: ["sewa permadani acara kantor kulonprogo", "rental karpet kulonprogo"],
    audience: "panitia acara kantor di Kulonprogo",
    scenario: "ruang acara kantor membutuhkan alas tambahan untuk peserta dan tamu",
    item_focus: "permadani dan karpet",
    en_title: "Renting a Rug for a Company Event in Kulonprogo",
    en_description: "What to ask when arranging a rental rug for a company event in Kulonprogo.",
    en_audience: "company event organizers in Kulonprogo",
    en_scenario: "a company event room needs extra floor covering for attendees and guests",
    en_item_focus: "rugs and carpets",
    area: "kulonprogo",
    service: "permadani",
    topic_type: "area-specific",
  },
  {
    slug: "extra-bed-untuk-homestay-kecil-di-jogja",
    title: "Extra Bed untuk Homestay Kecil di Jogja",
    description: "Cara pemilik homestay kecil merencanakan extra bed ketika jumlah tamu berubah pada periode tertentu.",
    tags: ["extra bed", "homestay", "jogja"],
    intent: ["extra bed homestay jogja", "sewa kasur homestay kecil"],
    audience: "pemilik homestay kecil di Yogyakarta",
    scenario: "tamu tambahan membutuhkan tempat tidur tanpa membeli perlengkapan baru",
    item_focus: "extra bed, kasur, dan perlengkapan tidur",
    en_title: "Extra Beds for a Small Homestay in Yogyakarta",
    en_description: "How a small homestay owner can plan extra beds when guest numbers change during a particular period.",
    en_audience: "small homestay owners in Yogyakarta",
    en_scenario: "additional guests need sleeping space without buying new equipment",
    en_item_focus: "extra beds, mattresses, and sleep equipment",
    area: "yogyakarta",
    service: "extra bed",
    topic_type: "service-specific",
  },
  {
    slug: "panduan-extra-bed-guest-house-di-sleman",
    title: "Panduan Extra Bed untuk Guest House di Sleman",
    description: "Pertimbangan guest house saat menyiapkan extra bed berdasarkan tipe kamar, jumlah tamu, dan durasi.",
    tags: ["extra bed", "guest house", "sleman"],
    intent: ["extra bed guest house sleman", "rental extra bed penginapan"],
    audience: "pengelola guest house di Sleman",
    scenario: "reservasi keluarga membutuhkan tambahan tempat tidur di kamar atau ruang yang disepakati",
    item_focus: "extra bed dan perlengkapan tidur",
    en_title: "Extra Beds for a Guest House in Sleman: A Practical Guide",
    en_description: "Considerations for a guest house preparing extra beds based on room type, guest count, and duration.",
    en_audience: "guest house managers in Sleman",
    en_scenario: "a family booking needs extra sleeping space in an agreed room or area",
    en_item_focus: "extra beds and sleep equipment",
    area: "sleman",
    service: "extra bed",
    topic_type: "service-specific",
  },
  {
    slug: "cara-menyiapkan-kamar-homestay-dengan-extra-bed",
    title: "Cara Menyiapkan Kamar Homestay dengan Extra Bed",
    description: "Checklist menata kamar homestay dengan extra bed tanpa mengabaikan ruang gerak, akses, dan perlengkapan tidur.",
    tags: ["extra bed", "homestay", "checklist"],
    intent: ["menyiapkan kamar homestay extra bed", "tata kamar dengan extra bed"],
    audience: "pemilik homestay dan pengelola penginapan",
    scenario: "kamar perlu menampung tamu tambahan untuk periode tertentu",
    item_focus: "extra bed, kasur, bantal, guling, dan selimut",
    en_title: "How to Prepare a Homestay Room with an Extra Bed",
    en_description: "A checklist for arranging a homestay room with an extra bed while preserving movement space, access, and sleep equipment.",
    en_audience: "homestay owners and accommodation managers",
    en_scenario: "a room needs to accommodate additional guests for a particular period",
    en_item_focus: "extra beds, mattresses, pillows, bolsters, and blankets",
    area: "",
    service: "extra bed",
    topic_type: "howto",
  },
  {
    slug: "sewa-kasur-untuk-pemilik-villa-di-yogyakarta",
    title: "Sewa Kasur untuk Pemilik Villa di Yogyakarta",
    description: "Panduan pemilik villa menyiapkan kasur sewa saat kebutuhan tamu meningkat tanpa menambah aset permanen.",
    tags: ["sewa kasur", "villa", "yogyakarta"],
    intent: ["sewa kasur villa yogyakarta", "kasur tambahan untuk villa"],
    audience: "pemilik villa dan pengelola akomodasi di Yogyakarta",
    scenario: "jumlah tamu villa melebihi kapasitas tempat tidur yang tersedia",
    item_focus: "kasur, extra bed, dan paket perlengkapan tidur",
    en_title: "Mattress Rental for Villa Owners in Yogyakarta",
    en_description: "How villa owners can arrange mattress rentals when guest demand rises without adding permanent assets.",
    en_audience: "villa owners and accommodation managers in Yogyakarta",
    en_scenario: "the number of villa guests exceeds the available sleeping capacity",
    en_item_focus: "mattresses, extra beds, and sleep equipment packages",
    area: "yogyakarta",
    service: "sewa kasur",
    topic_type: "service-specific",
  },
  {
    slug: "extra-bed-untuk-tamu-keluarga-di-penginapan-bantul",
    title: "Extra Bed untuk Tamu Keluarga di Penginapan Bantul",
    description: "Hal yang perlu disiapkan pengelola penginapan Bantul ketika keluarga tamu membutuhkan tempat tidur tambahan.",
    tags: ["extra bed", "penginapan", "bantul"],
    intent: ["extra bed penginapan bantul", "kasur tambahan tamu keluarga"],
    audience: "pengelola penginapan di Bantul",
    scenario: "keluarga tamu membutuhkan tambahan tempat tidur untuk masa menginap",
    item_focus: "extra bed, bantal, guling, dan selimut",
    en_title: "Extra Beds for Family Guests at an Accommodation in Bantul",
    en_description: "What an accommodation manager in Bantul should prepare when a guest family needs extra sleeping space.",
    en_audience: "accommodation managers in Bantul",
    en_scenario: "a guest family needs additional sleeping space for its stay",
    en_item_focus: "extra beds, pillows, bolsters, and blankets",
    area: "bantul",
    service: "extra bed",
    topic_type: "area-specific",
  },
  {
    slug: "checklist-perlengkapan-tidur-homestay-kulonprogo",
    title: "Checklist Perlengkapan Tidur Homestay di Kulonprogo",
    description: "Checklist perlengkapan tidur yang dapat dipertimbangkan homestay di Kulonprogo ketika menerima tambahan tamu.",
    tags: ["homestay", "perlengkapan tidur", "kulonprogo"],
    intent: ["perlengkapan tidur homestay kulonprogo", "extra bed homestay"],
    audience: "pemilik homestay di Kulonprogo",
    scenario: "homestay perlu menyiapkan tempat tidur tambahan untuk tamu keluarga atau rombongan kecil",
    item_focus: "kasur, extra bed, bantal, guling, selimut, dan sprei",
    en_title: "Sleep Equipment Checklist for a Homestay in Kulonprogo",
    en_description: "A checklist of sleep equipment a homestay in Kulonprogo can consider when welcoming additional guests.",
    en_audience: "homestay owners in Kulonprogo",
    en_scenario: "a homestay needs extra sleeping space for a family or small group",
    en_item_focus: "mattresses, extra beds, pillows, bolsters, blankets, and sheets",
    area: "kulonprogo",
    service: "extra bed",
    topic_type: "howto",
  },
];

function parseArgs(argv) {
  const dbIndex = argv.indexOf("--db");
  return {
    dbPath: path.resolve(dbIndex >= 0 ? argv[dbIndex + 1] : (process.env.SANTI_BLOG_DB_PATH ?? DEFAULT_DB)),
    dryRun: argv.includes("--dry-run") || process.env.SANTI_BLOG_DRY_RUN === "1",
  };
}

function runSql(dbPath, sql, json = false) {
  const args = json ? ["-json", dbPath, sql] : [dbPath, sql];
  return execFileSync("sqlite3", args, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }).trim();
}

function sqlQuote(value) {
  return `'${String(value ?? "").replace(/'/g, "''")}'`;
}

export function statusCounts(dbPath) {
  const rows = JSON.parse(runSql(dbPath, "SELECT status, COUNT(*) AS count FROM topics GROUP BY status ORDER BY status;", true) || "[]");
  return Object.fromEntries(rows.map((row) => [row.status, Number(row.count)]));
}

const EN_METADATA_COLUMNS = [
  "en_title",
  "en_description",
  "en_audience",
  "en_scenario",
  "en_item_focus",
];

function existingColumns(dbPath) {
  const rows = JSON.parse(runSql(dbPath, "PRAGMA table_info(topics);", true) || "[]");
  return new Set(rows.map((row) => row.name));
}

function addMissingMetadataSql(dbPath) {
  return EN_METADATA_COLUMNS
    .filter((column) => !existingColumns(dbPath).has(column))
    .map((column) => `ALTER TABLE topics ADD COLUMN ${column} TEXT NOT NULL DEFAULT '';`)
    .join(" ");
}

function insertSql(topic) {
  const fields = [
    topic.slug,
    topic.title,
    topic.description,
    JSON.stringify(topic.tags),
    JSON.stringify(topic.intent),
    topic.audience,
    topic.scenario,
    topic.item_focus,
    topic.en_title,
    topic.en_description,
    topic.en_audience,
    topic.en_scenario,
    topic.en_item_focus,
    topic.area,
    topic.service,
    topic.topic_type,
  ];
  return `INSERT OR IGNORE INTO topics (slug, title, description, tags, intent, audience, scenario, item_focus, en_title, en_description, en_audience, en_scenario, en_item_focus, area, service, topic_type) VALUES (${fields.map(sqlQuote).join(", ")});`;
}

function fillMetadataSql(topic) {
  const metadata = [
    ["en_title", topic.en_title],
    ["en_description", topic.en_description],
    ["en_audience", topic.en_audience],
    ["en_scenario", topic.en_scenario],
    ["en_item_focus", topic.en_item_focus],
  ];
  const assignments = metadata.map(([column, value]) =>
    `${column}=CASE WHEN COALESCE(TRIM(${column}), '')='' THEN ${sqlQuote(value)} ELSE ${column} END`
  );
  const blankCheck = metadata.map(([column]) => `COALESCE(TRIM(${column}), '')=''`).join(" OR ");
  return `UPDATE topics SET ${assignments.join(", ")} WHERE slug=${sqlQuote(topic.slug)} AND (${blankCheck});`;
}

export function refreshTopics(dbPath, { dryRun = false } = {}) {
  const before = statusCounts(dbPath);
  const uniqueSlugs = new Set(TOPIC_DEFINITIONS.map((topic) => topic.slug));
  if (uniqueSlugs.size !== TOPIC_DEFINITIONS.length) throw new Error("topic definitions contain duplicate slugs");
  if (!dryRun) {
    const addMissingMetadata = addMissingMetadataSql(dbPath);
    runSql(dbPath, `BEGIN IMMEDIATE; ${addMissingMetadata} ${TOPIC_DEFINITIONS.map(insertSql).join(" ")} ${TOPIC_DEFINITIONS.map(fillMetadataSql).join(" ")} COMMIT;`);
  }
  const after = statusCounts(dbPath);
  return { before, after, definitions: TOPIC_DEFINITIONS.length, dryRun };
}

export function main(argv = process.argv.slice(2)) {
  const { dbPath, dryRun } = parseArgs(argv);
  const result = refreshTopics(dbPath, { dryRun });
  const beforeTotal = Object.values(result.before).reduce((sum, count) => sum + count, 0);
  const afterTotal = Object.values(result.after).reduce((sum, count) => sum + count, 0);
  const inserted = afterTotal - beforeTotal;
  console.log(`[SANTI TOPIC REFRESH] mode=${dryRun ? "dry_run" : "apply"} definitions=${result.definitions} inserted=${inserted} before=${JSON.stringify(result.before)} after=${JSON.stringify(result.after)} db=${dbPath}`);
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`[SANTI TOPIC REFRESH ERROR] ${String(error.message ?? error).replace(/\s+/g, " ").slice(0, 900)}`);
    process.exitCode = 1;
  }
}
