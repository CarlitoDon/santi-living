import type { LandingPageConfig } from '@/types/landing';

export const sewaKasurTerdekat: LandingPageConfig = {
  meta: {
    title: 'Sewa & Rental Kasur Terdekat di Jogja | Pengiriman 2 Jam',
    description:
      'Cari sewa atau rental kasur terdekat di Jogja? Santi Living melayani area Sleman, Bantul, Kota Jogja. Pengiriman cepat 2 jam, kasur bersih, mulai Rp25.000/hari.',
  },
  hero: {
    title: 'Sewa & Rental Kasur Terdekat di Jogja',
    subtitle: 'Layanan sewa dan rental kasur terdekat — pengiriman cepat ke area Sleman, Bantul, dan Kota Yogyakarta',
    badge: 'Gratis ongkir radius 3 km',
  },
  color: 'green',

  benefits: [
    { icon: '📍', title: 'Lokasi Strategis', description: 'Berlokasi di Godean, dekat ke UGM, UNY, UMY, dan area kampus lainnya.' },
    { icon: '⚡', title: 'Pengiriman Cepat', description: 'Pemesanan sebelum jam 15:00 bisa diantar 2-4 jam. Same day delivery!' },
    { icon: '🆓', title: 'Gratis Ongkir', description: 'Pengiriman GRATIS untuk area dalam radius 3 km dari toko kami.' },
    { icon: '🗺️', title: 'Jangkauan Luas', description: 'Melayani area aktif Yogyakarta — Sleman, Bantul, Kota Jogja, Kulonprogo, dan sekitarnya.' },
  ],
  audience: [
    { icon: '🎓', title: 'Mahasiswa Area Kampus', description: 'UGM, UNY, UMY, UTY — kos kamu dekat dengan lokasi kami!' },
    { icon: '🏠', title: 'Warga Sleman & Bantul', description: 'Condongcatur, Maguwoharjo, Sewon, Kasihan — semua terjangkau.' },
    { icon: '🏨', title: 'Penginapan di Godean', description: 'Gratis ongkir! Butuh kasur tambahan untuk tamu, hubungi kami.' },
    { icon: '🏢', title: 'Event di Jogja', description: 'Acara di area layanan aktif Yogyakarta, kami bisa kirim dalam hitungan jam.' },
  ],
  faqs: [
    { question: 'Berapa jarak maksimal pengiriman?', answer: 'Kami melayani area aktif Sleman, Bantul, Kota Jogja, dan Kulonprogo. Untuk area dalam radius 3 km ongkir GRATIS, 3-8 km Rp15.000, 8-15 km Rp25.000, dan di atas 15 km wajib konfirmasi admin.' },
    { question: 'Berapa lama pengiriman dari pemesanan?', answer: 'Untuk pemesanan sebelum jam 15:00 WIB, kasur bisa diantar dalam 2-4 jam di hari yang sama (tergantung jarak dan ketersediaan).' },
    { question: 'Apakah bisa ambil sendiri ke toko?', answer: 'Bisa! Self-pickup di toko kami di Jl. Godean KM 10 tanpa ongkir. Cocok kalau kamu punya kendaraan sendiri.' },
    { question: 'Apakah area luar Jogja bisa dilayani?', answer: 'Untuk area di luar layanan aktif, termasuk Klaten, Magelang, Solo, dan Gunung Kidul, konfirmasi dulu via WhatsApp sebelum booking.' },
  ],
  cta: {
    title: 'Cari kasur terdekat?',
    description: 'Kami di Godean — bisa antar cepat ke lokasi kamu!',
    waText: 'Halo Santi Living, saya mau sewa kasur. Lokasi saya di [alamat]',
    waSource: 'terdekat_page',
  },
  sections: [
    {
      title: 'Area Terdekat Kos Mahasiswa & Kampus Utama',
      content: `
        <div class="prose max-w-none">
          <p>
            Santi Living menyediakan layanan <strong>sewa kasur terdekat</strong> untuk berbagai wilayah penting di Daerah Istimewa Yogyakarta. Kami memiliki cakupan khusus untuk mengantar pesanan kasur busa harian dan bulanan ke area kos mahasiswa dan pemukiman padat berikut:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div class="p-4 border rounded shadow-sm bg-white">
              <h4 class="font-bold text-lg text-emerald-700">📍 Sleman & Koridor Kampus</h4>
              <p class="text-sm mt-1">
                Melayani area kos mahasiswa padat di <strong>Seturan, Babarsari, Condongcatur, Kaliurang (koridor UII), Gejayan (UNY/Sanata Dharma), Depok Sleman, Ngaglik, Mlati,</strong> dan sekitarnya. Pengiriman cepat langsung dari workshop Godean.
              </p>
            </div>
            <div class="p-4 border rounded shadow-sm bg-white">
              <h4 class="font-bold text-lg text-emerald-700">📍 Bantul & Kota Yogyakarta</h4>
              <p class="text-sm mt-1">
                Layanan antar jemput kasur lipat dan extra bed ke area <strong>Kasihan (dekat UMY), Sewon (dekat ISI), Jetis, Gondokusuman, Umbulharjo, Kotagede,</strong> dan wilayah lainnya tanpa jaminan deposit yang memberatkan.
              </p>
            </div>
          </div>
          <div class="my-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded text-amber-900 text-sm">
            <strong>⚠️ Informasi Wilayah Pengiriman:</strong> Layanan kami mencakup 35 sub-area DIY di Sleman, Bantul, Kota Jogja, dan Kulon Progo/Godean. Mohon maaf, saat ini kami <strong>tidak melayani pengiriman ke Gunung Kidul</strong> demi menjaga efisiensi dan kecepatan armada pengiriman.
          </div>
        </div>
      `
    }
  ],
  en: {
    meta: {
      title: 'Nearest Mattress Rental in Jogja | 2-Hour Delivery',
      description:
        'Looking for the nearest mattress rental in Jogja? Santi Living serves Sleman, Bantul, and Jogja City areas. Fast 2-hour delivery, clean mattresses, starting from Rp25,000/day.',
    },
    hero: {
      title: 'Nearest Mattress Rental in Jogja',
      subtitle: 'Nearest mattress rental service — fast delivery to Sleman, Bantul, and Yogyakarta City areas',
      badge: 'Free delivery within 3 km radius',
    },
    benefits: [
      { icon: '📍', title: 'Strategic Location', description: 'Located in Godean, close to UGM, UNY, UMY, and other campus areas.' },
      { icon: '⚡', title: 'Fast Delivery', description: 'Orders placed before 3:00 PM can be delivered within 2–4 hours. Same day delivery!' },
      { icon: '🆓', title: 'Free Shipping', description: 'FREE delivery for areas within a 3 km radius from our store.' },
      { icon: '🗺️', title: 'Wide Coverage', description: 'Serving active Yogyakarta areas — Sleman, Bantul, Jogja City, Kulonprogo, and surroundings.' },
    ],
    audience: [
      { icon: '🎓', title: 'Students Near Campus', description: 'UGM, UNY, UMY, UTY — your boarding house is close to our location!' },
      { icon: '🏠', title: 'Sleman & Bantul Residents', description: 'Condongcatur, Maguwoharjo, Sewon, Kasihan — all within reach.' },
      { icon: '🏨', title: 'Accommodations in Godean', description: 'Free delivery! Need an extra mattress for guests, contact us.' },
      { icon: '🏢', title: 'Events in Jogja', description: 'Events in the active Yogyakarta service area, we can deliver within hours.' },
    ],
    faqs: [
      { question: 'What is the maximum delivery distance?', answer: 'We serve the active areas of Sleman, Bantul, Jogja City, and Kulonprogo. For areas within a 3 km radius delivery is FREE, 3–8 km Rp15,000, 8–15 km Rp25,000, and over 15 km requires admin confirmation.' },
      { question: 'How long does delivery take after ordering?', answer: 'For orders placed before 3:00 PM WIB, the mattress can be delivered within 2–4 hours on the same day (depending on distance and availability).' },
      { question: 'Can I pick it up directly from the store?', answer: 'Yes! Self-pickup is available at our store on Jl. Godean KM 10 with no delivery fee. Great if you have your own vehicle.' },
      { question: 'Can areas outside Jogja be served?', answer: 'For areas outside the active service zone, including Klaten, Magelang, Solo, and Gunung Kidul, please confirm via WhatsApp before booking.' },
    ],
    cta: {
      title: 'Looking for the nearest mattress?',
      description: 'We\'re in Godean — we can deliver quickly to your location!',
      waText: 'Hello Santi Living, I would like to rent a mattress. My location is at [address]',
      waSource: 'terdekat_page',
    },
    sections: [
      {
        title: 'Nearest Areas for Students & Main Campuses',
        content: `
          <div class="prose max-w-none">
            <p>
              Santi Living provides the <strong>nearest mattress rental</strong> services for various crucial sub-districts in Yogyakarta. We specialize in fast daily and monthly foam mattress deliveries to dense student boarding areas including:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div class="p-4 border rounded shadow-sm bg-white">
                <h4 class="font-bold text-lg text-emerald-700">📍 Sleman & Campus Corridor</h4>
                <p class="text-sm mt-1">
                  Serving student housing areas in <strong>Seturan, Babarsari, Condongcatur, Kaliurang (UII corridor), Gejayan (UNY/Sanata Dharma), Depok Sleman, Ngaglik, Mlati,</strong> and surroundings. Same-day delivery from Godean workshop.
                </p>
              </div>
              <div class="p-4 border rounded shadow-sm bg-white">
                <h4 class="font-bold text-lg text-emerald-700">📍 Bantul & Yogyakarta City</h4>
                <p class="text-sm mt-1">
                  Deliveries of foldable mattresses and extra beds to <strong>Kasihan (near UMY), Sewon (near ISI), Jetis, Gondokusuman, Umbulharjo, Kotagede,</strong> and other locations with no security deposit requirements.
                </p>
              </div>
            </div>
            <div class="my-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded text-amber-900 text-sm">
              <strong>⚠️ Delivery Service Area Note:</strong> We serve 35 active sub-areas in Sleman, Bantul, Jogja City, and Godean/Kulon Progo. Please note we <strong>do not deliver to Gunung Kidul</strong> due to logistical distance limits.
            </div>
          </div>
        `
      }
    ]
  },
};
