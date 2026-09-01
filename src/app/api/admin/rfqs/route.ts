import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rfqs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { isAuthenticatedAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const list = await db.select().from(rfqs).orderBy(desc(rfqs.id));
    return NextResponse.json({ rfqs: list });
  } catch {
    return NextResponse.json({ rfqs: [] });
  }
}

export async function PATCH(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status, adminNotes } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    try {
      await db.update(rfqs).set({ status, adminNotes }).where(eq(rfqs.id, Number(id)));
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
