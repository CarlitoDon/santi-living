1|import type { LandingPageConfig } from '@/types/landing';
2|
3|export const sewaCooling: LandingPageConfig = {
4|  meta: {
5|    title: 'Sewa & Rental Air Cooler Jogja Terdekat | Dingin Hemat Listrik',
6|    description: 'Pusat sewa dan rental Air Cooler terdekat di Jogja harian/bulanan. Lebih dingin dari kipas, lebih hemat dari AC. Cocok untuk kamar kos atau ruang keluarga.',
7|  },
8|  hero: {
9|    title: 'Sewa Air Cooler Jogja',
10|    subtitle: 'Rental air cooler terdekat, dingin maksimal tanpa tagihan listrik jebol. Solusi cerdas!',
11|    badge: 'Mulai Rp40.000/hari',
12|  },
13|  color: 'indigo',
14|
15|  benefits: [
16|    { icon: '❄️', title: 'Lebih Dingin dari Kipas', description: 'Menggunakan teknologi pendingin air (Ice Pack) untuk hembusan udara yang lebih sejuk.' },
17|    { icon: '⚡', title: 'Sangat Hemat Listrik', description: 'Konsumsi daya rendah (sekitar 50-70 Watt), jauh lebih hemat dibandingkan AC portabel.' },
18|    { icon: '💧', title: 'Kapasitas Tangki Besar', description: 'Tidak perlu repot sering mengisi ulang air. Dingin tahan lama sepanjang malam.' },
19|    { icon: '🔄', title: 'Praktis & Portable', description: 'Dilengkapi roda sehingga mudah dipindahkan dari ruang tamu ke kamar tidur.' },
20|  ],
21|  priceCards: [
22|    { name: 'Air Cooler (Harian)', size: 'Portable Cooler', price: 'Rp 40.000', daily: 'Per Hari', note: 'Sudah termasuk Ice Pack', popular: true },
23|    { name: 'Air Cooler (Mingguan)', size: 'Portable Cooler', price: 'Rp 175.000', daily: 'Per Minggu', note: 'Lebih hemat', popular: false },
24|    { name: 'Air Cooler (Bulanan)', size: 'Portable Cooler', price: 'Rp 450.000', daily: 'Per Bulan', note: 'Solusi jangka panjang anak kos', popular: false },
25|  ],
26|  audience: [
27|    { icon: '🥵', title: 'Anak Kos Kepanasan', description: 'Kamar kos terasa seperti oven saat siang hari? Air Cooler adalah pendingin paling efisien.' },
28|    { icon: '👶', title: 'Keluarga Punya Bayi', description: 'Lebih ramah untuk pernapasan bayi dibandingkan AC yang terlalu dingin dan kering.' },
29|    { icon: '💻', title: 'Work From Home (WFH)', description: 'Jaga konsentrasi kerja di rumah dengan suhu ruangan yang sejuk dan nyaman.' },
30|    { icon: '🤝', title: 'Ruang Tamu / Keluarga', description: 'Sejukkan ruang keluarga saat kumpul-kumpul santai di akhir pekan.' },
31|  ],
32|  faqs: [
33|    { question: 'Apakah Air Cooler sama dengan AC?', answer: 'Tidak. Air Cooler menggunakan air es (Ice Pack) untuk menyejukkan udara yang dihembuskan kipas, sehingga udara terasa lebih lembab dan sejuk, bukan sedingin freon AC.' },
34|    { question: 'Berapa lama dinginnya bertahan?', answer: 'Tergantung suhu ruangan, biasanya 1 Ice Pack bisa memberikan efek sejuk selama 4-6 jam sebelum perlu dibekukan kembali.' },
35|    { question: 'Apakah boros listrik?', answer: 'Sama sekali tidak! Konsumsi listriknya hampir sama dengan kipas angin biasa (sekitar 50-70 Watt).' },
36|    { question: 'Apakah sudah termasuk Ice Pack?', answer: 'Ya, setiap penyewaan Air Cooler sudah dilengkapi dengan Ice Pack (Blue Ice).' },
37|  ],
38|  cta: {
39|    title: 'Ingin ruangan lebih sejuk tanpa AC?',
40|    description: 'Sewa Air Cooler sekarang. Stok terbatas saat cuaca panas!',
41|    waText: 'Halo Santi Living, saya mau sewa Air Cooler',
42|    waSource: 'sewa_cooler_page',
43|  },
44|en: {
45|  meta: {
46|    title: 'Nearest Air Cooler Rental in Jogja | Cool & Energy Saving',
47|    description: 'The nearest air cooler rental center in Jogja, daily/monthly. Cooler than a fan, cheaper than AC. Perfect for boarding rooms or living rooms.',
48|  },
49|  hero: {
50|    title: 'Air Cooler Rental Jogja',
51|    subtitle: 'Nearest air cooler rental, maximum cooling without skyrocketing electricity bills. The smart solution!',
52|    badge: 'Starting from Rp40.000/day',
53|  },
54|    benefits: [
55|    { icon: '❄️', title: 'Cooler Than a Fan', description: 'Uses water cooling technology (Ice Pack) to deliver fresher and cooler airflow.' },
56|    { icon: '⚡', title: 'Extremely Energy Efficient', description: 'Low power consumption (around 50–70 Watts), far more economical than a portable AC.' },
57|    { icon: '💧', title: 'Large Tank Capacity', description: 'No need to frequently refill water. Long-lasting cooling throughout the night.' },
58|    { icon: '🔄', title: 'Practical & Portable', description: 'Equipped with wheels so it can easily be moved from the living room to the bedroom.' },
59|  ],
60|  priceCards: [
61|    { name: 'Air Cooler (Daily)', size: 'Portable Cooler', price: 'Rp 40.000', daily: 'Per Day', note: 'Ice Pack included', popular: true },
62|    { name: 'Air Cooler (Weekly)', size: 'Portable Cooler', price: 'Rp 175.000', daily: 'Per Week', note: 'Better value', popular: false },
63|    { name: 'Air Cooler (Monthly)', size: 'Portable Cooler', price: 'Rp 450.000', daily: 'Per Month', note: 'Long-term solution for boarding house residents', popular: false },
64|  ],
65|  audience: [
66|    { icon: '🥵', title: 'Overheated Boarding House Residents', description: 'Does your room feel like an oven during the day? An Air Cooler is the most efficient cooling solution.' },
67|    { icon: '👶', title: 'Families with Babies', description: 'More gentle on a baby\'s breathing compared to AC that is too cold and dry.' },
68|    { icon: '💻', title: 'Work From Home (WFH)', description: 'Stay focused while working at home with a cool and comfortable room temperature.' },
69|    { icon: '🤝', title: 'Living Room / Family Room', description: 'Cool down the family room during casual weekend gatherings.' },
70|  ],
71|  faqs: [
72|    { question: 'Is an Air Cooler the same as an AC?', answer: 'No. An Air Cooler uses ice water (Ice Pack) to cool the air blown by the fan, making the air feel more humid and refreshing, not as cold as freon-based AC.' },
73|    { question: 'How long does the cooling last?', answer: 'Depending on the room temperature, typically 1 Ice Pack can provide a cooling effect for 4–6 hours before needing to be refrozen.' },
74|    { question: 'Does it consume a lot of electricity?', answer: 'Not at all! Its power consumption is almost the same as a regular electric fan (around 50–70 Watts).' },
75|    { question: 'Is the Ice Pack included?', answer: 'Yes, every Air Cooler rental comes with an Ice Pack (Blue Ice).' },
76|  ],
77|  cta: {
78|    title: 'Want a cooler room without AC?',
79|    description: 'Rent an Air Cooler now. Limited stock during hot weather!',
80|    waText: 'Hello Santi Living, I would like to rent an Air Cooler',
81|    waSource: 'sewa_cooler_page',
82|  },
83|},
84|};
85|