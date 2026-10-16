import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { config } from '@/data/config';
import { localizedSiteUrl, primarySiteUrl, PRIMARY_SITE_URL } from '@/lib/site-url';
import { JsonLd } from '@/components/seo/JsonLd';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';

type Locale = 'id' | 'en';

const CHAIR_PAGE_PATH = '/sewa-kursi-acara';
const CHAIR_HERO_IMAGE = '/images/kursi-acara-jogja-katalog.webp';
const CHAIR_PICKUP_IMAGE = '/images/kursi-acara-jogja-pickup.webp';
const CHAIR_PROFILE_NAME = 'Sewa Kursi Acara Jogja - Santi Living | by Santi Mebel Jogja';
const CHAIR_PROFILE_URL = 'https://www.google.com/maps?cid=15162930286234518743';
const CHAIR_WA_TEXT = `Halo Santi Living, saya ingin cek sewa kursi acara Jogja.

Jenis acara:
Jenis kursi:
Jumlah kursi:
Tanggal acara:
Lokasi pengantaran:
Akses venue (lantai/jam bongkar):

Mohon info ketersediaan, ongkir, dan cara sewa.`;

const chairMetadata = {
  id: {
    title: 'Sewa Kursi Acara Jogja (Plastik, Lipat & Hotel) | Mulai 3rb Siap Antar',
    description:
      'Sewa kursi plastik Jogja & kursi acara: kursi plastik kokoh, kursi lipat, dan kursi hotel untuk hajatan, pengajian, dan syukuran. Cek stok dan pengantaran via WhatsApp.',
    keywords: [
      'sewa kursi acara jogja',
      'sewa kursi acara',
      'rental kursi acara jogja',
      'sewa kursi plastik jogja',
      'sewa kursi hajatan jogja',
      'rental kursi plastik jogja',
      'sewa kursi jogja',
      'kursi lipat',
      'kursi hotel',
      'kursi plastik',
    ],
    imageAlt: 'Katalog kursi acara untuk sewa kursi Jogja',
  },
  en: {
    title: 'Event Chair Rental Yogyakarta',
    description:
      'Rent event chairs in Yogyakarta: folding chairs, hotel chairs, and plastic chairs. Send your date, quantity, and delivery location so we can check availability and logistics via WhatsApp.',
    keywords: [
      'event chair rental yogyakarta',
      'event chair rental jogja',
      'folding chair rental yogyakarta',
      'hotel chair rental yogyakarta',
      'plastic chair rental yogyakarta',
    ],
    imageAlt: 'Event chair rental options in Yogyakarta',
  },
} satisfies Record<Locale, { title: string; description: string; keywords: string[]; imageAlt: string }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'id';
  const pageUrl = localizedSiteUrl(CHAIR_PAGE_PATH, locale);
  const metadata = chairMetadata[locale];
  const heroImageUrl = primarySiteUrl(CHAIR_HERO_IMAGE);

  return {
    metadataBase: new URL(PRIMARY_SITE_URL),
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: pageUrl,
      languages: {
        id: localizedSiteUrl(CHAIR_PAGE_PATH, 'id'),
        en: localizedSiteUrl(CHAIR_PAGE_PATH, 'en'),
        'x-default': localizedSiteUrl(CHAIR_PAGE_PATH, 'id'),
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'id_ID',
      url: pageUrl,
      siteName: config.businessName,
      title: metadata.title,
      description: metadata.description,
      images: [{ url: heroImageUrl, width: 1448, height: 1086, alt: metadata.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [heroImageUrl],
    },
    robots: { index: true, follow: true },
  };
}

export default async function SewaKursiAcaraPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'id';
  const isEnglish = locale === 'en';

  const copy = isEnglish
    ? {
        back: 'All rental services',
        eyebrow: 'Event chair rental / Yogyakarta',
        title: 'Event Chair Rental Yogyakarta',
        intro:
          'Looking for event chair rental in Yogyakarta? Choose the chair style that fits your event. Send us the date, quantity, and delivery location so we can check availability and logistics.',
        primaryCta: 'Check availability on WhatsApp',
        phone: '0895-1911-9092',
        catalogEyebrow: 'Chair options',
        catalogTitle: 'Chair options for events in Yogyakarta.',
        catalogIntro: 'The final recommendation follows your event format, quantity, date, and venue access.',
        detailsEyebrow: 'Before you chat',
        detailsTitle: 'Three details help us answer faster.',
        detailsIntro: 'Prepare these details before sending an inquiry:',
        details: ['Event date and time', 'Number of chairs', 'Delivery location and access'],
        detailsCta: 'Send event details',
        trustItems: ['Availability checked by date', 'Delivery logistics confirmed first', 'WhatsApp inquiry without price guesswork'],
        fitEyebrow: 'For your event',
        fitTitle: 'Event Chair Rental Yogyakarta',
        fitItems: [
          { title: 'Meetings and gatherings', description: 'Keep seating flexible for meetings, community gatherings, and family events.' },
          { title: 'Guest and ceremony areas', description: 'Use hotel chairs when the layout needs a tidy guest area and efficient storage.' },
          { title: 'Larger practical layouts', description: 'Ask about plastic chairs when the event needs a simple setup for a larger group.' },
        ],
        processEyebrow: 'How it works',
        processTitle: 'Three steps to get a realistic answer.',
        processSteps: [
          { number: '01', title: 'Send event details', description: 'Tell us the chair type, quantity, event date, and delivery location.' },
          { number: '02', title: 'Check stock and route', description: 'Admin checks the matching stock, delivery route, venue access, and schedule.' },
          { number: '03', title: 'Confirm the booking', description: 'Continue only after the option, estimate, and delivery plan fit your event.' },
        ],
        faqEyebrow: 'Before you order',
        faqTitle: 'Questions about renting chairs in Jogja.',
        faqs: [
          { question: 'What chair types can I ask about?', answer: 'You can ask about plastic chairs, folding chairs, and hotel chairs. The final option depends on the event date, quantity, and stock.' },
          { question: 'How much does chair rental cost in Jogja?', answer: 'Starting from Rp 3,000/unit/day for plastic chairs, Rp 5,000/unit/day for folding chairs, and Rp 7,000/unit/day for hotel chairs. Final prices depend on quantity, date, location, and venue access — confirm via WhatsApp.' },
          { question: 'Does Santi Living deliver to my venue?', answer: 'Send the complete venue address and access information. The team will check the route, unloading time, and delivery feasibility before confirming.' },
          { question: 'How early should I inquire?', answer: 'Earlier is better for larger quantities or fixed event dates. Same-day or short-notice requests still need a stock and route check first.' },
          { question: 'What is the minimum chair rental order?', answer: 'There is no fixed minimum — it depends on stock, date, and delivery route. Send the quantity, event date, and venue address via WhatsApp to 0895-1911-9092 so admin can check the realistic option.' },
          { question: 'Which delivery areas do you cover?', answer: 'We deliver from our workshop area to Sleman, Bantul, Yogyakarta city, and Kulon Progo. Send your full venue address via WhatsApp to 0895-1911-9092 so we can check the route and unloading access.' },
        ],
        priceEyebrow: 'Rental prices',
        priceTitle: 'Event Chair Rental Prices in Yogyakarta',
        priceIntro:
          'The price list below is a starting point so you can estimate the budget before chatting. Plastic chairs start from the lowest rate for large practical layouts, folding chairs sit in the middle for flexible setups, and hotel chairs cost more because the look is tidier for guest areas. The final estimate still follows quantity, event date, delivery location, and venue access, so send those four details for a realistic answer.',
        priceTable: [
          { type: 'Plastic chair', price: 'From Rp 3,000/unit/day', desc: 'Simple seating for large groups, easy to arrange and move.' },
          { type: 'Folding chair', price: 'Rp 5,000/unit/day', desc: 'Practical choice for meetings, gatherings, and flexible layouts.' },
          { type: 'Hotel chair', price: 'Rp 7,000/unit/day', desc: 'Tidier option for guest and ceremony areas.' },
        ],
        priceTips: [
          'Delivery fees are calculated separately based on quantity, route, and unloading access.',
          'Weekend and peak-season dates run out faster — earlier inquiries get more options.',
          'Tell us the floor, stairs, and unloading hours so the delivery plan is realistic.',
        ],
        priceDisclaimer: 'Prices may change — confirm via WhatsApp.',
        packageEyebrow: 'Packages and coverage',
        packageTitle: 'Packages for celebrations, prayers, and meetings',
        packageIntro:
          'Most orders fall into three patterns. Tell us which one is closest to your event so admin can suggest the chair mix and quantity faster.',
        packageItems: [
          { title: 'Family celebrations and syukuran', description: 'For home events with dozens to hundreds of guests. Plastic chairs usually cover the main rows while a few hotel chairs tidy up the guest area.' },
          { title: 'Community prayers and gatherings', description: 'For pengajian, arisan, and neighborhood events. The layout stays simple so unloading and packing run quickly.' },
          { title: 'Meetings and office events', description: 'For trainings and office gatherings. Folding chairs keep the room flexible when the layout changes between sessions.' },
        ],
        coverageText:
          'We deliver from our workshop area near Jl. Godean KM 10, Sleman, to Sleman, Bantul, Yogyakarta city, and Kulon Progo. Send the full venue address and unloading access so we can check the route before confirming.',
        testimonialEyebrow: 'From renters',
        testimonialTitle: 'Notes from chair renters in Jogja.',
        testimonials: [
          { name: 'Bu Ratna — Syukuran, Sleman', text: 'Ordered 100 plastic chairs for a family syukuran. Admin asked for the date and address first, then confirmed the delivery schedule. Unloading was quick.' },
          { name: 'Mas Dimas — Pengajian, Bantul', text: 'Needed extra chairs two days before the event. Stock was checked by date and the route was confirmed before we agreed. Practical.' },
          { name: 'Mbak Sari — Meeting, Yogyakarta city', text: 'Used folding chairs for a two-day training. The layout was easy to rearrange between sessions. Communication over WhatsApp was clear.' },
        ],
        finalCtaTitle: 'Ready to check chairs for your event?',
        finalCtaText: 'Send the date, quantity, chair preference, and venue. We will help check the most realistic option before you confirm.',
        finalCtaLabel: 'Cek kursi via WhatsApp',
        locationTitle: 'Chair service point in Gamping',
        locationText: 'Pelemgurih, Banyuraden, Kec. Gamping, Sleman, DI Yogyakarta 55293, near Santi Mebel Jogja I Gamping.',
        locationCta: 'Open Google Maps',
        pickupAlt: 'Pickup from Santi Mebel carrying event chairs',
        pickupCaption: 'Pickup and delivery are checked against the date, quantity, route, and venue access.',
        readingEyebrow: 'Read next',
        readingTitle: 'Chair rental guides for your event.',
        readingLinks: [
          { label: 'Plastic chair rental guide for events & celebrations', href: `/${locale}/artikel/sewa-kursi-plastik-jogja-acara-hajatan` },
          { label: 'Chair checklist for tent celebrations & weddings in Sleman', href: `/${locale}/artikel/sewa-kursi-plastik-sleman-tenda-hajatan-pernikahan` },
          { label: 'Chair tips for community prayers & gatherings in Bantul', href: `/${locale}/artikel/sewa-kursi-plastik-bantul-pengajian-syukuran-warga` },
        ],
      }
    : {
        back: 'Semua layanan sewa',
        eyebrow: 'Sewa kursi plastik & acara / Yogyakarta',
        title: 'Sewa Kursi Plastik & Kursi Acara Jogja',
        intro:
          'Butuh sewa kursi plastik Jogja atau kursi acara untuk hajatan, syukuran, dan pertemuan? Pilih jenis kursi yang paling sesuai. Kirim tanggal, jumlah, dan lokasi pengantaran agar kami bisa cek ketersediaan serta logistiknya.',
        primaryCta: 'Cek ketersediaan via WhatsApp',
        phone: '0895-1911-9092',
        catalogEyebrow: 'Pilihan kursi',
        catalogTitle: 'Pilihan kursi untuk acara di Jogja.',
        catalogIntro: 'Rekomendasi akhirnya mengikuti format acara, jumlah, tanggal, dan akses venue.',
        detailsEyebrow: 'Sebelum chat',
        detailsTitle: 'Tiga informasi membantu kami menjawab lebih cepat.',
        detailsIntro: 'Siapkan informasi ini sebelum mengirim pertanyaan:',
        details: ['Tanggal dan jam acara', 'Jumlah kursi yang dibutuhkan', 'Lokasi pengantaran dan akses venue'],
        detailsCta: 'Kirim detail acara',
        trustItems: ['Ketersediaan dicek berdasarkan tanggal', 'Logistik pengantaran dikonfirmasi dulu', 'Konsultasi WhatsApp tanpa tebak harga'],
        fitEyebrow: 'Untuk acara Anda',
        fitTitle: 'Sewa Kursi Jogja',
        fitItems: [
          { title: 'Rapat dan gathering', description: 'Jaga susunan tetap fleksibel untuk rapat, kumpul komunitas, dan acara keluarga.' },
          { title: 'Area tamu dan seremoni', description: 'Kursi hotel membantu area tamu tetap rapi saat layout perlu diubah atau diringkas.' },
          { title: 'Layout praktis jumlah besar', description: 'Kursi plastik bisa dipertimbangkan untuk susunan sederhana dan kelompok yang lebih besar.' },
        ],
        processEyebrow: 'Cara sewa',
        processTitle: 'Tiga langkah untuk mendapat jawaban yang realistis.',
        processSteps: [
          { number: '01', title: 'Kirim detail acara', description: 'Sampaikan jenis kursi, jumlah, tanggal acara, dan lokasi pengantaran.' },
          { number: '02', title: 'Cek stok dan rute', description: 'Admin mengecek stok yang sesuai, rute, akses venue, dan jadwal pengantaran.' },
          { number: '03', title: 'Konfirmasi pesanan', description: 'Lanjutkan setelah pilihan, estimasi, dan rencana pengantaran cocok dengan kebutuhan acara.' },
        ],
        faqEyebrow: 'Sebelum pesan',
        faqTitle: 'Pertanyaan tentang sewa kursi di Jogja.',
        faqs: [
          { question: 'Jenis kursi apa yang bisa ditanyakan?', answer: 'Anda bisa menanyakan kursi plastik, kursi lipat, dan kursi hotel. Pilihan akhirnya mengikuti tanggal acara, jumlah, dan stok yang tersedia.' },
          { question: 'Berapa harga sewa kursi di Jogja?', answer: 'Mulai Rp 3.000/unit/hari untuk kursi plastik, Rp 5.000/unit/hari untuk kursi lipat, dan Rp 7.000/unit/hari untuk kursi hotel. Harga final menyesuaikan jumlah, tanggal, lokasi, dan akses venue — konfirmasi via WhatsApp.' },
          { question: 'Apakah bisa diantar ke venue saya?', answer: 'Kirim alamat venue lengkap beserta informasi aksesnya. Tim akan mengecek rute, waktu bongkar, dan kelayakan pengantaran sebelum konfirmasi.' },
          { question: 'Sebaiknya pesan berapa lama sebelumnya?', answer: 'Semakin awal semakin baik, terutama untuk jumlah besar atau tanggal acara yang sudah tetap. Permintaan mendadak tetap perlu dicek stok dan rutenya terlebih dahulu.' },
          { question: 'Berapa minimal order sewa kursi?', answer: 'Tidak ada minimal order yang kaku — tergantung stok, tanggal, dan rute pengantaran. Kirim jumlah, tanggal acara, dan alamat venue via WhatsApp ke 0895-1911-9092 agar admin bisa cek opsi yang paling realistis.' },
          { question: 'Area mana saja yang dicover untuk antar kursi?', answer: 'Kami mengantar dari area workshop ke Sleman, Bantul, Kota Yogyakarta, dan Kulon Progo. Kirim alamat venue lengkap via WhatsApp ke 0895-1911-9092 agar tim bisa cek rute dan akses bongkar.' },
        ],
        priceEyebrow: 'Harga sewa',
        priceTitle: 'Harga Sewa Kursi di Jogja',
        priceIntro:
          'Daftar harga di bawah ini jadi patokan awal biar Anda bisa kira-kira budget sebelum chat. Kursi plastik mulai dari Rp 3.000/unit/hari, cocok untuk acara dengan tamu banyak yang butuh susunan kursi sederhana dan cepat ditata. Kursi lipat Rp 5.000/unit/hari, enak untuk rapat, gathering, dan acara keluarga karena gampang dipindah dan dilipat lagi setelah acara. Kursi hotel Rp 7.000/unit/hari, tampilannya lebih rapi untuk area tamu, akad, dan seremoni. Harga final tetap mengikuti jumlah kursi, tanggal acara, lokasi pengantaran, dan akses venue seperti lantai, tangga, atau jam bongkar. Karena itu kirim empat info itu di awal agar jawaban admin realistis dan tidak bolak-balik. Kalau tanggal Anda jatuh di akhir pekan atau musim hajatan, kabari lebih awal karena stok untuk jumlah besar biasanya lebih cepat habis. Untuk kebutuhan mendadak, tetap bisa ditanyakan, tapi admin perlu cek stok dan rute dulu sebelum janji. Ongkir dihitung terpisah mengikuti jumlah, rute, dan kemudahan bongkar di venue, jadi alamat lengkap membantu banget biar estimasinya tidak meleset. Patokan ini juga membantu Anda bandingkan opsi: kalau tamu di atas seratus dan budget mepet, kursi plastik biasanya paling aman; kalau acaranya rapat atau training yang layoutnya berubah-ubah, kursi lipat lebih fleksibel; kalau ada area tamu penting yang difoto, sisihkan beberapa kursi hotel untuk barisan depan.',
        priceTable: [
          { type: 'Kursi plastik', price: 'Mulai Rp 3.000/unit/hari', desc: 'Dudukan sederhana untuk tamu banyak, ringan, gampang ditata dan dipindah.' },
          { type: 'Kursi lipat', price: 'Rp 5.000/unit/hari', desc: 'Praktis untuk rapat, gathering, dan acara keluarga, gampang dilipat setelah acara.' },
          { type: 'Kursi hotel', price: 'Rp 7.000/unit/hari', desc: 'Tampilan rapi untuk area tamu dan seremoni, mudah diatur jadi barisan.' },
        ],
        priceTips: [
          'Ongkir dihitung terpisah mengikuti jumlah kursi, rute, dan akses bongkar di venue.',
          'Tanggal akhir pekan dan musim hajatan lebih cepat penuh — kabari lebih awal untuk jumlah besar.',
          'Sampaikan info lantai, tangga, dan jam bongkar agar rencana pengantaran realistis.',
          'Kalau layout belum fix, kirim dulu perkiraan jumlah dan tanggal agar stok bisa dicek.',
          'Untuk acara dua hari atau lebih, sebutkan durasinya di awal agar jadwal ambil ikut diatur.',
        ],
        priceDisclaimer: 'Harga dapat berubah — konfirmasi via WhatsApp.',
        packageEyebrow: 'Paket dan area antar',
        packageTitle: 'Paket hajatan, pengajian, dan acara kantor',
        packageIntro:
          'Kebanyakan pesanan masuk ke tiga pola ini. Ceritakan acara Anda masuk pola yang mana, biar admin cepat bantu pilihkan jenis dan jumlah kursi. Untuk hajatan di rumah atau tenda, biasanya kursi plastik menutup barisan utama, lalu beberapa kursi hotel merapikan area tamu atau keluarga. Untuk pengajian, arisan, dan syukuran warga, susunan dibuat sederhana supaya bongkar dan beres-beres cepat. Untuk rapat dan training kantor, kursi lipat bikin ruangan fleksibel karena gampang digeser antar sesi. Semua paket dicek dulu stoknya berdasarkan tanggal, lalu rutenya dicocokkan dengan jadwal antar yang ada hari itu. Kalau jumlah tamu masih kira-kira, sebutkan rentangnya, misalnya 80 sampai 100 orang, agar admin bisa siapkan opsi cadangan. Sertakan juga apakah kursi dipakai indoor atau outdoor supaya pilihan jenisnya pas sejak awal.',
        packageItems: [
          { title: 'Hajatan dan syukuran keluarga', description: 'Untuk acara di rumah, halaman, atau tenda dengan tamu puluhan sampai ratusan. Kursi plastik menutup barisan utama karena ringan dan cepat ditata, kursi hotel merapikan area tamu. Kirim tanggal, jumlah tamu, dan alamat agar admin bisa hitung kebutuhan dan jadwal antar.' },
          { title: 'Pengajian dan kumpul warga', description: 'Untuk pengajian rutin, arisan, dan syukuran lingkungan. Susunan kursi dibuat sederhana dan rapat supaya jamaah nyaman dan bongkarnya cepat. Cocok untuk masjid, musala, balai warga, dan halaman rumah. Kabari jam mulai dan jam selesai agar jadwal antar dan ambil bisa diatur.' },
          { title: 'Rapat dan acara kantor', description: 'Untuk training, workshop, dan gathering kantor yang layout ruangnya bisa berubah. Kursi lipat gampang dipindah dan dilipat lagi setelah sesi selesai. Kirim jumlah peserta, durasi acara, dan akses gedung termasuk lantai serta jam bongkar.' },
        ],
        coverageText:
          'Kami mengantar dari workshop dekat Jl. Godean KM 10, Sleman, ke Sleman, Bantul, Kota Yogyakarta, dan Kulon Progo. Untuk hajatan di Sleman, pengajian di Bantul, acara di Kota Yogyakarta, sampai kebutuhan di Kulon Progo, kirim alamat venue lengkap plus patokan dan akses bongkarnya. Admin akan cek rute, waktu tempuh, dan jadwal armada hari itu sebelum konfirmasi. Kalau aksesnya gang sempit atau harus naik lantai, ceritakan di awal agar tim datang dengan persiapan yang pas. Cantumkan juga nomor kontak yang bisa dihubungi saat armada tiba supaya serah terima berjalan cepat dan kursi langsung tertata di titik yang Anda mau. Selama acara, simpan kursi di tempat teduh bila memungkinkan agar tetap nyaman dipakai sampai acara selesai.',
        testimonialEyebrow: 'Cerita penyewa',
        testimonialTitle: 'Cerita penyewa kursi di Jogja.',
        testimonials: [
          { name: 'Bu Ratna — syukuran, Sleman', text: 'Sewa 100 kursi plastik untuk syukuran keluarga. Admin tanya tanggal dan alamat dulu, baru kasih jadwal antar yang pasti. Bongkarnya cepat, beresnya juga cepat.' },
          { name: 'Mas Dimas — pengajian, Bantul', text: 'Butuh tambahan kursi dua hari sebelum acara. Stok dicek berdasarkan tanggal, rute dikonfirmasi dulu sebelum kami sepakat. Praktis, tidak digantung.' },
          { name: 'Mbak Sari — rapat, Kota Yogyakarta', text: 'Pakai kursi lipat untuk training dua hari. Layout gampang diubah antar sesi, komunikasi via WhatsApp juga jelas dari awal sampai pengambilan.' },
        ],
        finalCtaTitle: 'Siap cek kursi untuk acara Anda?',
        finalCtaText: 'Kirim tanggal, jumlah, pilihan kursi, dan venue. Kami bantu cek opsi yang paling realistis sebelum Anda konfirmasi.',
        finalCtaLabel: 'Cek kursi via WhatsApp',
        locationTitle: 'Titik layanan kursi di Gamping',
        locationText: 'Pelemgurih, Banyuraden, Kec. Gamping, Sleman, DI Yogyakarta 55293, dekat Santi Mebel Jogja I Gamping.',
        locationCta: 'Buka Google Maps',
        pickupAlt: 'Pickup Santi Mebel sedang mengangkut banyak kursi acara',
        pickupCaption: 'Pengantaran dan pickup dicek berdasarkan tanggal, jumlah, rute, serta akses venue.',
        readingEyebrow: 'Baca juga',
        readingTitle: 'Panduan sewa kursi untuk acara Anda.',
        readingLinks: [
          { label: 'Panduan sewa kursi plastik untuk acara & hajatan', href: `/${locale}/artikel/sewa-kursi-plastik-jogja-acara-hajatan` },
          { label: 'Checklist kursi untuk tenda hajatan & pernikahan di Sleman', href: `/${locale}/artikel/sewa-kursi-plastik-sleman-tenda-hajatan-pernikahan` },
          { label: 'Tips kursi untuk pengajian & syukuran warga di Bantul', href: `/${locale}/artikel/sewa-kursi-plastik-bantul-pengajian-syukuran-warga` },
        ],
      };

  const chairTypes = isEnglish
    ? [
        {
          number: '01',
          title: 'Folding chair',
          price: 'Rp 5,000/unit/day',
          description: 'A practical option for flexible seating, meetings, gatherings, and family events.',
          tone: 'light',
          image: '/images/kursi-lipat-merah.webp',
          imageAlt: 'Folding chair available to check for event rental',
        },
        {
          number: '02',
          title: 'Hotel chair',
          price: 'Rp 7,000/unit/day',
          description: 'A chair suited for guest and ceremony areas, tidy and easy to arrange.',
          tone: 'dark',
          image: '/images/kursi-susun-merah.webp',
          imageAlt: 'Hotel chair available to check for event rental',
        },
        {
          number: '03',
          title: 'Plastic chair',
          price: 'From Rp 3,000/unit/day',
          description: 'A simple, easy-to-arrange option for practical event layouts and larger groups.',
          tone: 'green',
          image: '/images/kursi-plastik-biru.webp',
          imageAlt: 'Plastic chair available to check for event rental',
        },
      ]
    : [
        {
          number: '01',
          title: 'Kursi lipat',
          price: 'Rp 5.000/unit/hari',
          description: 'Pilihan praktis untuk susunan fleksibel, rapat, kumpul keluarga, dan acara sederhana.',
          tone: 'light',
          image: '/images/kursi-lipat-merah.webp',
          imageAlt: 'Kursi lipat untuk ditanyakan dalam sewa kursi acara',
        },
        {
          number: '02',
          title: 'Kursi hotel',
          price: 'Rp 7.000/unit/hari',
          description: 'Kursi untuk area tamu dan seremoni dengan tampilan rapi dan mudah ditata.',
          tone: 'dark',
          image: '/images/kursi-susun-merah.webp',
          imageAlt: 'Kursi hotel untuk ditanyakan dalam sewa kursi acara',
        },
        {
          number: '03',
          title: 'Kursi plastik',
          price: 'Mulai Rp 3.000/unit/hari',
          description: 'Pilihan sederhana dan mudah ditata untuk layout acara yang praktis dan jumlah besar.',
          tone: 'green',
          image: '/images/kursi-plastik-biru.webp',
          imageAlt: 'Kursi plastik untuk ditanyakan dalam sewa kursi acara',
        },
      ];

  const localBusinessSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'LocalBusiness' as const,
    '@id': `${PRIMARY_SITE_URL}#santi-living`,
    name: CHAIR_PROFILE_NAME,
    description: isEnglish
      ? 'Event chair rental in Yogyakarta: folding chairs, hotel chairs, and plastic chairs.'
      : 'Sewa kursi acara di Jogja: kursi lipat, kursi hotel, dan kursi plastik.',
    url: localizedSiteUrl(CHAIR_PAGE_PATH, locale),
    image: [primarySiteUrl(CHAIR_HERO_IMAGE), primarySiteUrl(CHAIR_PICKUP_IMAGE)],
    telephone: `+${config.whatsappNumber}`,
    address: {
      '@type': 'PostalAddress' as const,
      streetAddress: 'Pelemgurih, Banyuraden, Kec. Gamping',
      addressLocality: 'Sleman',
      addressRegion: 'DI Yogyakarta',
      postalCode: '55293',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates' as const,
      latitude: -7.800111,
      longitude: 110.330417,
    },
    sameAs: ['https://www.instagram.com/santi.mebel/', 'https://www.facebook.com/santimebeljogja/'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog' as const,
      name: isEnglish ? 'Event chair rental options' : 'Pilihan sewa kursi acara',
      itemListElement: chairTypes.map((chair) => ({
        '@type': 'Offer' as const,
        itemOffered: {
          '@type': 'Service' as const,
          name: chair.title,
          description: chair.description,
          url: localizedSiteUrl(CHAIR_PAGE_PATH, locale),
        },
      })),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: copy.faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="chair-page site-main-offset">
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema} />

      <section className="chair-hero" aria-labelledby="chair-page-title">
        <div className="container chair-hero-grid">
          <div className="chair-hero-copy">
            <Link href={`/${locale}`} className="chair-back-link">← {copy.back}</Link>
            <p className="chair-eyebrow">{copy.eyebrow}</p>
            <h1 id="chair-page-title">{copy.title}</h1>
            <p className="chair-hero-intro">{copy.intro}</p>
            <WhatsAppLink
              message={CHAIR_WA_TEXT}
              source="chair_lp_hero"
              location="chair_hero"
              data-product-category="kursi"
              data-page-type="landing"
              data-wa-intent="sewa_kursi_acara"
              className="chair-button chair-button-primary"
            >
              {copy.primaryCta} <span aria-hidden="true">↗</span>
            </WhatsAppLink>
            <p className="chair-phone">WhatsApp {copy.phone}</p>
            <ul className="chair-hero-proof" aria-label={isEnglish ? 'Service notes' : 'Catatan layanan'}>
              {copy.trustItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="chair-hero-media">
            <Image
              src={CHAIR_HERO_IMAGE}
              alt={isEnglish ? 'Folding and hotel chairs prepared for an event' : 'Kursi lipat dan kursi hotel yang disiapkan untuk acara'}
              width={1448}
              height={1086}
              priority
              sizes="(max-width: 767px) 92vw, 48vw"
            />
            <span className="chair-media-tag">{isEnglish ? 'Santi Living / event seating' : 'Santi Living / kursi acara'}</span>
          </div>
        </div>
      </section>

      <section className="chair-trust-strip" aria-label={isEnglish ? 'Rental service highlights' : 'Keunggulan layanan sewa'}>
        <div className="container chair-trust-grid">
          {copy.trustItems.map((item, index) => (
            <div className="chair-trust-item" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="chair-catalog" aria-labelledby="chair-catalog-title">
        <div className="container">
          <div className="chair-section-heading">
            <p className="chair-eyebrow">{copy.catalogEyebrow}</p>
            <h2 id="chair-catalog-title">{copy.catalogTitle}</h2>
            <p>{copy.catalogIntro}</p>
          </div>
          <div className="chair-type-grid">
            {chairTypes.map((chair) => (
              <article className={`chair-type-card chair-type-card-${chair.tone}`} key={chair.title}>
                <Image src={chair.image} alt={chair.imageAlt} width={720} height={900} sizes="(max-width: 800px) 92vw, 30vw" />
                <span className="chair-type-number">{chair.number}</span>
                <h3>{chair.title}</h3>
                <p><span className="chair-type-price">{chair.price}</span></p>
                <p>{chair.description}</p>
                <WhatsAppLink
                  message={`${CHAIR_WA_TEXT}${isEnglish ? `\n\nChair type: ${chair.title}` : `\n\nJenis kursi yang ditanyakan: ${chair.title}`}`}
                  source="chair_lp_catalog"
                  location="chair_catalog"
                  data-product-category="kursi"
                  data-page-type="landing"
                  data-wa-intent="sewa_kursi_acara"
                  className="chair-button chair-button-primary chair-type-cta"
                >
                  {isEnglish ? `Ask about ${chair.title}` : `Tanya ${chair.title} via WhatsApp`}
                </WhatsAppLink>
              </article>
            ))}
          </div>
          <p style={{ marginTop: '1.25rem', fontSize: '0.875rem', color: 'rgb(33 26 21 / 72%)' }}>
            {copy.priceDisclaimer}
          </p>
        </div>
      </section>
      <section className="chair-faq" aria-labelledby="chair-price-title">
        <div className="container chair-faq-inner">
          <div className="chair-section-heading">
            <p className="chair-eyebrow">{copy.priceEyebrow}</p>
            <h2 id="chair-price-title">{copy.priceTitle}</h2>
            <p>{copy.priceIntro}</p>
          </div>
          <table className="chair-price-table">
            <thead>
              <tr>
                <th scope="col">{isEnglish ? 'Chair type' : 'Jenis kursi'}</th>
                <th scope="col">{isEnglish ? 'Starting price' : 'Harga mulai'}</th>
                <th scope="col">{isEnglish ? 'Best for' : 'Cocok untuk'}</th>
              </tr>
            </thead>
            <tbody>
              {copy.priceTable.map((row) => (
                <tr key={row.type}>
                  <td><strong>{row.type}</strong></td>
                  <td>{row.price}</td>
                  <td>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'rgb(33 26 21 / 72%)' }}>
            {copy.priceDisclaimer}
          </p>
          <ul className="chair-reading-list">
            {copy.priceTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </section>


      <section className="chair-fit" aria-labelledby="chair-fit-title">
        <div className="container">
          <div className="chair-section-heading">
            <p className="chair-eyebrow">{copy.fitEyebrow}</p>
            <h2 id="chair-fit-title">{copy.fitTitle}</h2>
          </div>
          <div className="chair-fit-grid">
            {copy.fitItems.map((item, index) => (
              <article className="chair-fit-card" key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="chair-process" aria-labelledby="chair-process-title">
        <div className="container">
          <div className="chair-section-heading">
            <p className="chair-eyebrow">{copy.processEyebrow}</p>
            <h2 id="chair-process-title">{copy.processTitle}</h2>
          </div>
          <ol className="chair-process-grid">
            {copy.processSteps.map((step) => (
              <li className="chair-process-card" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="chair-fit" aria-labelledby="chair-package-title">
        <div className="container">
          <div className="chair-section-heading">
            <p className="chair-eyebrow">{copy.packageEyebrow}</p>
            <h2 id="chair-package-title">{copy.packageTitle}</h2>
            <p>{copy.packageIntro}</p>
          </div>
          <div className="chair-fit-grid">
            {copy.packageItems.map((item, index) => (
              <article className="chair-fit-card" key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <p style={{ marginTop: '1.5rem', color: 'rgb(33 26 21 / 78%)' }}>{copy.coverageText}</p>
        </div>
      </section>

      <section className="chair-fit" aria-labelledby="chair-testimonial-title">
        <div className="container">
          <div className="chair-section-heading">
            <p className="chair-eyebrow">{copy.testimonialEyebrow}</p>
            <h2 id="chair-testimonial-title">{copy.testimonialTitle}</h2>
          </div>
          <div className="chair-fit-grid">
            {copy.testimonials.map((item, index) => (
              <article className="chair-fit-card" key={item.name}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.name}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="chair-details" aria-labelledby="chair-details-title">
        <div className="container chair-details-grid">
          <div>
            <p className="chair-eyebrow">{copy.detailsEyebrow}</p>
            <h2 id="chair-details-title">{copy.detailsTitle}</h2>
            <p className="chair-details-intro">{copy.detailsIntro}</p>
            <ol className="chair-detail-list">
              {copy.details.map((detail, index) => (
                <li key={detail}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{detail}</strong>
                </li>
              ))}
            </ol>
            <WhatsAppLink
              message={CHAIR_WA_TEXT}
              source="chair_lp_details"
              location="chair_details"
              data-product-category="kursi"
              data-page-type="landing"
              data-wa-intent="sewa_kursi_acara"
              className="chair-button chair-button-light"
            >
              {copy.detailsCta} <span aria-hidden="true">↗</span>
            </WhatsAppLink>
          </div>

          <figure className="chair-pickup-card">
            <Image
              src={CHAIR_PICKUP_IMAGE}
              alt={copy.pickupAlt}
              width={1448}
              height={1086}
              sizes="(max-width: 767px) 92vw, 42vw"
            />
            <figcaption>{copy.pickupCaption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="chair-faq" aria-labelledby="chair-faq-title">
        <div className="container chair-faq-inner">
          <div className="chair-section-heading">
            <p className="chair-eyebrow">{copy.faqEyebrow}</p>
            <h2 id="chair-faq-title">{copy.faqTitle}</h2>
          </div>
          <div className="chair-faq-list">
            {copy.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="chair-faq" aria-labelledby="chair-reading-title">
        <div className="container">
          <div className="chair-section-heading">
            <p className="chair-eyebrow">{copy.readingEyebrow}</p>
            <h2 id="chair-reading-title">{copy.readingTitle}</h2>
          </div>
          <ul className="chair-reading-list">
            {copy.readingLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="chair-final-cta" aria-labelledby="chair-final-cta-title">
        <div className="container chair-final-cta-inner">
          <div>
            <p className="chair-eyebrow">Santi Living / WhatsApp</p>
            <h2 id="chair-final-cta-title">{copy.finalCtaTitle}</h2>
            <p>{copy.finalCtaText}</p>
          </div>
          <WhatsAppLink
            message={CHAIR_WA_TEXT}
            source="chair_lp_bottom"
            location="chair_bottom"
            data-product-category="kursi"
            data-page-type="landing"
            data-wa-intent="sewa_kursi_acara"
            className="chair-button chair-button-light"
          >
            {copy.finalCtaLabel} <span aria-hidden="true">↗</span>
          </WhatsAppLink>
        </div>
      </section>

      <section className="chair-location" aria-labelledby="chair-location-title">
        <div className="container chair-location-inner">
          <div>
            <p className="chair-eyebrow">Santi Living / Gamping</p>
            <h2 id="chair-location-title">{copy.locationTitle}</h2>
            <p>{copy.locationText}</p>
          </div>
          <a href={CHAIR_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="chair-button chair-button-outline">
            {copy.locationCta} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}
