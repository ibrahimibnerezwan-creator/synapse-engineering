import { getTableColumns, sql } from 'drizzle-orm';
import { products } from '@/db/schema';

// Project images in SQLite itself: a catalogue read must not transfer tens of MB of photos.
export const productSelection = {
  ...getTableColumns(products),
  primaryImage: sql<string>`CASE WHEN ${products.primaryImage} LIKE 'data:%' THEN '/api/products/' || ${products.id} || '/image?v=' || length(${products.primaryImage}) || '-' || hex(substr(${products.primaryImage}, -128, 16)) ELSE ${products.primaryImage} END`,
  additionalImages: sql<string>`(SELECT json_group_array(CASE WHEN value LIKE 'data:%' THEN '/api/products/' || ${sql.raw('"products"."id"')} || '/image?index=' || key || '&v=' || length(value) || '-' || hex(substr(value, -128, 16)) ELSE value END) FROM json_each(CASE WHEN json_valid(${products.additionalImages}) THEN CASE WHEN json_type(${products.additionalImages}) = 'array' THEN ${products.additionalImages} ELSE '[]' END ELSE '[]' END))`,
};
