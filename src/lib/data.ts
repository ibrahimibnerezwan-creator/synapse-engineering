import { db } from '@/db';
import { products, Product } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { INITIAL_PRODUCTS } from './catalog';

export { INITIAL_PRODUCTS };

export async function getAllProducts(): Promise<Product[]> {
  try {
    const dbProducts = await db.select().from(products).orderBy(products.displayOrder);
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts;
    }
  } catch {
    // Return fallback initial data if database is connecting for the first time
  }
  return INITIAL_PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (result && result.length > 0) {
      return result[0];
    }
  } catch {
    // Fallback search
  }
  const fallback = INITIAL_PRODUCTS.find((p) => p.slug === slug);
  return fallback || null;
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
