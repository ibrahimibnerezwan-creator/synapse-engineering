import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getAllProducts } from '@/lib/data';
import { productInput } from '@/lib/productInput';
import { displayProduct } from '@/lib/productMedia';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return NextResponse.json({ products: await getAllProducts() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Products could not be loaded. Please try again.' }, { status: 503 }); }
}

export async function POST(req: NextRequest) {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let input;
  try { input = productInput(await req.json()); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid product.' }, { status: 400 }); }
  const stem = input.title.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 100) || 'product';
  try {
    const [product] = await db.insert(products).values({ ...input, slug: stem + '-' + crypto.randomUUID().slice(0, 8), createdAt: new Date().toISOString() }).returning();
    return NextResponse.json({ success: true, product: displayProduct(product), slug: product.slug }, { status: 201 });
  } catch { return NextResponse.json({ error: 'The product could not be saved. Your form is preserved; please try again.' }, { status: 503 }); }
}

export async function PATCH(req: NextRequest) {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (!Number.isSafeInteger(Number(body?.id)) || Number(body.id) < 1) return NextResponse.json({ error: 'Valid product ID required.' }, { status: 400 });
  try {
    const [current] = await db.select().from(products).where(eq(products.id, Number(body.id))).limit(1);
    if (!current) return NextResponse.json({ error: 'Product not found. Refresh the list.' }, { status: 404 });
    let input;
    try { input = productInput(body, current); }
    catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid product.' }, { status: 400 }); }
    const [product] = await db.update(products).set(input).where(eq(products.id, current.id)).returning();
    if (!product) return NextResponse.json({ error: 'Product not found. Refresh the list.' }, { status: 404 });
    return NextResponse.json({ success: true, product: displayProduct(product), slug: product.slug });
  } catch { return NextResponse.json({ error: 'The product could not be updated. Your form is preserved; please try again.' }, { status: 503 }); }
}

export async function DELETE(req: NextRequest) {
  if (!await isAuthenticatedAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let id: unknown = req.nextUrl.searchParams.get('id');
  if (!id) { try { id = (await req.json()).id; } catch { /* Validate below. */ } }
  if (!Number.isSafeInteger(Number(id)) || Number(id) < 1) return NextResponse.json({ error: 'Valid product ID required.' }, { status: 400 });
  try {
    const deleted = await db.delete(products).where(eq(products.id, Number(id))).returning({ id: products.id });
    if (!deleted.length) return NextResponse.json({ error: 'Product not found. Refresh the list.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'The product could not be deleted. Please try again.' }, { status: 503 }); }
}
