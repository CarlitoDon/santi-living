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
};
