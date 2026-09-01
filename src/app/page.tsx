import React from 'react';
import { getAllProducts } from '@/lib/data';
import HomePageClient from './HomePageClient';

export const revalidate = 60; // SSR Revalidate every 60 seconds

export default async function HomePage() {
  const products = await getAllProducts();

  return <HomePageClient initialProducts={products} />;
}
