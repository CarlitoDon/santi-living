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
en: {
  meta: {
    title: 'Fan Rental Jogja Nearest Location | Daily & Monthly',
    description: 'Nearest stand fan rental service in Jogja. Practical & affordable solution for boarding house students or events. Same day delivery & pickup.',
  },
  hero: {
    title: 'Fan Rental Jogja',
    subtitle: 'Looking for the nearest fan rental? Rent daily or monthly, stay cool instantly!',
    badge: 'Starting from Rp29.000/day',
  },
  benefits: [
    { icon: '💨', title: 'Super Strong Airflow', description: '16 inch stand fan with a powerful motor for maximum air circulation.' },
    { icon: '🔄', title: 'Flexible Daily/Monthly', description: 'Need it for just one day for an event? Or monthly for a boarding room? We\'ve got you covered.' },
    { icon: '🧹', title: 'Clean Condition', description: 'Units are always cleaned and dust-free before being delivered to your place.' },
    { icon: '🚚', title: 'Delivery & Pickup Service', description: 'No need to carry it yourself. Our team delivers directly to your door.' },
  ],
  priceCards: [
    { name: 'Stand Fan (Daily)', size: '16 Inch Stand Fan', price: 'Rp 29.000', daily: 'Per Day', note: 'Great for events / guests', popular: false },
    { name: 'Stand Fan (Weekly)', size: '16 Inch Stand Fan', price: 'Rp 145.000', daily: 'Per Week', note: 'More savings', popular: true },
    { name: 'Stand Fan (Monthly)', size: '16 Inch Stand Fan', price: 'Rp 290.000', daily: 'Per Month', note: 'Best value for boarding house residents', popular: false },
  ],
  audience: [
    { icon: '🎓', title: 'Boarding House Residents', description: 'Room too hot but budget too tight for an AC? Monthly fan rental is the solution.' },
    { icon: '🎉', title: 'Gatherings / Events', description: 'Need extra fans for a family get-together or a hangout at your place?' },
    { icon: '🎒', title: 'Overnight Guests', description: 'Give extra comfort to family or friends staying overnight at your home.' },
    { icon: '🏢', title: 'Event Organizers', description: 'Rent in bulk to support air circulation at your indoor events.' },
  ],
  faqs: [
    { question: 'What size is the fan?', answer: 'We rent out standard 16 Inch stand fans, sufficient to cool a single boarding room.' },
    { question: 'Can it be delivered?', answer: 'Yes, we offer delivery service for fan rentals across Jogja and surrounding areas.' },
    { question: 'What if the fan breaks down?', answer: 'If the unit experiences a mechanical failure during the rental period (not due to dropping/water damage), we will replace it with a new unit free of charge.' },
    { question: 'Is there a minimum rental period?', answer: 'There is no minimum number of days. You can rent for as little as 1 day.' },
  ],
  cta: {
    title: 'Feeling stuffy in your room?',
    description: 'Order a fan now and enjoy cool air today.',
    waText: 'Hello Santi Living, I would like to rent a stand fan',
    waSource: 'sewa_kipas_page',
  },
},
};
