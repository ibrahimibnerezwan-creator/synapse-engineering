import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllProducts, getProductBySlug } from '@/lib/data';
import ProductDetailClient from './ProductDetailClient';
import { productPhoto } from '@/lib/productMedia';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found | Synapse Engineering' };
  }
  const photo = productPhoto(product);

  return {
    title: `${product.title} (${product.brand}) | Synapse Engineering`,
    description: product.description.slice(0, 160),
    alternates: { canonical: '/products/' + product.slug },
    openGraph: {
      url: '/products/' + product.slug,
      title: `${product.title} | ${product.brand}`,
      description: product.description.slice(0, 160),
      images: [{ url: photo.source || '/hero/factory-panel.jpg', alt: !photo.source ? 'Synapse industrial supply — product photo on request' : photo.illustration ? 'Product use-case illustration' : product.title }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getAllProducts();
  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 3);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
