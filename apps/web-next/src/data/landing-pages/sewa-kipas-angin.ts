import type { LandingPageConfig } from '@/types/landing';

export const sewaKipasAngin: LandingPageConfig = {
  meta: {
    title: 'Sewa & Rental Kipas Angin Jogja Terdekat | Harian & Bulanan',
    description: 'Layanan sewa dan rental kipas angin berdiri (stand fan) terdekat di Jogja. Solusi praktis & murah untuk mahasiswa kos atau acara. Antar jemput same day.',
  },
  hero: {
    title: 'Sewa Kipas Angin Jogja',
    subtitle: 'Cari rental kipas angin terdekat? Sewa harian atau bulanan, langsung adem!',
    badge: 'Mulai Rp29.000/hari',
  },
  color: 'emerald',
  benefits: [
    { icon: '💨', title: 'Angin Super Kencang', description: 'Kipas angin berdiri 16 inch dengan motor tangguh, sirkulasi udara maksimal.' },
    { icon: '🔄', title: 'Fleksibel Harian/Bulanan', description: 'Butuh sehari untuk acara? Atau bulanan untuk kos? Kami siap melayani.' },
    { icon: '🧹', title: 'Kondisi Bersih', description: 'Unit selalu dibersihkan dan bebas debu sebelum diantar ke tempat Anda.' },
    { icon: '🚚', title: 'Layanan Antar Jemput', description: 'Gak perlu repot bawa sendiri. Tim kami antar langsung ke pintu kamar Anda.' },
  ],
  priceCards: [
    { name: 'Kipas Angin (Harian)', size: '16 Inch Stand Fan', price: 'Rp 29.000', daily: 'Per Hari', note: 'Cocok untuk event / tamu', popular: false },
    { name: 'Kipas Angin (Mingguan)', size: '16 Inch Stand Fan', price: 'Rp 145.000', daily: 'Per Minggu', note: 'Lebih hemat', popular: true },
    { name: 'Kipas Angin (Bulanan)', size: '16 Inch Stand Fan', price: 'Rp 290.000', daily: 'Per Bulan', note: 'Paling hemat untuk anak kos', popular: false },
  ],
  audience: [
    { icon: '🎓', title: 'Anak Kos', description: 'Kamar kos panas tapi budget terbatas untuk beli AC? Sewa kipas bulanan adalah solusinya.' },
    { icon: '🎉', title: 'Hajatan / Acara', description: 'Butuh kipas tambahan untuk arisan keluarga atau kumpul teman di kontrakan?' },
    { icon: '🎒', title: 'Tamu Menginap', description: 'Beri kenyamanan ekstra untuk keluarga atau teman yang menginap di rumah Anda.' },
    { icon: '🏢', title: 'Event Organiser', description: 'Sewa dalam jumlah banyak untuk mendukung sirkulasi udara di acara indoor Anda.' },
  ],
  faqs: [
    { question: 'Berapa ukuran kipas anginnya?', answer: 'Kami menyewakan kipas angin berdiri (Stand Fan) ukuran standar 16 Inch yang cukup untuk mendinginkan satu kamar kos.' },
    { question: 'Apakah bisa diantar?', answer: 'Ya, kami melayani pengantaran (delivery) untuk penyewaan kipas angin di area Jogja dan sekitarnya.' },
    { question: 'Bagaimana jika kipasnya mati?', answer: 'Jika unit mengalami kerusakan mesin dalam masa sewa (bukan karena jatuh/air), kami akan menggantinya dengan unit baru secara gratis.' },
    { question: 'Apakah ada minimal sewa?', answer: 'Tidak ada minimal hari. Anda bisa menyewa mulai dari 1 hari saja.' },
  ],
  cta: {
    title: 'Kamar terasa gerah?',
    description: 'Pesan kipas angin sekarang dan nikmati udara sejuk hari ini juga.',
    waText: 'Halo Santi Living, saya mau sewa kipas angin berdiri',
    waSource: 'sewa_kipas_page',
  },
};
