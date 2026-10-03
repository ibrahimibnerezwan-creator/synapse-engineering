import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { ORDER_STATUSES, validId, validText } from '@/lib/workflow';

export async function GET() {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { return NextResponse.json(await db.select().from(orders).orderBy(desc(orders.id)), { headers: { 'Cache-Control': 'no-store' } }); }
  catch { return NextResponse.json({ error: 'Orders could not be loaded. Please try again.' }, { status: 503 }); }
}
export async function PATCH(req: NextRequest) {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (!validId(body?.id) || (body.status !== undefined && !ORDER_STATUSES.includes(body.status)) || (body.trackingCode !== undefined && !validText(body.trackingCode, 120)) || (body.note !== undefined && !validText(body.note))) return NextResponse.json({ error: 'Check the order ID, status and tracking details.' }, { status: 400 });
  const update: { status?: string; trackingCode?: string; note?: string } = {};
  if (body.status !== undefined) update.status = body.status;
  if (body.trackingCode !== undefined) update.trackingCode = body.trackingCode.trim();
  if (body.note !== undefined) update.note = body.note.trim();
  if (!Object.keys(update).length) return NextResponse.json({ error: 'No changes supplied.' }, { status: 400 });
  try {
    const [order] = await db.update(orders).set(update).where(eq(orders.id, Number(body.id))).returning();
    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    return NextResponse.json({ success: true, order });
  } catch { return NextResponse.json({ error: 'This order could not be updated. Please try again.' }, { status: 503 }); }
}
export async function DELETE(req: NextRequest) {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = req.nextUrl.searchParams.get('id');
  if (!validId(id)) return NextResponse.json({ error: 'Valid order ID required.' }, { status: 400 });
  try {
    const deleted = await db.delete(orders).where(eq(orders.id, Number(id))).returning({ id: orders.id });
    if (!deleted.length) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'This order could not be deleted.' }, { status: 503 }); }
}
