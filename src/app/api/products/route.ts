import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ products: await getAllProducts() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'The catalogue could not be loaded. Please try again.' }, { status: 503 });
  }
}
