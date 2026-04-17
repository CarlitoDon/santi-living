'use client';

import { Calculator } from '@/components/calculator';
import { products } from '@/data/products';
import type { Product } from '@/components/calculator/types';

// Map product catalog to Calculator format
const productsData: {
  mattressPackages: Product[];
  mattressOnly: Product[];
  accessories: Product[];
} = {
  mattressPackages: products.mattressPackages.map((p) => ({
    ...p,
    category: 'package' as const,
    image: p.image,
  })),
  mattressOnly: products.mattressOnly.map((p) => ({
    ...p,
    category: 'mattress' as const,
    image: p.image,
  })),
  accessories: products.accessories.map((p) => ({
    ...p,
    category: 'accessory' as const,
    image: p.image,
  })),
};

// Build image maps from product images (using public paths)
const imageMap: Record<string, string> = {};
const imageMapLarge: Record<string, string> = {};

const allProducts = [
  ...products.mattressPackages,
  ...products.mattressOnly,
  ...products.accessories,
];

for (const p of allProducts) {
  // Product images are in /images/ (public directory)
  imageMap[p.id] = p.image;
  imageMapLarge[p.id] = p.image;
}

export function CalculatorSection() {
  return (
    <Calculator
      products={productsData}
      imageMap={imageMap}
      imageMapLarge={imageMapLarge}
    />
  );
}
