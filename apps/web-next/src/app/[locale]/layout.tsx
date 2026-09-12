import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Serif } from 'next/font/google';
import { notFound } from 'next/navigation';

export const viewport: Viewport = {
  themeColor: '#f4ebdd',
  viewportFit: 'cover',
};
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';
import { StickyWhatsApp } from '@/components/layout/StickyWhatsApp';
import { GtagScript } from '@/components/tracking/GtagScript';
import { ClarityScript } from '@/components/tracking/ClarityScript';
import { AttributionCapture } from '@/components/tracking/AttributionCapture';
import { AlertModal } from '@/components/ui/AlertModal';
import { MotionController } from '@/components/ui/MotionController';
import { Providers } from './providers';
import { getDictionary } from '@/locales/dictionary';
import type { Locale } from '@/locales/dictionary';
import { localizedSiteUrl, primarySiteUrl } from '@/lib/site-url';
import '@/styles/globals.css';
import '@/styles/utilities.css';
import '@/styles/product-picker.css';
import '@/styles/motion.css';
import '@/styles/home.css';
import '@/styles/choice-home.css';
import '@/styles/chair-page.css';

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

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

function isSupportedLocale(locale: string): locale is Locale {
  return locale === 'id' || locale === 'en';
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const canonicalUrl = localizedSiteUrl('', locale);
  return {
    metadataBase: new URL('https://santiliving.com'),
    title: {
      default: dict.seo?.home_title ?? 'Sewa Kasur, Kursi, dan Karpet Jogja | Santi Living',
      template: '%s | Santi Living',
    },
    description:
      dict.seo?.home_desc ??
      'Santi Living melayani konsultasi sewa kasur, kursi acara, dan karpet di Jogja. Pilih kebutuhan, kirim tanggal, jumlah atau ukuran, dan lokasi untuk cek ketersediaan serta pengantaran via WhatsApp.',
    keywords: [
      'sewa kasur jogja',
      'rental kasur yogyakarta',
      'sewa kursi jogja',
      'sewa kursi acara jogja',
      'sewa karpet jogja',
      'sewa karpet permadani jogja',
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
      locale: locale === 'en' ? 'en_US' : 'id_ID',
      url: canonicalUrl,
      siteName: dict.seo?.site_name ?? 'Santi Living',
      title: dict.seo?.og_title ?? 'Sewa Kasur Jogja Terbaik - Antar Jemput Same Day',
      description:
        dict.seo?.og_desc ??
        'Santi Living melayani konsultasi sewa kasur, kursi acara, dan karpet di Jogja. Cek ketersediaan serta pengantaran via WhatsApp.',
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        id: localizedSiteUrl('', 'id'),
        en: localizedSiteUrl('', 'en'),
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: dict.seo?.site_name ?? 'Santi Living',
    url: primarySiteUrl(),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: localizedSiteUrl('/artikel', locale) + '?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Santi Living',
    url: primarySiteUrl(),
    logo: primarySiteUrl('/logo.png'),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-895-1911-9092',
      contactType: 'customer service',
      areaServed: 'ID',
      availableLanguage: locale === 'en' ? 'English' : 'Indonesian',
    },
    sameAs: [
      'https://www.instagram.com/santiliving',
      'https://www.tiktok.com/@santiliving',
    ],
  };


  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoSerif.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <GtagScript />
        <ClarityScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Providers locale={locale as Locale} dictionary={dict}>
          <MotionController />
          <AttributionCapture />
          <ConditionalLayout header={<Header />} footer={<Footer />}>
            {children}
          </ConditionalLayout>
          <StickyWhatsApp />
          <AlertModal />
        </Providers>
      </body>
    </html>
  );
}
