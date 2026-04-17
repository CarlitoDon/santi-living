import { ProductCatalogSchema, type ProductCatalog } from '@/types/product';
import rawProducts from './products.json';

export const products: ProductCatalog = ProductCatalogSchema.parse(rawProducts);
