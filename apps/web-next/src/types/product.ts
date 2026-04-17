import { z } from 'zod';

// ─── Product Schema ──────────────────────────────────────────────────────────

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  description: z.string(),
  pricePerDay: z.number(),
  costPrice: z.number(),
  dimensions: z.string().optional(),
  capacity: z.string().optional(),
  image: z.string(),
  includes: z.array(z.string()),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductCatalogSchema = z.object({
  mattressPackages: z.array(ProductSchema),
  mattressOnly: z.array(ProductSchema),
  accessories: z.array(ProductSchema),
});

export type ProductCatalog = z.infer<typeof ProductCatalogSchema>;
