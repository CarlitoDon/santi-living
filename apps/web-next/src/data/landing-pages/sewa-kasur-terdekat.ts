1|import type { LandingPageConfig } from '@/types/landing';
2|
3|export const sewaKasurTerdekat: LandingPageConfig = {
4|  meta: {
5|    title: 'Sewa & Rental Kasur Terdekat di Jogja | Pengiriman 2 Jam',
6|    description:
7|      'Cari sewa atau rental kasur terdekat di Jogja? Santi Living melayani area Sleman, Bantul, Kota Jogja. Pengiriman cepat 2 jam, kasur bersih, mulai Rp30.000/hari.',
8|    },
9|    hero: {
10|    title: 'Sewa & Rental Kasur Terdekat di Jogja',
11|    subtitle: 'Layanan sewa dan rental kasur terdekat — pengiriman cepat ke area Sleman, Bantul, dan Kota Yogyakarta',
12|    badge: 'Gratis ongkir radius 3 km',
13|    },
14|  color: 'green',
15|
16|  benefits: [
17|    { icon: '📍', title: 'Lokasi Strategis', description: 'Berlokasi di Godean, dekat ke UGM, UNY, UMY, dan area kampus lainnya.' },
18|    { icon: '⚡', title: 'Pengiriman Cepat', description: 'Pemesanan sebelum jam 15:00 bisa diantar 2-4 jam. Same day delivery!' },
19|    { icon: '🆓', title: 'Gratis Ongkir', description: 'Pengiriman GRATIS untuk area dalam radius 3 km dari toko kami.' },
20|    { icon: '🗺️', title: 'Jangkauan Luas', description: 'Melayani area aktif Yogyakarta — Sleman, Bantul, Kota Jogja, Kulonprogo, dan sekitarnya.' },
21|  ],
22|  audience: [
23|    { icon: '🎓', title: 'Mahasiswa Area Kampus', description: 'UGM, UNY, UMY, UTY — kos kamu dekat dengan lokasi kami!' },
24|    { icon: '🏠', title: 'Warga Sleman & Bantul', description: 'Condongcatur, Maguwoharjo, Sewon, Kasihan — semua terjangkau.' },
25|    { icon: '🏨', title: 'Penginapan di Godean', description: 'Gratis ongkir! Butuh kasur tambahan untuk tamu, hubungi kami.' },
26|    { icon: '🏢', title: 'Event di Jogja', description: 'Acara di area layanan aktif Yogyakarta, kami bisa kirim dalam hitungan jam.' },
27|  ],
28|  faqs: [
29|    { question: 'Berapa jarak maksimal pengiriman?', answer: 'Kami melayani area aktif Sleman, Bantul, Kota Jogja, dan Kulonprogo. Untuk area dalam radius 3 km ongkir GRATIS, 3-8 km Rp15.000, 8-15 km Rp25.000, dan di atas 15 km wajib konfirmasi admin.' },
30|    { question: 'Berapa lama pengiriman dari pemesanan?', answer: 'Untuk pemesanan sebelum jam 15:00 WIB, kasur bisa diantar dalam 2-4 jam di hari yang sama (tergantung jarak dan ketersediaan).' },
31|    { question: 'Apakah bisa ambil sendiri ke toko?', answer: 'Bisa! Self-pickup di toko kami di Jl. Godean KM 10 tanpa ongkir. Cocok kalau kamu punya kendaraan sendiri.' },
32|    { question: 'Apakah area luar Jogja bisa dilayani?', answer: 'Untuk area di luar layanan aktif, termasuk Klaten, Magelang, Solo, dan Gunung Kidul, konfirmasi dulu via WhatsApp sebelum booking.' },
33|  ],
34|  cta: {
35|    title: 'Cari kasur terdekat?',
36|    description: 'Kami di Godean — bisa antar cepat ke lokasi kamu!',
37|    waText: 'Halo Santi Living, saya mau sewa kasur. Lokasi saya di [alamat]',
38|    waSource: 'terdekat_page',
39|  },
40|  sections: [
41|    {
42|      title: 'Area Terdekat Kos Mahasiswa & Kampus Utama',
43|      content: `
44|        <div class="prose max-w-none">
45|          <p>
46|            Santi Living menyediakan layanan <strong>sewa kasur terdekat</strong> untuk berbagai wilayah penting di Daerah Istimewa Yogyakarta. Kami memiliki cakupan khusus untuk mengantar pesanan kasur busa harian dan bulanan ke area kos mahasiswa dan pemukiman padat berikut:
47|          </p>
48|          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
49|            <div class="p-4 border rounded shadow-sm bg-white">
50|              <h4 class="font-bold text-lg text-emerald-700">📍 Sleman & Koridor Kampus</h4>
51|              <p class="text-sm mt-1">
52|                Melayani area kos mahasiswa padat di <strong>Seturan, Babarsari, Condongcatur, Kaliurang (koridor UII), Gejayan (UNY/Sanata Dharma), Depok Sleman, Ngaglik, Mlati,</strong> dan sekitarnya. Pengiriman cepat langsung dari workshop Godean.
53|              </p>
54|            </div>
55|            <div class="p-4 border rounded shadow-sm bg-white">
56|              <h4 class="font-bold text-lg text-emerald-700">📍 Bantul & Kota Yogyakarta</h4>
57|              <p class="text-sm mt-1">
58|                Layanan antar jemput kasur lipat dan extra bed ke area <strong>Kasihan (dekat UMY), Sewon (dekat ISI), Jetis, Gondokusuman, Umbulharjo, Kotagede,</strong> dan wilayah lainnya tanpa jaminan deposit yang memberatkan.
59|              </p>
60|            </div>
61|          </div>
62|          <div class="my-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded text-amber-900 text-sm">
63|            <strong>⚠️ Informasi Wilayah Pengiriman:</strong> Layanan kami mencakup 35 sub-area DIY di Sleman, Bantul, Kota Jogja, dan Kulon Progo/Godean. Mohon maaf, saat ini kami <strong>tidak melayani pengiriman ke Gunung Kidul</strong> demi menjaga efisiensi dan kecepatan armada pengiriman.
64|          </div>
65|        </div>
66|      `
67|    }
68|  ],
69|  en: {
70|    meta: {
71|      title: 'Nearest Mattress Rental in Jogja | 2-Hour Delivery',
72|      description:
73|        'Looking for the nearest mattress rental in Jogja? Santi Living serves Sleman, Bantul, and Jogja City areas. Fast 2-hour delivery, clean mattresses, starting from Rp30,000/day.',
74|    },
75|    hero: {
76|      title: 'Nearest Mattress Rental in Jogja',
77|      subtitle: 'Nearest mattress rental service — fast delivery to Sleman, Bantul, and Yogyakarta City areas',
78|      badge: 'Free delivery within 3 km radius',
79|    },
80|    benefits: [
81|      { icon: '📍', title: 'Strategic Location', description: 'Located in Godean, close to UGM, UNY, UMY, and other campus areas.' },
82|      { icon: '⚡', title: 'Fast Delivery', description: 'Orders placed before 3:00 PM can be delivered within 2–4 hours. Same day delivery!' },
83|      { icon: '🆓', title: 'Free Shipping', description: 'FREE delivery for areas within a 3 km radius from our store.' },
84|      { icon: '🗺️', title: 'Wide Coverage', description: 'Serving active Yogyakarta areas — Sleman, Bantul, Jogja City, Kulonprogo, and surroundings.' },
85|    ],
86|    audience: [
87|      { icon: '🎓', title: 'Students Near Campus', description: 'UGM, UNY, UMY, UTY — your boarding house is close to our location!' },
88|      { icon: '🏠', title: 'Sleman & Bantul Residents', description: 'Condongcatur, Maguwoharjo, Sewon, Kasihan — all within reach.' },
89|      { icon: '🏨', title: 'Accommodations in Godean', description: 'Free delivery! Need an extra mattress for guests, contact us.' },
90|      { icon: '🏢', title: 'Events in Jogja', description: 'Events in the active Yogyakarta service area, we can deliver within hours.' },
91|    ],
92|    faqs: [
93|      { question: 'What is the maximum delivery distance?', answer: 'We serve the active areas of Sleman, Bantul, Jogja City, and Kulonprogo. For areas within a 3 km radius delivery is FREE, 3–8 km Rp15,000, 8–15 km Rp25,000, and over 15 km requires admin confirmation.' },
94|      { question: 'How long does delivery take after ordering?', answer: 'For orders placed before 3:00 PM WIB, the mattress can be delivered within 2–4 hours on the same day (depending on distance and availability).' },
95|      { question: 'Can I pick it up directly from the store?', answer: 'Yes! Self-pickup is available at our store on Jl. Godean KM 10 with no delivery fee. Great if you have your own vehicle.' },
96|      { question: 'Can areas outside Jogja be served?', answer: 'For areas outside the active service zone, including Klaten, Magelang, Solo, and Gunung Kidul, please confirm via WhatsApp before booking.' },
97|    ],
98|    cta: {
99|      title: 'Looking for the nearest mattress?',
100|      description: 'We\'re in Godean — we can deliver quickly to your location!',
101|      waText: 'Hello Santi Living, I would like to rent a mattress. My location is at [address]',
102|      waSource: 'terdekat_page',
103|    },
104|    sections: [
105|      {
106|        title: 'Nearest Areas for Students & Main Campuses',
107|        content: `
108|          <div class="prose max-w-none">
109|            <p>
110|              Santi Living provides the <strong>nearest mattress rental</strong> services for various crucial sub-districts in Yogyakarta. We specialize in fast daily and monthly foam mattress deliveries to dense student boarding areas including:
111|            </p>
112|            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
113|              <div class="p-4 border rounded shadow-sm bg-white">
114|                <h4 class="font-bold text-lg text-emerald-700">📍 Sleman & Campus Corridor</h4>
115|                <p class="text-sm mt-1">
116|                  Serving student housing areas in <strong>Seturan, Babarsari, Condongcatur, Kaliurang (UII corridor), Gejayan (UNY/Sanata Dharma), Depok Sleman, Ngaglik, Mlati,</strong> and surroundings. Same-day delivery from Godean workshop.
117|                </p>
118|              </div>
119|              <div class="p-4 border rounded shadow-sm bg-white">
120|                <h4 class="font-bold text-lg text-emerald-700">📍 Bantul & Yogyakarta City</h4>
121|                <p class="text-sm mt-1">
122|                  Deliveries of foldable mattresses and extra beds to <strong>Kasihan (near UMY), Sewon (near ISI), Jetis, Gondokusuman, Umbulharjo, Kotagede,</strong> and other locations with no security deposit requirements.
123|                </p>
124|              </div>
125|            </div>
126|            <div class="my-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded text-amber-900 text-sm">
127|              <strong>⚠️ Delivery Service Area Note:</strong> We serve 35 active sub-areas in Sleman, Bantul, Jogja City, and Godean/Kulon Progo. Please note we <strong>do not deliver to Gunung Kidul</strong> due to logistical distance limits.
128|            </div>
129|          </div>
130|        `
131|      }
132|    ]
133|  },
134|};
135|