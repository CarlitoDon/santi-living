import type { LandingPageConfig } from '@/types/landing';

export const sewaKasurTerdekat: LandingPageConfig = {
  meta: {
    title: 'Sewa & Rental Kasur Terdekat di Jogja | Pengiriman 2 Jam',
    description:
      'Cari sewa atau rental kasur terdekat di Jogja? Santi Living melayani area Sleman, Bantul, Kota Jogja. Pengiriman cepat 2 jam, kasur bersih, mulai Rp25.000/hari.',
  },
  hero: {
    title: 'Sewa & Rental Kasur Terdekat di Jogja',
    subtitle: 'Layanan sewa dan rental kasur terdekat — pengiriman cepat ke area Sleman, Bantul, dan Kota Yogyakarta',
    badge: 'Gratis ongkir radius 3 km',
  },
  color: 'green',
  benefits: [
    { icon: '📍', title: 'Lokasi Strategis', description: 'Berlokasi di Godean, dekat ke UGM, UNY, UMY, dan area kampus lainnya.' },
    { icon: '⚡', title: 'Pengiriman Cepat', description: 'Pemesanan sebelum jam 15:00 bisa diantar 2-4 jam. Same day delivery!' },
    { icon: '🆓', title: 'Gratis Ongkir', description: 'Pengiriman GRATIS untuk area dalam radius 3 km dari toko kami.' },
    { icon: '🗺️', title: 'Jangkauan Luas', description: 'Melayani area aktif Yogyakarta — Sleman, Bantul, Kota Jogja, Kulonprogo, dan sekitarnya.' },
  ],
  audience: [
    { icon: '🎓', title: 'Mahasiswa Area Kampus', description: 'UGM, UNY, UMY, UTY — kos kamu dekat dengan lokasi kami!' },
    { icon: '🏠', title: 'Warga Sleman & Bantul', description: 'Condongcatur, Maguwoharjo, Sewon, Kasihan — semua terjangkau.' },
    { icon: '🏨', title: 'Penginapan di Godean', description: 'Gratis ongkir! Butuh kasur tambahan untuk tamu, hubungi kami.' },
    { icon: '🏢', title: 'Event di Jogja', description: 'Acara di area layanan aktif Yogyakarta, kami bisa kirim dalam hitungan jam.' },
  ],
  faqs: [
    { question: 'Berapa jarak maksimal pengiriman?', answer: 'Kami melayani area aktif Sleman, Bantul, Kota Jogja, dan Kulonprogo. Untuk area dalam radius 3 km ongkir GRATIS, 3-8 km Rp15.000, 8-15 km Rp25.000, dan di atas 15 km wajib konfirmasi admin.' },
    { question: 'Berapa lama pengiriman dari pemesanan?', answer: 'Untuk pemesanan sebelum jam 15:00 WIB, kasur bisa diantar dalam 2-4 jam di hari yang sama (tergantung jarak dan ketersediaan).' },
    { question: 'Apakah bisa ambil sendiri ke toko?', answer: 'Bisa! Self-pickup di toko kami di Jl. Godean KM 10 tanpa ongkir. Cocok kalau kamu punya kendaraan sendiri.' },
    { question: 'Apakah area luar Jogja bisa dilayani?', answer: 'Untuk area di luar layanan aktif, termasuk Klaten, Magelang, Solo, dan Gunung Kidul, konfirmasi dulu via WhatsApp sebelum booking.' },
  ],
  cta: {
    title: 'Cari kasur terdekat?',
    description: 'Kami di Godean — bisa antar cepat ke lokasi kamu!',
    waText: 'Halo Santi Living, saya mau sewa kasur. Lokasi saya di [alamat]',
    waSource: 'terdekat_page',
  },
};
