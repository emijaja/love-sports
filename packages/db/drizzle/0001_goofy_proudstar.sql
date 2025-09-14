ALTER TABLE "profiles" ADD COLUMN "role" text DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "valid_role" CHECK (role IN ('admin', 'user'));