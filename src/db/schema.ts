import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  titleBn: text('title_bn'),
  modelNo: text('model_no'),
  brand: text('brand').notNull(),
  category: text('category').notNull(),
  subCategory: text('sub_category'),
  description: text('description').notNull(),
  descriptionBn: text('description_bn'),
  specs: text('specs'), // JSON string: { "Capacity": "16kWh", "Cycles": "11,000", ... }
  price: integer('price').default(0), // in BDT, 0 = Request Quote
  priceType: text('price_type').default('quote'), // 'fixed' | 'quote'
  datasheetUrl: text('datasheet_url'),
  primaryImage: text('primary_image').notNull(),
  additionalImages: text('additional_images'), // JSON array of string URLs
  featured: integer('featured').default(0),
  stockStatus: text('stock_status').default('In Stock'), // 'In Stock' | 'Direct Import (7-10 Days)' | 'Pre-Order'
  originCountry: text('origin_country').default('China'),
  displayOrder: integer('display_order').default(0),
  createdAt: text('created_at').notNull(),
});

export const rfqs = sqliteTable('rfqs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rfqNumber: text('rfq_number').notNull().unique(),
  contactName: text('contact_name').notNull(),
  companyName: text('company_name'),
  phone: text('phone').notNull(),
  email: text('email'),
  productId: integer('product_id'),
  productTitle: text('product_title'),
  quantity: integer('quantity').default(1),
  projectRequirement: text('project_requirement'),
  status: text('status').default('new'), // 'new' | 'contacted' | 'quoted' | 'in_procurement' | 'completed' | 'cancelled'
  estimatedValue: integer('estimated_value').default(0),
  adminNotes: text('admin_notes'),
  createdAt: text('created_at').notNull(),
});

export const sourcingInquiries = sqliteTable('sourcing_inquiries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  inquiryNumber: text('inquiry_number').notNull().unique(),
  clientName: text('client_name').notNull(),
  companyName: text('company_name'),
  phone: text('phone').notNull(),
  email: text('email'),
  itemName: text('item_name').notNull(),
  specification: text('specification'),
  targetQuantity: integer('target_quantity'),
  sampleOrPhotoUrl: text('sample_or_photo_url'),
  targetBudget: text('target_budget'),
  status: text('status').default('reviewing'), // 'reviewing' | 'factory_matched' | 'quote_sent' | 'sample_ordered' | 'shipping' | 'completed'
  trackingCode: text('tracking_code'),
  adminNotes: text('admin_notes'),
  createdAt: text('created_at').notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type RFQ = typeof rfqs.$inferSelect;
export type SourcingInquiry = typeof sourcingInquiries.$inferSelect;
