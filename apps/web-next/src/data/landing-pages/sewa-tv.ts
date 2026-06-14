import type { LandingPageConfig } from '@/types/landing';

export const sewaTv: LandingPageConfig = {
  meta: {
    title: 'Sewa & Rental TV Jogja Terdekat | TV LED 32 Inch',
    description: 'Pusat sewa dan rental TV LED 32 Inch terdekat di Jogja harian/bulanan. Cocok untuk nobar mahasiswa, presentasi, atau homestay. Antar jemput same day.',
  },
  hero: {
    title: 'Sewa & Rental TV Jogja',
    subtitle: 'Penyewaan TV terdekat, solusi hiburan dan presentasi praktis tanpa harus beli baru',
    badge: 'Mulai Rp50.000/hari',
  },
  color: 'blue',

  benefits: [
    { icon: '📺', title: 'Resolusi HD Jernih', description: 'Nonton film, main game, atau presentasi dengan gambar yang tajam.' },
    { icon: '🎮', title: 'Support HDMI & USB', description: 'Mudah disambungkan ke laptop, console game, atau flashdisk.' },
    { icon: '🚚', title: 'Antar Jemput Gratis*', description: 'Layanan antar jemput gratis untuk area tertentu di Sleman & Jogja.' },
    { icon: '💸', title: 'Sewa Harian/Bulanan', description: 'Fleksibel! Sewa harian untuk event, atau bulanan untuk kamar kos.' },
  ],
  priceCards: [
    { name: 'TV LED 32 Inch (Harian)', size: '32 Inch HD', price: 'Rp 50.000', daily: 'Per Hari', note: 'Termasuk remote & kabel', popular: true },
    { name: 'TV LED 32 Inch (Mingguan)', size: '32 Inch HD', price: 'Rp 250.000', daily: 'Per Minggu', note: 'Lebih hemat untuk staycation', popular: false },
    { name: 'TV LED 32 Inch (Bulanan)', size: '32 Inch HD', price: 'Rp 750.000', daily: 'Per Bulan', note: 'Cocok untuk kamar kos eksklusif', popular: false },
  ],
  audience: [
    { icon: '⚽', title: 'Event Nobar', description: 'Nonton bareng bola atau film bareng teman kos jadi lebih seru.' },
    { icon: '📊', title: 'Presentasi Kampus', description: 'Layar lebih besar dari laptop untuk presentasi tugas akhir atau sidang.' },
    { icon: '🎮', title: 'Gaming', description: 'Sewa TV untuk mabar PlayStation atau rental console di akhir pekan.' },
    { icon: '🏠', title: 'Homestay & Penginapan', description: 'Upgrade fasilitas kamar homestay Anda tanpa modal besar beli TV.' },
  ],
  faqs: [
    { question: 'Apakah harga sudah termasuk kabel HDMI?', answer: 'Ya, kami bisa meminjamkan kabel HDMI secara gratis jika Anda membutuhkannya.' },
    { question: 'Apakah TV ini Smart TV?', answer: 'Unit standar kami adalah LED TV biasa. Namun Anda bisa menyambungkannya ke laptop atau Android Box.' },
    { question: 'Bagaimana jika TV rusak saat disewa?', answer: 'Penyewa bertanggung jawab atas kerusakan fisik (layar pecah/jatuh). Kerusakan mesin akibat pemakaian normal adalah tanggung jawab kami.' },
    { question: 'Bisa diantar ke kost?', answer: 'Tentu! Kami melayani pengantaran ke kos, rumah, atau penginapan di area Jogja.' },
  ],
  cta: {
    title: 'Butuh TV untuk acara hari ini?',
    description: 'Hubungi admin kami sekarang untuk cek ketersediaan stok.',
    waText: 'Halo Santi Living, saya mau tanya ketersediaan sewa TV LED 32 Inch',
    waSource: 'sewa_tv_page',
  },
en: {
  meta: {
    title: 'Nearest TV Rental in Jogja | 32 Inch LED TV',
    description: 'Nearest 32 Inch LED TV rental center in Jogja, daily/monthly. Perfect for student watch parties, presentations, or homestays. Same day delivery and pickup.',
  },
  hero: {
    title: 'TV Rental in Jogja',
    subtitle: 'Nearest TV rental, a practical entertainment and presentation solution without having to buy new',
    badge: 'Starting from Rp50,000/day',
  },
    benefits: [
    { icon: '📺', title: 'Clear HD Resolution', description: 'Watch movies, play games, or present with a sharp picture.' },
    { icon: '🎮', title: 'HDMI & USB Support', description: 'Easily connect to a laptop, game console, or flash drive.' },
    { icon: '🚚', title: 'Free Delivery & Pickup*', description: 'Free delivery and pickup service for certain areas in Sleman & Jogja.' },
    { icon: '💸', title: 'Daily/Monthly Rental', description: 'Flexible! Daily rental for events, or monthly for boarding rooms.' },
  ],
  priceCards: [
    { name: '32 Inch LED TV (Daily)', size: '32 Inch HD', price: 'Rp 50,000', daily: 'Per Day', note: 'Includes remote & cable', popular: true },
    { name: '32 Inch LED TV (Weekly)', size: '32 Inch HD', price: 'Rp 250,000', daily: 'Per Week', note: 'More savings for a staycation', popular: false },
    { name: '32 Inch LED TV (Monthly)', size: '32 Inch HD', price: 'Rp 750,000', daily: 'Per Month', note: 'Perfect for an exclusive boarding room', popular: false },
  ],
  audience: [
    { icon: '⚽', title: 'Watch Party Events', description: 'Watching football or movies together with housemates becomes more fun.' },
    { icon: '📊', title: 'Campus Presentations', description: 'A bigger screen than a laptop for final project or thesis presentations.' },
    { icon: '🎮', title: 'Gaming', description: 'Rent a TV for a PlayStation session or console rental on the weekend.' },
    { icon: '🏠', title: 'Homestays & Lodging', description: 'Upgrade your homestay room facilities without the large upfront cost of buying a TV.' },
  ],
  faqs: [
    { question: 'Does the price already include an HDMI cable?', answer: 'Yes, we can lend you an HDMI cable for free if you need one.' },
    { question: 'Is this TV a Smart TV?', answer: 'Our standard unit is a regular LED TV. However, you can connect it to a laptop or Android Box.' },
    { question: 'What if the TV is damaged during the rental?', answer: 'The renter is responsible for physical damage (cracked screen/drops). Machine damage due to normal use is our responsibility.' },
    { question: 'Can it be delivered to a boarding house?', answer: 'Of course! We provide delivery to boarding houses, homes, or lodging in the Jogja area.' },
  ],
  cta: {
    title: 'Need a TV for an event today?',
    description: 'Contact our admin now to check stock availability.',
    waText: 'Hello Santi Living, I would like to ask about the availability of a 32 Inch LED TV rental',
    waSource: 'sewa_tv_page',
  },
},
};
