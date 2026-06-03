import type { LandingPageConfig } from '@/types/landing';

const KARPET_WA_TEXT = `Halo Santi Living, saya ingin cek ketersediaan sewa karpet Jogja.

Detail acara:
Jenis acara: {pernikahan / pengajian / seminar / pameran / lainnya}
Tanggal acara: {tanggal}
Lokasi acara: {alamat lengkap}
Ukuran area: {panjang x lebar / estimasi jumlah tamu}
Jenis karpet yang dibutuhkan: {karpet merah / permadani / lesehan / by request}

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
      'Solusi cek ketersediaan rental karpet untuk acara, hajatan, seminar, pengajian, pameran, wedding, dan kebutuhan venue di Yogyakarta.',
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
    bgImage: '/images/karpet-hero.webp',
    bgImageAlt: 'Ilustrasi karpet merah untuk layanan sewa karpet Jogja Santi Living',
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
      title: 'Fokus acara dan hajatan',
      description:
        'Cocok untuk kebutuhan alas tamu, jalur masuk, area lesehan, booth, panggung kecil, dan ruang keluarga sementara.',
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
      name: 'Karpet merah / red carpet',
      size: 'Runner, jalur tamu, VIP, wedding, grand opening',
      price: 'Cek via WA',
      daily: 'Harga final setelah ukuran dan stok tervalidasi',
      note: 'Kirim panjang jalur, lebar area, lokasi, dan tanggal acara.',
      popular: true,
    },
    {
      name: 'Karpet permadani',
      size: 'Pengajian, tahlilan, tamu keluarga, ruang sementara',
      price: 'By request',
      daily: 'Disesuaikan ukuran, motif, durasi, dan lokasi',
      note: 'Cocok untuk duduk lesehan dan area tamu yang ingin terlihat rapi.',
    },
    {
      name: 'Karpet pameran / booth',
      size: 'Booth UMKM, expo, seminar, panggung, layout custom',
      price: 'Estimasi dulu',
      daily: 'Admin bantu hitung dari luas area',
      note: 'Sertakan denah atau foto venue untuk estimasi kebutuhan.',
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
      title: 'Pernikahan, akad, dan hajatan',
      description:
        'Karpet untuk jalur tamu, area keluarga, ruang transit, atau persiapan wedding di rumah dan homestay.',
    },
    {
      icon: '🕌',
      title: 'Pengajian dan tahlilan',
      description:
        'Permadani atau karpet lesehan untuk membuat area duduk tamu lebih rapi dan nyaman.',
    },
    {
      icon: '🎓',
      title: 'Seminar, workshop, dan pameran',
      description:
        'Alas booth, panggung kecil, area registrasi, atau ruang tunggu peserta event kampus dan komunitas.',
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
          <li><strong>Karpet merah:</strong> jalur tamu, wedding, VIP, panggung, grand opening, dan acara formal.</li>
          <li><strong>Karpet permadani:</strong> pengajian, tahlilan, ruang tamu sementara, dan acara keluarga lesehan.</li>
          <li><strong>Karpet pameran:</strong> booth, expo, bazar UMKM, seminar, dan layout area custom.</li>
          <li><strong>Paket acara:</strong> karpet digabung dengan kasur tamu, kipas, air cooler, TV, bantal, atau selimut.</li>
        </ul>
        <p><strong>Panduan pendukung:</strong> baca <a href="https://santiliving.com/artikel/harga-sewa-karpet-jogja-2026">harga sewa karpet Jogja</a>, <a href="https://santiliving.com/artikel/karpet-merah-vs-karpet-permadani-acara">karpet merah vs karpet permadani</a>, <a href="https://santiliving.com/artikel/paket-sewa-perlengkapan-acara-jogja-karpet-kasur-kipas-tv">paket sewa perlengkapan acara</a>, <a href="https://santiliving.com/artikel/sewa-karpet-pengajian-tahlilan-jogja">sewa karpet pengajian/tahlilan</a>, <a href="https://santiliving.com/artikel/sewa-karpet-pernikahan-jogja">sewa karpet pernikahan</a>, dan <a href="https://santiliving.com/artikel/sewa-karpet-seminar-pameran-jogja">sewa karpet seminar/pameran</a>.</p>
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
          <li>Pilih kebutuhan: karpet merah, permadani, pameran, atau paket acara.</li>
          <li>Sebutkan apakah butuh perlengkapan tambahan seperti kasur, kipas, air cooler, TV, bantal, atau selimut.</li>
        </ol>
      `,
    },
  ],
};

export const sewaKarpetMerah: LandingPageConfig = {
  ...sewaKarpetJogja,
  meta: {
    title: 'Sewa Karpet Merah Jogja untuk Wedding, VIP & Grand Opening',
    description:
      'Cek ketersediaan sewa karpet merah Jogja untuk wedding, jalur VIP, grand opening, panggung, akad, dan area tamu formal. Konsultasi panjang, lebar, lokasi, dan tanggal acara via WhatsApp.',
  },
  hero: {
    ...sewaKarpetJogja.hero,
    title: 'Sewa Karpet Merah Jogja',
    subtitle:
      'Karpet merah untuk jalur tamu, wedding, VIP, grand opening, panggung kecil, akad, dan acara formal di Yogyakarta.',
    badge: 'Kirim panjang dan lebar jalur untuk estimasi',
    actions: [
      { type: 'link', label: 'Lihat opsi karpet', href: '#calculator', variant: 'primary' },
      {
        type: 'wa',
        label: 'Cek karpet merah',
        waText: KARPET_WA_TEXT.replace(
          '{karpet merah / permadani / lesehan / by request}',
          'karpet merah / red carpet'
        ),
        waSource: 'sewa_karpet_merah_page',
      },
    ],
    badges: ['Karpet merah untuk event formal Jogja'],
  },
  tracking: {
    productCategory: 'karpet',
    pageType: 'subcategory_page',
    intent: 'sewa_karpet_merah',
  },
  cta: {
    title: 'Butuh karpet merah untuk acara formal?',
    description:
      'Kirim panjang jalur, lebar area, lokasi, dan tanggal acara agar admin bisa cek opsi red carpet yang tersedia.',
    waText: KARPET_WA_TEXT.replace(
      '{karpet merah / permadani / lesehan / by request}',
      'karpet merah / red carpet'
    ),
    waSource: 'sewa_karpet_merah_page',
  },
  sections: [
    {
      title: 'Karpet Merah untuk Wedding, VIP, dan Grand Opening',
      content: `
        <p><strong>Sewa karpet merah Jogja</strong> cocok untuk acara yang membutuhkan kesan formal dan rapi: jalur masuk tamu VIP, akad nikah, wedding, grand opening toko, area panggung, photo spot, atau seremoni kampus.</p>
        <p>Agar estimasi tidak meleset, admin perlu tahu panjang jalur, lebar area, jenis permukaan lantai, lokasi acara, jam pemasangan, dan jam penjemputan. Jika venue memiliki banyak tangga atau akses kendaraan terbatas, biaya logistik dapat berbeda.</p>
        <h3>Checklist sebelum chat admin</h3>
        <ul>
          <li>Panjang dan lebar jalur karpet merah.</li>
          <li>Apakah karpet dipakai indoor atau outdoor.</li>
          <li>Foto area masuk, panggung, atau titik akad.</li>
          <li>Kebutuhan tambahan: kasur keluarga, kipas, air cooler, TV, atau bantal.</li>
        </ul>
        <p>Untuk menentukan jenis karpet, baca <a href="https://santiliving.com/artikel/karpet-merah-vs-karpet-permadani-acara">perbandingan karpet merah vs karpet permadani</a>. Jika karpet merah dipakai untuk wedding, lanjutkan ke <a href="https://santiliving.com/artikel/sewa-karpet-pernikahan-jogja">panduan sewa karpet pernikahan Jogja</a>.</p>
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
      'Permadani dan karpet lesehan untuk pengajian, tahlilan, tamu keluarga, acara rumah, musala kecil, dan ruang sementara.',
    badge: 'Cocok untuk duduk lesehan dan area tamu',
    actions: [
      { type: 'link', label: 'Lihat opsi permadani', href: '#calculator', variant: 'primary' },
      {
        type: 'wa',
        label: 'Cek permadani',
        waText: KARPET_WA_TEXT.replace(
          '{karpet merah / permadani / lesehan / by request}',
          'karpet permadani / lesehan'
        ),
        waSource: 'sewa_karpet_permadani_page',
      },
    ],
    badges: ['Permadani untuk pengajian dan acara keluarga'],
  },
  tracking: {
    productCategory: 'karpet',
    pageType: 'subcategory_page',
    intent: 'sewa_karpet_permadani',
  },
  cta: {
    title: 'Butuh permadani untuk pengajian atau tamu keluarga?',
    description:
      'Kirim ukuran area, jumlah tamu, tanggal acara, dan foto ruangan agar admin bisa cek pilihan karpet permadani yang sesuai.',
    waText: KARPET_WA_TEXT.replace(
      '{karpet merah / permadani / lesehan / by request}',
      'karpet permadani / lesehan'
    ),
    waSource: 'sewa_karpet_permadani_page',
  },
  sections: [
    {
      title: 'Karpet Permadani untuk Pengajian, Tahlilan, dan Acara Keluarga',
      content: `
        <p><strong>Sewa karpet permadani Jogja</strong> biasanya dicari untuk acara yang membutuhkan area duduk rapi: pengajian, tahlilan, syukuran, arisan keluarga, tamu luar kota, atau ruang tamu sementara saat rumah sedang penuh.</p>
        <p>Jenis dan jumlah permadani perlu disesuaikan dengan jumlah tamu, luas ruangan, durasi acara, dan akses lokasi. Untuk hasil paling akurat, kirim foto ruangan atau ukuran kasar panjang x lebar saat menghubungi admin.</p>
        <h3>Informasi yang membantu estimasi</h3>
        <ul>
          <li>Jumlah tamu yang duduk lesehan.</li>
          <li>Ukuran ruang atau halaman yang akan dialasi.</li>
          <li>Kebutuhan bantal, selimut, kipas, atau kasur tamu keluarga.</li>
          <li>Jam kirim dan jam penjemputan setelah acara selesai.</li>
        </ul>
        <p>Untuk konteks pemilihan, lihat <a href="https://santiliving.com/artikel/karpet-merah-vs-karpet-permadani-acara">karpet merah vs permadani</a>, <a href="https://santiliving.com/artikel/sewa-karpet-pengajian-tahlilan-jogja">sewa karpet pengajian/tahlilan</a>, atau <a href="https://santiliving.com/artikel/sewa-karpet-pernikahan-jogja">sewa karpet pernikahan Jogja</a>.</p>
      `,
    },
  ],
};

export const sewaKarpet = sewaKarpetJogja;
