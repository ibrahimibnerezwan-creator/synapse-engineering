import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { cleanPhone, DELIVERY_CHARGES, PAYMENT_METHODS, validId, validPhone, validText } from '@/lib/workflow';

export async function POST(req: NextRequest) {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  const { name, phone, address, productId, amount, quantity = 1, paymentMethod = 'cod', trxId, deliveryZone = 'outside', note = '' } = body || {};
  if (!validText(name, 120, true) || !validPhone(phone) || !validText(address, 2000, true) || !validText(note)) return NextResponse.json({ error: 'Enter a name, valid phone number and full delivery address.' }, { status: 400 });
  if (!validId(productId) || !Number.isSafeInteger(Number(quantity)) || Number(quantity) < 1 || Number(quantity) > 20 || !Object.hasOwn(DELIVERY_CHARGES, deliveryZone) || !PAYMENT_METHODS.includes(paymentMethod) || (amount !== undefined && (!Number.isSafeInteger(Number(amount)) || Number(amount) <= 0))) return NextResponse.json({ error: 'Check the product, quantity, amount, delivery zone and payment method.' }, { status: 400 });
  if (paymentMethod !== 'cod' && !validText(trxId, 120, true)) return NextResponse.json({ error: 'Enter the payment transaction ID.' }, { status: 400 });
  try {
    const [product] = await db.select({ id: products.id, title: products.title, price: products.price }).from(products).where(eq(products.id, Number(productId))).limit(1);
    if (!product) return NextResponse.json({ error: 'Product not found. Refresh the product list.' }, { status: 404 });
    const productAmount = (amount !== undefined ? Number(amount) : Number(product.price)) * Number(quantity);
    if (!Number.isSafeInteger(productAmount) || productAmount <= 0) return NextResponse.json({ error: 'Enter the agreed positive price for this product.' }, { status: 400 });
    const deliveryCharge = DELIVERY_CHARGES[deliveryZone as keyof typeof DELIVERY_CHARGES];
    const invoice = 'SYN-' + crypto.randomUUID().slice(0, 8).toUpperCase();
    await db.insert(orders).values({
      invoice, customerName: name.trim(), phone: cleanPhone(phone), address: address.trim(),
      productId: product.id, productTitle: product.title, quantity: Number(quantity), productAmount,
      deliveryCharge, totalAmount: productAmount + deliveryCharge, deliveryZone, paymentMethod,
      trxId: paymentMethod === 'cod' ? null : trxId.trim(), status: 'pending', trackingCode: null,
      source: 'quick_order_fb', note: note.trim(), createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true, invoice, totalAmount: productAmount + deliveryCharge });
  } catch { return NextResponse.json({ error: 'The order could not be saved. Please try again.' }, { status: 503 }); }
}
