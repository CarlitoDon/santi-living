import type { LandingPageConfig } from '@/types/landing';

export const sewaAcara: LandingPageConfig = {
  meta: {
    title: 'Sewa Paket Perlengkapan Event Jogja',
    description:
      'Sewa paket perlengkapan event Jogja: kasur rest area, air cooler, TV display, karpet by request, meja/kursi/sound konsultatif via WA.',
  },
  hero: {
    title: 'Sewa Paket Perlengkapan Event Jogja',
    subtitle:
      'Konsultasi satu pintu untuk item inti Santi Living dan kebutuhan acara by-request, dengan estimasi setelah tanggal, durasi, ukuran area, dan lokasi jelas.',
    badge: 'Item inti + by-request, area jauh konfirmasi dulu',
  },
  color: 'indigo',

  benefits: [
    {
      icon: '🛏️',
      title: 'Core: Kasur Rest Area',
      description:
        'Kasur busa, sprei, bantal, dan selimut untuk ruang transit crew, keluarga, panitia, atau VIP room acara.',
    },
    {
      icon: '❄️',
      title: 'Core: Pendingin & Display',
      description:
        'Air cooler/cooling fan dan TV display dikonsultasikan sesuai stok, durasi, akses venue, dan kebutuhan listrik.',
    },
    {
      icon: '🟦',
      title: 'By Request: Alas Event',
      description:
        'Karpet merah, permadani, runner, atau alas sirkulasi diarahkan ke opsi karpet khusus agar ukuran area bisa dihitung admin.',
    },
    {
      icon: '🪑',
      title: 'By Request: Operasional Panitia',
      description:
        'Meja lipat, kursi, backdrop ringan, sound portable, dan lighting sederhana dibantu secara konsultatif, bukan klaim semua selalu tersedia.',
    },
    {
      icon: '🚚',
      title: 'Rute & Setup Sesuai Rundown',
      description:
        'Prioritas Sleman, Kota Yogyakarta, Bantul, dan Kulon Progo; area jauh perlu cek rute, jam bongkar, dan akses kendaraan dulu.',
    },
  ],
  priceCards: [
    {
      name: 'Core Rest Area Crew',
      size: 'Kasur + sprei + bantal/selimut',
      price: 'Estimasi WA',
      daily: 'Setelah tanggal, durasi, jumlah unit, dan lokasi jelas',
      note: 'Untuk VIP room, ruang transit artis, panitia, atau keluarga besar',
      popular: true,
    },
    {
      name: 'Core Cooling & Display',
      size: 'Air cooler/cooling fan + TV display',
      price: 'Cek via WA',
      daily: 'Validasi stok, durasi, kebutuhan listrik, dan akses venue',
      note: 'Untuk booth pameran, ruang tunggu, guide map, atau nobar kecil',
      popular: false,
    },
    {
      name: 'Bundle Panitia Hemat',
      size: 'Kasur rest area + kipas/air cooler + perlengkapan kecil',
      price: 'Konsultasi',
      daily: 'Admin hitungkan setelah rundown dan lokasi dikirim',
      note: 'Cocok untuk makrab, diklat, gathering, dan event kampus',
      popular: false,
    },
    {
      name: 'By Request Karpet & Runner',
      size: 'Karpet merah, permadani, atau alas area',
      price: 'By request',
      daily: 'Butuh ukuran area/foto venue untuk estimasi',
      note: 'Akan diarahkan ke opsi karpet/permadani yang paling sesuai',
      popular: false,
    },
    {
      name: 'By Request Meja & Kursi',
      size: 'Meja lipat, kursi, atau layout operasional',
      price: 'By request',
      daily: 'Ketersediaan dan jumlah unit dikonfirmasi via WA',
      note: 'Untuk area registrasi, konsumsi, crew desk, atau ruang briefing',
      popular: false,
    },
    {
      name: 'By Request Sound & Lighting',
      size: 'Sound portable / spot lighting sederhana',
      price: 'By request',
      daily: 'Bukan paket teknis besar; cek kebutuhan acara dulu',
      note: 'Pendukung acara kecil, bukan klaim produksi panggung penuh',
      popular: false,
    },
  ],
  audience: [
    {
      icon: '🎓',
      title: 'Panitia Kampus & Mahasiswa',
      description:
        'Makrab, diklat, pameran karya, atau outbound yang butuh rest area, pendingin, TV display, dan item operasional secukupnya.',
    },
    {
      icon: '💼',
      title: 'Event Organizer & Vendor Lokal',
      description:
        'EO yang butuh partner rental kasur transit, cooling, display, dan pengadaan tambahan yang batas layanannya jelas.',
    },
    {
      icon: '👰',
      title: 'Wedding Preparation / Hajatan',
      description:
        'Keluarga besar yang menyiapkan ruang istirahat sementara, karpet/alas area tamu, dan kebutuhan panitia di rumah atau homestay.',
    },
    {
      icon: '⛺',
      title: 'Bazar, Komunitas, dan Gathering',
      description:
        'Event semi-outdoor atau indoor kecil yang membutuhkan pendingin portabel, layar display, alas area, dan logistik ringan.',
    },
  ],
  faqs: [
    {
      question: 'Apa saja item inti Santi Living untuk event?',
      answer:
        'Item inti yang paling kuat adalah kasur rest area, sprei, bantal, selimut, air cooler/cooling fan, dan TV display. Jumlah unit tetap harus dicek via WhatsApp sesuai tanggal, durasi, lokasi, dan rute pengantaran.',
    },
    {
      question: 'Apa bedanya item inti dan item by-request?',
      answer:
        'Item inti adalah perlengkapan yang biasa ditangani langsung Santi Living. Item by-request seperti karpet, meja, kursi, backdrop ringan, sound portable, dan lighting sederhana perlu konsultasi lebih awal karena bergantung kebutuhan acara, ukuran area, dan opsi pengadaan yang tersedia.',
    },
    {
      question: 'Apakah bisa dibuat rekomendasi paket untuk acara saya?',
      answer:
        'Bisa. Kirim tanggal, durasi, venue, jumlah orang, ukuran area/foto lokasi, dan item yang dibutuhkan. Admin akan bantu susun rekomendasi paket yang realistis tanpa mengunci harga final sebelum detail acara jelas.',
    },
    {
      question: 'Apakah bisa diantar hari yang sama untuk kebutuhan mendadak?',
      answer:
        'Kami bisa cek slot same day jika pesanan masuk sebelum jam operasional padat dan stok/rute masih memungkinkan. Untuk paket event yang banyak item, sebaiknya konsultasi lebih awal agar pengiriman dan bongkar-muat aman.',
    },
    {
      question: 'Bagaimana dengan pengantaran dan biaya jemput?',
      answer:
        'Workshop resmi kami berada di Jl. Godean KM 10, Sleman, Yogyakarta. Area prioritas mencakup Sleman, Kota Yogyakarta, Bantul, dan Kulon Progo; biaya dan jadwal pengiriman mengikuti jarak, durasi sewa, jumlah barang, serta akses venue.',
    },
    {
      question: 'Apakah Santi Living melayani pengiriman ke Gunungkidul?',
      answer:
        'Mohon maaf, saat ini kami belum melayani area Gunungkidul seperti Wonosari dan Semanu karena pertimbangan jarak tempuh dan keselamatan kurir. Untuk area jauh di luar rute prioritas, silakan konfirmasi dulu via WhatsApp.',
    },
  ],
  cta: {
    title: 'Butuh konsultasi bundle perlengkapan event?',
    description:
      'Kirim rundown, tanggal, durasi, lokasi, jumlah tamu/crew, ukuran area, dan daftar item yang diinginkan. Admin akan bantu pisahkan mana item inti dan mana yang perlu by-request.',
    waText:
      'Halo Santi Living, saya ingin konsultasi paket perlengkapan event. Tanggal acara: ... Lokasi/venue: ... Durasi sewa: ... Jumlah tamu/crew: ... Kebutuhan inti: kasur/air cooler/TV. By-request: karpet/meja/kursi/sound/lighting. Mohon info ketersediaan, rekomendasi paket, estimasi, dan ongkir.',
    waSource: 'acara_santiliving_page',
    secondaryLabel: 'Cek opsi karpet acara',

  },
  sections: [
    {
      title: 'Batas Layanan: Item Inti vs By-Request',
      content: `
        <p><strong>acara.santiliving.com</strong> diposisikan sebagai halaman konsultasi bundle perlengkapan event, bukan klaim semua alat acara selalu tersedia. Tujuannya membantu panitia memilah kebutuhan yang bisa ditangani langsung dan kebutuhan yang perlu dikonfirmasi lebih awal.</p>
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr><th>Kategori</th><th>Contoh item</th><th>Cara estimasi aman</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Item inti</strong></td><td>Kasur rest area, sprei, bantal, selimut, air cooler/cooling fan, TV display</td><td>Cek stok, jumlah unit, durasi, lokasi, dan rute pengantaran via WA.</td></tr>
              <tr><td><strong>By-request</strong></td><td>Karpet merah, permadani, runner, meja lipat, kursi, backdrop ringan, sound portable, lighting sederhana</td><td>Kirim foto/ukuran area dan kebutuhan acara; admin bantu cari opsi realistis.</td></tr>
              <tr><td><strong>Di luar klaim</strong></td><td>Paket produksi panggung besar, vendor sound besar, dekorasi penuh, atau coverage wilayah yang belum dikonfirmasi</td><td>Perlu konfirmasi terpisah; area jauh dan kebutuhan teknis besar tidak dijanjikan otomatis.</td></tr>
            </tbody>
          </table>
        </div>
      `,
    },
    {
      title: 'Use Case Event dan Rekomendasi Paket',
      content: `
        <p>Setiap acara punya pola kebutuhan berbeda. Berikut contoh arah rekomendasi awal sebelum admin menghitung estimasi final.</p>
        <ul>
          <li><strong>Makrab / diklat kampus:</strong> mulai dari kasur rest area panitia, bantal/selimut, cooling fan, dan TV display untuk briefing. Karpet atau meja-kursi diproses by-request jika venue membutuhkan.</li>
          <li><strong>Wedding preparation / hajatan keluarga:</strong> fokus pada kasur transit keluarga, perlengkapan tidur bersih, pendingin ruangan, dan opsi karpet/alas tamu jika area lesehan perlu dibuat rapi.</li>
          <li><strong>Pameran / bazar / booth:</strong> prioritaskan TV display, pendingin booth, meja operasional by-request, dan alas area seperti karpet merah atau runner setelah ukuran booth dikirim.</li>
          <li><strong>Gathering komunitas / nobar kecil:</strong> pilih TV display, cooling fan, alas duduk/karpet by-request, serta kasur rest area jika crew bermalam atau venue dipakai berjam-jam.</li>
        </ul>
        <p><strong>Data yang perlu dikirim ke admin:</strong> tanggal, jam antar-jemput, alamat venue, akses bongkar-muat, jumlah orang, ukuran area, foto lokasi, dan prioritas item yang wajib ada.</p>
      `,
    },
    {
      title: 'Solusi Perlengkapan EO & Event Konsultatif di Yogyakarta',
      content: `
        <p>Menyelenggarakan pameran, wedding preparation, festival komunitas, makrab mahasiswa, atau gathering kantor membutuhkan persiapan logistik yang matang. Kebutuhan yang sering muncul adalah ruang istirahat crew, pendingin portabel, layar display, alas area, dan perlengkapan operasional ringan.</p>
        <p><strong>Santi Living</strong> membantu panitia dan EO di Jogja dengan model konsultasi satu pintu: item inti ditangani sesuai stok dan rute, sedangkan item tambahan diproses sebagai by-request agar tidak ada klaim berlebihan tentang ketersediaan atau harga final.</p>
        <p>Untuk kebutuhan alas event yang lebih spesifik, buka halaman khusus <a href="https://karpet.santiliving.com/sewa-karpet-jogja"><strong>sewa karpet Jogja</strong></a> agar panitia bisa memilih karpet merah, permadani, runner, atau paket karpet acara sebelum chat admin.</p>
        <p>Jika intent-nya sudah jelas, arahkan langsung ke money page yang tepat: <a href="https://karpet.santiliving.com/sewa-karpet-merah-jogja">sewa karpet merah Jogja</a> untuk jalur tamu/seremoni, atau <a href="https://permadani.santiliving.com/sewa-karpet-permadani-jogja">sewa permadani Jogja</a> untuk pengajian, tahlilan, dan area lesehan keluarga.</p>
        <h3>Mengapa EO & Panitia Event Memilih Santi Living?</h3>
        <ul>
          <li><strong>SOP higienitas kasur:</strong> perlengkapan tidur disiapkan bersih, rapi, dan dikirim sesuai standar operasional Santi Living.</li>
          <li><strong>Pemesanan fleksibel:</strong> cocok untuk kebutuhan harian, beberapa hari, atau bulk; estimasi menyesuaikan jumlah unit, durasi, dan rute.</li>
          <li><strong>Armada pengiriman sesuai rute:</strong> tim logistik memprioritaskan Sleman, Kota Yogyakarta, Bantul, dan Kulon Progo. Area jauh tetap perlu konfirmasi dulu.</li>
          <li><strong>Boundary jelas:</strong> halaman ini membedakan item inti dan by-request supaya panitia tidak mengira semua item atau semua wilayah tersedia otomatis.</li>
        </ul>
      `,
    },
  ],
en: {
  meta: {
    title: 'Event Equipment Package Rental Jogja',
    description:
      'Event equipment package rental Jogja: rest area mattresses, air coolers, display TVs, carpet by request, tables/chairs/sound consultative via WA.',
  },
  hero: {
    title: 'Event Equipment Package Rental Jogja',
    subtitle:
      'One-stop consultation for Santi Living core items and by-request event needs, with estimates provided after date, duration, area size, and location are confirmed.',
    badge: 'Core items + by-request, distant areas confirm first',
  },
  benefits: [
    {
      icon: '🛏️',
      title: 'Core: Rest Area Mattress',
      description:
        'Foam mattress, bed sheet, pillow, and blanket for crew transit rooms, family, committee, or VIP room at events.',
    },
    {
      icon: '❄️',
      title: 'Core: Cooling & Display',
      description:
        'Air cooler/cooling fan and display TV consulted based on stock, duration, venue access, and power requirements.',
    },
    {
      icon: '🟦',
      title: 'By Request: Event Flooring',
      description:
        'Red carpet, rug, runner, or circulation flooring directed to the dedicated carpet option so the admin can calculate the area size.',
    },
    {
      icon: '🪑',
      title: 'By Request: Committee Operations',
      description:
        'Folding tables, chairs, lightweight backdrop, portable sound, and simple lighting assisted consultatively — not a claim that all items are always available.',
    },
    {
      icon: '🚚',
      title: 'Route & Setup According to Rundown',
      description:
        'Priority areas: Sleman, Yogyakarta City, Bantul, and Kulon Progo; distant areas require route, unloading time, and vehicle access confirmation first.',
    },
  ],
  priceCards: [
    {
      name: 'Core Rest Area Crew',
      size: 'Mattress + bed sheet + pillow/blanket',
      price: 'WA Estimate',
      daily: 'After date, duration, number of units, and location are confirmed',
      note: 'For VIP rooms, artist transit rooms, committee, or large families',
      popular: true,
    },
    {
      name: 'Core Cooling & Display',
      size: 'Air cooler/cooling fan + display TV',
      price: 'Check via WA',
      daily: 'Validate stock, duration, power requirements, and venue access',
      note: 'For exhibition booths, waiting rooms, guide maps, or small screenings',
      popular: false,
    },
    {
      name: 'Budget Committee Bundle',
      size: 'Rest area mattress + fan/air cooler + small equipment',
      price: 'Consultation',
      daily: 'Admin calculates after rundown and location are submitted',
      note: 'Suitable for orientation camps, training, gatherings, and campus events',
      popular: false,
    },
    {
      name: 'By Request Carpet & Runner',
      size: 'Red carpet, rug, or area flooring',
      price: 'By request',
      daily: 'Area size/venue photo required for estimate',
      note: 'Will be directed to the most suitable carpet/rug option',
      popular: false,
    },
    {
      name: 'By Request Tables & Chairs',
      size: 'Folding tables, chairs, or operational layout',
      price: 'By request',
      daily: 'Availability and number of units confirmed via WA',
      note: 'For registration areas, catering, crew desks, or briefing rooms',
      popular: false,
    },
    {
      name: 'By Request Sound & Lighting',
      size: 'Portable sound / simple spot lighting',
      price: 'By request',
      daily: 'Not a large technical package; check event needs first',
      note: 'Support for small events, not a claim of full stage production',
      popular: false,
    },
  ],
  audience: [
    {
      icon: '🎓',
      title: 'Campus Committees & Students',
      description:
        'Orientation camps, training, art exhibitions, or outbound events that need rest areas, cooling, display TVs, and basic operational items.',
    },
    {
      icon: '💼',
      title: 'Event Organizers & Local Vendors',
      description:
        'EOs that need a rental partner for transit mattresses, cooling, display, and additional procurement with clearly defined service boundaries.',
    },
    {
      icon: '👰',
      title: 'Wedding Preparation / Family Celebrations',
      description:
        'Large families preparing temporary rest areas, carpet/flooring for guest areas, and committee needs at home or a homestay.',
    },
    {
      icon: '⛺',
      title: 'Bazaars, Communities, and Gatherings',
      description:
        'Semi-outdoor or small indoor events that need portable cooling, display screens, area flooring, and light logistics.',
    },
  ],
  faqs: [
    {
      question: 'What are the core Santi Living items for events?',
      answer:
        'The strongest core items are rest area mattresses, bed sheets, pillows, blankets, air coolers/cooling fans, and display TVs. Unit quantities must still be checked via WhatsApp based on date, duration, location, and delivery route.',
    },
    {
      question: 'What is the difference between core items and by-request items?',
      answer:
        'Core items are equipment that Santi Living typically handles directly. By-request items such as carpets, tables, chairs, lightweight backdrops, portable sound, and simple lighting require earlier consultation as they depend on event needs, area size, and available procurement options.',
    },
    {
      question: 'Can a package recommendation be made for my event?',
      answer:
        'Yes. Send the date, duration, venue, number of people, area size/location photos, and items needed. The admin will help put together a realistic package recommendation without locking in a final price before the event details are clear.',
    },
    {
      question: 'Can same-day delivery be arranged for urgent needs?',
      answer:
        'We can check for same-day slots if the order comes in before peak operational hours and stock/route is still available. For event packages with many items, it is best to consult early to ensure safe delivery and unloading.',
    },
    {
      question: 'What about delivery and pickup fees?',
      answer:
        'Our official workshop is located at Jl. Godean KM 10, Sleman, Yogyakarta. Priority areas include Sleman, Yogyakarta City, Bantul, and Kulon Progo; delivery fees and schedules follow distance, rental duration, quantity of items, and venue access.',
    },
    {
      question: 'Does Santi Living deliver to Gunungkidul?',
      answer:
        'We apologize, but we currently do not serve the Gunungkidul area such as Wonosari and Semanu due to travel distance and courier safety considerations. For distant areas outside the priority route, please confirm first via WhatsApp.',
    },
  ],
  cta: {
    title: 'Need a consultation for an event equipment bundle?',
    description:
      'Send the rundown, date, duration, location, number of guests/crew, area size, and list of desired items. The admin will help separate which are core items and which need to be by-request.',
    waText:
      'Hello Santi Living, I would like to consult about an event equipment package. Event date: ... Location/venue: ... Rental duration: ... Number of guests/crew: ... Core needs: mattress/air cooler/TV. By-request: carpet/tables/chairs/sound/lighting. Please provide availability info, package recommendations, estimates, and delivery costs.',
    waSource: 'acara_santiliving_page',
    secondaryLabel: 'Check event carpet options',
      },
  sections: [
    {
      title: 'Service Boundaries: Core Items vs By-Request',
      content: `
        <p><strong>acara.santiliving.com</strong> is positioned as an event equipment bundle consultation page, not a claim that all event tools are always available. Its purpose is to help committees distinguish between needs that can be handled directly and needs that require earlier confirmation.</p>
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr><th>Category</th><th>Example items</th><th>Safe estimation method</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Core items</strong></td><td>Rest area mattress, bed sheet, pillow, blanket, air cooler/cooling fan, display TV</td><td>Check stock, number of units, duration, location, and delivery route via WA.</td></tr>
              <tr><td><strong>By-request</strong></td><td>Red carpet, rug, runner, folding table, chairs, lightweight backdrop, portable sound, simple lighting</td><td>Send area photos/dimensions and event needs; admin helps find realistic options.</td></tr>
              <tr><td><strong>Outside claims</strong></td><td>Large stage production packages, major sound vendors, full decoration, or coverage of unconfirmed areas</td><td>Requires separate confirmation; distant areas and large technical needs are not automatically promised.</td></tr>
            </tbody>
          </table>
        </div>
      `,
    },
    {
      title: 'Event Use Cases and Package Recommendations',
      content: `
        <p>Every event has a different pattern of needs. Here are examples of initial recommendation directions before the admin calculates the final estimate.</p>
        <ul>
          <li><strong>Orientation camp / campus training:</strong> start with committee rest area mattresses, pillows/blankets, cooling fan, and display TV for briefings. Carpet or tables/chairs are processed by-request if the venue requires them.</li>
          <li><strong>Wedding preparation / family celebration:</strong> focus on family transit mattresses, clean bedding, room cooling, and carpet/guest flooring options if a floor-seating area needs to be tidied up.</li>
          <li><strong>Exhibition / bazaar / booth:</strong> prioritize display TV, booth cooling, operational tables by-request, and area flooring such as red carpet or runner after booth dimensions are submitted.</li>
          <li><strong>Community gathering / small screening:</strong> choose display TV, cooling fan, seating mat/carpet by-request, and rest area mattresses if crew stays overnight or the venue is used for many hours.</li>
        </ul>
        <p><strong>Data to send to admin:</strong> date, delivery/pickup time, venue address, unloading access, number of people, area size, location photos, and priority items that must be present.</p>
      `,
    },
    {
      title: 'Consultative EO & Event Equipment Solutions in Yogyakarta',
      content: `
        <p>Organizing an exhibition, wedding preparation, community festival, student orientation camp, or office gathering requires thorough logistical preparation. Common needs include crew rest areas, portable cooling, display screens, area flooring, and light operational equipment.</p>
        <p><strong>Santi Living</strong> assists committees and EOs in Jogja with a one-stop consultation model: core items are handled according to stock and route, while additional items are processed as by-request to avoid overclaiming availability or final pricing.</p>
        <p>For more specific event flooring needs, visit the dedicated <a href="https://karpet.santiliving.com/sewa-karpet-jogja"><strong>Jogja carpet rental</strong></a> page so committees can choose red carpet, rug, runner, or event carpet packages before chatting with admin.</p>
        <p>If the intent is already clear, go directly to the right money page: <a href="https://karpet.santiliving.com/sewa-karpet-merah-jogja">red carpet rental Jogja</a> for guest walkways/ceremonies, or <a href="https://permadani.santiliving.com/sewa-karpet-permadani-jogja">rug rental Jogja</a> for prayer gatherings, tahlilan, and family floor-seating areas.</p>
        <h3>Why Do EOs & Event Committees Choose Santi Living?</h3>
        <ul>
          <li><strong>Mattress hygiene SOP:</strong> bedding is prepared clean, neat, and delivered according to Santi Living's operational standards.</li>
          <li><strong>Flexible ordering:</strong> suitable for daily, multi-day, or bulk needs; estimates adjust to number of units, duration, and route.</li>
          <li><strong>Route-appropriate delivery fleet:</strong> the logistics team prioritizes Sleman, Yogyakarta City, Bantul, and Kulon Progo. Distant areas still require confirmation first.</li>
          <li><strong>Clear boundaries:</strong> this page distinguishes core items from by-request items so committees do not assume all items or all areas are automatically available.</li>
        </ul>
      `,
    },
  ],
},
};
