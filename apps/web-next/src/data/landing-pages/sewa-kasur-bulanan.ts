import type { LandingPageConfig } from '@/types/landing';

export const sewaKasurBulanan: LandingPageConfig = {
  meta: {
    title: 'Sewa Kasur Bulanan Jogja | Hemat Mulai Rp750rb/Bulan',
    description:
      'Sewa kasur bulanan di Jogja mulai Rp750.000/bulan. Cocok untuk kos, kontrakan, atau mahasiswa. Kasur bersih, antar jemput gratis, tanpa deposit besar.',
  },
  hero: {
    title: 'Sewa Kasur Bulanan Jogja',
    subtitle: 'Solusi hemat untuk kos, kontrakan, atau mahasiswa yang butuh kasur tanpa beli',
    badge: 'Mulai Rp750.000/bulan',
  },
  color: 'cyan',
  benefits: [
    { icon: '💸', title: 'Hemat vs Beli Baru', description: 'Kasur baru mulai Rp1-3 juta. Sewa bulanan cuma Rp750rb — hemat sampai 75%!' },
    { icon: '🎓', title: 'Cocok untuk Mahasiswa', description: 'Baru pindah kos? Sewa dulu, nanti kalau sudah settle baru beli.' },
    { icon: '🧹', title: 'Kasur Selalu Bersih', description: 'Setiap kasur dicuci profesional sebelum diantar. Bersih, wangi, dan steril.' },
    { icon: '📦', title: 'Bebas Repot', description: 'Selesai sewa? Kami jemput. Tidak perlu mikir mau diapakan kasurnya.' },
  ],
  priceCards: [
    { name: 'Single Standard', size: '90 × 200 cm', price: 'Rp 750.000', daily: '≈ Rp 25.000/hari', note: '1 orang • kasur busa saja', popular: false },
    { name: 'Paket Lengkap Single', size: 'Kasur + Sprei + Bantal + Selimut', price: 'Rp 1.050.000', daily: '≈ Rp 35.000/hari', note: '1 orang • siap pakai langsung', popular: true },
    { name: 'Double', size: '120 × 200 cm', price: 'Rp 1.050.000', daily: '≈ Rp 35.000/hari', note: '1-2 orang • kasur busa saja', popular: false },
  ],
  audience: [
    { icon: '🎓', title: 'Mahasiswa Baru', description: 'Baru pindah kos di Jogja, belum sempat beli kasur. Sewa dulu sambil settle.' },
    { icon: '🏠', title: 'Penghuni Kontrakan', description: 'Kontrak 3-6 bulan? Beli kasur terlalu mahal, sewa jauh lebih hemat.' },
    { icon: '💼', title: 'Pekerja Project', description: 'Karyawan yang ditugaskan ke Jogja sementara. Butuh kasur tanpa beli furniture.' },
    { icon: '🏢', title: 'Pemilik Kos', description: 'Perlu kasur tambahan untuk kamar baru? Sewa banyak unit, dapat diskon 10-15%!' },
  ],
  faqs: [
    { question: 'Apakah sewa bulanan lebih murah dari harian?', answer: 'Ya! Harga sewa bulanan dihitung dari tarif harian × 30 hari tanpa markup. Dibanding beli kasur baru, sewa bulanan jauh lebih hemat.' },
    { question: 'Bisa perpanjang sewa kasur bulanan?', answer: 'Tentu! Cukup hubungi kami via WhatsApp sebelum masa sewa habis. Perpanjangan tanpa biaya administrasi tambahan.' },
    { question: 'Apakah ada deposit atau jaminan?', answer: 'Tidak ada deposit besar. Cukup bayar biaya sewa + ongkir di awal.' },
    { question: 'Bagaimana kalau kasur rusak saat disewa?', answer: 'Kerusakan normal akibat pemakaian wajar tidak dikenakan biaya. Untuk kerusakan besar ada biaya penggantian yang wajar.' },
  ],
  cta: {
    title: 'Butuh kasur untuk sewa bulanan?',
    description: 'Hubungi kami — bisa antar hari ini!',
    waText: 'Halo Santi Living, saya mau sewa kasur bulanan untuk [durasi] bulan',
    waSource: 'bulanan_page',
  },
};
