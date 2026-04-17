import type { Metadata } from 'next';
import { Inter, Noto_Serif } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyWhatsApp } from '@/components/layout/StickyWhatsApp';
import { GtagScript } from '@/components/tracking/GtagScript';
import '@/styles/globals.css';
import '@/styles/utilities.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://santiliving.com'),
  title: {
    default: 'Sewa Kasur Jogja Terbaik - Antar Jemput Same Day | Santi Living',
    template: '%s | Santi Living',
  },
  description:
    'Sewa kasur bersih di Jogja mulai Rp25.000/hari. ✅ Antar jemput same day ✅ Gratis ongkir area tertentu ✅ Kasur premium & steril ✅ Order via WhatsApp. Santi Living Yogyakarta.',
  keywords: [
    'sewa kasur jogja',
    'rental kasur yogyakarta',
    'sewa kasur murah',
    'sewa kasur harian',
    'sewa kasur bulanan',
    'sewa kasur lipat',
    'extra bed jogja',
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://santiliving.com',
    siteName: 'Santi Living',
    title: 'Sewa Kasur Jogja Terbaik - Antar Jemput Same Day',
    description:
      'Sewa kasur bersih di Jogja mulai Rp25.000/hari. ✅ Antar jemput same day ✅ Kasur premium & steril.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://santiliving.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Sewa Kasur Jogja – Santi Living",
    "image": "https://santiliving.com/logo.png",
    "@id": "https://santiliving.com",
    "url": "https://santiliving.com",
    "telephone": "+6289519119092",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Godean",
      "addressLocality": "Sleman",
      "addressRegion": "DI Yogyakarta",
      "postalCode": "55264",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -7.7793,
      "longitude": 110.3397
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "21:00"
    }
  };

  return (
    <html lang="id" className={`${inter.variable} ${notoSerif.variable}`}>
      <head>
        <GtagScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <StickyWhatsApp />
      </body>
    </html>
  );
}
