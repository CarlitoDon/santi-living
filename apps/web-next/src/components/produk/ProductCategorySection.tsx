'use client';

import type { Product } from '@/types/product';
import { ProductCard } from '@/components/produk/ProductCard';

type ProductCategory = NonNullable<Product['category']>;

type ProductCategorySectionProps = {
  title: string;
  description: string;
  items: Product[];
  category: ProductCategory;
  onSelect: (product: Product) => void;
  className?: string;
};

/** Reusable product grid section shared by each catalog category. */
export function ProductCategorySection({
  title,
  description,
  items,
  category,
  onSelect,
  className,
}: ProductCategorySectionProps) {
  const headingId = `product-category-${category}`;

  return (
    <section className={className} aria-labelledby={headingId}>
      <h2 id={headingId} className="text-2xl mb-1 text-slate-900 font-bold" data-reveal="up">
        {title}
      </h2>
      <p className="text-base text-slate-500 mb-6 pb-4 border-b border-slate-200" data-reveal="fade">
        {description}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item, index) => {
          const product = { ...item, category };

          return (
            <div key={product.id} data-reveal="up" data-reveal-delay={String((index % 4) * 40)}>
              <ProductCard product={product} onClick={() => onSelect(product)} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
