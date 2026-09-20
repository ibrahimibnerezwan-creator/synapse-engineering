import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rfqs } from '@/db/schema';

export async function POST(req: NextRequest) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  const { contactName, companyName, phone, email, productTitle, quantity = 1, projectRequirement } = body || {};
  if (typeof contactName !== 'string' || !contactName.trim() || typeof phone !== 'string' || !/^\+?\d{7,15}$/.test(phone.replace(/[\s\-()]/g, '')) || typeof productTitle !== 'string' || !productTitle.trim() || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
    return NextResponse.json({ error: 'Enter your name, a valid phone number, product and quantity.' }, { status: 400 });
  }
  const rfqNumber = `SYN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  try {
    await db.insert(rfqs).values({
      rfqNumber,
      contactName: contactName.trim(),
      companyName: typeof companyName === 'string' ? companyName.trim() : '',
      phone: phone.replace(/[\s\-()]/g, ''),
      email: typeof email === 'string' ? email.trim() : '',
      productTitle: productTitle.trim(),
      quantity: Number(quantity),
      projectRequirement: typeof projectRequirement === 'string' ? projectRequirement.trim() : '',
      status: 'new',
      createdAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Your request could not be saved. Please try again or contact us on WhatsApp.' }, { status: 503 });
  }
  // Persist first. Analytics failures must never turn a saved lead into a failed request.
  void fetch(new URL('/api/fb-events', req.url), {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventName: 'Lead', eventId: `lead-${rfqNumber}`, product: { title: productTitle }, userData: { name: contactName, phone, email } }),
  }).catch(() => {});
  return NextResponse.json({ success: true, rfqNumber });
}
