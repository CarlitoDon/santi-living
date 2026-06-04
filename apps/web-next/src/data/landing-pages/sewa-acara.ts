import type { LandingPageConfig } from '@/types/landing';

export const sewaAcara: LandingPageConfig = {
  meta: {
    title: 'Sewa Paket Perlengkapan Event Jogja',
    description:
      'Sewa paket perlengkapan event Jogja: kasur rest area, air cooler, TV display, karpet by request, meja/kursi/sound konsultatif via WA.',
  },
  hero: {
    title: 'Sewa Paket Perlengkapan Event Jogja',
    subtitle:
      'Konsultasi satu pintu untuk item inti Santi Living dan kebutuhan acara by-request, dengan estimasi setelah tanggal, durasi, ukuran area, dan lokasi jelas.',
    badge: 'Item inti + by-request, area jauh konfirmasi dulu',
  },
  color: 'indigo',
  tracking: {
    productCategory: 'event',
    pageType: 'money_page',
    intent: 'sewa_perlengkapan_event_jogja',
  },
  benefits: [
    {
      icon: '🛏️',
      title: 'Core: Kasur Rest Area',
      description:
        'Kasur busa, sprei, bantal, dan selimut untuk ruang transit crew, keluarga, panitia, atau VIP room acara.',
    },
    {
      icon: '❄️',
      title: 'Core: Pendingin & Display',
      description:
        'Air cooler/cooling fan dan TV display dikonsultasikan sesuai stok, durasi, akses venue, dan kebutuhan listrik.',
    },
    {
      icon: '🟦',
      title: 'By Request: Alas Event',
      description:
        'Karpet merah, permadani, runner, atau alas sirkulasi diarahkan ke opsi karpet khusus agar ukuran area bisa dihitung admin.',
    },
    {
      icon: '🪑',
      title: 'By Request: Operasional Panitia',
      description:
        'Meja lipat, kursi, backdrop ringan, sound portable, dan lighting sederhana dibantu secara konsultatif, bukan klaim semua selalu tersedia.',
    },
    {
      icon: '🚚',
      title: 'Rute & Setup Sesuai Rundown',
      description:
        'Prioritas Sleman, Kota Yogyakarta, Bantul, dan Kulon Progo; area jauh perlu cek rute, jam bongkar, dan akses kendaraan dulu.',
    },
  ],
  priceCards: [
    {
      name: 'Core Rest Area Crew',
      size: 'Kasur + sprei + bantal/selimut',
      price: 'Estimasi WA',
      daily: 'Setelah tanggal, durasi, jumlah unit, dan lokasi jelas',
      note: 'Untuk VIP room, ruang transit artis, panitia, atau keluarga besar',
      popular: true,
    },
    {
      name: 'Core Cooling & Display',
      size: 'Air cooler/cooling fan + TV display',
      price: 'Cek via WA',
      daily: 'Validasi stok, durasi, kebutuhan listrik, dan akses venue',
      note: 'Untuk booth pameran, ruang tunggu, guide map, atau nobar kecil',
      popular: false,
    },
    {
      name: 'Bundle Panitia Hemat',
      size: 'Kasur rest area + kipas/air cooler + perlengkapan kecil',
      price: 'Konsultasi',
      daily: 'Admin hitungkan setelah rundown dan lokasi dikirim',
      note: 'Cocok untuk makrab, diklat, gathering, dan event kampus',
      popular: false,
    },
    {
      name: 'By Request Karpet & Runner',
      size: 'Karpet merah, permadani, atau alas area',
      price: 'By request',
      daily: 'Butuh ukuran area/foto venue untuk estimasi',
      note: 'Akan diarahkan ke opsi karpet/permadani yang paling sesuai',
      popular: false,
    },
    {
      name: 'By Request Meja & Kursi',
      size: 'Meja lipat, kursi, atau layout operasional',
      price: 'By request',
      daily: 'Ketersediaan dan jumlah unit dikonfirmasi via WA',
      note: 'Untuk area registrasi, konsumsi, crew desk, atau ruang briefing',
      popular: false,
    },
    {
      name: 'By Request Sound & Lighting',
      size: 'Sound portable / spot lighting sederhana',
      price: 'By request',
      daily: 'Bukan paket teknis besar; cek kebutuhan acara dulu',
      note: 'Pendukung acara kecil, bukan klaim produksi panggung penuh',
      popular: false,
    },
  ],
  audience: [
    {
      icon: '🎓',
      title: 'Panitia Kampus & Mahasiswa',
      description:
        'Makrab, diklat, pameran karya, atau outbound yang butuh rest area, pendingin, TV display, dan item operasional secukupnya.',
    },
    {
      icon: '💼',
      title: 'Event Organizer & Vendor Lokal',
      description:
        'EO yang butuh partner rental kasur transit, cooling, display, dan pengadaan tambahan yang batas layanannya jelas.',
    },
    {
      icon: '👰',
      title: 'Wedding Preparation / Hajatan',
      description:
        'Keluarga besar yang menyiapkan ruang istirahat sementara, karpet/alas area tamu, dan kebutuhan panitia di rumah atau homestay.',
    },
    {
      icon: '⛺',
      title: 'Bazar, Komunitas, dan Gathering',
      description:
        'Event semi-outdoor atau indoor kecil yang membutuhkan pendingin portabel, layar display, alas area, dan logistik ringan.',
    },
  ],
  faqs: [
    {
      question: 'Apa saja item inti Santi Living untuk event?',
      answer:
        'Item inti yang paling kuat adalah kasur rest area, sprei, bantal, selimut, air cooler/cooling fan, dan TV display. Jumlah unit tetap harus dicek via WhatsApp sesuai tanggal, durasi, lokasi, dan rute pengantaran.',
    },
    {
      question: 'Apa bedanya item inti dan item by-request?',
      answer:
        'Item inti adalah perlengkapan yang biasa ditangani langsung Santi Living. Item by-request seperti karpet, meja, kursi, backdrop ringan, sound portable, dan lighting sederhana perlu konsultasi lebih awal karena bergantung kebutuhan acara, ukuran area, dan opsi pengadaan yang tersedia.',
    },
    {
      question: 'Apakah bisa dibuat rekomendasi paket untuk acara saya?',
      answer:
        'Bisa. Kirim tanggal, durasi, venue, jumlah orang, ukuran area/foto lokasi, dan item yang dibutuhkan. Admin akan bantu susun rekomendasi paket yang realistis tanpa mengunci harga final sebelum detail acara jelas.',
    },
    {
      question: 'Apakah bisa diantar hari yang sama untuk kebutuhan mendadak?',
      answer:
        'Kami bisa cek slot same day jika pesanan masuk sebelum jam operasional padat dan stok/rute masih memungkinkan. Untuk paket event yang banyak item, sebaiknya konsultasi lebih awal agar pengiriman dan bongkar-muat aman.',
    },
    {
      question: 'Bagaimana dengan pengantaran dan biaya jemput?',
      answer:
        'Workshop resmi kami berada di Jl. Godean KM 10, Sleman, Yogyakarta. Area prioritas mencakup Sleman, Kota Yogyakarta, Bantul, dan Kulon Progo; biaya dan jadwal pengiriman mengikuti jarak, durasi sewa, jumlah barang, serta akses venue.',
    },
    {
      question: 'Apakah Santi Living melayani pengiriman ke Gunungkidul?',
      answer:
        'Mohon maaf, saat ini kami belum melayani area Gunungkidul seperti Wonosari dan Semanu karena pertimbangan jarak tempuh dan keselamatan kurir. Untuk area jauh di luar rute prioritas, silakan konfirmasi dulu via WhatsApp.',
    },
  ],
  cta: {
    title: 'Butuh konsultasi bundle perlengkapan event?',
    description:
      'Kirim rundown, tanggal, durasi, lokasi, jumlah tamu/crew, ukuran area, dan daftar item yang diinginkan. Admin akan bantu pisahkan mana item inti dan mana yang perlu by-request.',
    waText:
      'Halo Santi Living, saya ingin konsultasi paket perlengkapan event. Tanggal acara: ... Lokasi/venue: ... Durasi sewa: ... Jumlah tamu/crew: ... Kebutuhan inti: kasur/air cooler/TV. By-request: karpet/meja/kursi/sound/lighting. Mohon info ketersediaan, rekomendasi paket, estimasi, dan ongkir.',
    waSource: 'acara_santiliving_page',
    secondaryLabel: 'Cek opsi karpet acara',
    secondaryHref: 'https://karpet.santiliving.com/sewa-karpet-jogja',
  },
  sections: [
    {
      title: 'Batas Layanan: Item Inti vs By-Request',
      content: `
        <p><strong>acara.santiliving.com</strong> diposisikan sebagai halaman konsultasi bundle perlengkapan event, bukan klaim semua alat acara selalu tersedia. Tujuannya membantu panitia memilah kebutuhan yang bisa ditangani langsung dan kebutuhan yang perlu dikonfirmasi lebih awal.</p>
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr><th>Kategori</th><th>Contoh item</th><th>Cara estimasi aman</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Item inti</strong></td><td>Kasur rest area, sprei, bantal, selimut, air cooler/cooling fan, TV display</td><td>Cek stok, jumlah unit, durasi, lokasi, dan rute pengantaran via WA.</td></tr>
              <tr><td><strong>By-request</strong></td><td>Karpet merah, permadani, runner, meja lipat, kursi, backdrop ringan, sound portable, lighting sederhana</td><td>Kirim foto/ukuran area dan kebutuhan acara; admin bantu cari opsi realistis.</td></tr>
              <tr><td><strong>Di luar klaim</strong></td><td>Paket produksi panggung besar, vendor sound besar, dekorasi penuh, atau coverage semua wilayah DIY</td><td>Perlu konfirmasi terpisah; area jauh dan kebutuhan teknis besar tidak dijanjikan otomatis.</td></tr>
            </tbody>
          </table>
        </div>
      `,
    },
    {
      title: 'Use Case Event dan Rekomendasi Paket',
      content: `
        <p>Setiap acara punya pola kebutuhan berbeda. Berikut contoh arah rekomendasi awal sebelum admin menghitung estimasi final.</p>
        <ul>
          <li><strong>Makrab / diklat kampus:</strong> mulai dari kasur rest area panitia, bantal/selimut, cooling fan, dan TV display untuk briefing. Karpet atau meja-kursi diproses by-request jika venue membutuhkan.</li>
          <li><strong>Wedding preparation / hajatan keluarga:</strong> fokus pada kasur transit keluarga, perlengkapan tidur bersih, pendingin ruangan, dan opsi karpet/alas tamu jika area lesehan perlu dibuat rapi.</li>
          <li><strong>Pameran / bazar / booth:</strong> prioritaskan TV display, pendingin booth, meja operasional by-request, dan alas area seperti karpet merah atau runner setelah ukuran booth dikirim.</li>
          <li><strong>Gathering komunitas / nobar kecil:</strong> pilih TV display, cooling fan, alas duduk/karpet by-request, serta kasur rest area jika crew bermalam atau venue dipakai berjam-jam.</li>
        </ul>
        <p><strong>Data yang perlu dikirim ke admin:</strong> tanggal, jam antar-jemput, alamat venue, akses bongkar-muat, jumlah orang, ukuran area, foto lokasi, dan prioritas item yang wajib ada.</p>
      `,
    },
    {
      title: 'Solusi Perlengkapan EO & Event Konsultatif di Yogyakarta',
      content: `
        <p>Menyelenggarakan pameran, wedding preparation, festival komunitas, makrab mahasiswa, atau gathering kantor membutuhkan persiapan logistik yang matang. Kebutuhan yang sering muncul adalah ruang istirahat crew, pendingin portabel, layar display, alas area, dan perlengkapan operasional ringan.</p>
        <p><strong>Santi Living</strong> membantu panitia dan EO di Jogja dengan model konsultasi satu pintu: item inti ditangani sesuai stok dan rute, sedangkan item tambahan diproses sebagai by-request agar tidak ada klaim berlebihan tentang ketersediaan atau harga final.</p>
        <p>Untuk kebutuhan alas event yang lebih spesifik, buka halaman khusus <a href="https://karpet.santiliving.com/sewa-karpet-jogja"><strong>sewa karpet Jogja</strong></a> agar panitia bisa memilih karpet merah, permadani, runner, atau paket karpet acara sebelum chat admin.</p>
        <h3>Mengapa EO & Panitia Event Memilih Santi Living?</h3>
        <ul>
          <li><strong>SOP higienitas kasur:</strong> perlengkapan tidur disiapkan bersih, rapi, dan dikirim sesuai standar operasional Santi Living.</li>
          <li><strong>Pemesanan fleksibel:</strong> cocok untuk kebutuhan harian, beberapa hari, atau bulk; estimasi menyesuaikan jumlah unit, durasi, dan rute.</li>
          <li><strong>Armada pengiriman sesuai rute:</strong> tim logistik memprioritaskan Sleman, Kota Yogyakarta, Bantul, dan Kulon Progo. Area jauh tetap perlu konfirmasi dulu.</li>
          <li><strong>Boundary jelas:</strong> halaman ini membedakan item inti dan by-request supaya panitia tidak mengira semua item atau semua wilayah tersedia otomatis.</li>
        </ul>
      `,
    },
  ],
};
