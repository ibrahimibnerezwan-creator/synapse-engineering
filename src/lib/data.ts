import { db } from '@/db';
import { products, Product } from '@/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { INITIAL_PRODUCTS } from './catalog';
import { productSelection } from './productQuery';

export { INITIAL_PRODUCTS };

export async function getAllProducts(): Promise<Product[]> {
  return db.select(productSelection).from(products).orderBy(asc(products.displayOrder), desc(products.id));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const [product] = await db.select(productSelection).from(products).where(eq(products.slug, slug)).limit(1);
  return product || null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.featured === 1);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const all = await getAllProducts();
  if (!category || category === 'All') return all;
  return all.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
}
