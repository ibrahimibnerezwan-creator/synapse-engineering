import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/db/schema';
import { INITIAL_PRODUCTS } from '../src/lib/catalog';

async function seed() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error('TURSO_DATABASE_URL not set');
    process.exit(1);
  }

  const client = createClient({ url, authToken });
  const db = drizzle(client, { schema });

  console.log('Seeding initial products to Turso database...');

  for (const prod of INITIAL_PRODUCTS) {
    try {
      await db.insert(schema.products).values({
        slug: prod.slug,
        title: prod.title,
        titleBn: prod.titleBn,
        modelNo: prod.modelNo,
        brand: prod.brand,
        category: prod.category,
        subCategory: prod.subCategory,
        description: prod.description,
        descriptionBn: prod.descriptionBn,
        specs: prod.specs,
        price: prod.price,
        priceType: prod.priceType,
        primaryImage: prod.primaryImage,
        additionalImages: prod.additionalImages,
        datasheetUrl: prod.datasheetUrl,
        featured: prod.featured,
        stockStatus: prod.stockStatus,
        originCountry: prod.originCountry,
        displayOrder: prod.displayOrder,
        createdAt: prod.createdAt
      });
      console.log(`✓ Seeded: ${prod.title}`);
    } catch (e: any) {
      console.log(`Item already exists or error: ${e.message}`);
    }
  }

  console.log('Seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
