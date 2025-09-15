ALTER TABLE "events"
ALTER COLUMN "starts_at_ms"
SET
    DATA TYPE bigint;
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "ends_at_ms" SET DATA TYPE bigint;
--> statement-breakpoint
ALTER TABLE "results_final"
ALTER COLUMN "generated_at_ms"
SET
    DATA TYPE bigint;
--> statement-breakpoint
ALTER TABLE "results_interval"
ALTER COLUMN "generated_at_ms"
SET
    DATA TYPE bigint;
--> statement-breakpoint
ALTER TABLE "telemetry"
ALTER COLUMN "timestamp_ms"
SET
    DATA TYPE bigint;
--> statement-breakpoint
ALTER TABLE "telemetry_peers"
ALTER COLUMN "timestamp_ms"
SET
    DATA TYPE bigint;
--> statement-breakpoint