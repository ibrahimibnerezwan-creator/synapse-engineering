import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      address,
      productId,
      productTitle,
      quantity = 1,
      productAmount,
      deliveryZone = 'outside',
      paymentMethod = 'cod',
      trxId = null,
      note = null,
      website = '' // honeypot
    } = body;

    // Honeypot bot trap
    if (website) {
      return NextResponse.json({ success: true, message: 'Received' });
    }

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: 'Name, phone, and delivery address are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    const deliveryCharge = deliveryZone === 'dhaka' ? 70 : deliveryZone === 'suburb' ? 100 : 130;
    const qty = Math.max(1, Number(quantity) || 1);
    const amount = Number(productAmount) || 0;
    const total = amount + deliveryCharge;

    const invoice = `SYN-${Date.now().toString().slice(-6)}`;

    await db.insert(orders).values({
      invoice,
      customerName: name.trim(),
      phone: cleanPhone,
      address: address.trim(),
      productId: productId ? Number(productId) : null,
      productTitle: productTitle || 'Custom Hardware / Gadget Order',
      quantity: qty,
      productAmount: amount,
      deliveryCharge,
      totalAmount: total,
      deliveryZone,
      paymentMethod,
      trxId: paymentMethod === 'cod' ? null : trxId,
      status: 'pending',
      source: 'web',
      note: note ? note.trim() : null,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      invoice,
      totalAmount: total,
      deliveryCharge
    });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place order.' },
      { status: 500 }
    );
  }
}
