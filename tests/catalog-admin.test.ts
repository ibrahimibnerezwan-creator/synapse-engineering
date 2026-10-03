import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { AsyncLocalStorage } from 'node:async_hooks';
import { createRequire } from 'node:module';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createClient, type Client } from '@libsql/client';
import { displayProduct, imagePath, isOrderable, parseGallery } from '../src/lib/productMedia';
import type { Product } from '../src/db/schema';

(globalThis as unknown as { AsyncLocalStorage: typeof AsyncLocalStorage }).AsyncLocalStorage = AsyncLocalStorage;
const require = createRequire(import.meta.url);
const { NextRequest } = require('next/server') as typeof import('next/server');
const { workAsyncStorage } = require('next/dist/server/app-render/work-async-storage.external') as typeof import('next/dist/server/app-render/work-async-storage.external');
const { workUnitAsyncStorage } = require('next/dist/server/app-render/work-unit-async-storage.external') as typeof import('next/dist/server/app-render/work-unit-async-storage.external');
const { RequestCookies, ResponseCookies } = require('next/dist/server/web/spec-extension/cookies') as typeof import('next/dist/server/web/spec-extension/cookies');

let dir: string, client: Client, token: string;
let admin: typeof import('../src/app/api/admin/products/route');
let publicCatalog: typeof import('../src/app/api/products/route');
let image: typeof import('../src/app/api/products/[id]/image/route');
let upload: typeof import('../src/app/api/upload/route');
let login: typeof import('../src/app/api/admin/login/route');
let sourcing: typeof import('../src/app/api/sourcing-inquiry/route');
let sourcingAdmin: typeof import('../src/app/api/admin/sourcing/route');
let manual: typeof import('../src/app/api/admin/manual-order/route');
let orderAdmin: typeof import('../src/app/api/admin/orders/route');
let rfqAdmin: typeof import('../src/app/api/admin/rfqs/route');
let data: typeof import('../src/lib/data');
let auth: typeof import('../src/lib/auth');
let created: Product;
const envKeys = ['TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN', 'JWT_SECRET', 'ADMIN_PASSWORD', 'CF_ACCESS_KEY_ID', 'CF_SECRET_ACCESS_KEY', 'CF_ACCOUNT_ID', 'CF_R2_PUBLIC_URL'];
const originalEnv = Object.fromEntries(envKeys.map(key => [key, process.env[key]]));
const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aUGkAAAAASUVORK5CYII=';
const draft = { title: 'Audit charger', titleBn: 'চার্জার', brand: 'Fixture', modelNo: 'QA-CHG', category: 'Consumer Tech & Gadgets', subCategory: 'Charging & Cables', description: 'Isolated fixture', descriptionBn: 'পরীক্ষার পণ্য', price: 500, priceType: 'fixed', primaryImage: png, additionalImages: [png], specs: '{"Voltage":230}', featured: 0, displayOrder: 7, stockStatus: 'In Stock', originCountry: 'China', datasheetUrl: 'https://manual.invalid/charger.pdf' };
const request = (path: string, method = 'GET', body?: unknown) => new NextRequest('https://storefront.invalid' + path, { method, ...(body === undefined ? {} : { body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }) });
const invoke = <T>(action: () => T, adminToken: string | null = token): T => {
  const headers = new Headers(adminToken ? { cookie: 'synapse_admin_token=' + adminToken } : {});
  const readonly = new RequestCookies(headers);
  const mutable = new ResponseCookies(new Headers());
  if (adminToken) mutable.set('synapse_admin_token', adminToken);
  return workAsyncStorage.run({ route: '/api/test' } as never, () => workUnitAsyncStorage.run({ type: 'request', phase: 'action', cookies: readonly, userspaceMutableCookies: mutable } as never, action));
};

before(async () => {
  dir = await mkdtemp(join(tmpdir(), 'synapse-admin-'));
  process.env.TURSO_DATABASE_URL = 'file:' + join(dir, 'fixture.db');
  process.env.JWT_SECRET = 'isolated-test-secret-at-least-32-characters';
  process.env.ADMIN_PASSWORD = 'fixture-seller-password';
  for (const key of ['TURSO_AUTH_TOKEN', 'CF_ACCESS_KEY_ID', 'CF_SECRET_ACCESS_KEY', 'CF_ACCOUNT_ID', 'CF_R2_PUBLIC_URL']) delete process.env[key];
  client = createClient({ url: process.env.TURSO_DATABASE_URL });
  for (const file of ['0000_safe_the_liberteens.sql', '0001_great_chronomancer.sql']) {
    const sql = await readFile(new URL('../drizzle/' + file, import.meta.url), 'utf8');
    for (const statement of sql.split('--> statement-breakpoint')) if (statement.trim()) await client.execute(statement);
  }
  admin = require('../src/app/api/admin/products/route.ts');
  publicCatalog = require('../src/app/api/products/route.ts');
  image = require('../src/app/api/products/[id]/image/route.ts');
  upload = require('../src/app/api/upload/route.ts');
  login = require('../src/app/api/admin/login/route.ts');
  sourcing = require('../src/app/api/sourcing-inquiry/route.ts');
  sourcingAdmin = require('../src/app/api/admin/sourcing/route.ts');
  manual = require('../src/app/api/admin/manual-order/route.ts');
  orderAdmin = require('../src/app/api/admin/orders/route.ts');
  rfqAdmin = require('../src/app/api/admin/rfqs/route.ts');
  data = require('../src/lib/data.ts');
  auth = require('../src/lib/auth.ts');
  token = await auth.signToken();
});
after(async () => {
  for (const key of envKeys) if (originalEnv[key] === undefined) delete process.env[key]; else process.env[key] = originalEnv[key];
  client?.close();
  if (dir) await rm(dir, { recursive: true, force: true });
});

test('An empty database stays empty and missing or deleted seed slugs do not reappear', async () => {
  assert.deepEqual(await data.getAllProducts(), []);
  assert.equal(await data.getProductBySlug('hithium-heroee-16-16kwh-lifepo4-battery-pack'), null);
  assert.deepEqual((await (await publicCatalog.GET()).json()).products, []);
});
test('All seller operations require a valid session', async () => {
  const actions: Array<() => Promise<Response>> = [
    () => admin.GET(), () => admin.POST(request('/api/admin/products', 'POST', draft)),
    () => admin.PATCH(request('/api/admin/products', 'PATCH', { id: 1, ...draft })),
    () => admin.DELETE(request('/api/admin/products?id=1', 'DELETE')),
    () => sourcingAdmin.GET(), () => orderAdmin.GET(), () => rfqAdmin.GET(),
  ];
  for (const action of actions) assert.equal((await invoke(action, null)).status, 401);
  assert.equal((await invoke(() => admin.GET(), 'forged-session')).status, 401);
});
test('Only the configured password logs in; public aliases and missing secrets fail closed', async () => {
  for (const password of ['admin', 'admin2026', 'wrong-password']) assert.equal((await invoke(() => login.POST(request('/api/admin/login', 'POST', { password })), null)).status, 401);
  assert.equal((await invoke(() => login.POST(request('/api/admin/login', 'POST', { password: process.env.ADMIN_PASSWORD })), null)).status, 200);
  const secret = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  assert.equal((await invoke(() => login.POST(request('/api/admin/login', 'POST', { password: process.env.ADMIN_PASSWORD })), null)).status, 503);
  assert.equal(await auth.verifyToken(token), null);
  process.env.JWT_SECRET = secret;
});
test('Publish creates a real row and returns the same complete, lightweight data to seller and public', async () => {
  const response = await invoke(() => admin.POST(request('/api/admin/products', 'POST', draft)));
  assert.equal(response.status, 201);
  created = (await response.json()).product;
  assert.match(created.primaryImage, /^\/api\/products\/\d+\/image\?/);
  assert.equal(created.featured, 0);
  assert.equal(created.displayOrder, 7);
  const seller = (await (await invoke(() => admin.GET())).json()).products;
  const storefront = (await (await publicCatalog.GET()).json()).products;
  assert.deepEqual(seller, storefront);
  assert.equal(storefront.length, 1);
  assert.equal(storefront[0].descriptionBn, draft.descriptionBn);
  assert.deepEqual(JSON.parse(storefront[0].specs), { Voltage: '230' });
  assert.ok(!JSON.stringify(storefront).includes('data:image'));
  const row = (await client.execute({ sql: 'SELECT primary_image FROM products WHERE id=?', args: [created.id] })).rows[0];
  assert.equal(row.primary_image, png);
});
test('Binary image requests reproduce persisted primary and gallery photos', async () => {
  for (const query of ['', '?index=0']) {
    const response = await image.GET(request('/api/products/' + created.id + '/image' + query), { params: Promise.resolve({ id: String(created.id) }) });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'image/png');
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), Buffer.from(png.split(',')[1], 'base64'));
  }
  assert.equal((await image.GET(request('/api/products/999/image'), { params: Promise.resolve({ id: '999' }) })).status, 404);
  assert.equal((await image.GET(request('/api/products/1/image?index=-1'), { params: Promise.resolve({ id: '1' }) })).status, 400);
});
test('Editing keeps product identity, inline photos and all optional fields while changing price and availability', async () => {
  const response = await invoke(() => admin.PATCH(request('/api/admin/products', 'PATCH', { ...created, price: 650, stockStatus: 'Out of Stock' })));
  assert.equal(response.status, 200);
  const updated = (await response.json()).product;
  assert.equal(updated.id, created.id);
  assert.equal(updated.slug, created.slug);
  assert.equal(updated.createdAt, created.createdAt);
  assert.equal(updated.descriptionBn, draft.descriptionBn);
  assert.equal(updated.datasheetUrl, draft.datasheetUrl);
  assert.equal(updated.price, 650);
  assert.equal(isOrderable(updated), false);
  const row = (await client.execute({ sql: 'SELECT primary_image,additional_images FROM products WHERE id=?', args: [created.id] })).rows[0];
  assert.equal(row.primary_image, png);
  assert.deepEqual(JSON.parse(String(row.additional_images)), [png]);
  created = updated;
});
test('Bad specs, prices, category, gallery and unsafe URLs cannot publish a product', async () => {
  for (const change of [{ specs: 'bad-json' }, { specs: '[]' }, { specs: '{"x":{}}' }, { price: -1 }, { price: 1.5 }, { price: 0, priceType: 'fixed' }, { category: 'missing' }, { primaryImage: 'javascript:alert(1)' }, { additionalImages: Array(6).fill(png) }]) {
    assert.equal((await invoke(() => admin.POST(request('/api/admin/products', 'POST', { ...draft, ...change })))).status, 400);
  }
  assert.equal((await data.getAllProducts()).length, 1);
});
test('Large legacy uploads are projected to URLs and remain editable without an image re-upload', async () => {
  const legacyImage = 'data:image/jpeg;base64,' + 'A'.repeat(2_200_000);
  await client.execute({ sql: 'UPDATE products SET primary_image=?, additional_images=? WHERE id=?', args: [legacyImage, JSON.stringify([legacyImage]), created.id] });
  const [lightweight] = await data.getAllProducts();
  assert.ok(JSON.stringify(lightweight).length < 5000);
  const stored = { ...lightweight, primaryImage: legacyImage, additionalImages: JSON.stringify([legacyImage]) };
  assert.deepEqual(lightweight, displayProduct(stored));
  const response = await invoke(() => admin.PATCH(request('/api/admin/products', 'PATCH', { ...lightweight, price: 700 })));
  assert.equal(response.status, 200);
  assert.equal((await client.execute({ sql: 'SELECT length(primary_image) as size FROM products WHERE id=?', args: [created.id] })).rows[0].size, legacyImage.length);
});
test('Broken legacy gallery JSON degrades to an empty gallery without losing the catalogue', async () => {
  await client.execute({ sql: 'UPDATE products SET additional_images=? WHERE id=?', args: ['broken-json', created.id] });
  const [product] = await data.getAllProducts();
  assert.deepEqual(parseGallery(product.additionalImages), []);
});
test('Upload validates photos and preserves a small photo when R2 is unconfigured', async () => {
  const form = new FormData();
  form.append('file', new File([Buffer.from(png.split(',')[1], 'base64')], 'fixture.png', { type: 'image/png' }));
  const response = await invoke(() => upload.POST(new NextRequest('https://storefront.invalid/api/upload', { method: 'POST', body: form })));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).url, png);
  for (const file of [new File(['not-an-image'], 'bad.png', { type: 'image/png' }), new File(['x'], 'bad.svg', { type: 'image/svg+xml' }), new File([Buffer.alloc(800_001)], 'big.jpg', { type: 'image/jpeg' })]) {
    const invalid = new FormData(); invalid.append('file', file);
    assert.ok([400, 413].includes((await invoke(() => upload.POST(new NextRequest('https://storefront.invalid/api/upload', { method: 'POST', body: invalid })))).status));
  }
  process.env.CF_ACCESS_KEY_ID = 'fixture-not-real';
  const partial = new FormData(); partial.append('file', new File([Buffer.from(png.split(',')[1], 'base64')], 'fixture.png', { type: 'image/png' }));
  assert.equal((await invoke(() => upload.POST(new NextRequest('https://storefront.invalid/api/upload', { method: 'POST', body: partial })))).status, 503);
  delete process.env.CF_ACCESS_KEY_ID;
});
test('Sourcing receipts represent saved inquiries, reachable only by the seller', async () => {
  const response = await sourcing.POST(request('/api/sourcing-inquiry', 'POST', { clientName: 'Fixture buyer', phone: '01700000000', itemName: 'Spare module', targetQuantity: 4, specification: '230V' }));
  assert.equal(response.status, 200);
  const receipt = await response.json();
  const items = (await (await invoke(() => sourcingAdmin.GET())).json()).inquiries;
  assert.equal(items[0].inquiryNumber, receipt.inquiryNumber);
  assert.equal(items[0].targetQuantity, 4);
  assert.equal((await invoke(() => sourcingAdmin.PATCH(request('/api/admin/sourcing', 'PATCH', { id: items[0].id, status: 'contacted', adminNotes: 'Fixture follow-up' })))).status, 200);
  assert.equal((await invoke(() => sourcingAdmin.PATCH(request('/api/admin/sourcing', 'PATCH', { id: items[0].id, status: 'unknown' })))).status, 400);
  assert.equal((await sourcing.POST(request('/api/sourcing-inquiry', 'POST', { clientName: '', phone: 'bad', itemName: 'Module' }))).status, 400);
});
test('Manual orders use agreed prices and quantities without inventing courier tracking or confirmed payment', async () => {
  const response = await invoke(() => manual.POST(request('/api/admin/manual-order', 'POST', { name: 'Fixture buyer', phone: '01700000000', address: 'Fixture address', productId: created.id, quantity: 2, amount: 700, deliveryZone: 'dhaka', paymentMethod: 'bkash', trxId: 'FIXTURE-TRX' })));
  assert.equal(response.status, 200);
  const receipt = await response.json();
  assert.equal(receipt.totalAmount, 1470);
  assert.equal(receipt.trackingCode, undefined);
  const orders = await (await invoke(() => orderAdmin.GET())).json();
  assert.equal(orders[0].trackingCode, null);
  assert.equal(orders[0].status, 'pending');
  assert.equal(orders[0].quantity, 2);
  assert.equal((await invoke(() => orderAdmin.PATCH(request('/api/admin/orders', 'PATCH', { id: orders[0].id, status: 'confirmed', trackingCode: 'REAL-FIXTURE-CODE', note: 'Verified fixture' })))).status, 200);
  assert.equal((await invoke(() => orderAdmin.PATCH(request('/api/admin/orders', 'PATCH', { id: orders[0].id, status: 'unknown' })))).status, 400);
  assert.equal((await invoke(() => orderAdmin.PATCH(request('/api/admin/orders', 'PATCH', { id: 999, status: 'confirmed' })))).status, 404);
});
test('Delete works with the client URL and does not resurrect the deleted product', async () => {
  assert.equal((await invoke(() => admin.DELETE(request('/api/admin/products?id=' + created.id, 'DELETE')))).status, 200);
  assert.equal(await data.getProductBySlug(created.slug), null);
  assert.deepEqual(await data.getAllProducts(), []);
  assert.equal((await invoke(() => admin.DELETE(request('/api/admin/products?id=' + created.id, 'DELETE')))).status, 404);
});
test('Photo versions change with replacement data while stored product identity stays stable', () => {
  assert.notEqual(imagePath(1, undefined, png), imagePath(1, undefined, png + 'AAAA'));
});
test('Database failures never produce fake publication, deletion or sourcing receipts', async () => {
  await client.execute('DROP TABLE products');
  await client.execute('DROP TABLE sourcing_inquiries');
  const results = [
    await invoke(() => admin.POST(request('/api/admin/products', 'POST', draft))),
    await invoke(() => admin.DELETE(request('/api/admin/products?id=1', 'DELETE'))),
    await invoke(() => admin.GET()),
    await sourcing.POST(request('/api/sourcing-inquiry', 'POST', { clientName: 'Fixture buyer', phone: '01700000000', itemName: 'Module' })),
  ];
  for (const response of results) {
    assert.equal(response.status, 503);
    const result = await response.json();
    assert.equal(result.success, undefined);
    assert.ok(!/insert into|delete from|01700000000|Fixture buyer/i.test(result.error));
  }
});
