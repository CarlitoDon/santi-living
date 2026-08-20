import type { LandingPageConfig } from '@/types/landing';

export const sewaExtraBedJogja: LandingPageConfig = {
  meta: {
    title: 'Sewa Extra Bed Jogja Mulai 40rb - Rental Ekstrabed Hotel & Homestay',
    description: 'Layanan sewa extra bed Jogja & rental ekstrabed terdekat. Kasur busa steril tebal, include sprei, bantal & selimut, siap antar cepat 2 jam ke hotel & homestay.',
  },
  hero: {
    title: 'Sewa & Rental Extra Bed Jogja Terdekat',
    subtitle: 'Solusi kasur tambahan (extra bed) steril, tebal, dan nyaman untuk tamu hotel, homestay, villa, dan acara keluarga di Yogyakarta.',
    badge: 'Mulai Rp40.000/hari',
  },
  color: 'indigo',

  benefits: [
    {
      icon: '🏨',
      title: 'Standar Hotel & Homestay',
      description: 'Kasur busa tebal density tinggi dengan sprei bersih wangi laundry, siap langsung pakai untuk tamu Anda.',
    },
    {
      icon: '⚡',
      title: 'Antar Cepat 2 Jam',
      description: 'Layanan delivery kilat siap kirim ke hotel, homestay, guesthouse, maupun rumah tinggal di seluruh area Jogja.',
    },
    {
      icon: '🧼',
      title: '100% Steril & Higienis',
      description: 'Setiap unit extra bed melalui proses sanitasi UV-C dan pembersihan mendalam sebelum dikirimkan.',
    },
    {
      icon: '📦',
      title: 'Paket Komplit & Fleksibel',
      description: 'Tersedia pilihan kasur saja atau paket full set lengkap dengan bantal, sprei, dan selimut tebal lembut.',
    },
  ],

  priceCards: [
    {
      name: 'Kasur Single (Extra Bed Only)',
      size: '90 x 200 cm (Tebal 10-15 cm)',
      price: 'Rp 40.000',
      daily: 'Per Hari / 24 Jam',
      note: 'Termasuk kasur busa steril + sprei terpasang',
      popular: false,
    },
    {
      name: 'Paket Full Extra Bed Single',
      size: '90 x 200 cm (Lengkap)',
      price: 'Rp 60.000',
      daily: 'Per Hari / 24 Jam',
      note: 'Kasur + Sprei + 1 Bantal & Sarung + 1 Selimut Tebal',
      popular: true,
    },
    {
      name: 'Paket Full Extra Bed Double',
      size: '120 x 200 cm / 140 x 200 cm',
      price: 'Rp 70.000',
      daily: 'Per Hari / 24 Jam',
      note: 'Kasur luas + Sprei + 2 Bantal & Sarung + Selimut',
      popular: false,
    },
  ],

  audience: [
    {
      icon: '🏨',
      title: 'Hotel, Homestay & Villa',
      description: 'Solusi instan saat ada tamu tambahan mendadak tanpa perlu investasi beli kasur baru yang memakan ruang simpan.',
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Keluarga Liburan di Jogja',
      description: 'Bikin seluruh rombongan keluarga tidur nyaman bersama dalam satu kamar atau penginapan tanpa berdesakan.',
    },
    {
      icon: '🎉',
      title: 'Acara Reuni & Pernikahan',
      description: 'Kebutuhan akomodasi menginap rombongan kerabat atau panitia acara keluarga besar di rumah Jogja.',
    },
    {
      icon: '🎒',
      title: 'Wisatawan Rombongan & Study Tour',
      description: 'Ekstra bed fleksibel untuk kebutuhan rombongan komunitas, study tour, dan gathering kantor.',
    },
  ],

  faqs: [
    {
      question: 'Apa saja kelengkapan Paket Full Extra Bed?',
      answer: 'Paket Full Extra Bed sudah termasuk kasur busa tebal berkualitas, sprei bersih wangi yang sudah terpasang, bantal kepala empuk beserta sarungnya, serta selimut tebal dan lembut.',
    },
    {
      question: 'Apakah bisa diantar langsung ke hotel atau homestay tempat kami menginap?',
      answer: 'Tentu bisa! Tim delivery kami terbiasa mengantar dan koordinasi dengan resepsionis atau pihak pengelola hotel, villa, dan homestay di wilayah Yogyakarta, Sleman, Bantul, dan sekitarnya.',
    },
    {
      question: 'Berapa lama estimasi pengiriman extra bed?',
      answer: 'Untuk kebutuhan mendadak (urgent), kami siap melakukan pengiriman express dalam waktu 1-2 jam setelah konfirmasi pesanan (sesuai slot dan jarak lokasi).',
    },
    {
      question: 'Apakah kondisi extra bed dijamin bersih dan wangi?',
      answer: 'Pasti. Semua kasur dan perlengkapan tidur Santi Living selalu melalui proses pembersihan berstandar, disinfeksi UV-C, dan sprei/sarung bantal selalu baru dicuci laundry higienis.',
    },
    {
      question: 'Bagaimana cara pemesanan dan pembayarannya?',
      answer: 'Sangat mudah! Cukup klik tombol WhatsApp, informasikan alamat penginapan, jumlah unit, dan tanggal sewa. Pembayaran bisa dilakukan via transfer bank atau QRIS.',
    },
    {
      question: 'Apakah ada diskon untuk sewa jumlah banyak atau lebih dari 3 hari?',
      answer: 'Ya, kami menyediakan penawaran harga khusus untuk penyewaan di atas 3 hari serta pemesanan rombongan dalam jumlah banyak. Konsultasikan langsung via WhatsApp.',
    },
  ],

  cta: {
    title: 'Butuh Extra Bed Tambahan Sekarang di Jogja?',
    description: 'Admin kami siap membantu kebutuhan kasur tambahan untuk hotel, homestay, atau rumah Anda 24/7.',
    waText: 'Halo Santi Living, saya mau sewa extra bed di Jogja',
    waSource: 'sewa_extra_bed_jogja_page',
  },

  tracking: {
    productCategory: 'kasur',
    pageType: 'landing',
    intent: 'sewa_extra_bed',
  },

  en: {
    meta: {
      title: 'Rent Extra Bed in Jogja from IDR 40k - Hotel & Homestay Bed Rental',
      description: 'Extra bed rental service in Yogyakarta. Thick sterile foam mattresses, includes bed sheet, pillow & blanket, fast 2-hour delivery to hotels & homestays.',
    },
    hero: {
      title: 'Rent & Hire Extra Bed in Jogja',
      subtitle: 'Sterile, thick, and comfortable extra bed solutions for guests at hotels, homestays, villas, and family gatherings in Yogyakarta.',
      badge: 'From IDR 40,000/day',
    },
    benefits: [
      {
        icon: '🏨',
        title: 'Hotel & Homestay Standard',
        description: 'High-density thick foam mattresses with fresh laundry bedsheets, ready to use immediately for your guests.',
      },
      {
        icon: '⚡',
        title: 'Fast 2-Hour Delivery',
        description: 'Express delivery ready to send to hotels, homestays, guesthouses, and private residences across Yogyakarta.',
      },
      {
        icon: '🧼',
        title: '100% Sterile & Hygienic',
        description: 'Every extra bed unit undergoes UV-C sanitization and deep cleaning before being dispatched.',
      },
      {
        icon: '📦',
        title: 'Complete & Flexible Packages',
        description: 'Choose mattress-only or full complete packages with pillows, bedsheets, and soft thick blankets.',
      },
    ],
    priceCards: [
      {
        name: 'Single Mattress (Extra Bed Only)',
        size: '90 x 200 cm (Thickness 10-15 cm)',
        price: 'Rp 40,000',
        daily: 'Per Day / 24 Hours',
        note: 'Includes sterile foam mattress + fitted sheet',
        popular: false,
      },
      {
        name: 'Full Single Extra Bed Package',
        size: '90 x 200 cm (Complete Set)',
        price: 'Rp 60,000',
        daily: 'Per Day / 24 Hours',
        note: 'Mattress + Sheet + 1 Pillow & Case + 1 Thick Blanket',
        popular: true,
      },
      {
        name: 'Full Double Extra Bed Package',
        size: '120 x 200 cm / 140 x 200 cm',
        price: 'Rp 70,000',
        daily: 'Per Day / 24 Hours',
        note: 'Spacious mattress + Sheet + 2 Pillows & Cases + Blanket',
        popular: false,
      },
    ],
    audience: [
      {
        icon: '🏨',
        title: 'Hotels, Homestays & Villas',
        description: 'Instant solution for unexpected extra guests without having to invest in new bulky mattresses.',
      },
      {
        icon: '👨‍👩‍👧‍👦',
        title: 'Vacationing Families in Jogja',
        description: 'Keep the whole family sleeping comfortably together in one room without feeling cramped.',
      },
      {
        icon: '🎉',
        title: 'Reunions & Wedding Parties',
        description: 'Accommodation needs for visiting relatives or event committees staying in Yogyakarta.',
      },
      {
        icon: '🎒',
        title: 'Group Travelers & Study Tours',
        description: 'Flexible extra beds for community tour groups, study excursions, and corporate gatherings.',
      },
    ],
    faqs: [
      {
        question: 'What is included in the Full Extra Bed Package?',
        answer: 'The Full Extra Bed Package includes a quality thick foam mattress, freshly laundered bedsheet fitted on delivery, soft pillow with pillowcase, and a warm blanket.',
      },
      {
        question: 'Can you deliver directly to our hotel or homestay?',
        answer: 'Yes! Our delivery team frequently coordinates with receptionists and management at hotels, villas, and homestays across Yogyakarta, Sleman, Bantul, and surrounding areas.',
      },
      {
        question: 'How fast can the extra bed be delivered?',
        answer: 'For urgent needs, we provide express delivery within 1-2 hours after order confirmation depending on distance and available slots.',
      },
      {
        question: 'Is the extra bed clean and fresh?',
        answer: 'Absolutely. All Santi Living bedding undergoes thorough cleaning, UV-C disinfection, and uses freshly laundered linens.',
      },
      {
        question: 'How do I order and pay?',
        answer: 'Simply click the WhatsApp button, provide your lodging location, quantity, and rental dates. Payment can be made via bank transfer or QRIS.',
      },
      {
        question: 'Are there discounts for multi-day or bulk rentals?',
        answer: 'Yes, we offer special rates for rentals over 3 days and large bulk orders. Contact us directly via WhatsApp for a tailored quote.',
      },
    ],
    cta: {
      title: 'Need an Extra Bed in Jogja Right Now?',
      description: 'Our team is ready 24/7 on WhatsApp to assist your extra mattress needs for hotels, homestays, or homes.',
      waText: 'Hello Santi Living, I would like to rent an extra bed in Jogja',
      waSource: 'sewa_extra_bed_jogja_page',
    },
  },
};
