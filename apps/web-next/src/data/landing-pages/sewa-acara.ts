import type { LandingPageConfig } from '@/types/landing';

export const sewaAcara: LandingPageConfig = {
  meta: {
    title: 'Sewa Perlengkapan Event & EO Jogja | Santi Living',
    description: 'Sewa perlengkapan event organizer & event Jogja terlengkap: kasur rest area, bantal/selimut, cooling fan/air cooler, TV display, meja & kursi lipat harian. Antar jemput se-DIY.',
  },
  hero: {
    title: 'Sewa Perlengkapan Event & EO Jogja',
    subtitle: 'Solusi persewaan kebutuhan festival, gathering, outbound, wedding prep, pameran, dan acara kampus terpercaya',
    badge: 'Same Day Delivery & Gratis Penjemputan',
  },
  color: 'indigo',
  benefits: [
    { icon: '🛏️', title: 'Rest Area & Kasur Busa', description: 'Kasur busa High Density steril untuk ruang transit artis, crew, panitia, atau rest area event.' },
    { icon: '❄️', title: 'AC Portable & Air Cooler', description: 'Pendingin udara hemat daya agar tenda sirkulasi udara baik dan tamu undangan nyaman.' },
    { icon: '📺', title: 'TV Display & Presentasi', description: 'LED TV 32 inch harian untuk display booth pameran, nobar, atau guide map digital.' },
    { icon: '🚚', title: 'Antar Jemput Tepat Waktu', description: 'Armada pengiriman siap antar jemput ke lokasi event di Sleman, Bantul, Jogja City, & Kulonprogo.' },
  ],
  priceCards: [
    { name: 'Paket Rest Area VIP', size: '2 Kasur Super/Double + Sprei + Bantal', price: 'Rp 90.000', daily: 'Per Hari', note: 'Pas untuk crew transit/VIP room pameran', popular: true },
    { name: 'Air Cooler / Cooling Fan', size: 'Standar Acara', price: 'Rp 35.000', daily: 'Per Hari', note: 'Dingin maksimal dengan ice pack harian', popular: false },
    { name: 'Display TV 32\" LED', size: 'HD dengan Kabel HDMI', price: 'Rp 50.000', daily: 'Per Hari', note: 'Cocok untuk booth pameran & wedding guide', popular: false },
  ],
  audience: [
    { icon: '🎓', title: 'Acara Kampus & Mahasiswa', description: 'Penyewaan kasur bulk untuk makrab/outbound, TV display pameran karya, dan kipas angin ruang sidang.' },
    { icon: '💼', title: 'Event Organizer & Vendor', description: 'Partner sub-eksternal terpercaya untuk menunjang perlengkapan transit artist room dan dekorasi penunjang.' },
    { icon: '👰', title: 'Wedding Preparation / Hajatan', description: 'Rest area nyaman bagi keluarga besar pengantin di rumah singgah sementara atau homestay transit.' },
    { icon: '⛺', title: 'Bazar & Gathering Komunitas', description: 'Kebutuhan pendingin portabel, TV nobar, dan alas tidur panitia untuk event berhari-hari.' },
  ],
  faqs: [
    { question: 'Apakah kasur dijamin bersih dan steril?', answer: 'Tentu. Santi Living menerapkan 7 Tahap Higienitas (vacuum tungau, UV-C steril, plastik tersegel) agar crew/panitia Anda beristirahat dengan nyaman.' },
    { question: 'Apakah bisa diantar hari ini juga untuk kebutuhan darurat?', answer: 'Ya, kami melayani same day delivery 2-4 jam jika pesanan terkonfirmasi sebelum jam 15:00 WIB dan stok tersedia.' },
    { question: 'Bagaimana dengan pengantaran dan biaya jemput?', answer: 'Kami menyediakan gratis ongkir untuk area terdekat dari workshop kami di Jl. Godean KM 4. Untuk area Sleman, Bantul, dan Kota Yogyakarta tarif sangat transparan berdasarkan jarak.' },
    { question: 'Apakah Santi Living melayani pengiriman ke Gunungkidul?', answer: 'Mohon maaf, demi keselamatan kurir dan kendala geografis jarak tempuh, kami secara ketat TIDAK melayani area Gunungkidul (Klaten/Semanu/Wonosari). Area aktif kami mencakup Sleman, Kota Jogja, Bantul, dan Kulonprogo.' },
  ],
  cta: {
    title: 'Butuh perlengkapan event cepat di Yogyakarta?',
    description: 'Konsultasikan kebutuhan rest area, TV pameran, atau cooling fan acara Anda dengan admin fast-response kami.',
    waText: 'Halo Santi Living, saya mau tanya/booking perlengkapan untuk event organizer / acara kami',
    waSource: 'acara_santiliving_page',
  },
  sections: [
    {
      title: 'Solusi Perlengkapan EO & Event Terlengkap di Yogyakarta',
      content: `
        <p>Menyelenggarakan sebuah pameran, wedding preparation, festival komunitas, makrab mahasiswa, atau gathering kantor membutuhkan persiapan logistik yang matang. Salah satu hal krusial yang sering luput namun sangat dicari adalah ruang istirahat (rest area / transit room) crew yang nyaman, pendingin booth pameran yang handal, dan layar presentasi pendukung.</p>
        <p><strong>Santi Living</strong> hadir sebagai mitra terpercaya bagi para Event Organizer (EO), panitia kampus, dan keluarga besar di Jogja. Sebagai divisi khusus persewaan dari <strong>Santi Mebel</strong>, kami menyediakan kasur busa steril kualitas premium (HD Foam), selimut ekstra, bantal cadangan, TV Display 32 inci, hingga Air Cooler hemat daya untuk menjamin kelancaran jalannya acara Anda.</p>
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
