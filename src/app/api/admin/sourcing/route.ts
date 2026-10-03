import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sourcingInquiries } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { SOURCING_STATUSES, validId, validText } from '@/lib/workflow';

export async function GET() {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { return NextResponse.json({ inquiries: await db.select().from(sourcingInquiries).orderBy(desc(sourcingInquiries.id)) }, { headers: { 'Cache-Control': 'no-store' } }); }
  catch { return NextResponse.json({ error: 'Sourcing requests could not be loaded. Please try again.' }, { status: 503 }); }
}
export async function PATCH(req: NextRequest) {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (!validId(body?.id) || (body.status !== undefined && !SOURCING_STATUSES.includes(body.status)) || (body.adminNotes !== undefined && !validText(body.adminNotes)) || (body.trackingCode !== undefined && !validText(body.trackingCode, 120))) return NextResponse.json({ error: 'Check the inquiry ID, status and notes.' }, { status: 400 });
  const update: { status?: string; adminNotes?: string; trackingCode?: string } = {};
  if (body.status !== undefined) update.status = body.status;
  if (body.adminNotes !== undefined) update.adminNotes = body.adminNotes.trim();
  if (body.trackingCode !== undefined) update.trackingCode = body.trackingCode.trim();
  if (!Object.keys(update).length) return NextResponse.json({ error: 'No changes supplied.' }, { status: 400 });
  try {
    const [inquiry] = await db.update(sourcingInquiries).set(update).where(eq(sourcingInquiries.id, Number(body.id))).returning();
    if (!inquiry) return NextResponse.json({ error: 'Sourcing request not found.' }, { status: 404 });
    return NextResponse.json({ success: true, inquiry });
  } catch { return NextResponse.json({ error: 'This sourcing request could not be updated.' }, { status: 503 }); }
}
