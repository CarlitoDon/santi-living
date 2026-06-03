import type { Metadata } from 'next';
import { CartBar } from '@/components/home/CartBar';
import { KarpetCalculatorSection } from '@/components/landing/KarpetCalculatorSection';
import { LandingPage } from '@/components/landing/LandingPage';
import { JsonLd } from '@/components/seo/JsonLd';
import { sewaKarpetJogja } from '@/data/landing-pages/sewa-karpet';
import {
  buildKarpetBreadcrumbSchema,
  buildKarpetFaqSchema,
  buildKarpetMetadata,
  buildKarpetServiceSchema,
} from '@/lib/karpet-seo';

const path = '/sewa-karpet-jogja';

export const metadata: Metadata = buildKarpetMetadata(sewaKarpetJogja, path);

export default function SewaKarpetJogjaPage() {
  return (
    <>
      <JsonLd data={buildKarpetServiceSchema(sewaKarpetJogja, path, 'Sewa karpet Jogja')} />
      <JsonLd data={buildKarpetFaqSchema(sewaKarpetJogja)} />
      <JsonLd
        data={buildKarpetBreadcrumbSchema([
          { name: 'Beranda', path: '/' },
          { name: 'Sewa Karpet Jogja', path },
        ])}
      />
      <LandingPage config={sewaKarpetJogja}>
        <KarpetCalculatorSection />
      </LandingPage>
      <CartBar />
    </>
  );
}
