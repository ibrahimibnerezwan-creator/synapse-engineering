import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/data';
import { SITE_URL } from '@/lib/siteUrl';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  return ['/', '/calculator', '/sourcing', ...products.map(product => '/products/' + product.slug)]
    .map(path => ({ url: new URL(path, SITE_URL).toString() }));
}
