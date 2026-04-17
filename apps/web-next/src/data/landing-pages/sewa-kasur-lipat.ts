import type { LandingPageConfig } from '@/types/landing';

export const sewaKasurLipat: LandingPageConfig = {
  meta: {
    title: 'Sewa Kasur Lipat Jogja | Praktis untuk Tamu & Acara',
    description:
      'Sewa kasur lipat di Jogja mulai Rp25.000/hari. Praktis dilipat, mudah disimpan, cocok untuk tamu mendadak, acara keluarga, atau event. Antar jemput gratis area Godean.',
  },
  hero: {
    title: 'Sewa Kasur Lipat Jogja',
    subtitle: 'Solusi praktis untuk tamu mendadak, acara keluarga, dan event — mudah disimpan!',
    badge: 'Mulai Rp25.000/hari',
  },
  color: 'purple',
  benefits: [
    { icon: '📐', title: 'Mudah Dilipat & Disimpan', description: 'Kasur busa bisa dilipat jadi 3 bagian. Tidak makan tempat saat tidak dipakai.' },
    { icon: '🚚', title: 'Antar Jemput Cepat', description: 'Pesan sebelum jam 15:00, kasur bisa sampai hari ini juga — same day delivery!' },
    { icon: '🧼', title: 'Bersih & Higienis', description: 'Dicuci profesional dan dibungkus plastik steril sebelum diantar ke kamu.' },
    { icon: '💰', title: 'Hemat Budget', description: 'Jauh lebih murah daripada beli kasur lipat baru yang jarang dipakai.' },
  ],
  audience: [
    { icon: '👨‍👩‍👧‍👦', title: 'Keluarga Besar', description: 'Lebaran, hajatan, reuni — butuh kasur tambahan untuk tamu menginap.' },
    { icon: '🏨', title: 'Pemilik Homestay', description: 'Butuh ekstra bed untuk kamar? Kasur lipat bisa dilipat pagi hari.' },
    { icon: '🎓', title: 'Anak Kos', description: 'Teman atau orang tua berkunjung menginap? Sewa 1-2 hari sudah cukup.' },
    { icon: '🎪', title: 'Penyelenggara Event', description: 'Gathering, camping indoor, retreat — sewa banyak unit dapat diskon 15%!' },
  ],
  faqs: [
    { question: 'Apakah kasur lipat bisa diantar hari ini?', answer: 'Bisa! Untuk pemesanan sebelum jam 15:00 WIB, kami bisa antar di hari yang sama (same-day delivery).' },
    { question: 'Berapa ukuran kasur lipat yang tersedia?', answer: 'Tersedia ukuran Single (90x200), Single Super (100x200), dan Double (120x200). Semua bisa dilipat jadi 3 bagian.' },
    { question: 'Apakah kasur lipat bisa disewa harian?', answer: 'Tentu! Minimal sewa 1 hari. Cocok untuk tamu dadakan yang menginap semalam.' },
    { question: 'Bagaimana cara pengembalian kasur?', answer: 'Tim kami akan menjemput kasur di lokasi kamu pada hari terakhir sewa. Tidak perlu repot mengantar balik.' },
  ],
  cta: {
    title: 'Butuh kasur lipat untuk acara?',
    description: 'Pesan sekarang, bisa antar hari ini!',
    waText: 'Halo Santi Living, saya mau sewa kasur lipat untuk [jumlah] orang',
    waSource: 'lipat_page',
  },
};
