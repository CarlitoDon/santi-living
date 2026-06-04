import type { LandingPageConfig } from '@/types/landing';

const KARPET_WA_TEXT = `Halo Santi Living, saya ingin cek ketersediaan sewa karpet Jogja.

Detail acara:
Jenis acara: {pernikahan / pengajian / seminar / pameran / lainnya}
Tanggal acara: {tanggal}
Lokasi acara: {alamat lengkap}
Ukuran area: {panjang x lebar / estimasi jumlah tamu}
Jenis karpet yang dibutuhkan: {permadani merah / permadani emas / runner acara / by request}

Mohon info ketersediaan, rekomendasi ukuran, estimasi harga, dan ongkirnya.`;

export const sewaKarpetJogja: LandingPageConfig = {
  meta: {
    title: 'Sewa Karpet Jogja untuk Acara, Hajatan & Event',
    description:
      'Sewa karpet Jogja untuk pernikahan, pengajian, seminar, booth, dan pameran. Konsultasi ukuran serta estimasi biaya via WhatsApp Santi Living.',
  },
  hero: {
    title: 'Sewa Karpet Jogja',
    subtitle:
      'Solusi cek ketersediaan rental permadani merah/emas, karpet runner acara, alas booth, dan kebutuhan venue di Yogyakarta.',
    badge: 'Cek ketersediaan dan estimasi via WhatsApp',
    features: [
      { icon: '📏', text: 'Bantu hitung ukuran area' },
      { icon: '🧼', text: 'Prioritas karpet bersih' },
      { icon: '🚚', text: 'Antar jemput sesuai area' },
    ],
    actions: [
      { type: 'link', label: 'Cek opsi karpet', href: '#calculator', variant: 'primary' },
      {
        type: 'wa',
        label: 'Konsultasi via WhatsApp',
        waText: KARPET_WA_TEXT,
        waSource: 'sewa_karpet_jogja_page',
      },
    ],
    badges: ['Sewa karpet acara Jogja — konsultasi ukuran & stok'],
    phone: '0895-1911-9092',
    bgImage: '/images/permadani-emas.jpg',
    bgImageAlt: 'Permadani emas untuk layanan sewa karpet Jogja Santi Living',
  },
  tracking: {
    productCategory: 'karpet',
    pageType: 'money_page',
    intent: 'sewa_karpet_jogja',
  },
  color: 'indigo',
  benefits: [
    {
      icon: '🎪',
      title: 'Permadani dan event dipisahkan jelas',
      description:
        'Permadani merah/emas dipakai untuk area duduk dan ruang keluarga. Runner/lembar panjang dipakai untuk jalur acara dan booth.',
    },
    {
      icon: '📐',
      title: 'Ukuran dikonsultasikan',
      description:
        'Kirim panjang, lebar, jumlah tamu, atau foto area agar admin bisa bantu rekomendasikan jenis dan jumlah karpet.',
    },
    {
      icon: '📍',
      title: 'Area layanan jelas',
      description:
        'Prioritas pengiriman ke Sleman, Kota Jogja, Bantul, Godean, Mlati, Gamping, Depok, dan area DIY yang masih aman dijangkau.',
    },
    {
      icon: '🧾',
      title: 'Estimasi transparan',
      description:
        'Harga final mengikuti jenis karpet, ukuran, durasi, lokasi, delivery, cleaning, deposit, dan ketersediaan stok atau partner.',
    },
  ],
  priceCards: [
    {
      name: 'Permadani merah',
      size: 'Motif merah untuk ruang tamu, pengajian, dan area lesehan',
      price: 'Cek via WA',
      daily: 'Harga final setelah ukuran dan stok tervalidasi',
      note: 'Bukan runner acara; kirim ukuran ruang, jumlah tamu, lokasi, dan tanggal.',
      popular: true,
    },
    {
      name: 'Permadani emas',
      size: 'Motif emas/cokelat untuk area duduk dan ruang sementara',
      price: 'By request',
      daily: 'Disesuaikan ukuran, motif, durasi, dan lokasi',
      note: 'Cocok untuk duduk lesehan dan area tamu yang ingin terlihat rapi.',
    },
    {
      name: 'Runner / alas acara',
      size: 'Lembar panjang untuk jalur tamu, booth, expo, atau panggung',
      price: 'Estimasi dulu',
      daily: 'Admin bantu hitung dari luas area',
      note: 'Kategori ini berbeda dari permadani motif ukuran persegi panjang.',
    },
    {
      name: 'Paket acara Santi Living',
      size: 'Karpet + kasur tamu + kipas / air cooler + TV',
      price: 'Konsultasi',
      daily: 'Bundle sesuai kebutuhan acara',
      note: 'Untuk panitia yang butuh satu pintu logistik perlengkapan acara.',
    },
  ],
  audience: [
    {
      icon: '👰',
      title: 'Pengajian, tahlilan, dan syukuran',
      description:
        'Permadani merah atau emas untuk area duduk tamu, ruang keluarga, musala kecil, dan acara rumah.',
    },
    {
      icon: '🕌',
      title: 'Tamu keluarga dan homestay',
      description:
        'Tambahan permadani untuk ruang tamu sementara, villa, guest house, atau keluarga yang menginap.',
    },
    {
      icon: '🎓',
      title: 'Event dan booth',
      description:
        'Jika butuh lembar panjang, jalur tamu, atau alas booth, admin akan arahkan ke kategori runner/alas acara.',
    },
    {
      icon: '🏡',
      title: 'Venue, homestay, dan acara keluarga',
      description:
        'Tambahan alas sementara untuk ruang tamu, villa, guest house, dan gathering keluarga di Jogja.',
    },
  ],
  faqs: [
    {
      question: 'Apakah sewa karpet Santi Living sudah ready stock?',
      answer:
        'Ketersediaan karpet wajib dicek dulu melalui WhatsApp karena jenis, ukuran, warna, kapasitas, dan partner supplier perlu divalidasi sesuai tanggal acara.',
    },
    {
      question: 'Kenapa harga sewa karpet tidak ditulis final?',
      answer:
        'Harga karpet sangat dipengaruhi ukuran area, jenis karpet, durasi sewa, lokasi pengiriman, ongkir, cleaning, deposit, dan risiko noda atau kerusakan. Admin akan memberi estimasi setelah detail acara jelas.',
    },
    {
      question: 'Data apa yang perlu dikirim saat chat WhatsApp?',
      answer:
        'Kirim jenis acara, tanggal, lokasi, ukuran area atau jumlah tamu, jenis karpet yang diinginkan, foto area bila ada, dan apakah membutuhkan kasur, kipas, air cooler, atau TV juga.',
    },
    {
      question: 'Area mana saja yang dilayani?',
      answer:
        'Area prioritas adalah Sleman, Kota Yogyakarta, Bantul, Godean, Mlati, Gamping, Depok, sekitar UGM, Malioboro, dan sebagian Kulon Progo. Untuk Gunungkidul atau area jauh, mohon konfirmasi dulu karena tidak selalu dapat dilayani.',
    },
    {
      question: 'Apakah bisa sekalian pesan kasur, kipas, air cooler, atau TV?',
      answer:
        'Bisa. Santi Living kuat di perlengkapan acara seperti kasur tamu, bantal, selimut, kipas, air cooler, dan TV display, sehingga kebutuhan karpet bisa dikonsultasikan sebagai bagian dari paket acara.',
    },
  ],
  cta: {
    title: 'Butuh sewa karpet untuk acara di Jogja?',
    description:
      'Kirim tanggal, lokasi, ukuran area, dan jenis acara. Admin akan bantu cek ketersediaan serta estimasi karpet yang paling masuk akal.',
    waText: KARPET_WA_TEXT,
    waSource: 'sewa_karpet_jogja_page',
    secondaryLabel: 'Pilih opsi karpet',
    secondaryHref: '#calculator',
  },
  sections: [
    {
      title: 'Rental Karpet Jogja untuk Event, Hajatan, dan Venue',
      content: `
        <p><strong>Sewa karpet Jogja</strong> biasanya dibutuhkan ketika acara harus terlihat rapi tanpa membeli perlengkapan yang hanya dipakai satu atau dua hari. Kebutuhan paling umum datang dari pernikahan, pengajian, tahlilan, seminar, pameran, bazar, grand opening, acara kampus, homestay, dan venue keluarga.</p>
        <p>Santi Living menjalankan kategori karpet sebagai layanan konsultatif: pelanggan mengirim detail acara terlebih dahulu, lalu admin mengecek ketersediaan stok atau partner, jenis karpet, ukuran, area layanan, estimasi delivery, dan biaya cleaning. Dengan cara ini, halaman tidak menjanjikan harga final sebelum operasional karpet benar-benar tervalidasi.</p>
        <h3>Jenis kebutuhan karpet yang bisa dikonsultasikan</h3>
        <ul>
          <li><strong>Permadani merah:</strong> karpet motif ukuran relatif persegi panjang untuk area duduk, ruang tamu, pengajian, dan acara keluarga.</li>
          <li><strong>Permadani emas:</strong> karpet motif emas/cokelat untuk pengajian, tahlilan, ruang tamu sementara, dan acara lesehan.</li>
          <li><strong>Runner / alas acara:</strong> lembar panjang untuk jalur tamu, panggung, booth, expo, bazar UMKM, dan layout area custom.</li>
          <li><strong>Paket acara:</strong> karpet digabung dengan kasur tamu, kipas, air cooler, TV, bantal, atau selimut.</li>
        </ul>
        <p><strong>Panduan pendukung:</strong> baca <a href="https://santiliving.com/artikel/harga-sewa-karpet-jogja-2026">harga sewa karpet Jogja</a>, <a href="https://santiliving.com/artikel/karpet-merah-vs-karpet-permadani-acara">beda permadani dan runner acara</a>, <a href="https://santiliving.com/artikel/paket-sewa-perlengkapan-acara-jogja-karpet-kasur-kipas-tv">paket sewa perlengkapan acara</a>, <a href="https://santiliving.com/artikel/sewa-karpet-pengajian-tahlilan-jogja">sewa karpet pengajian/tahlilan</a>, <a href="https://santiliving.com/artikel/sewa-karpet-pernikahan-jogja">sewa karpet pernikahan</a>, dan <a href="https://santiliving.com/artikel/sewa-karpet-seminar-pameran-jogja">sewa karpet seminar/pameran</a>.</p>
      `,
    },
    {
      title: 'Area Layanan Sewa Karpet di Yogyakarta',
      content: `
        <p>Area prioritas mencakup Sleman, Kota Jogja, Bantul, Godean, Mlati, Gamping, Depok, sekitar kampus UGM, Malioboro, dan titik acara yang masih aman untuk rute pengantaran. Detail ongkir tetap mengikuti alamat lengkap, akses kendaraan, jam acara, durasi sewa, dan jadwal penjemputan.</p>
        <p>Untuk area jauh seperti Gunungkidul atau lokasi dengan akses sulit, tim perlu melakukan pengecekan terlebih dahulu. Jika tidak memungkinkan, admin akan memberi tahu sejak awal agar panitia bisa mencari opsi lokal yang lebih aman.</p>
      `,
    },
    {
      title: 'Cara Pesan Karpet agar Estimasi Cepat',
      content: `
        <ol>
          <li>Siapkan jenis acara, tanggal, jam kirim, dan jam jemput.</li>
          <li>Kirim alamat lengkap serta titik patokan venue.</li>
          <li>Ukur panjang dan lebar area, atau kirim foto/video lokasi.</li>
          <li>Pilih kebutuhan: permadani merah, permadani emas, runner acara, pameran, atau paket acara.</li>
          <li>Sebutkan apakah butuh perlengkapan tambahan seperti kasur, kipas, air cooler, TV, bantal, atau selimut.</li>
        </ol>
      `,
    },
  ],
};

export const sewaKarpetMerah: LandingPageConfig = {
  ...sewaKarpetJogja,
  meta: {
    title: 'Sewa Permadani Merah Jogja untuk Pengajian & Tamu',
    description:
      'Cek ketersediaan sewa karpet merah motif permadani di Jogja untuk pengajian, tahlilan, tamu keluarga, ruang tamu sementara, dan acara lesehan.',
  },
  hero: {
    ...sewaKarpetJogja.hero,
    title: 'Sewa Permadani Merah Jogja',
    subtitle:
      'Karpet merah motif permadani untuk area duduk, ruang tamu, pengajian, tahlilan, dan acara keluarga lesehan di Yogyakarta.',
    badge: 'Permadani merah, bukan runner acara',
    actions: [
      { type: 'link', label: 'Lihat opsi permadani', href: '#calculator', variant: 'primary' },
      {
        type: 'wa',
        label: 'Cek permadani merah',
        waText: KARPET_WA_TEXT.replace(
          '{permadani merah / permadani emas / runner acara / by request}',
          'permadani merah'
        ),
        waSource: 'sewa_karpet_merah_page',
      },
    ],
    badges: ['Permadani merah untuk area duduk dan ruang tamu'],
    bgImage: '/images/permadani-merah.jpg',
    bgImageAlt: 'Permadani merah untuk ruang tamu dan acara lesehan Santi Living',
  },
  tracking: {
    productCategory: 'karpet',
    pageType: 'subcategory_page',
    intent: 'sewa_karpet_permadani_merah',
  },
  benefits: [
    {
      icon: '🟥',
      title: 'Permadani merah bermotif',
      description:
        'Karpet merah di halaman ini adalah permadani ruang ukuran relatif persegi panjang, bukan runner acara.',
    },
    {
      icon: '🕌',
      title: 'Untuk area duduk lesehan',
      description:
        'Cocok untuk pengajian, tahlilan, syukuran, ruang tamu sementara, dan acara keluarga.',
    },
    {
      icon: '📐',
      title: 'Ukuran dikonsultasikan',
      description:
        'Kirim ukuran ruangan, jumlah tamu, atau foto area agar admin bisa cek jumlah lembar dan stok merah.',
    },
    {
      icon: '🚚',
      title: 'Delivery sesuai rute',
      description:
        'Estimasi mengikuti lokasi, akses kendaraan, jam kirim, jam jemput, durasi, dan kondisi stok.',
    },
  ],
  priceCards: [
    {
      name: 'Permadani merah',
      size: 'Motif merah untuk area duduk, ruang tamu, dan pengajian',
      price: 'Cek via WA',
      daily: 'Harga final setelah ukuran dan stok tervalidasi',
      note: 'Kirim ukuran ruang, jumlah tamu, lokasi, tanggal, dan foto area bila ada.',
      popular: true,
    },
    {
      name: 'Permadani emas',
      size: 'Alternatif motif emas/cokelat jika stok merah penuh',
      price: 'By request',
      daily: 'Disesuaikan ukuran, motif, durasi, dan lokasi',
      note: 'Admin bisa sarankan opsi warna setelah cek stok aktual.',
    },
  ],
  audience: [
    {
      icon: '🕌',
      title: 'Pengajian dan tahlilan',
      description:
        'Permadani merah untuk area duduk tamu agar ruangan terlihat rapi dan hangat.',
    },
    {
      icon: '🏡',
      title: 'Ruang tamu sementara',
      description:
        'Tambahan alas saat rumah, homestay, atau villa menerima tamu keluarga.',
    },
    {
      icon: '👥',
      title: 'Syukuran, arisan, dan acara rumah',
      description:
        'Area lesehan lebih tertata saat tamu datang banyak dan kursi tidak cukup.',
    },
  ],
  cta: {
    title: 'Butuh permadani merah untuk tamu atau pengajian?',
    description:
      'Kirim ukuran ruang, jumlah tamu, lokasi, dan tanggal acara agar admin bisa cek stok permadani merah yang tersedia.',
    waText: KARPET_WA_TEXT.replace(
      '{permadani merah / permadani emas / runner acara / by request}',
      'permadani merah'
    ),
    waSource: 'sewa_karpet_merah_page',
    secondaryLabel: 'Pilih opsi permadani',
    secondaryHref: '#calculator',
  },
  sections: [
    {
      title: 'Permadani Merah untuk Pengajian, Tahlilan, dan Tamu Keluarga',
      content: `
        <p><strong>Sewa karpet merah Jogja</strong> di halaman ini berarti permadani merah bermotif, bukan red carpet runner atau lembar panjang untuk jalur acara. Bentuknya relatif persegi panjang dan paling cocok untuk area duduk tamu, ruang keluarga, pengajian, tahlilan, atau acara lesehan.</p>
        <p>Agar estimasi tidak meleset, admin perlu tahu luas ruang, jumlah tamu, lokasi acara, jam pengiriman, dan jam penjemputan. Jika stok merah tidak cocok dengan ukuran ruangan, admin bisa menyarankan permadani emas atau opsi motif lain.</p>
        <h3>Checklist sebelum chat admin</h3>
        <ul>
          <li>Jumlah tamu yang duduk lesehan.</li>
          <li>Ukuran ruang atau halaman yang akan dialasi.</li>
          <li>Apakah karpet dipakai indoor atau outdoor.</li>
          <li>Foto area ruang tamu, musala kecil, atau lokasi acara.</li>
          <li>Kebutuhan tambahan: kasur keluarga, kipas, air cooler, TV, atau bantal.</li>
        </ul>
        <p>Jika yang dibutuhkan justru jalur panjang untuk tamu, panggung, atau booth, sebutkan sebagai runner/alas acara agar admin tidak mengira Anda mencari permadani merah.</p>
      `,
    },
  ],
};

export const sewaKarpetPermadani: LandingPageConfig = {
  ...sewaKarpetJogja,
  meta: {
    title: 'Sewa Permadani Jogja untuk Pengajian & Tahlilan',
    description:
      'Sewa permadani Jogja untuk pengajian, tahlilan, tamu keluarga, dan lesehan. Cek motif, ukuran, delivery, cleaning, deposit via WhatsApp.',
  },
  hero: {
    ...sewaKarpetJogja.hero,
    title: 'Sewa Permadani Jogja untuk Pengajian & Tahlilan',
    subtitle:
      'Permadani merah atau emas untuk area duduk lesehan, ruang tamu sementara, musala kecil, tamu keluarga, syukuran, dan acara rumah di Yogyakarta.',
    badge: 'Fokus lesehan dan ruang tamu sementara',
    features: [
      { icon: '🕌', text: 'Pengajian & tahlilan' },
      { icon: '🏡', text: 'Tamu keluarga' },
      { icon: '📐', text: 'Bantu hitung area' },
    ],
    actions: [
      { type: 'link', label: 'Pilih permadani', href: '#calculator', variant: 'primary' },
      {
        type: 'wa',
        label: 'Cek motif & estimasi',
        waText: KARPET_WA_TEXT
          .replace('sewa karpet Jogja', 'sewa permadani Jogja untuk pengajian/tahlilan/tamu keluarga')
          .replace('Jenis acara: {pernikahan / pengajian / seminar / pameran / lainnya}', 'Jenis kebutuhan: {pengajian / tahlilan / syukuran / tamu keluarga / ruang tamu sementara / lainnya}')
          .replace(
            '{permadani merah / permadani emas / runner acara / by request}',
            'permadani merah / permadani emas'
          ),
        waSource: 'permadani_page',
      },
    ],
    badges: ['Permadani pengajian, tahlilan, dan tamu keluarga'],
    bgImage: '/images/permadani-emas.jpg',
    bgImageAlt: 'Permadani emas untuk pengajian tahlilan dan area duduk keluarga Santi Living',
  },
  tracking: {
    productCategory: 'karpet',
    pageType: 'money_page',
    intent: 'sewa_karpet_permadani',
  },
  benefits: [
    {
      icon: '🕌',
      title: 'Fokus area duduk lesehan',
      description:
        'Copy dan selector halaman ini khusus permadani untuk pengajian, tahlilan, syukuran, ruang tamu sementara, dan musala kecil.',
    },
    {
      icon: '🟫',
      title: 'Varian merah dan emas',
      description:
        'Motif merah/emas dicek berdasarkan stok dan ukuran; tidak mengklaim semua motif selalu ready.',
    },
    {
      icon: '📐',
      title: 'Panduan area dan tamu',
      description:
        'Kirim panjang x lebar, jumlah tamu lesehan, dan foto ruangan agar admin bisa bantu estimasi jumlah lembar.',
    },
    {
      icon: '🚚',
      title: 'Delivery, cleaning, deposit jelas',
      description:
        'Estimasi mengikuti lokasi, akses kendaraan, durasi, risiko noda, cleaning, deposit, dan jadwal jemput.',
    },
  ],
  priceSection: {
    title: 'Opsi Sewa Permadani',
    linkLabel: 'Baca panduan harga sewa karpet/permadani →',
    linkHref: 'https://santiliving.com/artikel/harga-sewa-karpet-jogja-2026',
  },
  priceCards: [
    {
      name: 'Permadani merah',
      size: 'Motif merah untuk pengajian, tahlilan, area duduk, dan ruang tamu',
      price: 'Cek via WA',
      daily: 'Harga final setelah ukuran dan stok tervalidasi',
      note: 'Bukan runner acara; kirim ukuran ruang, jumlah tamu, lokasi, dan tanggal.',
      popular: true,
    },
    {
      name: 'Permadani emas',
      size: 'Motif emas/cokelat untuk pengajian dan acara keluarga',
      price: 'By request',
      daily: 'Disesuaikan ukuran, motif, durasi, lokasi, cleaning, dan deposit',
      note: 'Cocok untuk duduk lesehan, musala kecil, dan area tamu yang ingin terlihat rapi.',
    },
    {
      name: 'Permadani by request',
      size: 'Motif dan ukuran disesuaikan stok',
      price: 'Konsultasi',
      daily: 'Admin cek opsi yang tersedia',
      note: 'Sertakan foto ruangan agar rekomendasi warna, ukuran, dan jumlah lembar lebih tepat.',
    },
  ],
  audience: [
    {
      icon: '🕌',
      title: 'Pengajian dan tahlilan',
      description:
        'Permadani merah atau emas untuk membuat area duduk jamaah dan tamu lebih rapi serta nyaman.',
    },
    {
      icon: '🏡',
      title: 'Tamu keluarga dan ruang sementara',
      description:
        'Tambahan alas ruang tamu sementara saat keluarga besar, tamu luar kota, homestay, atau villa membutuhkan area kumpul.',
    },
    {
      icon: '👥',
      title: 'Syukuran, arisan, dan acara rumah',
      description:
        'Area lesehan lebih tertata saat tamu datang banyak dan kursi tidak cukup.',
    },
  ],
  faqs: [
    {
      question: 'Apakah halaman ini khusus sewa permadani untuk pengajian dan tahlilan?',
      answer:
        'Ya. Fokus halaman ini adalah permadani merah/emas untuk duduk lesehan, ruang tamu sementara, musala kecil, pengajian, tahlilan, syukuran, dan tamu keluarga. Jika kebutuhan Anda jalur panjang, booth, atau panggung, admin akan mengarahkannya ke kategori runner/alas acara yang berbeda.',
    },
    {
      question: 'Bagaimana cara memperkirakan kebutuhan permadani dari luas area atau jumlah tamu?',
      answer:
        'Patokan awalnya adalah ukuran area yang akan dialasi dan jumlah tamu yang duduk lesehan. Kirim panjang x lebar ruangan, foto area, serta estimasi jumlah tamu; admin akan cek ukuran lembar yang tersedia dan memberi rekomendasi jumlah permadani tanpa mengunci harga final sebelum stok serta lokasi tervalidasi.',
    },
    {
      question: 'Apakah motif merah atau emas selalu tersedia?',
      answer:
        'Tidak diklaim selalu ready. Motif merah, emas, cokelat, atau motif lain perlu dicek berdasarkan tanggal, durasi, ukuran area, dan kondisi stok/partner. Jika motif pilihan tidak cocok, admin bisa menyarankan opsi paling dekat.',
    },
    {
      question: 'Apakah ada biaya cleaning atau deposit?',
      answer:
        'Cleaning dan deposit bisa berbeda untuk tiap acara karena dipengaruhi durasi, lokasi, risiko noda, penggunaan indoor/outdoor, jumlah lembar, dan kondisi pengembalian. Admin akan menyebutkan estimasi serta ketentuan sebelum konfirmasi pesanan.',
    },
    {
      question: 'Area pengiriman permadani Santi Living ke mana saja?',
      answer:
        'Prioritas rute adalah Godean, Sleman, Kota Yogyakarta, Bantul, Depok, Mlati, Gamping, sekitar UGM/Malioboro, dan sebagian Kulon Progo. Untuk Gunungkidul atau area jauh/akses sulit, konfirmasi dulu karena belum tentu bisa dilayani pada tanggal tertentu.',
    },
    {
      question: 'Data apa yang perlu dikirim supaya estimasi cepat?',
      answer:
        'Kirim jenis acara, tanggal, alamat lengkap, ukuran area atau jumlah tamu, pilihan motif merah/emas/by request, foto ruangan, kebutuhan delivery/jemput, serta apakah perlu tambahan bantal, kipas, air cooler, TV, atau kasur tamu keluarga.',
    },
  ],
  cta: {
    title: 'Butuh permadani untuk pengajian, tahlilan, atau tamu keluarga?',
    description:
      'Kirim ukuran area, jumlah tamu, tanggal acara, foto ruangan, dan pilihan motif. Admin akan cek ketersediaan, jumlah lembar, delivery, cleaning, serta deposit.',
    waText: KARPET_WA_TEXT
      .replace('sewa karpet Jogja', 'sewa permadani Jogja untuk pengajian/tahlilan/tamu keluarga')
      .replace('Jenis acara: {pernikahan / pengajian / seminar / pameran / lainnya}', 'Jenis kebutuhan: {pengajian / tahlilan / syukuran / tamu keluarga / ruang tamu sementara / lainnya}')
      .replace(
        '{permadani merah / permadani emas / runner acara / by request}',
        'permadani merah / permadani emas'
      ),
    waSource: 'permadani_page',
    secondaryLabel: 'Pilih permadani dulu',
    secondaryHref: '#calculator',
  },
  sections: [
    {
      title: 'Permadani untuk Pengajian, Tahlilan, Lesehan, dan Ruang Tamu Sementara',
      content: `
        <p><strong>Sewa permadani Jogja</strong> biasanya dibutuhkan saat rumah atau musala kecil perlu area duduk yang rapi tanpa membeli karpet permanen. Intent utama halaman ini adalah permadani untuk <strong>pengajian, tahlilan, syukuran, tamu keluarga, lesehan, dan ruang tamu sementara</strong>.</p>
        <p>Permadani merah dan emas di sini berarti karpet motif ukuran relatif persegi panjang untuk area duduk. Ini dipisahkan dari runner atau lembar panjang untuk jalur tamu, booth, panggung, dan kebutuhan event lain agar calon penyewa tidak salah pesan.</p>
        <p>Jenis dan jumlah permadani perlu disesuaikan dengan jumlah tamu, luas ruangan, durasi, motif yang tersedia, risiko noda, cleaning, deposit, dan akses lokasi. Untuk hasil paling akurat, kirim foto ruangan atau ukuran kasar panjang x lebar saat menghubungi admin.</p>
        <h3>Informasi yang membantu estimasi permadani</h3>
        <ul>
          <li>Jumlah tamu yang duduk lesehan.</li>
          <li>Ukuran ruang, teras, musala kecil, atau area yang akan dialasi.</li>
          <li>Pilihan motif: merah, emas/cokelat, atau by request.</li>
          <li>Kebutuhan tambahan seperti bantal duduk, kipas, air cooler, TV, atau kasur tamu keluarga.</li>
          <li>Jam kirim dan jam penjemputan setelah acara selesai.</li>
        </ul>
        <p>Untuk konteks pemilihan, baca <a href="https://santiliving.com/artikel/sewa-karpet-pengajian-tahlilan-jogja">panduan sewa karpet untuk pengajian/tahlilan</a>, <a href="https://santiliving.com/artikel/karpet-merah-vs-karpet-permadani-acara">beda permadani dan runner acara</a>, dan <a href="https://santiliving.com/artikel/harga-sewa-karpet-jogja-2026">panduan harga sewa karpet Jogja</a>.</p>
      `,
    },
    {
      title: 'Panduan Cepat Hitung Area dan Jumlah Tamu Lesehan',
      content: `
        <p>Jika belum punya denah, mulai dari tiga data sederhana: <strong>berapa tamu yang duduk lesehan</strong>, <strong>berapa panjang x lebar area</strong>, dan <strong>apakah area indoor atau outdoor</strong>. Admin akan mencocokkan data tersebut dengan ukuran lembar yang tersedia, bukan langsung mengunci jumlah atau harga.</p>
        <ul>
          <li><strong>Ruang tamu kecil:</strong> kirim foto dari dua sudut ruangan dan sebutkan jumlah tamu inti.</li>
          <li><strong>Pengajian/tahlilan rumah:</strong> sebutkan estimasi jamaah, area duduk utama, dan apakah perlu jalur kosong untuk lalu lintas tamu.</li>
          <li><strong>Homestay/villa:</strong> sebutkan ruangan mana yang dipakai sebagai ruang kumpul sementara dan durasi sewanya.</li>
          <li><strong>Area luar/teras:</strong> konfirmasi kondisi lantai, risiko hujan, dan jam penjemputan agar cleaning/deposit bisa dihitung aman.</li>
        </ul>
        <p>Bahasa aman untuk estimasi: admin akan memberi rekomendasi jumlah lembar setelah ukuran, motif, tanggal, dan rute delivery tervalidasi.</p>
      `,
    },
    {
      title: 'Rute Lokal: Godean, Sleman, Kota Jogja, Bantul, dan Kulon Progo',
      content: `
        <p>Workshop resmi Santi Living berada di <strong>Jl. Godean KM 10, Sleman, Yogyakarta</strong>. Karena permadani butuh pengiriman dan penjemputan, lokasi acara menentukan ongkir, jadwal, dan kemungkinan layanan.</p>
        <p>Rute prioritas mencakup Godean, Sleman, Kota Yogyakarta, Bantul, Depok, Mlati, Gamping, sekitar UGM/Malioboro, serta sebagian Kulon Progo. Area jauh atau akses sulit perlu dicek dulu; tidak semua tanggal bisa dilayani.</p>
        <p>Untuk gambaran rute pengantaran Santi Living, lihat cluster lokal: <a href="https://santiliving.com/artikel/sewa-kasur-godean-sleman-terdekat-workshop">Godean/Sleman</a>, <a href="https://santiliving.com/artikel/sewa-kasur-bantul-terdekat-antar-jemput">Bantul</a>, <a href="https://santiliving.com/artikel/sewa-kasur-depok-sleman-terdekat">Depok Sleman</a>, <a href="https://santiliving.com/artikel/sewa-kasur-terdekat-gamping">Gamping</a>, dan <a href="https://santiliving.com/artikel/sewa-kasur-kulonprogo-wates-murah">Kulon Progo/Wates</a>. Link tersebut adalah referensi rute layanan Santi Living, bukan klaim stok permadani di setiap area.</p>
      `,
    },
  ],
};

export const sewaKarpet = sewaKarpetJogja;
