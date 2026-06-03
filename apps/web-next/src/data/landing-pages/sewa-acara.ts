import type { LandingPageConfig } from '@/types/landing';

export const sewaAcara: LandingPageConfig = {
  meta: {
    title: 'Sewa Perlengkapan Event & EO Jogja | Santi Living',
    description: 'Sewa perlengkapan event organizer & event Jogja terlengkap: kasur rest area, pendingin/air cooler, TV display, meja, kursi, sound & dekorasi ringan by request harian. Antar jemput se-DIY.',
  },
  hero: {
    title: 'Sewa Perlengkapan Event & EO Jogja',
    subtitle: 'Solusi persewaan kebutuhan festival, gathering, outbound, wedding prep, pameran, dan acara kampus terpercaya',
    badge: 'Same Day Delivery & Gratis Penjemputan',
  },
  color: 'indigo',
  benefits: [
    { icon: '🛏️', title: 'Rest Area & Kasur Busa', description: 'Kasur busa High Density steril untuk ruang transit artis, crew, panitia, atau rest area event.' },
    { icon: '❄️', title: 'Pendingin & Air Cooler', description: 'Pendingin udara portabel agar tenda/ruangan memiliki sirkulasi udara baik dan crew nyaman.' },
    { icon: '📺', title: 'TV Display & Guide', description: 'LED TV 32 inch harian untuk kebutuhan guide map digital, display booth pameran, atau slide presentasi.' },
    { icon: '📦', title: 'Alat Acara (By Request)', description: 'Pengadaan opsional seperti meja, kursi, karpet, backdrop / dekorasi ringan, sound & lighting sederhana sesuai konsultasi.' },
    { icon: '🚚', title: 'Antar Jemput Rundown', description: 'Armada pengiriman siap antar jemput tepat waktu ke lokasi event di Sleman, Bantul, Jogja City, & Kulonprogo.' },
  ],
  priceCards: [
    { name: 'Paket Rest Area VIP', size: '2 Kasur Super + Sprei + Bantal', price: 'Rp 90.000', daily: 'Per Hari', note: 'Pas untuk crew transit/VIP room pameran', popular: true },
    { name: 'Air Cooler / Cooling Fan', size: 'Standar Acara', price: 'Rp 35.000', daily: 'Per Hari', note: 'Dingin maksimal dengan ice pack harian', popular: false },
    { name: 'Display TV 32" LED', size: 'HD dengan Kabel HDMI', price: 'Rp 50.000', daily: 'Per Hari', note: 'Cocok untuk booth pameran & wedding guide', popular: false },
    { name: 'Meja & Kursi Lipat (By Request)', size: 'Custom Layout', price: 'Hubungi WA', daily: 'Konsultasikan', note: 'Layanan pengadaan opsional untuk crew & operasional', popular: false },
    { name: 'Lighting & Sound (By Request)', size: 'Portable Audio / Spot', price: 'Hubungi WA', daily: 'Konsultasikan', note: 'Peralatan musik/lighting sederhana pendukung keintiman acara', popular: false },
    { name: 'Karpet & Backdrop (By Request)', size: 'Alas & Dekorasi Ringan', price: 'Hubungi WA', daily: 'Konsultasikan', note: 'Pengadaan by-request penunjang sirkulasi & visual panitia', popular: false },
  ],
  audience: [
    { icon: '🎓', title: 'Acara Kampus & Mahasiswa', description: 'Penyewaan kasur bulk untuk makrab/outbound, TV display pameran karya, dan pendingin ruangan acara.' },
    { icon: '💼', title: 'Event Organizer & Vendor', description: 'Partner operasional terpercaya menunjang perlengkapan transit artist room, meja-kursi crew, dan penunjang pameran.' },
    { icon: '👰', title: 'Wedding Preparation / Hajatan', description: 'Rest area nyaman bagi keluarga besar pengantin di rumah singgah sementara atau homestay transit.' },
    { icon: '⛺', title: 'Bazar & Gathering Komunitas', description: 'Kebutuhan pendingin portabel, TV nobar, sound sistem portabel, dan alas tidur panitia untuk event.' },
  ],
  faqs: [
    { question: 'Apakah kasur dijamin bersih dan steril?', answer: 'Tentu. Santi Living menerapkan 7 Tahap Higienitas (vacuum tungau, UV-C steril, plastik tersegel) agar crew/panitia Anda beristirahat dengan nyaman.' },
    { question: 'Apakah peralatan by-request seperti meja, kursi, dan sound sudah pasti ready?', answer: 'Untuk item di luar kasur, pendingin, dan TV display, status pengadaannya adalah by-request/konsultatif. Mohon komunikasikan sedini mungkin agar tim kami dapat mengoordinasikan opsi terbaik untuk acara Anda.' },
    { question: 'Apakah bisa diantar hari ini juga untuk kebutuhan darurat?', answer: 'Ya, kami melayani same day delivery 2-4 jam jika pesanan terkonfirmasi sebelum jam 15:00 WIB dan stok tersedia.' },
    { question: 'Bagaimana dengan pengantaran dan biaya jemput?', answer: 'Kami menyediakan gratis ongkir untuk area terdekat dari workshop kami di Jl. Godean KM 4. Untuk area Sleman, Bantul, dan Kota Yogyakarta tarif sangat transparan berdasarkan jarak.' },
    { question: 'Apakah Santi Living melayani pengiriman ke Gunungkidul?', answer: 'Mohon maaf, demi keselamatan kurir dan kendala geografis jarak tempuh, kami secara ketat TIDAK melayani area Gunungkidul (Klaten/Semanu/Wonosari). Area aktif kami mencakup Sleman, Kota Jogja, Bantul, dan Kulonprogo.' },
  ],
  cta: {
    title: 'Butuh perlengkapan event cepat di Yogyakarta?',
    description: 'Konsultasikan kebutuhan rest area, armada logistik, TV pameran, meja-kursi, atau pendingin acara Anda dengan admin fast-response kami.',
    waText: 'Halo Santi Living, saya mau tanya/booking perlengkapan untuk event organizer / acara kami',
    waSource: 'acara_santiliving_page',
  },
  sections: [
    {
      title: 'Solusi Perlengkapan EO & Event Terlengkap di Yogyakarta',
      content: `
        <p>Menyelenggarakan sebuah pameran, wedding preparation, festival komunitas, makrab mahasiswa, atau gathering kantor membutuhkan persiapan logistik yang matang. Salah satu hal krusial yang sering luput namun sangat dicari adalah ruang istirahat (rest area / transit room) crew yang nyaman, pendingin booth pameran yang handal, dan layar presentasi pendukung.</p>
        <p><strong>Santi Living</strong> hadir sebagai mitra terpercaya bagi para Event Organizer (EO), panitia kampus, dan keluarga besar di Jogja. Sebagai divisi khusus persewaan kasur dan perlengkapan transit premium, kami menyediakan kasur busa steril kualitas premium (HD Foam), selimut ekstra, bantal cadangan, TV Display 32 inci, hingga Air Cooler hemat daya untuk menjamin kelancaran jalannya acara Anda.</p>
        <p>Selain peralatan inti di atas, kami juga memfasilitasi pengadaan penunjang operasional lainnya seperti meja lipat, kursi, karpet sirkulasi, backdrop dekorasi ringan, sound portable, dan lighting sederhana secara by-request / konsultatif via WhatsApp demi kemudahan satu atap logistik festival Anda.</p>
        <h3>Mengapa EO & Panitia Event Memilih Santi Living?</h3>
        <ul>
          <li><strong>Higienitas Mutlak 7 Tahap:</strong> Seluruh kasur transit dijamin ultra bersih, divacuum tungau secara industri, disterilisasi sinar UV-C, dan dikirim dalam segel plastik kedap udara.</li>
          <li><strong>Pemesanan Fleksibel & Bulk Discount:</strong> Mulai dari penyewaan harian untuk acara singkat hingga sewa mingguan untuk workshop/diklat panitia. Dapatkan harga khusus diskon grosir untuk pemesanan di atas 5 unit.</li>
          <li><strong>Armada Pengiriman Kilat (Same Day):</strong> Tim logistik kami siap mengantar dan melakukan setup perlengkapan langsung di venue acara Anda di Jogja, Sleman, Bantul, maupun Kulonprogo (Wates).</li>
          <li><strong>Pelayanan Tanpa Gunungkidul:</strong> Untuk menjaga ketepatan waktu pengiriman dan keselamatan operasional logistik, kami fokus penuh di 4 kabupaten utama se-DIY dan tidak menerima order ke perbukitan Gunungkidul.</li>
        </ul>
      `
    }
  ]
};
