import type { LandingPageConfig } from '@/types/landing';

export const sewaBantal: LandingPageConfig = {
  meta: {
    title: 'Sewa & Rental Bantal Jogja Terdekat | Bersih & Higienis',
    description: 'Pusat sewa dan rental bantal guling terdekat di Jogja. Bantal empuk, sarung bersih wangi laundry, jaminan steril UV-C. Cocok untuk tamu & asrama.',
  },
  hero: {
    title: 'Sewa & Rental Bantal Jogja',
    subtitle: 'Cari tempat sewa bantal terdekat? Kami sediakan bantal guling ekstra yang dijamin bersih, wangi, dan steril untuk kenyamanan tamu Anda.',
    badge: 'Mulai Rp10.000/hari',
  },
  color: 'cyan',

  benefits: [
    { icon: '🧼', title: '100% Higienis', description: 'Bantal disterilkan dengan sinar UV-C dan sarung bantal selalu baru dari laundry.' },
    { icon: '☁️', title: 'Isi Dakron Premium', description: 'Bantal empuk dan padat, mampu menopang kepala dengan nyaman tanpa takut kempes.' },
    { icon: '🚚', title: 'Antar Jemput Kilat', description: 'Pesan pagi, bantal sampai siang. Kami antar langsung ke alamat Anda di Jogja.' },
    { icon: '💰', title: 'Harga Termurah', description: 'Solusi paling hemat daripada beli baru. Sewa harian atau bulanan sesuai kebutuhan.' },
  ],
  priceCards: [
    { name: 'Bantal Tidur', size: 'Standar Dewasa', price: 'Rp 10.000', daily: 'Per Hari', note: 'Termasuk sarung bersih', popular: true },
    { name: 'Guling', size: 'Standar Dewasa', price: 'Rp 10.000', daily: 'Per Hari', note: 'Termasuk sarung bersih', popular: false },
    { name: 'Paket Hemat (B+G)', size: '1 Bantal + 1 Guling', price: 'Rp 18.000', daily: 'Per Hari', note: 'Lebih hemat Rp 2.000', popular: true },
  ],
  audience: [
    { icon: '🏠', title: 'Tamu Menginap', description: 'Sediakan bantal ekstra yang layak untuk kerabat atau keluarga yang berkunjung.' },
    { icon: '🎓', title: 'Mahasiswa Baru', description: 'Lengkapi kebutuhan kost baru Anda tanpa harus keluar modal besar di awal.' },
    { icon: '🏨', title: 'Homestay & Penginapan', description: 'Upgrade fasilitas tidur tamu Anda dengan bantal yang selalu segar dan wangi.' },
    { icon: '🎒', title: 'Study Tour / Camping', description: 'Sedia bantal dalam jumlah besar untuk rombongan wisata atau acara makrab.' },
  ],
  faqs: [
    { question: 'Apakah sarung bantal sudah dicuci?', answer: 'Tentu. Setiap sarung bantal wajib melalui proses laundry profesional dan disetrika suhu tinggi sebelum dikirim.' },
    { question: 'Bisa sewa dalam jumlah banyak?', answer: 'Bisa banget! Kami memiliki stok ratusan bantal untuk kebutuhan rombongan atau event besar.' },
    { question: 'Apakah ada minimal sewa?', answer: 'Tidak ada. Anda bisa menyewa bantal mulai dari 1 unit saja untuk kebutuhan mendadak.' },
    { question: 'Bagaimana cara pesannya?', answer: 'Cukup klik tombol WhatsApp, kirim lokasi, dan tim kurir kami akan segera meluncur.' },
  ],
  cta: {
    title: 'Butuh bantal tambahan malam ini?',
    description: 'Admin kami siap melayani pesanan Anda 24/7 via WhatsApp.',
    waText: 'Halo Santi Living, saya mau sewa bantal guling ekstra',
    waSource: 'sewa_bantal_page',
  },
en: {
  meta: {
    title: 'Nearest Pillow Rental in Jogja | Clean & Hygienic',
    description: 'The nearest pillow and bolster rental center in Jogja. Soft pillows, fresh laundered pillowcases, UV-C sterilization guaranteed. Perfect for guests & dormitories.',
  },
  hero: {
    title: 'Pillow Rental in Jogja',
    subtitle: 'Looking for the nearest pillow rental? We provide extra pillows and bolsters guaranteed to be clean, fresh, and sterile for your guests\' comfort.',
    badge: 'Starting from Rp10,000/day',
  },
  benefits: [
    { icon: '🧼', title: '100% Hygienic', description: 'Pillows are sterilized with UV-C light and pillowcases are always freshly laundered.' },
    { icon: '☁️', title: 'Premium Dacron Fill', description: 'Soft and firm pillows that support your head comfortably without going flat.' },
    { icon: '🚚', title: 'Express Delivery & Pickup', description: 'Order in the morning, pillow arrives by noon. We deliver directly to your address in Jogja.' },
    { icon: '💰', title: 'Lowest Price', description: 'The most affordable solution compared to buying new. Daily or monthly rental to suit your needs.' },
  ],
  priceCards: [
    { name: 'Sleeping Pillow', size: 'Adult Standard', price: 'Rp 10,000', daily: 'Per Day', note: 'Includes clean pillowcase', popular: true },
    { name: 'Bolster', size: 'Adult Standard', price: 'Rp 10,000', daily: 'Per Day', note: 'Includes clean cover', popular: false },
    { name: 'Value Bundle (P+B)', size: '1 Pillow + 1 Bolster', price: 'Rp 18,000', daily: 'Per Day', note: 'Save Rp 2,000', popular: true },
  ],
  audience: [
    { icon: '🏠', title: 'Overnight Guests', description: 'Provide proper extra pillows for relatives or family members who are visiting.' },
    { icon: '🎓', title: 'New Students', description: 'Complete your new boarding house needs without having to spend a lot upfront.' },
    { icon: '🏨', title: 'Homestays & Guesthouses', description: 'Upgrade your guests\' sleeping experience with pillows that are always fresh and fragrant.' },
    { icon: '🎒', title: 'Study Tours / Camping', description: 'Supply pillows in large quantities for tour groups or orientation events.' },
  ],
  faqs: [
    { question: 'Are the pillowcases already washed?', answer: 'Absolutely. Every pillowcase must go through a professional laundry process and be ironed at high temperature before delivery.' },
    { question: 'Can I rent in large quantities?', answer: 'Of course! We have hundreds of pillows in stock for group needs or large events.' },
    { question: 'Is there a minimum rental?', answer: 'No minimum. You can rent as few as 1 unit for last-minute needs.' },
    { question: 'How do I place an order?', answer: 'Simply click the WhatsApp button, send your location, and our courier team will be on their way.' },
  ],
  cta: {
    title: 'Need extra pillows tonight?',
    description: 'Our admin is ready to serve your orders 24/7 via WhatsApp.',
    waText: 'Hello Santi Living, I would like to rent extra pillows and bolsters',
    waSource: 'sewa_bantal_page',
  },
},
};
