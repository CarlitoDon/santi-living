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
};
