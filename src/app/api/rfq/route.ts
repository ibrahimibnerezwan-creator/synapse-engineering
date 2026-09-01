import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rfqs } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      rfqNumber,
      contactName,
      companyName,
      phone,
      email,
      productId,
      productTitle,
      quantity,
      projectRequirement
    } = body;

    if (!contactName || !phone) {
      return NextResponse.json({ error: 'Name and phone number are required' }, { status: 400 });
    }

    const newRfqId = rfqNumber || `SYN-${Date.now().toString().slice(-6)}`;

    // 1. Save to Turso DB
    try {
      await db.insert(rfqs).values({
        rfqNumber: newRfqId,
        contactName,
        companyName: companyName || '',
        phone,
        email: email || '',
        productId: productId || null,
        productTitle: productTitle || 'General RFQ',
        quantity: Number(quantity) || 1,
        projectRequirement: projectRequirement || '',
        status: 'new',
        createdAt: new Date().toISOString()
      });
    } catch {
      // Continue even if local DB is not yet migrated
    }

    // 2. Server-side forward to Meta CAPI if configured
    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    try {
      fetch(`${protocol}://${host}/api/fb-events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'Lead',
          eventId: `lead-${newRfqId}`,
          product: { title: productTitle },
          userData: { name: contactName, phone, email }
        })
      }).catch(() => {});
    } catch {}

    return NextResponse.json({ success: true, rfqNumber: newRfqId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
