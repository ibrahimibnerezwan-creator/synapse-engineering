import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await getAllProducts();

  // Meta Commerce Catalog standard CSV headers
  const headers = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'brand',
    'category'
  ];

  const escapeCSV = (str: string) => {
    return `"${(str || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
  };

  const rows = products.map((p) => {
    const link = `https://synapse-engneering.com/products/${p.slug}`;
    const priceStr = p.price && p.price > 0 ? `${p.price} BDT` : '0 BDT';
    return [
      p.id,
      escapeCSV(p.title),
      escapeCSV(p.description),
      'in stock',
      'new',
      priceStr,
      link,
      p.primaryImage,
      escapeCSV(p.brand),
      escapeCSV(p.category)
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename=synapse-products-catalog.csv',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
