import type { LandingPageConfig } from '@/types/landing';

export const sewaAcara: LandingPageConfig = {
  meta: {
    title: 'Sewa Perlengkapan Event & EO Jogja',
    description: 'Sewa perlengkapan event Jogja: kasur rest area, air cooler, TV display, karpet, meja, kursi, dan sound by request. Cek via WhatsApp.',
  },
  hero: {
    title: 'Sewa Perlengkapan Event & EO Jogja',
    subtitle: 'Solusi persewaan kebutuhan festival, gathering, outbound, wedding prep, pameran, dan acara kampus terpercaya',
    badge: 'Cek ketersediaan dan rute pengantaran',
  },
  color: 'indigo',
  tracking: {
    productCategory: 'event',
    pageType: 'money_page',
    intent: 'sewa_perlengkapan_event_jogja',
  },
  benefits: [
    { icon: '🛏️', title: 'Rest Area & Kasur Busa', description: 'Kasur busa High Density steril untuk ruang transit artis, crew, panitia, atau rest area event.' },
    { icon: '❄️', title: 'Pendingin & Air Cooler', description: 'Pendingin udara portabel agar tenda/ruangan memiliki sirkulasi udara baik dan crew nyaman.' },
    { icon: '📺', title: 'TV Display & Guide', description: 'LED TV 32 inch harian untuk kebutuhan guide map digital, display booth pameran, atau slide presentasi.' },
    { icon: '📦', title: 'Alat Acara (By Request)', description: 'Pengadaan opsional seperti meja, kursi, karpet, backdrop / dekorasi ringan, sound & lighting sederhana sesuai konsultasi.' },
    { icon: '🚚', title: 'Antar Jemput Sesuai Rundown', description: 'Armada pengiriman diprioritaskan untuk Sleman, Kota Jogja, Bantul, dan Kulon Progo; area jauh konfirmasi dulu via WhatsApp.' },
  ],
  priceCards: [
    { name: 'Paket Rest Area VIP', size: '2 Kasur Super + Sprei + Bantal', price: 'Estimasi WA', daily: 'Setelah tanggal, durasi, dan lokasi jelas', note: 'Pas untuk crew transit/VIP room pameran', popular: true },
    { name: 'Air Cooler / Cooling Fan', size: 'Standar Acara', price: 'Cek via WA', daily: 'Ketersediaan dan ongkir divalidasi dulu', note: 'Dingin maksimal dengan ice pack harian', popular: false },
    { name: 'Display TV 32" LED', size: 'HD dengan Kabel HDMI', price: 'Cek via WA', daily: 'Cek stok, durasi, dan akses venue', note: 'Cocok untuk booth pameran & wedding guide', popular: false },
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
    { question: 'Bagaimana dengan pengantaran dan biaya jemput?', answer: 'Kami menyediakan gratis ongkir untuk area terdekat dari workshop kami di Jl. Godean KM 10. Untuk area Sleman, Bantul, dan Kota Yogyakarta tarif sangat transparan berdasarkan jarak.' },
    { question: 'Apakah Santi Living melayani pengiriman ke Gunungkidul?', answer: 'Mohon maaf, demi keselamatan kurir dan kendala geografis jarak tempuh, kami belum melayani area Gunungkidul seperti Wonosari dan Semanu. Area prioritas kami mencakup Sleman, Kota Jogja, Bantul, dan Kulon Progo; area jauh perlu konfirmasi dulu.' },
  ],
  cta: {
    title: 'Butuh perlengkapan event cepat di Yogyakarta?',
    description: 'Konsultasikan kebutuhan rest area, armada logistik, TV pameran, meja-kursi, atau pendingin acara Anda dengan admin fast-response kami.',
    waText: 'Halo Santi Living, saya mau tanya/booking perlengkapan untuk event organizer / acara kami',
    waSource: 'acara_santiliving_page',
    secondaryLabel: 'Cek opsi karpet acara',
    secondaryHref: 'https://karpet.santiliving.com/sewa-karpet-jogja',
  },
  sections: [
    {
      title: 'Solusi Perlengkapan EO & Event Konsultatif di Yogyakarta',
      content: `
        <p>Menyelenggarakan sebuah pameran, wedding preparation, festival komunitas, makrab mahasiswa, atau gathering kantor membutuhkan persiapan logistik yang matang. Salah satu hal krusial yang sering luput namun sangat dicari adalah ruang istirahat (rest area / transit room) crew yang nyaman, pendingin booth pameran yang handal, dan layar presentasi pendukung.</p>
        <p><strong>Santi Living</strong> hadir sebagai mitra terpercaya bagi para Event Organizer (EO), panitia kampus, dan keluarga besar di Jogja. Sebagai divisi khusus persewaan kasur dan perlengkapan transit premium, kami menyediakan kasur busa steril kualitas premium (HD Foam), selimut ekstra, bantal cadangan, TV Display 32 inci, hingga Air Cooler hemat daya untuk menjamin kelancaran jalannya acara Anda.</p>
        <p>Selain peralatan inti di atas, kami juga memfasilitasi pengadaan penunjang operasional lainnya seperti meja lipat, kursi, karpet sirkulasi, backdrop dekorasi ringan, sound portable, dan lighting sederhana secara by-request / konsultatif via WhatsApp demi kemudahan satu atap logistik festival Anda.</p>
        <p>Untuk kebutuhan alas event yang lebih spesifik, buka halaman khusus <a href="https://karpet.santiliving.com/sewa-karpet-jogja"><strong>sewa karpet Jogja</strong></a> agar panitia bisa memilih karpet merah, permadani, atau paket karpet acara sebelum chat admin.</p>
        <h3>Mengapa EO & Panitia Event Memilih Santi Living?</h3>
        <ul>
          <li><strong>Higienitas Mutlak 7 Tahap:</strong> Seluruh kasur transit dijamin ultra bersih, divacuum tungau secara industri, disterilisasi sinar UV-C, dan dikirim dalam segel plastik kedap udara.</li>
          <li><strong>Pemesanan Fleksibel & Bulk Discount:</strong> Mulai dari penyewaan harian untuk acara singkat hingga sewa mingguan untuk workshop/diklat panitia. Dapatkan harga khusus diskon grosir untuk pemesanan di atas 5 unit.</li>
          <li><strong>Armada Pengiriman Sesuai Rute:</strong> Tim logistik kami dapat mengantar dan melakukan setup perlengkapan langsung di venue acara untuk area prioritas Sleman, Kota Jogja, Bantul, dan Kulon Progo. Area jauh tetap perlu konfirmasi dulu.</li>
          <li><strong>Area Operasional Jelas:</strong> Untuk menjaga ketepatan waktu pengiriman dan keselamatan operasional logistik, kami fokus di area prioritas tersebut dan belum menerima order ke Gunungkidul.</li>
        </ul>
      `
    }
  ]
};
