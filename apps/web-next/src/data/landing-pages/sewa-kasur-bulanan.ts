import type { LandingPageConfig } from '@/types/landing';

export const sewaKasurBulanan: LandingPageConfig = {
  meta: {
    title: 'Sewa & Rental Kasur Bulanan Jogja Terdekat | Hemat Rp750rb',
    description:
      'Pusat sewa dan rental kasur bulanan terdekat di Jogja mulai Rp900.000/bulan. Cocok untuk kos, kontrakan, atau mahasiswa. Kasur bersih, antar jemput gratis, tanpa deposit besar.',
  },
  hero: {
    title: 'Sewa & Rental Kasur Bulanan Jogja',
    subtitle: 'Solusi hemat untuk kos, kontrakan, atau mahasiswa yang butuh rental kasur terdekat tanpa beli',
    badge: 'Mulai Rp900.000/bulan',
  },
  color: 'cyan',

  benefits: [
    { icon: '💸', title: 'Hemat vs Beli Baru', description: 'Kasur baru mulai Rp1-3 juta. Sewa bulanan cuma Rp750rb — hemat sampai 75%!' },
    { icon: '🎓', title: 'Cocok untuk Mahasiswa', description: 'Baru pindah kos? Sewa dulu, nanti kalau sudah settle baru beli.' },
    { icon: '🧹', title: 'Kasur Selalu Bersih', description: 'Setiap kasur dicuci profesional sebelum diantar. Bersih, wangi, dan steril.' },
    { icon: '📦', title: 'Bebas Repot', description: 'Selesai sewa? Kami jemput. Tidak perlu mikir mau diapakan kasurnya.' },
  ],
  priceCards: [
    { name: 'Single Standard', size: '90 × 200 cm', price: 'Rp 900.000', daily: '≈ Rp 30.000/hari', note: '1 orang • kasur busa saja', popular: false },
    { name: 'Paket Lengkap Single', size: 'Kasur + Sprei + Bantal', price: 'Rp 1.200.000', daily: '≈ Rp 40.000/hari', note: '1 orang • siap pakai langsung', popular: true },
    { name: 'Double', size: '120 × 200 cm', price: 'Rp 1.200.000', daily: '≈ Rp 40.000/hari', note: '1-2 orang • kasur busa saja', popular: false },
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
en: {
  meta: {
    title: 'Nearest Monthly Mattress Rental in Jogja | Save Rp750k',
    description:
      'Nearest monthly mattress rental center in Jogja starting from Rp900,000/month. Perfect for boarding houses, rentals, or students. Clean mattresses, free delivery & pickup, no large deposit.',
  },
  hero: {
    title: 'Monthly Mattress Rental in Jogja',
    subtitle: 'The budget-friendly solution for boarding houses, rentals, or students who need the nearest mattress rental without buying',
    badge: 'Starting from Rp900,000/month',
  },
  benefits: [
    { icon: '💸', title: 'Save vs Buying New', description: 'New mattresses start at Rp1–3 million. Monthly rental is only Rp750k — save up to 75%!' },
    { icon: '🎓', title: 'Perfect for Students', description: 'Just moved into a boarding house? Rent first, then buy once you\'re settled.' },
    { icon: '🧹', title: 'Always Clean Mattresses', description: 'Every mattress is professionally washed before delivery. Clean, fresh, and sanitized.' },
    { icon: '📦', title: 'Hassle-Free', description: 'Done renting? We\'ll pick it up. No need to worry about what to do with the mattress.' },
  ],
  priceCards: [
    { name: 'Single Standard', size: '90 × 200 cm', price: 'Rp 900,000', daily: '≈ Rp 30,000/day', note: '1 person • foam mattress only', popular: false },
    { name: 'Complete Single Package', size: 'Mattress + Bedsheet + Pillow', price: 'Rp 1,200,000', daily: '≈ Rp 40,000/day', note: '1 person • ready to use immediately', popular: true },
    { name: 'Double', size: '120 × 200 cm', price: 'Rp 1,200,000', daily: '≈ Rp 40,000/day', note: '1–2 people • foam mattress only', popular: false },
  ],
  audience: [
    { icon: '🎓', title: 'New Students', description: 'Just moved into a boarding house in Jogja and haven\'t had time to buy a mattress yet. Rent first while you settle in.' },
    { icon: '🏠', title: 'Rental Tenants', description: 'On a 3–6 month lease? Buying a mattress is too expensive — renting is far more affordable.' },
    { icon: '💼', title: 'Project Workers', description: 'Employees temporarily assigned to Jogja. Need a mattress without buying furniture.' },
    { icon: '🏢', title: 'Boarding House Owners', description: 'Need extra mattresses for new rooms? Rent multiple units and get a 10–15% discount!' },
  ],
  faqs: [
    { question: 'Is monthly rental cheaper than daily rental?', answer: 'Yes! Monthly rental pricing is calculated from the daily rate × 30 days with no markup. Compared to buying a new mattress, monthly rental is far more affordable.' },
    { question: 'Can I extend my monthly mattress rental?', answer: 'Of course! Just contact us via WhatsApp before your rental period ends. Extensions come with no additional admin fees.' },
    { question: 'Is there a deposit or security bond?', answer: 'No large deposit required. Just pay the rental fee + delivery cost upfront.' },
    { question: 'What if the mattress gets damaged during the rental?', answer: 'Normal wear and tear from regular use is not charged. For major damage, a reasonable replacement fee applies.' },
  ],
  cta: {
    title: 'Need a mattress for monthly rental?',
    description: 'Contact us — we can deliver today!',
    waText: 'Hello Santi Living, I would like to rent a mattress monthly for [duration] month(s)',
    waSource: 'bulanan_page',
  },
},
};
