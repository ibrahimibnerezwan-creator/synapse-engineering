CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`title_bn` text,
	`model_no` text,
	`brand` text NOT NULL,
	`category` text NOT NULL,
	`sub_category` text,
	`description` text NOT NULL,
	`description_bn` text,
	`specs` text,
	`price` integer DEFAULT 0,
	`price_type` text DEFAULT 'quote',
	`datasheet_url` text,
	`primary_image` text NOT NULL,
	`additional_images` text,
	`featured` integer DEFAULT 0,
	`stock_status` text DEFAULT 'In Stock',
	`origin_country` text DEFAULT 'China',
	`display_order` integer DEFAULT 0,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `rfqs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rfq_number` text NOT NULL,
	`contact_name` text NOT NULL,
	`company_name` text,
	`phone` text NOT NULL,
	`email` text,
	`product_id` integer,
	`product_title` text,
	`quantity` integer DEFAULT 1,
	`project_requirement` text,
	`status` text DEFAULT 'new',
	`estimated_value` integer DEFAULT 0,
	`admin_notes` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rfqs_rfq_number_unique` ON `rfqs` (`rfq_number`);--> statement-breakpoint
CREATE TABLE `sourcing_inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`inquiry_number` text NOT NULL,
	`client_name` text NOT NULL,
	`company_name` text,
	`phone` text NOT NULL,
	`email` text,
	`item_name` text NOT NULL,
	`specification` text,
	`target_quantity` integer,
	`sample_or_photo_url` text,
	`target_budget` text,
	`status` text DEFAULT 'reviewing',
	`tracking_code` text,
	`admin_notes` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sourcing_inquiries_inquiry_number_unique` ON `sourcing_inquiries` (`inquiry_number`);