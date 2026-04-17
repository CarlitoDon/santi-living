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
    default: 'Sewa Kasur Jogja | Antar Jemput Mulai Rp25.000/hari - Santi Living',
    template: '%s | Santi Living',
  },
  description:
    'Sewa kasur busa di Jogja murah mulai Rp25rb/hari. Antar jemput area Sleman, Bantul, Kota Jogja. Kasur bersih hotel-quality. Bisa harian/mingguan/bulanan.',
  keywords: [
    'sewa kasur jogja',
    'rental kasur yogyakarta',
    'sewa kasur murah',
    'sewa kasur bulanan',
    'sewa kasur lipat',
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://santiliving.com',
    siteName: 'Santi Living',
    title: 'Sewa Kasur Jogja | Antar Jemput Mulai Rp25.000/hari',
    description:
      'Sewa kasur busa di Jogja murah mulai Rp25rb/hari. Antar jemput area Sleman, Bantul, Kota Jogja.',
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
  return (
    <html lang="id" className={`${inter.variable} ${notoSerif.variable}`}>
      <head>
        <GtagScript />
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
