import React from 'react';
import { getAllProducts } from '@/lib/data';
import HomePageClient from './HomePageClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getAllProducts();

  return <HomePageClient initialProducts={products} />;
}
