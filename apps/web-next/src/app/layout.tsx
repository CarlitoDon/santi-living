import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Serif } from 'next/font/google';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  viewportFit: 'cover',
};
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyWhatsApp } from '@/components/layout/StickyWhatsApp';
import { GtagScript } from '@/components/tracking/GtagScript';
import { ClarityScript } from '@/components/tracking/ClarityScript';
import { AlertModal } from '@/components/ui/AlertModal';
import { Providers } from './providers';
import '@/styles/globals.css';
import '@/styles/utilities.css';
import '@/styles/product-picker.css';

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
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
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
      "streetAddress": "Jl. Godean KM 10 Geneng, RT.05/RW.04, Sidoagung, Kec. Godean",
      "addressLocality": "Sleman",
      "addressRegion": "DI Yogyakarta",
      "postalCode": "55264",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -7.7673015,
      "longitude": 110.2938902
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
    <html lang="id" className={`${inter.variable} ${notoSerif.variable}`} suppressHydrationWarning>
      <head>
        <GtagScript />
        <ClarityScript />
        <link rel="preload" href="/images/stok-kasur.webp" as="image" type="image/webp" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Providers>
          <Header />
          <div style={{ flex: 1 }}>
            {children}
          </div>
          <Footer />
        </Providers>
        <StickyWhatsApp />
        <AlertModal />
      </body>
    </html>
  );
}
