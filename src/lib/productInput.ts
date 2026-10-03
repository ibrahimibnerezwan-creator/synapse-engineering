import type { Product } from '@/db/schema';
import { CATEGORY_ORDER } from './productGroups';
import { isImageProxy, MAX_INLINE_MEDIA_LENGTH, MAX_UPLOAD_BYTES, parseGallery } from './productMedia';

export const STOCK_STATUSES = ['In Stock', 'Available on Request', 'Preorder', 'Out of Stock', 'Discontinued'] as const;

function text(value: unknown, label: string, max: number, required = false) {
  if (value === null || value === undefined) value = '';
  if (typeof value !== 'string') throw new Error(label + ' must be text.');
  const result = value.trim();
  if ((required && !result) || result.length > max) throw new Error('Enter ' + label.toLowerCase() + ' (up to ' + max + ' characters).');
  return result;
}

function safeUrl(source: string, label: string, image = false) {
  if (source.startsWith('blob:')) throw new Error('This is a temporary browser photo link. Upload the photo again before saving.');
  if (image && /^data:image\/(?:jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(source)) {
    if (source.length > Math.ceil(MAX_UPLOAD_BYTES * 4 / 3) + 100) throw new Error('This photo is too large. Select it again to resize it.');
    return source;
  }
  if (source.startsWith('/') && !source.startsWith('//') && !source.startsWith('/api/products/')) return source;
  try {
    const url = new URL(source);
    if (url.protocol === 'https:' && !url.username && !url.password && source.length <= 2048) return source;
  } catch { /* Report the field, never a URL parser exception. */ }
  throw new Error(label + ' must be a valid HTTPS URL' + (image ? ' or an uploaded photo.' : '.'));
}

export function productInput(body: Record<string, unknown>, current?: Product) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Enter valid product details.');
  const title = text(body.title, 'Product title', 300, true).replace(/\s+/g, ' ');
  const brand = text(body.brand, 'Brand', 120, true);
  const category = text(body.category, 'Category', 100, true);
  if (!CATEGORY_ORDER.includes(category as typeof CATEGORY_ORDER[number])) throw new Error('Choose a supported product category.');
  const price = Number(body.price ?? 0);
  const priceType = body.priceType ?? (price > 0 ? 'fixed' : 'quote');
  if (!Number.isSafeInteger(price) || price < 0 || price > 1_000_000_000 || !['fixed', 'quote'].includes(String(priceType)) || (priceType === 'fixed' && price <= 0)) throw new Error('Use a positive whole-taka fixed price, or choose quotation pricing.');
  const stockStatus = text(body.stockStatus ?? 'In Stock', 'Stock status', 60);
  if (!STOCK_STATUSES.includes(stockStatus as typeof STOCK_STATUSES[number])) throw new Error('Choose a supported stock status.');
  const displayOrder = Number(body.displayOrder ?? 0);
  if (!Number.isSafeInteger(displayOrder) || displayOrder < 0 || displayOrder > 100_000) throw new Error('Display order must be a whole number from 0 to 100000.');
  const featured = Number(body.featured ?? 1);
  if (![0, 1].includes(featured)) throw new Error('Featured must be on or off.');
  let specs: unknown = body.specs || '{}';
  if (typeof specs === 'string') {
    try { specs = JSON.parse(specs); } catch { throw new Error('Specifications must contain valid JSON.'); }
  }
  if (!specs || typeof specs !== 'object' || Array.isArray(specs) || Object.entries(specs).some(([key, value]) => !key.trim() || !['string', 'number', 'boolean'].includes(typeof value))) throw new Error('Specifications must be an object with simple names and values.');
  const specsText = JSON.stringify(Object.fromEntries(Object.entries(specs).map(([key, value]) => [key.trim(), String(value)])));
  if (specsText.length > 20_000) throw new Error('Specifications are too long.');
  let primaryImage = text(body.primaryImage, 'Primary image', MAX_INLINE_MEDIA_LENGTH, true);
  if (current && isImageProxy(primaryImage, current.id)) primaryImage = current.primaryImage;
  // Existing large photos remain editable without forcing a destructive re-upload.
  if (!current || primaryImage !== current.primaryImage || !primaryImage.startsWith('data:image/')) safeUrl(primaryImage, 'Primary image', true);
  let gallery: unknown = body.additionalImages ?? [];
  if (typeof gallery === 'string') {
    try { gallery = JSON.parse(gallery || '[]'); } catch { throw new Error('Additional photos must be a valid list.'); }
  }
  if (!Array.isArray(gallery) || gallery.length > 5 || gallery.some(source => typeof source !== 'string')) throw new Error('Use up to five additional photos.');
  const storedGallery = parseGallery(current?.additionalImages);
  const additionalImages: string[] = gallery.map((source: string) => {
    const index = current ? storedGallery.findIndex((_, index) => isImageProxy(source, current.id, index)) : -1;
    if (index >= 0) return storedGallery[index];
    if (storedGallery.includes(source)) return source;
    return safeUrl(source.trim(), 'Additional photo', true);
  });
  const inlineLength = [primaryImage, ...additionalImages].filter(source => source.startsWith('data:')).reduce((sum, source) => sum + source.length, 0);
  const oldInlineLength = current ? [current.primaryImage, ...storedGallery].filter(source => source.startsWith('data:')).reduce((sum, source) => sum + source.length, 0) : 0;
  if (inlineLength > MAX_INLINE_MEDIA_LENGTH && inlineLength > oldInlineLength) throw new Error('These photos are too large together. Remove a photo or select smaller files.');
  const datasheetUrl = text(body.datasheetUrl, 'Datasheet URL', 2048);
  if (datasheetUrl) safeUrl(datasheetUrl, 'Datasheet');
  return {
    title, brand, category, price: priceType === 'quote' ? 0 : price, priceType: String(priceType), stockStatus, displayOrder, featured,
    titleBn: text(body.titleBn, 'Bangla title', 300), modelNo: text(body.modelNo, 'Model / part number', 120),
    subCategory: text(body.subCategory, 'Subcategory', 120), description: text(body.description, 'Description', 10_000, true),
    descriptionBn: text(body.descriptionBn, 'Bangla description', 10_000), specs: specsText,
    primaryImage, additionalImages: JSON.stringify(additionalImages), datasheetUrl,
    originCountry: text(body.originCountry ?? 'China', 'Country of origin', 120),
  };
}
