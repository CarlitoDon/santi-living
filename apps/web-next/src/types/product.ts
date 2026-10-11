import { z } from 'zod';

// ─── Product Schema ──────────────────────────────────────────────────────────

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  name_en: z.string().optional(),
  shortName: z.string(),
  description: z.string(),
  description_en: z.string().optional(),
  pricePerDay: z.number(),
  costPrice: z.number(),
  dimensions: z.string().optional(),
  capacity: z.string().optional(),
  capacity_en: z.string().optional(),
  image: z.string(),
  includes: z.array(z.string()),
  category: z.enum(['package', 'mattress', 'accessory']),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductCatalogSchema = z.object({
  mattressPackages: z.array(ProductSchema),
  mattressOnly: z.array(ProductSchema),
  accessories: z.array(ProductSchema),
});

export type ProductCatalog = z.infer<typeof ProductCatalogSchema>;

export interface CartItem {
  id: string;
  name: string;
  category: 'package' | 'mattress' | 'accessory';
  quantity: number;
  pricePerDay: number;
  includes?: string[];
}
