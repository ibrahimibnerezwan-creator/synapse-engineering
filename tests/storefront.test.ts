import assert from 'node:assert/strict';
import { test } from 'node:test';
import { consumerProducts, searchProducts } from '../src/lib/storefront';
import { INITIAL_PRODUCTS } from '../src/lib/catalog';

const consumer = INITIAL_PRODUCTS.find(product => product.category === 'Consumer Tech & Gadgets')!;
const pricedIndustrial = { ...consumer, id: 900, category: 'Industrial Automation', title: 'Priced PLC', price: 48000 };

test('Home never includes a priced industrial product', () => {
  assert.deepEqual(consumerProducts([consumer, pricedIndustrial]).map(item => item.id), [consumer.id]);
});
test('Home filters retain only their corresponding consumer group', () => {
  const result = consumerProducts(INITIAL_PRODUCTS, 'Smart Home');
  assert.ok(result.length > 0);
  assert.ok(result.every(item => /smart|zigbee/i.test(`${item.title} ${item.subCategory}`)));
});
test('Search matches model numbers regardless of case and surrounding whitespace', () => {
  const product = INITIAL_PRODUCTS.find(item => item.modelNo?.startsWith('6ES'))!;
  assert.ok(searchProducts(INITIAL_PRODUCTS, '  6es  ').some(item => item.id === product.id));
});
test('Search can match Bangla and keeps category filtering explicit', () => {
  const product = { ...consumer, titleBn: 'পরীক্ষা', category: 'New category' };
  assert.equal(searchProducts([product], 'পরীক্ষা', 'New category').length, 1);
  assert.equal(searchProducts([product], 'পরীক্ষা', 'Industrial Automation').length, 0);
});
test('An empty search returns every category, including new admin categories', () => {
  assert.equal(searchProducts([consumer, { ...pricedIndustrial, category: 'New category' }], '').length, 2);
});
