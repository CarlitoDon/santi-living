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
    title: 'Sewa Karpet Permadani Jogja untuk Pengajian & Tamu',
    description:
      'Cek ketersediaan sewa karpet permadani Jogja untuk pengajian, tahlilan, tamu keluarga, ruang tamu sementara, dan acara lesehan. Konsultasi ukuran area dan estimasi via WhatsApp.',
  },
  hero: {
    ...sewaKarpetJogja.hero,
    title: 'Sewa Karpet Permadani Jogja',
    subtitle:
      'Permadani merah dan emas untuk pengajian, tahlilan, tamu keluarga, acara rumah, musala kecil, dan ruang sementara.',
    badge: 'Permadani merah/emas, bukan runner acara',
    actions: [
      { type: 'link', label: 'Lihat opsi permadani', href: '#calculator', variant: 'primary' },
      {
        type: 'wa',
        label: 'Cek permadani',
        waText: KARPET_WA_TEXT.replace(
          '{permadani merah / permadani emas / runner acara / by request}',
          'permadani merah / permadani emas'
        ),
        waSource: 'sewa_karpet_permadani_page',
      },
    ],
    badges: ['Permadani untuk pengajian dan acara keluarga'],
    bgImage: '/images/permadani-emas.jpg',
    bgImageAlt: 'Permadani emas untuk pengajian dan area duduk keluarga Santi Living',
  },
  tracking: {
    productCategory: 'karpet',
    pageType: 'subcategory_page',
    intent: 'sewa_karpet_permadani',
  },
  benefits: [
    {
      icon: '🕌',
      title: 'Fokus area duduk lesehan',
      description:
        'Permadani cocok untuk pengajian, tahlilan, syukuran, ruang tamu sementara, dan musala kecil.',
    },
    {
      icon: '🟫',
      title: 'Varian merah dan emas',
      description:
        'Karpet merah dan karpet emas di sini sama-sama permadani motif ukuran relatif persegi panjang.',
    },
    {
      icon: '📐',
      title: 'Ukuran dikonsultasikan',
      description:
        'Kirim ukuran ruangan, jumlah tamu, atau foto area agar admin bisa cek jumlah lembar dan stok motif.',
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
      size: 'Motif merah untuk area duduk, pengajian, dan ruang tamu',
      price: 'Cek via WA',
      daily: 'Harga final setelah ukuran dan stok tervalidasi',
      note: 'Bukan runner acara; kirim ukuran ruang, jumlah tamu, lokasi, dan tanggal.',
      popular: true,
    },
    {
      name: 'Permadani emas',
      size: 'Motif emas/cokelat untuk pengajian dan acara keluarga',
      price: 'By request',
      daily: 'Disesuaikan ukuran, motif, durasi, dan lokasi',
      note: 'Cocok untuk duduk lesehan dan area tamu yang ingin terlihat rapi.',
    },
    {
      name: 'Permadani by request',
      size: 'Motif dan ukuran disesuaikan stok',
      price: 'Konsultasi',
      daily: 'Admin cek opsi yang tersedia',
      note: 'Sertakan foto ruangan agar rekomendasi warna dan jumlah lembar lebih tepat.',
    },
  ],
  audience: [
    {
      icon: '🕌',
      title: 'Pengajian dan tahlilan',
      description:
        'Permadani merah atau emas untuk membuat area duduk tamu lebih rapi dan nyaman.',
    },
    {
      icon: '🏡',
      title: 'Tamu keluarga dan ruang sementara',
      description:
        'Tambahan alas untuk rumah, homestay, villa, dan gathering keluarga di Jogja.',
    },
    {
      icon: '👥',
      title: 'Syukuran, arisan, dan acara rumah',
      description:
        'Area lesehan lebih tertata saat tamu datang banyak dan kursi tidak cukup.',
    },
  ],
  cta: {
    title: 'Butuh permadani untuk pengajian atau tamu keluarga?',
    description:
      'Kirim ukuran area, jumlah tamu, tanggal acara, dan foto ruangan agar admin bisa cek pilihan permadani merah atau emas yang sesuai.',
    waText: KARPET_WA_TEXT.replace(
      '{permadani merah / permadani emas / runner acara / by request}',
      'permadani merah / permadani emas'
    ),
    waSource: 'sewa_karpet_permadani_page',
  },
  sections: [
    {
      title: 'Karpet Permadani untuk Pengajian, Tahlilan, dan Acara Keluarga',
      content: `
        <p><strong>Sewa karpet permadani Jogja</strong> biasanya dicari untuk acara yang membutuhkan area duduk rapi: pengajian, tahlilan, syukuran, arisan keluarga, tamu luar kota, atau ruang tamu sementara saat rumah sedang penuh.</p>
        <p>Karpet merah dan karpet emas termasuk permadani jika bentuknya motif ukuran relatif persegi panjang seperti karpet ruang. Yang bukan permadani adalah runner/lembar panjang untuk jalur tamu, panggung, booth, atau alas acara.</p>
        <p>Jenis dan jumlah permadani perlu disesuaikan dengan jumlah tamu, luas ruangan, durasi acara, dan akses lokasi. Untuk hasil paling akurat, kirim foto ruangan atau ukuran kasar panjang x lebar saat menghubungi admin.</p>
        <h3>Informasi yang membantu estimasi</h3>
        <ul>
          <li>Jumlah tamu yang duduk lesehan.</li>
          <li>Ukuran ruang atau halaman yang akan dialasi.</li>
          <li>Kebutuhan bantal, selimut, kipas, atau kasur tamu keluarga.</li>
          <li>Jam kirim dan jam penjemputan setelah acara selesai.</li>
        </ul>
        <p>Untuk konteks pemilihan, lihat <a href="https://santiliving.com/artikel/sewa-karpet-pengajian-tahlilan-jogja">sewa karpet pengajian/tahlilan</a> atau <a href="https://santiliving.com/artikel/paket-sewa-perlengkapan-acara-jogja-karpet-kasur-kipas-tv">paket sewa perlengkapan acara</a>.</p>
      `,
    },
  ],
};

export const sewaKarpet = sewaKarpetJogja;
