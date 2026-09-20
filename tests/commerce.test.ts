import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createClient, type Client } from '@libsql/client';
import { NextRequest } from 'next/server';

let dir: string;
let client: Client;
let checkout: typeof import('../src/app/api/checkout/route').POST;
let rfq: typeof import('../src/app/api/rfq/route').POST;
const originalFetch = globalThis.fetch;
const originalURL = process.env.TURSO_DATABASE_URL;
const originalToken = process.env.TURSO_AUTH_TOKEN;
const order = { name: 'QA fixture', phone: '01700000000', address: 'Test address', productId: 1, productTitle: 'Untrusted title', quantity: 2, productAmount: 8400, deliveryZone: 'dhaka', paymentMethod: 'cod' };
const quote = { contactName: 'QA fixture', phone: '01700000000', productTitle: 'PLC module', quantity: 3 };
const request = (path: string, body: unknown) => new NextRequest(`https://storefront.invalid${path}`, { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } });

before(async () => {
  dir = await mkdtemp(join(tmpdir(), 'synapse-commerce-'));
  process.env.TURSO_DATABASE_URL = `file:${join(dir, 'test.db')}`;
  delete process.env.TURSO_AUTH_TOKEN;
  client = createClient({ url: process.env.TURSO_DATABASE_URL });
  for (const file of ['0000_safe_the_liberteens.sql', '0001_great_chronomancer.sql']) {
    const sql = await readFile(new URL(`../drizzle/${file}`, import.meta.url), 'utf8');
    for (const statement of sql.split('--> statement-breakpoint')) {
      if (statement.trim()) await client.execute(statement);
    }
  }
  await client.execute({ sql: 'INSERT INTO products (id, slug, title, brand, category, description, primary_image, price, created_at) VALUES (1, ?, ?, ?, ?, ?, ?, 4200, ?)', args: ['qa-product', 'Trusted charger', 'Test brand', 'Consumer Tech & Gadgets', 'Fixture only', '/hero/home-gan.jpg', new Date().toISOString()] });
  globalThis.fetch = async () => new Response('{}', { status: 200 });
  checkout = (await import('../src/app/api/checkout/route')).POST;
  rfq = (await import('../src/app/api/rfq/route')).POST;
});
after(async () => {
  globalThis.fetch = originalFetch;
  if (originalURL === undefined) delete process.env.TURSO_DATABASE_URL; else process.env.TURSO_DATABASE_URL = originalURL;
  if (originalToken === undefined) delete process.env.TURSO_AUTH_TOKEN; else process.env.TURSO_AUTH_TOKEN = originalToken;
  client?.close();
  if (dir) await rm(dir, { recursive: true, force: true });
});

test('COD persists server product identity, quantity, delivery and total', async () => {
  const response = await checkout(request('/api/checkout', order));
  assert.equal(response.status, 200);
  const receipt = await response.json();
  assert.equal(receipt.totalAmount, 8470);
  const result = await client.execute({ sql: 'SELECT * FROM orders WHERE invoice = ?', args: [receipt.invoice] });
  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0].product_title, 'Trusted charger');
  assert.equal(result.rows[0].quantity, 2);
  assert.equal(result.rows[0].total_amount, 8470);
});
test('Forged browser price is rejected before any order is saved', async () => {
  const response = await checkout(request('/api/checkout', { ...order, productAmount: 1 }));
  assert.equal(response.status, 409);
  assert.equal((await client.execute('SELECT COUNT(*) AS count FROM orders')).rows[0].count, 1);
});
test('bKash and Nagad require transaction IDs and preserve delivery rates', async () => {
  for (const paymentMethod of ['bkash', 'nagad']) {
    assert.equal((await checkout(request('/api/checkout', { ...order, paymentMethod }))).status, 400);
    const response = await checkout(request('/api/checkout', { ...order, paymentMethod, trxId: 'QA-TRANSACTION', deliveryZone: 'outside' }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).totalAmount, 8530);
  }
  const response = await checkout(request('/api/checkout', { ...order, deliveryZone: 'suburb' }));
  assert.equal((await response.json()).totalAmount, 8500);
});
test('Invalid quantities, payment methods and products cannot create orders', async () => {
  for (const change of [{ quantity: -1 }, { quantity: 1.5 }, { quantity: 21 }, { paymentMethod: 'unknown' }, { productId: 999 }, { deliveryZone: 'unknown' }]) {
    assert.equal((await checkout(request('/api/checkout', { ...order, ...change }))).status, 400);
  }
});
test('RFQ receipt corresponds to a saved request and ignores a forged receipt number', async () => {
  const response = await rfq(request('/api/rfq', { ...quote, rfqNumber: 'FORGED' }));
  assert.equal(response.status, 200);
  const receipt = await response.json();
  assert.notEqual(receipt.rfqNumber, 'FORGED');
  const saved = await client.execute({ sql: 'SELECT * FROM rfqs WHERE rfq_number = ?', args: [receipt.rfqNumber] });
  assert.equal(saved.rows.length, 1);
  assert.equal(saved.rows[0].quantity, 3);
});
test('Invalid quote requests do not report success', async () => {
  for (const change of [{ contactName: ' ' }, { phone: 'invalid' }, { quantity: 0 }, { productTitle: '' }]) {
    assert.equal((await rfq(request('/api/rfq', { ...quote, ...change }))).status, 400);
  }
});
test('Database write failures produce an actionable error, never a receipt or SQL leak', async () => {
  await client.execute('DROP TABLE rfqs');
  await client.execute('DROP TABLE orders');
  for (const response of [await rfq(request('/api/rfq', quote)), await checkout(request('/api/checkout', order))]) {
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.success, undefined);
    assert.ok(body.error.includes('could not be saved'));
    assert.ok(!/insert into|test address|01700000000/i.test(body.error));
  }
});
