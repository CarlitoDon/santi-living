import type { LandingPageConfig } from '@/types/landing';

export const sewaKasurTerdekat: LandingPageConfig = {
  meta: {
    title: 'Sewa Kasur Terdekat di Jogja | Pengiriman 2-4 Jam',
    description:
      'Cari sewa kasur terdekat di Jogja? Santi Living melayani area Sleman, Bantul, Kota Jogja. Pengiriman cepat 2-4 jam, kasur bersih, mulai Rp25.000/hari.',
  },
  hero: {
    title: 'Sewa Kasur Terdekat di Jogja',
    subtitle: 'Layanan sewa kasur cepat — pengiriman 2-4 jam ke area Sleman, Bantul, dan Kota Yogyakarta',
    badge: 'Gratis ongkir radius 3 km',
  },
  color: 'green',
  benefits: [
    { icon: '📍', title: 'Lokasi Strategis', description: 'Berlokasi di Godean, dekat ke UGM, UNY, UMY, dan area kampus lainnya.' },
    { icon: '⚡', title: 'Pengiriman Cepat', description: 'Pemesanan sebelum jam 15:00 bisa diantar 2-4 jam. Same day delivery!' },
    { icon: '🆓', title: 'Gratis Ongkir', description: 'Pengiriman GRATIS untuk area dalam radius 3 km dari toko kami.' },
    { icon: '🗺️', title: 'Jangkauan Luas', description: 'Melayani seluruh DIY — Sleman, Bantul, Kota Jogja, dan sekitarnya.' },
  ],
  audience: [
    { icon: '🎓', title: 'Mahasiswa Area Kampus', description: 'UGM, UNY, UMY, UTY — kos kamu dekat dengan lokasi kami!' },
    { icon: '🏠', title: 'Warga Sleman & Bantul', description: 'Condongcatur, Maguwoharjo, Sewon, Kasihan — semua terjangkau.' },
    { icon: '🏨', title: 'Penginapan di Godean', description: 'Gratis ongkir! Butuh kasur tambahan untuk tamu, hubungi kami.' },
    { icon: '🏢', title: 'Event di Jogja', description: 'Acara di mana saja di area DIY, kami bisa kirim dalam hitungan jam.' },
  ],
  faqs: [
    { question: 'Berapa jarak maksimal pengiriman?', answer: 'Kami melayani seluruh wilayah DIY. Untuk area dalam radius 3 km ongkir GRATIS, 3-8 km Rp15.000, 8-15 km Rp25.000, dan di atas 15 km Rp1.500/km.' },
    { question: 'Berapa lama pengiriman dari pemesanan?', answer: 'Untuk pemesanan sebelum jam 15:00 WIB, kasur bisa diantar dalam 2-4 jam di hari yang sama (tergantung jarak dan ketersediaan).' },
    { question: 'Apakah bisa ambil sendiri ke toko?', answer: 'Bisa! Self-pickup di toko kami di Jl. Godean KM 10 tanpa ongkir. Cocok kalau kamu punya kendaraan sendiri.' },
    { question: 'Apakah area luar Jogja bisa dilayani?', answer: 'Untuk area luar DIY (Klaten, Magelang, Solo) bisa dikonsultasikan dulu via WhatsApp untuk hitung ongkir.' },
  ],
  cta: {
    title: 'Cari kasur terdekat?',
    description: 'Kami di Godean — bisa antar cepat ke lokasi kamu!',
    waText: 'Halo Santi Living, saya mau sewa kasur. Lokasi saya di [alamat]',
    waSource: 'terdekat_page',
  },
};
