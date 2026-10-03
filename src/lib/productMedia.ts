import type { Product } from '@/db/schema';

export const MAX_UPLOAD_BYTES = 800_000;
export const MAX_INLINE_MEDIA_LENGTH = 2_500_000;

export function isLegacyMedia(source: string) {
  return source.startsWith('blob:') || /^https:\/\/(?:www\.)?synapse-engneering\.com\/wp-content\//i.test(source);
}

export function productPhoto(product: Pick<Product, 'primaryImage' | 'subCategory' | 'title' | 'category'>, image = product.primaryImage) {
  const illustration = image.includes('images.unsplash.com');
  const category = `${product.subCategory || ''} ${product.title}`.toLowerCase();
  const fallback = category.includes('smart') || category.includes('zigbee') ? '/hero/home-smart.jpg'
    : category.includes('charging') || category.includes('gan') ? '/hero/home-gan.jpg'
    : product.category === 'Consumer Tech & Gadgets' ? '/hero/home-power.jpg'
    : product.category === 'Solar & Power Solutions' ? '/hero/factory-ess.jpg'
    : product.category === 'Global Sourcing & Import' ? '/hero/factory-floor.jpg' : '/hero/factory-panel.jpg';
  return { source: isLegacyMedia(image) ? '' : illustration ? fallback : image, illustration };
}

export function imagePath(id: number, index?: number, source?: string) {
  const version = source ? source.length + '-' + Array.from(source.slice(-128, -112)).map(character => character.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join('') : '';
  const query = [index === undefined ? '' : `index=${index}`, version ? `v=${version}` : ''].filter(Boolean).join('&');
  return `/api/products/${id}/image${query ? '?' + query : ''}`;
}

export function isImageProxy(source: string, id: number, index?: number) {
  try {
    const url = new URL(source, 'https://catalog.invalid');
    return source.startsWith('/') && url.pathname === `/api/products/${id}/image` && url.searchParams.get('index') === (index === undefined ? null : String(index));
  } catch { return false; }
}

export function parseGallery(value: string | null | undefined): string[] {
  try {
    const parsed: unknown = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string' && !!item.trim()) : [];
  } catch { return []; }
}

export function parseSpecs(value: string | null | undefined): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(value || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([, v]) => ['string', 'number', 'boolean'].includes(typeof v)).map(([k, v]) => [k, String(v)]));
  } catch { return {}; }
}

/** Keep stored inline photos out of HTML, RSC and JSON catalogue payloads. */
export function displayProduct(product: Product): Product {
  return {
    ...product,
    primaryImage: product.primaryImage.startsWith('data:') ? imagePath(product.id, undefined, product.primaryImage) : product.primaryImage,
    additionalImages: JSON.stringify(parseGallery(product.additionalImages).map((source, index) => source.startsWith('data:') ? imagePath(product.id, index, source) : source)),
  };
}

export function isOrderable(product: Pick<Product, 'price' | 'priceType' | 'stockStatus'>) {
  return Number(product.price) > 0 && product.priceType !== 'quote' && !/out of stock|unavailable|discontinued/i.test(product.stockStatus || '');
}
