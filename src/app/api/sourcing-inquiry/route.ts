import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sourcingInquiries } from '@/db/schema';
import { cleanPhone, validPhone, validText } from '@/lib/workflow';

export async function POST(req: NextRequest) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  const { clientName, companyName = '', phone, email = '', itemName, specification = '', targetQuantity = 1, targetBudget = '', sampleOrPhotoUrl = '' } = body || {};
  if (!validText(clientName, 120, true) || !validPhone(phone) || !validText(itemName, 300, true) || !validText(companyName, 200) || !validText(email, 254) || !validText(specification, 5000) || !validText(targetBudget, 200) || !validText(sampleOrPhotoUrl, 2048) || !Number.isSafeInteger(Number(targetQuantity)) || Number(targetQuantity) < 1 || Number(targetQuantity) > 1_000_000) return NextResponse.json({ error: 'Enter your name, a valid phone number, the item and a positive whole-number quantity.' }, { status: 400 });
  const inquiryNumber = 'SRC-' + crypto.randomUUID().slice(0, 8).toUpperCase();
  if (sampleOrPhotoUrl && !/^https:\/\//.test(sampleOrPhotoUrl)) return NextResponse.json({ error: 'Use an HTTPS link for the reference photo or product.' }, { status: 400 });
  try {
    await db.insert(sourcingInquiries).values({
      inquiryNumber, clientName: clientName.trim(), companyName: companyName.trim(), phone: cleanPhone(phone),
      email: email.trim(), itemName: itemName.trim(), specification: specification.trim(), targetQuantity: Number(targetQuantity),
      targetBudget: targetBudget.trim(), sampleOrPhotoUrl: sampleOrPhotoUrl.trim(), status: 'reviewing', createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true, inquiryNumber });
  } catch { return NextResponse.json({ error: 'Your sourcing request could not be saved. Please try again or contact us on WhatsApp.' }, { status: 503 }); }
}
