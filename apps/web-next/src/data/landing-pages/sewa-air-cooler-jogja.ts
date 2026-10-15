import type { LandingPageConfig } from '@/types/landing';

export const sewaAirCoolerJogja: LandingPageConfig = {
  meta: {
    title: 'Sewa Air Cooler Jogja 35rb/Hari | Hemat Listrik 50-70W, MCB Kos Aman',
    description: 'Sewa air cooler Jogja Rp35rb/hari, 175rb/minggu, 450rb/bulan. Daya 50-70W (vs AC portable 400-800W), MCB kos 450VA aman. Antar 2-4 jam se-DIY!',
  },
  hero: {
    title: 'Sewa Air Cooler Jogja 35rb/Hari',
    subtitle: 'Pendingin 50-70 Watt — 10x lebih hemat dari AC portable 400-800W. MCB kos tidak jeglek.',
    badge: 'Antar 2-4 jam se-DIY',
  },
  color: 'cyan',

  benefits: [
    { icon: '⚡', title: 'Hemat Listrik 10x Lipat', description: 'Konsumsi daya hanya 50–70 Watt, 10x lebih hemat dibanding AC portable 400–800 Watt.' },
    { icon: '🔌', title: 'MCB Kos Pasti Aman', description: 'Aman untuk listrik kos 450VA maupun 900VA tanpa khawatir jeglek atau trip mendadak.' },
    { icon: '❄️', title: 'Termasuk Ice Pack', description: 'Dilengkapi ice pack beku berkualitas untuk hembusan udara sejuk bertahan 4–6 jam.' },
    { icon: '🔄', title: 'Praktis & Beroda', description: 'Mudah dipindahkan dengan roda dari kamar tidur, ruang kerja, hingga ruang tamu.' },
  ],

  priceCards: [
    { name: 'Air Cooler (Harian)', size: 'Portable Cooler', price: 'Rp 35.000', daily: 'Per Hari', note: 'Sudah termasuk Ice Pack', popular: true },
    { name: 'Air Cooler (Mingguan)', size: 'Portable Cooler', price: 'Rp 175.000', daily: 'Per Minggu', note: 'Lebih hemat', popular: false },
    { name: 'Air Cooler (Bulanan)', size: 'Portable Cooler', price: 'Rp 450.000', daily: 'Per Bulan', note: 'Solusi anak kos', popular: false },
  ],

  audience: [
    { icon: '🥵', title: 'Anak Kos Kepanasan', description: 'Kamar kos terasa gerah saat siang dan sore? Air cooler adalah pendingin sejuk paling hemat tanpa jeglek.' },
    { icon: '👶', title: 'Keluarga Punya Bayi', description: 'Hembusan udara sejuk alami dan lembab yang lebih ramah untuk pernapasan anak dibanding hembusan AC kering.' },
    { icon: '💻', title: 'Work From Home (WFH)', description: 'Jaga fokus kerja dan produktivitas di kamar seharian tanpa cemas tagihan token listrik jebol.' },
    { icon: '🤝', title: 'Ruang Tamu & Acara Keluarga', description: 'Sejukkan ruang berkumpul keluarga saat arisan, syukuran, atau tamu menginap di akhir pekan.' },
  ],

  sections: [
    {
      title: 'Tabel Perbandingan: Air Cooler vs AC Portable',
      content: `
        <div class="overflow-x-auto my-6">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200">
                <th class="py-3 px-4 font-semibold text-slate-900">Parameter</th>
                <th class="py-3 px-4 font-semibold text-cyan-700">Air Cooler (Santi Living)</th>
                <th class="py-3 px-4 font-semibold text-slate-700">AC Portable</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm">
              <tr>
                <td class="py-3 px-4 font-medium text-slate-900">Daya Listrik</td>
                <td class="py-3 px-4 text-cyan-700 font-semibold">50–70 Watt (Hemat 10x)</td>
                <td class="py-3 px-4 text-slate-600">400–800 Watt</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-medium text-slate-900">Beban MCB Listrik Kos</td>
                <td class="py-3 px-4 text-cyan-700 font-semibold">Aman di 450VA & 900VA (Tidak jeglek)</td>
                <td class="py-3 px-4 text-slate-600">Rawan jeglek/trip di kos 450–900VA</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-medium text-slate-900">Tarif Sewa Harian</td>
                <td class="py-3 px-4 text-cyan-700 font-semibold">Mulai Rp 35.000/hari</td>
                <td class="py-3 px-4 text-slate-600">Umumnya Rp 100.000+/hari</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-medium text-slate-900">Pipa Pembuangan Panas</td>
                <td class="py-3 px-4 text-cyan-700 font-semibold">Tidak butuh pipa/cerobong keluar</td>
                <td class="py-3 px-4 text-slate-600">Wajib pasang pipa pembuangan ke jendela</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-medium text-slate-900">Media Pendingin</td>
                <td class="py-3 px-4 text-cyan-700 font-semibold">Ice Pack + sirkulasi air sejuk</td>
                <td class="py-3 px-4 text-slate-600">Kompresor freon</td>
              </tr>
              <tr>
                <td class="py-3 px-4 font-medium text-slate-900">Mobilitas & Fleksibilitas</td>
                <td class="py-3 px-4 text-cyan-700 font-semibold">Praktis beroda, mudah digeser bebas</td>
                <td class="py-3 px-4 text-slate-600">Berat & terbatas jangkauan pipa jendela</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Ingin tahu perbandingan daya listrik dan efisiensi selengkapnya? Simak ulasan mendalam kami di <a href="/artikel/apakah-ac-portable-boros-listrik-vs-air-cooler" class="text-cyan-600 underline font-medium">artikel apakah AC portable boros listrik vs air cooler</a>.</p>
      `,
    },
  ],

  faqs: [
    {
      question: 'Apa bedanya Air Cooler dengan AC Portable?',
      answer: 'Air Cooler menggunakan Ice Pack dan air untuk menghembuskan udara dingin alami dengan daya hanya 50–70 Watt. Sedangkan AC Portable menggunakan kompresor pendingin freon dengan konsumsi daya 400–800 Watt yang rawan membuat meteran listrik kos jeglek.',
    },
    {
      question: 'Apakah aman untuk MCB meteran kos 450VA atau 900VA?',
      answer: 'Sangat aman. Konsumsi daya air cooler hanya 50–70 Watt (setara kipas angin biasa), sehingga tidak akan membebani MCB kos 450VA maupun 900VA sekalipun dinyalakan bersamaan dengan lampu atau laptop.',
    },
    {
      question: 'Berapa lama efek dingin ice pack bertahan?',
      answer: 'Tergantung suhu ruangan, 1 unit ice pack beku umumnya memberikan kesejukan optimal selama 4–6 jam. Anda bisa membekukan kembali ice pack di freezer untuk pemakaian berikutnya.',
    },
    {
      question: 'Apakah sewa sudah termasuk Ice Pack?',
      answer: 'Ya, setiap paket sewa Air Cooler di Santi Living sudah lengkap termasuk Ice Pack (Blue Ice) yang siap digunakan.',
    },
    {
      question: 'Berapa lama durasi pengiriman dan area mana saja yang dijangkau?',
      answer: 'Pengiriman siap diantar 2–4 jam ke seluruh area DIY (Sleman, Bantul, Kota Yogyakarta, dan Kulon Progo). Jika Anda butuh alternatif varian pendingin lainnya, silakan cek katalog lengkap di layanan sewa cooling Santi Living.',
    },
  ],

  cta: {
    title: 'Kamar kos panas? Sejukkan dgn 35rb/hari.',
    description: 'Sewa air cooler Jogja siap antar 2-4 jam se-DIY. Stok terbatas saat cuaca terik!',
    waText: 'Halo Santi Living, saya mau sewa Air Cooler Jogja',
    waSource: 'sewa_air_cooler_jogja_page',
    secondaryLabel: 'Lihat varian pendingin lain',
    secondaryHref: '/sewa-cooling',
  },

  en: {
    meta: {
      title: 'Rent Air Cooler Jogja Rp35k/Day | Energy Saving 50-70W, Safe for Boarding Rooms',
      description: 'Rent air cooler in Jogja from Rp35k/day, 175k/week, 450k/month. Low 50-70W power (vs 400-800W portable AC). Safe for 450VA MCB. Fast delivery in 2-4 hours!',
    },
    hero: {
      title: 'Rent Air Cooler Jogja from Rp35k/Day',
      subtitle: '50–70 Watts cooling — 10x more energy-efficient than 400–800W portable AC. No tripped circuit breakers.',
      badge: 'Fast 2-4 hr delivery across DIY',
    },
    benefits: [
      { icon: '⚡', title: '10x Energy Efficient', description: 'Consumes only 50–70 Watts, 10x more efficient than 400–800W portable air conditioners.' },
      { icon: '🔌', title: 'Safe for Room Breakers', description: 'Runs smoothly on 450VA and 900VA power connections without the risk of tripping breakers.' },
      { icon: '❄️', title: 'Ice Pack Included', description: 'Equipped with frozen ice packs delivering refreshing and cool air for 4–6 hours.' },
      { icon: '🔄', title: 'Portable with Wheels', description: 'Easily wheeled between bedrooms, study desks, and living rooms.' },
    ],
    priceCards: [
      { name: 'Air Cooler (Daily)', size: 'Portable Cooler', price: 'Rp 35.000', daily: 'Per Day', note: 'Ice Pack included', popular: true },
      { name: 'Air Cooler (Weekly)', size: 'Portable Cooler', price: 'Rp 175.000', daily: 'Per Week', note: 'Better value', popular: false },
      { name: 'Air Cooler (Monthly)', size: 'Portable Cooler', price: 'Rp 450.000', daily: 'Per Month', note: 'Ideal for boarding house residents', popular: false },
    ],
    audience: [
      { icon: '🥵', title: 'Overheated Boarding Residents', description: 'Boarding room feels like an oven? An air cooler is the most economical cooling solution without tripping power.' },
      { icon: '👶', title: 'Families with Babies', description: 'Gentle, naturally humidified cool breeze that protects delicate infant airways better than dry AC.' },
      { icon: '💻', title: 'Remote Workers (WFH)', description: 'Stay focused and comfortable working all day without fearing high electricity token costs.' },
      { icon: '🤝', title: 'Living Room & Family Events', description: 'Cool your living space during family gatherings, celebrations, or weekend guest visits.' },
    ],
    sections: [
      {
        title: 'Comparison: Air Cooler vs Portable AC',
        content: `
          <div class="overflow-x-auto my-6">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200">
                  <th class="py-3 px-4 font-semibold text-slate-900">Parameter</th>
                  <th class="py-3 px-4 font-semibold text-cyan-700">Air Cooler (Santi Living)</th>
                  <th class="py-3 px-4 font-semibold text-slate-700">Portable AC</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm">
                <tr>
                  <td class="py-3 px-4 font-medium text-slate-900">Power Consumption</td>
                  <td class="py-3 px-4 text-cyan-700 font-semibold">50–70 Watts (10x Savings)</td>
                  <td class="py-3 px-4 text-slate-600">400–800 Watts</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-medium text-slate-900">Circuit Breaker Compatibility</td>
                  <td class="py-3 px-4 text-cyan-700 font-semibold">Safe on 450VA & 900VA (No tripping)</td>
                  <td class="py-3 px-4 text-slate-600">High trip risk on 450–900VA circuits</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-medium text-slate-900">Daily Rental Rate</td>
                  <td class="py-3 px-4 text-cyan-700 font-semibold">From Rp 35,000/day</td>
                  <td class="py-3 px-4 text-slate-600">Typically Rp 100,000+/day</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-medium text-slate-900">Exhaust Hose Needed</td>
                  <td class="py-3 px-4 text-cyan-700 font-semibold">None (Self-contained)</td>
                  <td class="py-3 px-4 text-slate-600">Requires exhaust hose venting out a window</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-medium text-slate-900">Cooling Medium</td>
                  <td class="py-3 px-4 text-cyan-700 font-semibold">Ice Pack + water evaporation</td>
                  <td class="py-3 px-4 text-slate-600">Refrigerant compressor</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-medium text-slate-900">Mobility</td>
                  <td class="py-3 px-4 text-cyan-700 font-semibold">Equipped with wheels, easy to relocate</td>
                  <td class="py-3 px-4 text-slate-600">Heavy and tethered to window hose</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Want a complete power consumption breakdown? Read our in-depth guide in the <a href="/artikel/apakah-ac-portable-boros-listrik-vs-air-cooler" class="text-cyan-600 underline font-medium">article comparing portable AC power vs air cooler</a>.</p>
        `,
      },
    ],
    faqs: [
      {
        question: 'What is the difference between an Air Cooler and a Portable AC?',
        answer: 'An Air Cooler uses ice packs and water evaporation to generate gentle cool air consuming only 50–70 Watts. A Portable AC uses a freon compressor consuming 400–800 Watts, which often trips standard Indonesian boarding room electrical meters.',
      },
      {
        question: 'Is it safe for 450VA or 900VA boarding house breakers?',
        answer: 'Yes, completely safe. Consuming only 50–70 Watts (similar to a standard fan), it will not overload 450VA or 900VA meters even when running alongside lights or laptops.',
      },
      {
        question: 'How long does the ice pack cooling effect last?',
        answer: 'Depending on ambient room temperature, one frozen ice pack provides 4–6 hours of refreshing cool airflow before needing to be refrozen.',
      },
      {
        question: 'Is the ice pack included with the rental?',
        answer: 'Yes, every Santi Living air cooler rental includes a reusable Blue Ice pack ready for use.',
      },
      {
        question: 'How fast is delivery and which areas are covered?',
        answer: 'Fast delivery within 2–4 hours across DIY (Sleman, Bantul, Yogyakarta City, and Kulon Progo). Need other cooling options? Check out our full cooling catalog on the sewa cooling page.',
      },
    ],
    cta: {
      title: 'Room feeling hot? Cool it down for Rp35k/day.',
      description: 'Rent an air cooler in Jogja with delivery in 2-4 hours across DIY. Limited units available during heatwaves!',
      waText: 'Hello Santi Living, I want to rent an Air Cooler in Jogja',
      waSource: 'sewa_air_cooler_jogja_page',
      secondaryLabel: 'View other cooling options',
    },
  },
};
