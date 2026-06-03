import type { LandingPageConfig } from '@/types/landing';

export const sewaKarpet: LandingPageConfig = {
  meta: {
    title: 'Sewa Karpet Jogja Murah - Harian & Event | Santi Living',
    description: 'Jasa sewa karpet Jogja terdekat untuk event, pameran, booth, panggung, dekorasi wedding / akad, dan pengajian/tahlilan. Hubungi Santi Living untuk harga rental murah terjangkau.',
  },
  hero: {
    title: 'Sewa Karpet Jogja',
    subtitle: 'Solusi rental karpet bersih untuk event, booth pameran, panggung, akad nikah, pengajian, dan pertemuan keluarga harian terpercaya di Yogyakarta.',
    badge: 'Mulai Rp 10.000 / Meter',
  },
  color: 'indigo',
  benefits: [
    { icon: '🧹', title: 'Bersih & Steril', description: 'Karpet divacuum bersih dari debu dan kotoran sebelum diantar agar nyaman digunakan.' },
    { icon: '🚚', title: 'Antar Jemput Tepat Waktu', description: 'Armada logistik kami siap mengantar dan menjemput karpet langsung ke lokasi acara Anda.' },
    { icon: '💰', title: 'Harga Terjangkau & Transparan', description: 'Harga sewa harian yang murah dan bersahabat untuk menyukseskan berbagai kegiatan Anda.' },
    { icon: '🤝', title: 'Bebas Ribet', description: 'Cukup pesan via WhatsApp, tentukan jadwal kirim & jemput, biar kami yang urus logistiknya.' }
  ],
  priceCards: [
    { name: 'Karpet Event Kecil / Lorong', size: 'Lebar 1m (Panjang Custom)', price: 'Mulai Rp 10.000', daily: 'Per meter / hari', note: 'Cocok untuk lorong masuk atau jalan setapak', popular: false },
    { name: 'Karpet Sedang', size: 'Ukuran 2m x 3m', price: 'Rp 45.000', daily: 'Per Hari', note: 'Ideal untuk dekorasi akad nikah atau ruang VIP minimalis', popular: true },
    { name: 'Karpet Besar', size: 'Ukuran 3m x 4m', price: 'Rp 65.000', daily: 'Per Hari', note: 'Pas untuk area panggung atau lesehan kumpul keluarga', popular: false },
    { name: 'Karpet Area Booth / Panggung', size: 'Custom Setup / Meter persegi', price: 'Estimasi By Request', daily: 'Konsultasikan via WA', note: 'Kebutuhan panggung besar, pameran, atau pameran multi-booth', popular: false },
    { name: 'Karpet VIP / Dekoratif', size: 'Tekstur Tebal & Premium', price: 'Estimasi By Request', daily: 'Konsultasikan via WA', note: 'Karpet berkualitas tinggi untuk event eksklusif', popular: false }
  ],
  audience: [
    { icon: '🤵', title: 'Pernikahan, Akad & Hajatan', description: 'Karpet bersih dan rapi untuk area ijab kabul, wedding prep di homestay, atau area kumpul keluarga.' },
    { icon: '🎪', title: 'Pameran, Booth & Panggung', description: 'Pemasangan karpet instan untuk booth bazaar, pameran UMKM, panggung pensi sekolah, atau expo.' },
    { icon: '🏡', title: 'Pengajian & Acara Keluarga', description: 'Sewa karpet lesehan tebal untuk tahlilan, arisan, syukuran, atau acara kumpul keluarga besar.' },
    { icon: '🏫', title: 'Pertemuan & Event Komunitas', description: 'Layanan sewa untuk seminar, makrab mahasiswa di vila, talkshow, maupun gathering indoor.' }
  ],
  faqs: [
    { question: 'Berapa minimal pemesanan sewa karpet di Jogja?', answer: 'Pemesanan sewa karpet minimal Rp 50.000 (belum termasuk ongkos kirim) atau bisa digabung dengan item sewa kasur / perlengkapan lain di Santi Living.' },
    { question: 'Apakah bisa diantar hari ini juga untuk kebutuhan darurat?', answer: 'Ya, kami melayani same day delivery 2-4 jam jika pesanan terkonfirmasi sebelum jam 15:00 WIB dan stok tersedia.' },
    { question: 'Apakah tim Santi Living melayani pemasangan / instalasi?', answer: 'Untuk karpet lepasan (kasur/lesehan), kami hanya mengantar sampai ke lokasi. Untuk kebutuhan karpet pameran press yang memerlukan instalasi khusus, silakan konsultasikan via WhatsApp.' },
    { question: 'Apakah melayani pengiriman ke Gunungkidul?', answer: 'Mohon maaf, demi keselamatan operasional kurir kami, saat ini kami secara ketat TIDAK melayani area Gunungkidul. Jangkauan aktif kami meliputi Sleman, Bantul, Yogyakarta, dan sebagian Kulonprogo.' }
  ],
  cta: {
    title: 'Butuh rental karpet bersih cepat di Yogyakarta?',
    description: 'Konsultasikan ukuran, jumlah, dan jadwal pengiriman karpet acara Anda bersama admin fast-response kami.',
    waText: 'Halo Santi Living, saya mau tanya/booking rental karpet Jogja untuk acara kami',
    waSource: 'sewa_karpet_page'
  },
  sections: [
    {
      title: 'Persewaan Karpet Event, Panggung & Lesehan Jogja',
      content: `
        <p>Mengadakan acara di Yogyakarta kini semakin mudah tanpa perlu membeli banyak perlengkapan sekali pakai. Baik itu pameran bisnis (bazaar), panggung talkshow, dekorasi akad/pernikahan, hingga pengajian keluarga di rumah, kebutuhan alas berupa karpet bersih sangatlah esensial untuk estetika maupun kenyamanan tamu/panitia.</p>
        <p><strong>Santi Living</strong> menyediakan jasa sewa karpet murah di Jogja dengan fokus utama pada kebersihan karpet, kemudahan pemesanan, dan ketepatan waktu pengantaran. Kami menawarkan opsi sewa karpet custom meteran untuk pameran/booth, karpet ukuran standar siap pakai (2x3m dan 3x4m) yang cocok untuk dekorasi akad/VIP, hingga karpet lesehan tebal untuk syukuran/tahlilan.</p>
        <h3>Keunggulan Sewa Karpet Jogja Melalui Santi Living</h3>
        <ul>
          <li><strong>Kebersihan Terjamin:</strong> Sebelum dikirim, seluruh karpet kami bersihkan dan vacuum secara higienis sehingga bebas dari debu berlebih.</li>
          <li><strong>Pilihan Ukuran Fleksibel:</strong> Tersedia karpet lorong panjang 1 meter, karpet siap pakai (2x3m & 3x4m), hingga custom layout untuk panggung pameran.</li>
          <li><strong>Gratis Jemput Logistik:</strong> Anda tidak perlu lelah memikirkan bagaimana cara mengembalikan karpet tebal yang berat. Tim kurir kami akan mengambilnya langsung setelah masa sewa selesai.</li>
          <li><strong>Layanan Area Sleman, Jogja Kota, Bantul & Kulonprogo:</strong> Kami menjangkau sebagian besar kawasan strategis di DIY untuk menyukseskan jalannya acara Anda.</li>
        </ul>
      `
    }
  ]
};
