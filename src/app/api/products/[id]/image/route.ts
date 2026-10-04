import { NextRequest, NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { products } from '@/db/schema';
import { publicResponse } from '@/lib/publicResponse';

export const dynamic = 'force-dynamic';

const unavailable = (status: number) => new NextResponse(null, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = req.nextUrl.searchParams.get('index');
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1 || (index !== null && (!/^\d+$/.test(index) || !Number.isSafeInteger(Number(index))))) return unavailable(400);
  try {
    // Fetch just the requested photo; do not transfer every gallery image from Turso.
    const selection = index === null ? products.primaryImage
      : sql<string | null>`CASE WHEN json_valid(${products.additionalImages}) THEN json_extract(${products.additionalImages}, ${`$[${Number(index)}]`}) ELSE NULL END`;
    const [product] = await db.select({ source: selection }).from(products).where(eq(products.id, Number(id))).limit(1);
    const source = product?.source;
    if (typeof source !== 'string' || !source) return unavailable(404);
    const match = /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=\s]+)$/.exec(source);
    if (!match) {
      // Existing links may still point here after an inline image is replaced with a URL.
      if (source.startsWith('https://') || source.startsWith('/hero/')) return NextResponse.redirect(new URL(source, req.url), { headers: { 'Cache-Control': 'no-store' } });
      return unavailable(404);
    }
    return publicResponse(req, Buffer.from(match[2], 'base64'), match[1]);
  } catch { return unavailable(503); }
}
