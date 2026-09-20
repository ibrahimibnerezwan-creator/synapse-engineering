CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invoice` text NOT NULL,
	`customer_name` text NOT NULL,
	`phone` text NOT NULL,
	`address` text NOT NULL,
	`product_id` integer,
	`product_title` text NOT NULL,
	`quantity` integer DEFAULT 1,
	`product_amount` integer NOT NULL,
	`delivery_charge` integer DEFAULT 130,
	`total_amount` integer NOT NULL,
	`delivery_zone` text DEFAULT 'outside',
	`payment_method` text DEFAULT 'cod',
	`trx_id` text,
	`status` text DEFAULT 'pending',
	`tracking_code` text,
	`source` text DEFAULT 'web',
	`note` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_invoice_unique` ON `orders` (`invoice`);