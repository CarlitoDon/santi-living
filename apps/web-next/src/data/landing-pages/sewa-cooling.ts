import type { LandingPageConfig } from '@/types/landing';

export const sewaCooling: LandingPageConfig = {
  meta: {
    title: 'Sewa & Rental Air Cooler Jogja Terdekat | Dingin Hemat Listrik',
    description: 'Pusat sewa dan rental Air Cooler terdekat di Jogja harian/bulanan. Lebih dingin dari kipas, lebih hemat dari AC. Cocok untuk kamar kos atau ruang keluarga.',
  },
  hero: {
    title: 'Sewa Air Cooler Jogja',
    subtitle: 'Rental air cooler terdekat, dingin maksimal tanpa tagihan listrik jebol. Solusi cerdas!',
    badge: 'Mulai Rp35.000/hari',
  },
  color: 'indigo',
  benefits: [
    { icon: '❄️', title: 'Lebih Dingin dari Kipas', description: 'Menggunakan teknologi pendingin air (Ice Pack) untuk hembusan udara yang lebih sejuk.' },
    { icon: '⚡', title: 'Sangat Hemat Listrik', description: 'Konsumsi daya rendah (sekitar 50-70 Watt), jauh lebih hemat dibandingkan AC portabel.' },
    { icon: '💧', title: 'Kapasitas Tangki Besar', description: 'Tidak perlu repot sering mengisi ulang air. Dingin tahan lama sepanjang malam.' },
    { icon: '🔄', title: 'Praktis & Portable', description: 'Dilengkapi roda sehingga mudah dipindahkan dari ruang tamu ke kamar tidur.' },
  ],
  priceCards: [
    { name: 'Air Cooler (Harian)', size: 'Portable Cooler', price: 'Rp 35.000', daily: 'Per Hari', note: 'Sudah termasuk Ice Pack', popular: true },
    { name: 'Air Cooler (Mingguan)', size: 'Portable Cooler', price: 'Rp 175.000', daily: 'Per Minggu', note: 'Lebih hemat', popular: false },
    { name: 'Air Cooler (Bulanan)', size: 'Portable Cooler', price: 'Rp 450.000', daily: 'Per Bulan', note: 'Solusi jangka panjang anak kos', popular: false },
  ],
  audience: [
    { icon: '🥵', title: 'Anak Kos Kepanasan', description: 'Kamar kos terasa seperti oven saat siang hari? Air Cooler adalah pendingin paling efisien.' },
    { icon: '👶', title: 'Keluarga Punya Bayi', description: 'Lebih ramah untuk pernapasan bayi dibandingkan AC yang terlalu dingin dan kering.' },
    { icon: '💻', title: 'Work From Home (WFH)', description: 'Jaga konsentrasi kerja di rumah dengan suhu ruangan yang sejuk dan nyaman.' },
    { icon: '🤝', title: 'Ruang Tamu / Keluarga', description: 'Sejukkan ruang keluarga saat kumpul-kumpul santai di akhir pekan.' },
  ],
  faqs: [
    { question: 'Apakah Air Cooler sama dengan AC?', answer: 'Tidak. Air Cooler menggunakan air es (Ice Pack) untuk menyejukkan udara yang dihembuskan kipas, sehingga udara terasa lebih lembab dan sejuk, bukan sedingin freon AC.' },
    { question: 'Berapa lama dinginnya bertahan?', answer: 'Tergantung suhu ruangan, biasanya 1 Ice Pack bisa memberikan efek sejuk selama 4-6 jam sebelum perlu dibekukan kembali.' },
    { question: 'Apakah boros listrik?', answer: 'Sama sekali tidak! Konsumsi listriknya hampir sama dengan kipas angin biasa (sekitar 50-70 Watt).' },
    { question: 'Apakah sudah termasuk Ice Pack?', answer: 'Ya, setiap penyewaan Air Cooler sudah dilengkapi dengan Ice Pack (Blue Ice).' },
  ],
  cta: {
    title: 'Ingin ruangan lebih sejuk tanpa AC?',
    description: 'Sewa Air Cooler sekarang. Stok terbatas saat cuaca panas!',
    waText: 'Halo Santi Living, saya mau sewa Air Cooler',
    waSource: 'sewa_cooler_page',
  },
};
