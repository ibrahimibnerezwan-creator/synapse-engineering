import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sourcingInquiries } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, companyName, phone, email, itemName, specification, targetQuantity, targetBudget } = body;

    if (!phone || !itemName) {
      return NextResponse.json({ error: 'Item name and phone number are required' }, { status: 400 });
    }

    const inquiryId = `SRC-${Date.now().toString().slice(-6)}`;

    try {
      await db.insert(sourcingInquiries).values({
        inquiryNumber: inquiryId,
        clientName: clientName || 'Industrial Client',
        companyName: companyName || '',
        phone,
        email: email || '',
        itemName,
        specification: specification || '',
        targetQuantity: Number(targetQuantity) || 1,
        targetBudget: targetBudget || '',
        status: 'reviewing',
        createdAt: new Date().toISOString()
      });
    } catch {}

    return NextResponse.json({ success: true, inquiryNumber: inquiryId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
