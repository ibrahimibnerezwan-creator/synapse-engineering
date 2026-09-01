import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const isAuthed = await isAuthenticatedAdmin();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      name,
      phone,
      address,
      productId,
      amount,
      paymentMethod = 'cod',
      trxId = null,
      deliveryZone = 'outside',
      note = null
    } = await req.json();

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: 'Name, phone, and address are required' },
        { status: 400 }
      );
    }

    let productTitle = 'Manual / Custom Order';
    let productPrice = Number(amount) || 0;

    if (productId) {
      const found = await db.select().from(products).where(eq(products.id, Number(productId))).limit(1);
      if (found.length > 0) {
        productTitle = found[0].title;
        if (!productPrice) {
          productPrice = found[0].price || 0;
        }
      }
    }

    const deliveryCharge = deliveryZone === 'dhaka' ? 70 : deliveryZone === 'suburb' ? 100 : 130;
    const totalAmount = productPrice + deliveryCharge;
    const invoice = `SYN-${Date.now().toString().slice(-6)}`;
    const trackingCode = `ST-${Math.floor(10000000 + Math.random() * 90000000)}`;

    await db.insert(orders).values({
      invoice,
      customerName: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      productId: productId ? Number(productId) : null,
      productTitle,
      quantity: 1,
      productAmount: productPrice,
      deliveryCharge,
      totalAmount,
      deliveryZone,
      paymentMethod,
      trxId: paymentMethod === 'cod' ? null : trxId,
      status: 'confirmed',
      trackingCode,
      source: 'quick_order_fb',
      note: note ? note.trim() : null,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      invoice,
      trackingCode,
      totalAmount
    });
  } catch (error: any) {
    console.error('Manual order save error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save manual order' }, { status: 500 });
  }
}
