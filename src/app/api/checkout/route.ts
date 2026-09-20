import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  const { name, phone, address, productId, quantity = 1, productAmount, deliveryZone = 'outside', paymentMethod = 'cod', trxId, website } = body || {};
  if (website) return NextResponse.json({ success: true, message: 'Received' });
  if (typeof name !== 'string' || !name.trim() || typeof address !== 'string' || !address.trim() || typeof phone !== 'string' || !/^\+?\d{7,15}$/.test(phone.replace(/[\s\-()]/g, ''))) {
    return NextResponse.json({ error: 'Enter your name, a valid phone number and delivery address.' }, { status: 400 });
  }
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 20 || !Number.isInteger(Number(productId)) || Number(productId) < 1 || !['dhaka', 'suburb', 'outside'].includes(deliveryZone) || !['cod', 'bkash', 'nagad'].includes(paymentMethod)) {
    return NextResponse.json({ error: 'Check the product, quantity, delivery zone and payment method.' }, { status: 400 });
  }
  if (paymentMethod !== 'cod' && (typeof trxId !== 'string' || !trxId.trim())) {
    return NextResponse.json({ error: 'Enter the transaction ID for your payment.' }, { status: 400 });
  }
  try {
    const [product] = await db.select().from(products).where(eq(products.id, Number(productId))).limit(1);
    if (!product || !product.price || product.price <= 0) return NextResponse.json({ error: 'This product needs a quotation. Please contact the supply desk.' }, { status: 400 });
    const amount = product.price * qty;
    // Never trust a price submitted by the browser. Ask the customer to review a changed price.
    if (Number(productAmount) !== amount) return NextResponse.json({ error: 'The product price has changed. Refresh the page and review the total before ordering.' }, { status: 409 });
    const deliveryCharge = deliveryZone === 'dhaka' ? 70 : deliveryZone === 'suburb' ? 100 : 130;
    const invoice = `SYN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    await db.insert(orders).values({
      invoice, customerName: name.trim(), phone: phone.replace(/[\s\-()]/g, ''), address: address.trim(),
      productId: product.id, productTitle: product.title, quantity: qty, productAmount: amount,
      deliveryCharge, totalAmount: amount + deliveryCharge, deliveryZone, paymentMethod,
      trxId: paymentMethod === 'cod' ? null : trxId.trim(), status: 'pending', source: 'web', createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true, invoice, totalAmount: amount + deliveryCharge, deliveryCharge });
  } catch {
    return NextResponse.json({ error: 'Your order could not be saved. Please try again or contact us on WhatsApp.' }, { status: 503 });
  }
}
