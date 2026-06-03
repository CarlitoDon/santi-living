import type { Metadata } from 'next';
import {
  KarpetCalculatorSection,
  KarpetCartBar,
} from '@/components/landing/KarpetCalculatorSection';
import { LandingPage } from '@/components/landing/LandingPage';
import { JsonLd } from '@/components/seo/JsonLd';
import { sewaKarpetMerah } from '@/data/landing-pages/sewa-karpet';
import {
  buildKarpetBreadcrumbSchema,
  buildKarpetFaqSchema,
  buildKarpetMetadata,
  buildKarpetServiceSchema,
} from '@/lib/karpet-seo';

const path = '/sewa-karpet-merah-jogja';

export const metadata: Metadata = buildKarpetMetadata(sewaKarpetMerah, path);

export default function SewaKarpetMerahJogjaPage() {
  return (
    <>
      <JsonLd data={buildKarpetServiceSchema(sewaKarpetMerah, path, 'Sewa karpet merah Jogja')} />
      <JsonLd data={buildKarpetFaqSchema(sewaKarpetMerah)} />
      <JsonLd
        data={buildKarpetBreadcrumbSchema([
          { name: 'Beranda', path: '/' },
          { name: 'Sewa Karpet Jogja', path: '/sewa-karpet-jogja' },
          { name: 'Sewa Karpet Merah Jogja', path },
        ])}
      />
      <LandingPage config={sewaKarpetMerah}>
        <KarpetCalculatorSection />
      </LandingPage>
      <KarpetCartBar />
    </>
  );
}
