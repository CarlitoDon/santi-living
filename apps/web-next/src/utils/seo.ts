import type { Product } from '@/types/product';

export function generateProductSchemaList(products: Product[], startIndex = 1) {
  return products.map((p, i) => ({
    '@type': 'ListItem' as const,
    position: startIndex + i,
    item: {
      '@type': 'Product' as const,
      name: p.name,
      description: p.description,
      image: p.image || 'https://santiliving.com/logo.png',
      brand: { '@type': 'Brand' as const, name: 'Santi Living' },
      offers: {
        '@type': 'Offer' as const,
        price: p.pricePerDay,
        priceCurrency: 'IDR',
        availability: 'https://schema.org/InStock',
        url: 'https://santiliving.com/produk',
        seller: { '@type': 'Organization' as const, name: 'Santi Living' },
      },
    },
  }));
}

export type FAQItemInput = { q: string; a: string } | { question: string; answer: string };

export function generateFAQSchema(faqs: FAQItemInput[]) {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: 'q' in faq ? faq.q : faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: 'a' in faq ? faq.a : faq.answer,
      },
    })),
  };
}
