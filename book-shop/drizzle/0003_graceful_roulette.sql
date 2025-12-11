ALTER TABLE "books" ALTER COLUMN "author_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "authors" ADD COLUMN "image" text;