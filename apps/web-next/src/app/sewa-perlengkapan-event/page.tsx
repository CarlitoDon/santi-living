import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { JsonLd } from '@/components/seo/JsonLd';
import { sewaAcara } from '@/data/landing-pages/sewa-acara';
import {
  buildAcaraBreadcrumbSchema,
  buildAcaraFaqSchema,
  buildAcaraMetadata,
  buildAcaraServiceSchema,
} from '@/lib/acara-seo';

export const metadata: Metadata = buildAcaraMetadata(sewaAcara);

export default function SewaPerlengkapanEventPage() {
  return (
    <>
      <JsonLd data={buildAcaraServiceSchema(sewaAcara)} />
      <JsonLd data={buildAcaraFaqSchema(sewaAcara)} />
      <JsonLd data={buildAcaraBreadcrumbSchema()} />
      <LandingPage config={sewaAcara} />
    </>
  );
}
