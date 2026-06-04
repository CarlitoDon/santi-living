import type { LandingPageConfig } from '@/types/landing';

const KARPET_WA_TEXT = `Halo Santi Living, saya ingin cek ketersediaan sewa karpet Jogja.

Detail acara:
Jenis acara: {pernikahan / pengajian / seminar / pameran / lainnya}
Tanggal acara: {tanggal}
Lokasi acara: {alamat lengkap}
Ukuran area: {panjang x lebar / estimasi jumlah tamu}
Jenis karpet yang dibutuhkan: {karpet merah runner / permadani merah-emas / karpet booth-pameran / paket acara / by request}

Mohon info ketersediaan, rekomendasi ukuran, estimasi harga, dan ongkirnya.`;

export const sewaKarpetJogja: LandingPageConfig = {
  meta: {
    title: 'Sewa Karpet Jogja untuk Acara, Hajatan & Event',
    description:
      'Sewa karpet Jogja untuk karpet merah, permadani, runner, booth, seminar, pameran, dan hajatan. Cek ukuran serta estimasi via WhatsApp.',
  },
  hero: {
    title: 'Sewa Karpet Jogja untuk Acara',
    subtitle:
      'Pilih jalur karpet merah, karpet permadani, runner acara, booth pameran, atau paket karpet + perlengkapan event. Admin bantu cek ketersediaan, ukuran area, rute antar-jemput, dan estimasi biaya.',
    badge: 'Pusat pilihan karpet acara: jenis jelas, estimasi setelah ukuran',
    features: [
      { icon: '🟥', text: 'Karpet merah & runner' },
      { icon: '🟫', text: 'Permadani lesehan' },
      { icon: '🎪', text: 'Booth, pameran, seminar' },
      { icon: '📦', text: 'Paket acara by request' },
    ],
    actions: [
      { type: 'link', label: 'Pilih jenis karpet', href: '#pilih-jenis-karpet', variant: 'primary' },
      { type: 'link', label: 'Bandingkan opsi', href: '#perbandingan-karpet', variant: 'ghost' },
      {
        type: 'wa',
        label: 'Konsultasi via WhatsApp',
        waText: KARPET_WA_TEXT,
        waSource: 'sewa_karpet_jogja_page',
      },
    ],
    badges: ['Karpet merah', 'Permadani', 'Runner & booth', 'Paket acara'],
    phone: '0895-1911-9092',
    bgImage: '/images/karpet-hero.webp',
    bgImageAlt: 'Karpet acara dan permadani untuk pilar sewa karpet Jogja Santi Living',
  },
  tracking: {
    productCategory: 'karpet',
    pageType: 'money_page',
    intent: 'sewa_karpet_jogja',
  },
  color: 'indigo',
  benefits: [
    {
      icon: '🧭',
      title: 'Jenis karpet dipisahkan sejak awal',
      description:
        'Karpet merah runner, permadani merah/emas, karpet booth, dan paket acara punya fungsi berbeda sehingga admin tidak salah menghitung kebutuhan venue.',
    },
    {
      icon: '📐',
      title: 'Estimasi berdasarkan ukuran area',
      description:
        'Kirim panjang-lebar, jumlah tamu, denah, atau foto lokasi. Estimasi mengikuti ukuran, durasi, akses lokasi, cleaning, dan ketersediaan stok/partner.',
    },
    {
      icon: '🎓',
      title: 'Cocok untuk event formal dan keluarga',
      description:
        'Satu halaman untuk seminar, pameran, booth UMKM, hajatan, pernikahan, pengajian, tahlilan, dan acara kampus di Jogja.',
    },
    {
      icon: '📦',
      title: 'Bisa dikonsultasikan sebagai paket acara',
      description:
        'Jika butuh karpet plus kasur tamu, kipas, air cooler, TV, bantal, atau selimut, admin akan cek opsi yang tersedia tanpa mengklaim semua item selalu ready.',
    },
  ],
  priceCards: [
    {
      name: 'Karpet merah / runner acara',
      size: 'Lembar panjang untuk jalur tamu, panggung, booth, dan area seremoni',
      price: 'Cek via WA',
      daily: 'Estimasi setelah panjang-lebar, durasi, dan lokasi jelas',
      note: 'Berbeda dari permadani merah bermotif untuk duduk lesehan.',
      popular: true,
    },
    {
      name: 'Karpet permadani merah / emas',
      size: 'Motif merah atau emas untuk pengajian, tahlilan, dan area duduk tamu',
      price: 'By request',
      daily: 'Disesuaikan jumlah lembar, motif, durasi, dan stok',
      note: 'Cocok untuk area lesehan, ruang tamu sementara, dan acara keluarga.',
    },
    {
      name: 'Karpet booth / pameran / seminar',
      size: 'Alas area custom untuk stand, expo, bazar, panggung kecil, atau kelas',
      price: 'Estimasi dulu',
      daily: 'Admin bantu hitung dari denah, foto, atau ukuran area',
      note: 'Sebutkan layout, akses loading, dan jam setup agar rute pengiriman realistis.',
    },
    {
      name: 'Paket karpet + perlengkapan acara',
      size: 'Karpet by request + kasur tamu + kipas / air cooler + TV bila tersedia',
      price: 'Konsultasi',
      daily: 'Bundle mengikuti kebutuhan dan ketersediaan',
      note: 'Untuk panitia yang ingin satu pintu logistik acara; stok dan jadwal tetap dicek dulu.',
    },
  ],
  audience: [
    {
      icon: '👰',
      title: 'Pernikahan, hajatan, dan jalur tamu',
      description:
        'Karpet merah atau runner membantu jalur masuk, panggung kecil, dan area seremoni terlihat lebih rapi.',
    },
    {
      icon: '🎓',
      title: 'Seminar, acara kampus, dan panggung kecil',
      description:
        'Runner atau alas acara bisa dikonsultasikan untuk panggung, meja registrasi, area foto, dan ruang kelas sementara.',
    },
    {
      icon: '🏪',
      title: 'Pameran, booth, bazar, dan UMKM',
      description:
        'Kirim denah booth atau ukuran stand agar admin bisa membantu estimasi luas karpet dan jadwal setup.',
    },
    {
      icon: '🕌',
      title: 'Pengajian, tahlilan, dan acara keluarga',
      description:
        'Permadani merah atau emas diposisikan sebagai area duduk lesehan, bukan sebagai runner jalur tamu.',
    },
  ],
  faqs: [
    {
      question: 'Apa bedanya karpet merah, permadani, runner, dan paket acara?',
      answer:
        'Karpet merah biasanya untuk jalur tamu atau area seremoni jika bentuknya runner panjang. Permadani merah/emas adalah karpet motif untuk duduk lesehan. Runner/booth dipakai untuk pameran, panggung, atau layout custom. Paket acara menggabungkan karpet dengan perlengkapan lain yang dicek by request.',
    },
    {
      question: 'Apakah sewa karpet Santi Living sudah ready stock?',
      answer:
        'Ketersediaan karpet wajib dicek dulu melalui WhatsApp karena jenis, ukuran, warna, kapasitas, jadwal, dan partner supplier perlu divalidasi sesuai tanggal acara.',
    },
    {
      question: 'Kenapa harga sewa karpet tidak ditulis final?',
      answer:
        'Harga karpet sangat dipengaruhi ukuran area, jenis karpet, durasi sewa, lokasi pengiriman, ongkir, cleaning, deposit, dan risiko noda atau kerusakan. Admin akan memberi estimasi setelah detail acara jelas.',
    },
    {
      question: 'Data apa yang perlu dikirim saat chat WhatsApp?',
      answer:
        'Kirim jenis acara, tanggal, lokasi, ukuran area atau jumlah tamu, jenis karpet yang diinginkan, foto area bila ada, jam setup, jam jemput, dan apakah membutuhkan kasur, kipas, air cooler, atau TV juga.',
    },
    {
      question: 'Area mana saja yang dilayani?',
      answer:
        'Area prioritas adalah Sleman, Kota Yogyakarta, Bantul, Godean, Mlati, Gamping, Depok, sekitar UGM, Malioboro, dan sebagian Kulon Progo. Untuk Gunungkidul atau area jauh, mohon konfirmasi dulu karena tidak selalu dapat dilayani.',
    },
    {
      question: 'Apakah bisa sekalian pesan kasur, kipas, air cooler, atau TV?',
      answer:
        'Bisa dikonsultasikan. Santi Living kuat di perlengkapan acara seperti kasur tamu, bantal, selimut, kipas, air cooler, dan TV display. Kebutuhan tambahan tetap dicek sesuai stok, jadwal, dan rute pengiriman.',
    },
  ],
  cta: {
    title: 'Butuh sewa karpet untuk acara di Jogja?',
    description:
      'Kirim tanggal, lokasi, ukuran area, jenis acara, dan pilihan karpet. Admin akan bantu cek ketersediaan serta estimasi yang paling masuk akal.',
    waText: KARPET_WA_TEXT,
    waSource: 'sewa_karpet_jogja_page',
    secondaryLabel: 'Pilih opsi karpet',
    secondaryHref: '#calculator',
  },
  sections: [
    {
      title: 'Pilih Jenis Karpet Acara di Santi Living',
      content: `
        <div id="pilih-jenis-karpet"></div>
        <p><strong>Sewa karpet Jogja</strong> di Santi Living dibuat sebagai hub untuk semua kebutuhan karpet acara: karpet merah, permadani, runner, booth pameran, seminar, hajatan, dan paket perlengkapan event. Karena setiap jenis punya fungsi berbeda, halaman ini memecah pilihan sejak awal supaya panitia tidak salah menyebut kebutuhan.</p>
        <p><strong>Navigasi cepat:</strong> <a href="#karpet-merah-runner">karpet merah runner</a> · <a href="#permadani-lesehan">permadani lesehan</a> · <a href="#runner-booth-pameran">runner booth/pameran</a> · <a href="#paket-karpet-acara">paket karpet acara</a> · <a href="#perbandingan-karpet">tabel perbandingan</a>.</p>
        <h3 id="karpet-merah-runner">Karpet merah untuk jalur tamu dan seremoni</h3>
        <p>Jika yang dicari adalah jalur merah panjang untuk pintu masuk, panggung, akad, launching, atau booth formal, sebutkan sebagai <strong>karpet merah runner</strong>. Admin perlu panjang jalur, lebar area, indoor/outdoor, dan jam setup. Kalau yang dimaksud karpet merah bermotif untuk duduk, lihat <a href="https://karpet.santiliving.com/sewa-karpet-merah-jogja">halaman permadani merah Jogja</a>.</p>
        <h3 id="permadani-lesehan">Permadani merah/emas untuk duduk lesehan</h3>
        <p>Jika acara berupa pengajian, tahlilan, arisan, ruang tamu keluarga, atau musala kecil, pilih <strong>karpet permadani</strong>. Permadani adalah karpet motif ukuran relatif persegi panjang, bukan runner acara. Lihat juga <a href="https://permadani.santiliving.com/sewa-karpet-permadani-jogja">halaman khusus sewa permadani Jogja</a>.</p>
        <h3 id="runner-booth-pameran">Runner, booth, pameran, seminar, dan bazar</h3>
        <p>Untuk seminar, pameran, stand UMKM, panggung kecil, atau layout custom, kirim denah, foto, atau ukuran panjang x lebar. Admin akan bantu menghitung kebutuhan karpet dan waktu pengiriman yang realistis.</p>
        <h3 id="paket-karpet-acara">Paket karpet acara by request</h3>
        <p>Jika panitia juga butuh kasur tamu, kipas, air cooler, TV, bantal, atau selimut, cek <a href="https://acara.santiliving.com/sewa-perlengkapan-event">paket perlengkapan event Santi Living</a>. Semua item tambahan tetap divalidasi by request sesuai stok dan jadwal.</p>
      `,
    },
    {
      title: 'Perbandingan Permadani vs Runner vs Karpet Merah vs Paket Acara',
      content: `
        <div id="perbandingan-karpet"></div>
        <p>Gunakan tabel ini sebelum chat agar istilah yang dikirim ke admin tepat. Kalau masih ragu, kirim foto referensi dan ukuran area; admin akan bantu mengarahkan.</p>
        <table>
          <thead>
            <tr><th>Opsi</th><th>Paling cocok untuk</th><th>Data yang perlu dikirim</th><th>Catatan aman</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Karpet merah runner</strong></td><td>Jalur tamu, panggung, akad, launching, seremoni.</td><td>Panjang-lebar jalur, lokasi, indoor/outdoor, jam setup.</td><td>Jangan disamakan dengan permadani merah motif.</td></tr>
            <tr><td><strong>Permadani merah/emas</strong></td><td>Pengajian, tahlilan, syukuran, ruang tamu, lesehan keluarga.</td><td>Jumlah tamu, ukuran ruangan, foto area, kebutuhan bantal/kasur tambahan.</td><td>Cek stok motif dan jumlah lembar dulu via WA.</td></tr>
            <tr><td><strong>Runner / booth / pameran</strong></td><td>Seminar, pameran, expo, bazar UMKM, stand, panggung kecil.</td><td>Denah booth, luas area, akses loading, jadwal kirim-jemput.</td><td>Estimasi mengikuti ukuran dan koordinasi venue.</td></tr>
            <tr><td><strong>Paket karpet acara</strong></td><td>Panitia yang ingin karpet plus kasur, kipas, air cooler, TV, atau item event lain.</td><td>Daftar item, jumlah orang, durasi, lokasi, dan prioritas kebutuhan.</td><td>Semua item tambahan by request; admin cek stok sebelum memberi estimasi.</td></tr>
          </tbody>
        </table>
      `,
    },
    {
      title: 'Panduan Cepat Harga, Jenis Acara, Area, dan Cara Pesan',
      content: `
        <div id="harga-sewa-karpet"></div>
        <p>Biaya sewa karpet tidak ditulis sebagai harga final karena karpet mengikuti luas area, jenis karpet, tanggal acara, durasi sewa, akses venue, delivery, cleaning, deposit, dan ketersediaan stok. Untuk memahami faktor biayanya, baca <a href="https://santiliving.com/artikel/harga-sewa-karpet-jogja-2026">panduan harga sewa karpet Jogja 2026</a>.</p>
        <h3 id="jenis-acara-karpet">Jenis acara yang sering membutuhkan karpet</h3>
        <ul>
          <li><strong>Pernikahan dan hajatan:</strong> jalur tamu, panggung, area foto, atau ruang keluarga. Referensi: <a href="https://santiliving.com/artikel/sewa-karpet-pernikahan-jogja">sewa karpet pernikahan Jogja</a>.</li>
          <li><strong>Pengajian dan tahlilan:</strong> permadani untuk duduk lesehan. Referensi: <a href="https://santiliving.com/artikel/sewa-karpet-pengajian-tahlilan-jogja">sewa karpet pengajian/tahlilan Jogja</a>.</li>
          <li><strong>Seminar dan pameran:</strong> runner, booth, expo, bazar, atau panggung kecil. Referensi: <a href="https://santiliving.com/artikel/sewa-karpet-seminar-pameran-jogja">sewa karpet seminar/pameran Jogja</a>.</li>
          <li><strong>Butuh beberapa item sekaligus:</strong> karpet bisa dikonsultasikan bersama kasur, kipas, air cooler, dan TV. Referensi: <a href="https://santiliving.com/artikel/paket-sewa-perlengkapan-acara-jogja-karpet-kasur-kipas-tv">paket sewa perlengkapan acara Jogja</a>.</li>
        </ul>
        <p>Jika ragu memilih antara karpet merah dan permadani, baca juga <a href="https://santiliving.com/artikel/karpet-merah-vs-karpet-permadani-acara">karpet merah vs karpet permadani acara</a>.</p>
      `,
    },
    {
      title: 'Area Layanan Sewa Karpet di Yogyakarta',
      content: `
        <div id="area-sewa-karpet"></div>
        <p>Area prioritas mencakup Sleman, Kota Jogja, Bantul, Godean, Mlati, Gamping, Depok, sekitar kampus UGM, Malioboro, dan titik acara yang masih aman untuk rute pengantaran. Detail ongkir tetap mengikuti alamat lengkap, akses kendaraan, jam acara, durasi sewa, dan jadwal penjemputan.</p>
        <p>Untuk area jauh seperti Gunungkidul atau lokasi dengan akses sulit, tim perlu melakukan pengecekan terlebih dahulu. Jika tidak memungkinkan, admin akan memberi tahu sejak awal agar panitia bisa mencari opsi lokal yang lebih aman.</p>
        <p>Workshop resmi Santi Living berada di <strong>Jl. Godean KM 10, Sleman, Yogyakarta</strong>, sehingga informasi alamat kirim dan titik patokan sangat membantu estimasi rute.</p>
      `,
    },
    {
      title: 'Cara Pesan Karpet agar Estimasi Cepat',
      content: `
        <div id="cara-pesan-karpet"></div>
        <ol>
          <li>Siapkan jenis acara, tanggal, jam kirim, dan jam jemput.</li>
          <li>Kirim alamat lengkap serta titik patokan venue.</li>
          <li>Ukur panjang dan lebar area, atau kirim foto/video lokasi.</li>
          <li>Pilih kebutuhan: karpet merah runner, permadani merah/emas, runner booth/pameran, atau paket acara.</li>
          <li>Sebutkan apakah butuh perlengkapan tambahan seperti kasur, kipas, air cooler, TV, bantal, atau selimut.</li>
          <li>Tunggu admin mengecek ketersediaan, rekomendasi ukuran, ongkir, cleaning, deposit bila ada, dan estimasi biaya.</li>
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
          '{karpet merah runner / permadani merah-emas / karpet booth-pameran / paket acara / by request}',
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
      '{karpet merah runner / permadani merah-emas / karpet booth-pameran / paket acara / by request}',
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
        <p>Jika yang dibutuhkan justru jalur panjang untuk tamu, panggung, atau booth, sebutkan sebagai runner/alas acara agar admin tidak mengira Anda mencari permadani merah. Untuk navigasi intent, mulai dari <a href="https://karpet.santiliving.com/sewa-karpet-jogja">sewa karpet Jogja</a>, bandingkan dengan <a href="https://permadani.santiliving.com/sewa-karpet-permadani-jogja">sewa permadani Jogja</a>, atau buka <a href="https://acara.santiliving.com/sewa-perlengkapan-event">paket perlengkapan event Jogja</a> bila butuh item tambahan.</p>
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
            '{karpet merah runner / permadani merah-emas / karpet booth-pameran / paket acara / by request}',
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
        '{karpet merah runner / permadani merah-emas / karpet booth-pameran / paket acara / by request}',
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
        <p>Untuk konteks pemilihan, baca <a href="https://santiliving.com/artikel/sewa-karpet-pengajian-tahlilan-jogja">panduan sewa karpet untuk pengajian/tahlilan</a>, <a href="https://santiliving.com/artikel/karpet-merah-vs-karpet-permadani-acara">beda permadani dan runner acara</a>, dan <a href="https://santiliving.com/artikel/harga-sewa-karpet-jogja-2026">panduan harga sewa karpet Jogja</a>. Jika ternyata kebutuhan Anda adalah runner/jalur tamu, buka <a href="https://karpet.santiliving.com/sewa-karpet-jogja">sewa karpet Jogja</a> atau <a href="https://karpet.santiliving.com/sewa-karpet-merah-jogja">sewa karpet merah Jogja</a>; untuk bundle dengan kasur/pendingin/TV, gunakan <a href="https://acara.santiliving.com/sewa-perlengkapan-event">paket perlengkapan event Jogja</a>.</p>
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
