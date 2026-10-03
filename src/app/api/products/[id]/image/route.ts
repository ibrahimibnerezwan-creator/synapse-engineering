import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { products } from '@/db/schema';
import { parseGallery } from '@/lib/productMedia';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = req.nextUrl.searchParams.get('index');
  if (!/^\d+$/.test(id) || Number(id) < 1 || (index !== null && !/^\d+$/.test(index))) return new NextResponse(null, { status: 400 });
  try {
    const [product] = await db.select({ primaryImage: products.primaryImage, additionalImages: products.additionalImages }).from(products).where(eq(products.id, Number(id))).limit(1);
    const source = product && (index === null ? product.primaryImage : parseGallery(product.additionalImages)[Number(index)]);
    if (!source) return new NextResponse(null, { status: 404 });
    const match = /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=\s]+)$/.exec(source);
    if (!match) {
      // Existing links may still point here after an inline image is replaced with a URL.
      if (source.startsWith('https://') || source.startsWith('/hero/')) return NextResponse.redirect(new URL(source, req.url));
      return new NextResponse(null, { status: 404 });
    }
    return new NextResponse(Buffer.from(match[2], 'base64'), { headers: {
      'Content-Type': match[1], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    } });
  } catch { return new NextResponse(null, { status: 503 }); }
}
