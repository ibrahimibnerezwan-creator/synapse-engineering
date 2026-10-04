import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data';
import { publicResponse } from '@/lib/publicResponse';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    return publicResponse(request, JSON.stringify({ products: await getAllProducts() }), 'application/json');
  } catch {
    return NextResponse.json({ error: 'The catalogue could not be loaded. Please try again.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
