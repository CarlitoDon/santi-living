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
  PERMADANI_SITE_URL,
} from '@/lib/karpet-seo';

const path = '/sewa-karpet-permadani-jogja';

export const metadata: Metadata = buildKarpetMetadata(sewaKarpetPermadani, path, PERMADANI_SITE_URL);

export default function SewaKarpetPermadaniJogjaPage() {
  return (
    <>
      <JsonLd
        data={buildKarpetServiceSchema(
          sewaKarpetPermadani,
          path,
          'Sewa karpet permadani Jogja',
          PERMADANI_SITE_URL,
        )}
      />
      <JsonLd data={buildKarpetFaqSchema(sewaKarpetPermadani)} />
      <JsonLd
        data={buildKarpetBreadcrumbSchema([
          { name: 'Beranda Permadani', path: '/' },
          { name: 'Sewa Karpet Permadani Jogja', path },
        ], PERMADANI_SITE_URL)}
      />
      <LandingPage config={sewaKarpetPermadani}>
        <KarpetCalculatorSection scope="permadani" />
      </LandingPage>
      <KarpetCartBar />
    </>
  );
}
