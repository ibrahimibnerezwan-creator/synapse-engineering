import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rfqs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { RFQ_STATUSES, validId, validText } from '@/lib/workflow';

export const dynamic = 'force-dynamic';
export async function GET() {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { return NextResponse.json({ rfqs: await db.select().from(rfqs).orderBy(desc(rfqs.id)) }, { headers: { 'Cache-Control': 'no-store' } }); }
  catch { return NextResponse.json({ error: 'Could not load quotation requests. Please try again.' }, { status: 503 }); }
}
export async function PATCH(req: NextRequest) {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (!validId(body?.id) || (body.status !== undefined && !RFQ_STATUSES.includes(body.status)) || (body.adminNotes !== undefined && !validText(body.adminNotes))) return NextResponse.json({ error: 'Check the request ID, status and notes.' }, { status: 400 });
  const update: { status?: string; adminNotes?: string } = {};
  if (body.status !== undefined) update.status = body.status;
  if (body.adminNotes !== undefined) update.adminNotes = body.adminNotes.trim();
  if (!Object.keys(update).length) return NextResponse.json({ error: 'No changes supplied.' }, { status: 400 });
  try {
    const [rfq] = await db.update(rfqs).set(update).where(eq(rfqs.id, Number(body.id))).returning();
    if (!rfq) return NextResponse.json({ error: 'Quotation request not found.' }, { status: 404 });
    return NextResponse.json({ success: true, rfq });
  } catch { return NextResponse.json({ error: 'Could not update this quotation request.' }, { status: 503 }); }
}
