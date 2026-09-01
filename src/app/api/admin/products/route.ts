import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { INITIAL_PRODUCTS } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

// GET all products
export async function GET() {
  try {
    const dbProducts = await db.select().from(products).orderBy(desc(products.id));
    if (dbProducts && dbProducts.length > 0) {
      return NextResponse.json({ products: dbProducts });
    }
  } catch {}
  return NextResponse.json({ products: INITIAL_PRODUCTS });
}

// POST create product
export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      titleBn,
      modelNo,
      brand,
      category,
      subCategory,
      description,
      descriptionBn,
      specs,
      price,
      priceType,
      primaryImage,
      datasheetUrl,
      stockStatus,
      originCountry
    } = body;

    if (!title || !brand || !category) {
      return NextResponse.json({ error: 'Title, brand, and category are required' }, { status: 400 });
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Date.now().toString().slice(-4)}`;

    try {
      await db.insert(products).values({
        slug,
        title,
        titleBn: titleBn || '',
        modelNo: modelNo || '',
        brand,
        category,
        subCategory: subCategory || '',
        description: description || '',
        descriptionBn: descriptionBn || '',
        specs: typeof specs === 'string' ? specs : JSON.stringify(specs || {}),
        price: Number(price) || 0,
        priceType: priceType || 'quote',
        primaryImage: primaryImage || 'https://synapse-engneering.com/wp-content/uploads/2026/04/automation.png',
        datasheetUrl: datasheetUrl || '',
        stockStatus: stockStatus || 'In Stock',
        originCountry: originCountry || 'China',
        featured: 1,
        displayOrder: 1,
        createdAt: new Date().toISOString()
      });
    } catch {}

    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    try {
      await db.delete(products).where(eq(products.id, Number(id)));
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
