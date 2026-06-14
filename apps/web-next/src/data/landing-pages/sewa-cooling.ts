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
en: {
  meta: {
    title: 'Nearest Air Cooler Rental in Jogja | Cool & Energy Saving',
    description: 'The nearest air cooler rental center in Jogja, daily/monthly. Cooler than a fan, cheaper than AC. Perfect for boarding rooms or living rooms.',
  },
  hero: {
    title: 'Air Cooler Rental Jogja',
    subtitle: 'Nearest air cooler rental, maximum cooling without skyrocketing electricity bills. The smart solution!',
    badge: 'Starting from Rp35.000/day',
  },
    benefits: [
    { icon: '❄️', title: 'Cooler Than a Fan', description: 'Uses water cooling technology (Ice Pack) to deliver fresher and cooler airflow.' },
    { icon: '⚡', title: 'Extremely Energy Efficient', description: 'Low power consumption (around 50–70 Watts), far more economical than a portable AC.' },
    { icon: '💧', title: 'Large Tank Capacity', description: 'No need to frequently refill water. Long-lasting cooling throughout the night.' },
    { icon: '🔄', title: 'Practical & Portable', description: 'Equipped with wheels so it can easily be moved from the living room to the bedroom.' },
  ],
  priceCards: [
    { name: 'Air Cooler (Daily)', size: 'Portable Cooler', price: 'Rp 35.000', daily: 'Per Day', note: 'Ice Pack included', popular: true },
    { name: 'Air Cooler (Weekly)', size: 'Portable Cooler', price: 'Rp 175.000', daily: 'Per Week', note: 'Better value', popular: false },
    { name: 'Air Cooler (Monthly)', size: 'Portable Cooler', price: 'Rp 450.000', daily: 'Per Month', note: 'Long-term solution for boarding house residents', popular: false },
  ],
  audience: [
    { icon: '🥵', title: 'Overheated Boarding House Residents', description: 'Does your room feel like an oven during the day? An Air Cooler is the most efficient cooling solution.' },
    { icon: '👶', title: 'Families with Babies', description: 'More gentle on a baby\'s breathing compared to AC that is too cold and dry.' },
    { icon: '💻', title: 'Work From Home (WFH)', description: 'Stay focused while working at home with a cool and comfortable room temperature.' },
    { icon: '🤝', title: 'Living Room / Family Room', description: 'Cool down the family room during casual weekend gatherings.' },
  ],
  faqs: [
    { question: 'Is an Air Cooler the same as an AC?', answer: 'No. An Air Cooler uses ice water (Ice Pack) to cool the air blown by the fan, making the air feel more humid and refreshing, not as cold as freon-based AC.' },
    { question: 'How long does the cooling last?', answer: 'Depending on the room temperature, typically 1 Ice Pack can provide a cooling effect for 4–6 hours before needing to be refrozen.' },
    { question: 'Does it consume a lot of electricity?', answer: 'Not at all! Its power consumption is almost the same as a regular electric fan (around 50–70 Watts).' },
    { question: 'Is the Ice Pack included?', answer: 'Yes, every Air Cooler rental comes with an Ice Pack (Blue Ice).' },
  ],
  cta: {
    title: 'Want a cooler room without AC?',
    description: 'Rent an Air Cooler now. Limited stock during hot weather!',
    waText: 'Hello Santi Living, I would like to rent an Air Cooler',
    waSource: 'sewa_cooler_page',
  },
},
};
