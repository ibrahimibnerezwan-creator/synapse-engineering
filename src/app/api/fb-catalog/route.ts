import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const products = (await getAllProducts()).filter(product => product.priceType !== 'quote' && Number(product.price) > 0 && product.primaryImage && !product.primaryImage.includes('images.unsplash.com'));
    const base = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const cell = (value: unknown) => '"' + String(value ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"';
    const headers = ['id', 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'brand', 'category'];
    const rows = products.map(product => [
      product.id, product.title, product.description,
      /out of stock|unavailable|discontinued/i.test(product.stockStatus || '') ? 'out of stock' : /preorder|request/i.test(product.stockStatus || '') ? 'preorder' : 'in stock',
      'new', String(product.price) + ' BDT', new URL('/products/' + product.slug, base).toString(),
      new URL(product.primaryImage, base).toString(), product.brand, product.category,
    ].map(cell).join(','));
    return new NextResponse([headers.join(','), ...rows].join('\n'), { headers: {
      'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename=synapse-products-catalog.csv', 'Cache-Control': 'no-store',
    } });
  } catch { return NextResponse.json({ error: 'The catalogue export could not be generated. Please try again.' }, { status: 503 }); }
}
