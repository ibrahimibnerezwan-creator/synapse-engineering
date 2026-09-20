import type { Product } from '@/db/schema';

export function consumerProducts(products: Product[], group = 'All') {
  return products.filter(product => {
    if (product.category !== 'Consumer Tech & Gadgets') return false;
    const text = `${product.subCategory || ''} ${product.title}`.toLowerCase();
    if (group === 'Power') return text.includes('power');
    if (group === 'Charging') return text.includes('charging') || text.includes('charger');
    if (group === 'Smart Home') return text.includes('smart') || text.includes('zigbee');
    return true;
  });
}

export function searchProducts(products: Product[], query: string, category = 'All Products') {
  const needle = query.toLocaleLowerCase().trim();
  return products.filter(product => (category === 'All Products' || product.category === category) &&
    [product.title, product.titleBn, product.brand, product.modelNo, product.description, product.subCategory]
      .some(value => (value || '').toLocaleLowerCase().includes(needle)));
}
