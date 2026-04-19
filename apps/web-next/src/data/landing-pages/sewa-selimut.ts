import type { LandingPageConfig } from '@/types/landing';

export const sewaSelimut: LandingPageConfig = {
  meta: {
    title: 'Sewa & Rental Selimut Jogja Terdekat | Kualitas Hotel',
    description: 'Layanan sewa dan rental selimut tebal terdekat di Jogja. Selimut bulu halus (fleece), wangi laundry, sangat hangat untuk musim dingin atau camping.',
  },
  hero: {
    title: 'Sewa & Rental Selimut Jogja',
    subtitle: 'Butuh selimut tambahan terdekat? Sewa selimut tebal kualitas hotel yang lembut, hangat, dan dijamin 100% bersih.',
    badge: 'Mulai Rp10.000/hari',
  },
  color: 'indigo',
  benefits: [
    { icon: '🔥', title: 'Sangat Hangat', description: 'Bahan tebal (Fleece/Microfiber) yang sangat efektif menahan suhu dingin malam hari.' },
    { icon: '🌸', title: 'Wangi Laundry', description: 'Selimut dicuci dengan pewangi linen premium. Tidak ada bau apek atau lembab.' },
    { icon: '🧼', title: 'Higienitas Total', description: 'Melalui proses cuci suhu tinggi untuk memastikan kuman dan tungau mati total.' },
    { icon: '🚚', title: 'Antar Sampai Pintu', description: 'Gak perlu repot, kami antar selimut bersih langsung ke rumah atau kost Anda.' },
  ],
  priceCards: [
    { name: 'Selimut Harian', size: 'Single / Double', price: 'Rp 10.000', daily: 'Per Hari', note: 'Bahan fleece lembut', popular: true },
    { name: 'Selimut Mingguan', size: 'Single / Double', price: 'Rp 60.000', daily: 'Per Minggu', note: 'Lebih hemat', popular: false },
    { name: 'Selimut Bulanan', size: 'Single / Double', price: 'Rp 150.000', daily: 'Per Bulan', note: 'Cocok untuk musim bediding', popular: false },
  ],
  audience: [
    { icon: '🏔️', title: 'Acara di Kaliurang', description: 'Lengkapi kebutuhan makrab atau retreat di area pegunungan yang dingin.' },
    { icon: '👨‍👩-👧‍👦', title: 'Keluarga Menginap', description: 'Pastikan tamu Anda tidak kedinginan saat menginap di rumah Anda.' },
    { icon: '🏢', title: 'Asrama & Pesantren', description: 'Solusi selimut bulanan untuk anak asrama tanpa repot mencuci sendiri.' },
    { icon: '⛺', title: 'Glamping / Camping', description: 'Tidur di alam bebas serasa di hotel dengan selimut tebal dari kami.' },
  ],
  faqs: [
    { question: 'Bahannya apa?', answer: 'Kami menggunakan selimut berbahan fleece atau microfiber tebal yang lembut dan tidak gatal di kulit.' },
    { question: 'Apakah selimutnya lebar?', answer: 'Ya, ukuran selimut kami cukup untuk menutupi tubuh orang dewasa dengan sempurna.' },
    { question: 'Bisa sewa selimut saja tanpa kasur?', answer: 'Tentu bisa. Kami melayani penyewaan selimut saja maupun paket lengkap dengan kasur.' },
    { question: 'Perlu deposit tidak?', answer: 'Sistem kami berbasis kepercayaan (tanpa deposit besar) khusus untuk wilayah Yogyakarta.' },
  ],
  cta: {
    title: 'Udara mulai terasa dingin?',
    description: 'Pesan selimut hangat Anda sekarang dan nikmati tidur nyenyak malam ini.',
    waText: 'Halo Santi Living, saya mau sewa selimut tebal',
    waSource: 'sewa_selimut_page',
  },
};
