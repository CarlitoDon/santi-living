import type { Metadata } from 'next';
import {
  KarpetCalculatorSection,
  KarpetCartBar,
} from '@/components/landing/KarpetCalculatorSection';
import { LandingPage } from '@/components/landing/LandingPage';
import { JsonLd } from '@/components/seo/JsonLd';
import { sewaKarpetPermadani } from '@/data/landing-pages/sewa-karpet';
import {
  buildKarpetBreadcrumbSchema,
  buildKarpetFaqSchema,
  buildKarpetMetadata,
  buildKarpetServiceSchema,
} from '@/lib/karpet-seo';

const path = '/sewa-karpet-permadani-jogja';

export const metadata: Metadata = buildKarpetMetadata(sewaKarpetPermadani, path);

export default function SewaKarpetPermadaniJogjaPage() {
  return (
    <>
      <JsonLd
        data={buildKarpetServiceSchema(
          sewaKarpetPermadani,
          path,
          'Sewa karpet permadani Jogja',
        )}
      />
      <JsonLd data={buildKarpetFaqSchema(sewaKarpetPermadani)} />
      <JsonLd
        data={buildKarpetBreadcrumbSchema([
          { name: 'Beranda', path: '/' },
          { name: 'Sewa Karpet Jogja', path: '/sewa-karpet-jogja' },
          { name: 'Sewa Karpet Permadani Jogja', path },
        ])}
      />
      <LandingPage config={sewaKarpetPermadani}>
        <KarpetCalculatorSection scope="permadani" />
      </LandingPage>
      <KarpetCartBar />
    </>
  );
}
