CREATE TABLE "device_assignments" (
	"event_id" uuid,
	"participant_id" uuid,
	"device_id" text,
	"assigned_at" timestamp DEFAULT now(),
	CONSTRAINT "device_assignments_event_id_participant_id_unique" UNIQUE("event_id","participant_id"),
	CONSTRAINT "device_assignments_event_id_device_id_unique" UNIQUE("event_id","device_id")
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" text PRIMARY KEY NOT NULL,
	"note" text,
	"registered_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"starts_at_ms" integer NOT NULL,
	"ends_at_ms" integer NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"nickname" text,
	"gender" text,
	"image_url" text,
	"bio" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "results_final" (
	"event_id" uuid PRIMARY KEY NOT NULL,
	"generated_at_ms" integer NOT NULL,
	"per_participant_json" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "results_interval" (
	"event_id" uuid PRIMARY KEY NOT NULL,
	"generated_at_ms" integer NOT NULL,
	"per_participant_json" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telemetry" (
	"event_id" uuid,
	"device_id" text,
	"timestamp_ms" integer NOT NULL,
	"heart_rate_bpm" integer,
	"battery_pct" integer
);
--> statement-breakpoint
CREATE TABLE "telemetry_peers" (
	"event_id" uuid,
	"device_id" text,
	"peer_device_id" text,
	"timestamp_ms" integer NOT NULL,
	"distance_m" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "device_assignments" ADD CONSTRAINT "device_assignments_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device_assignments" ADD CONSTRAINT "device_assignments_participant_id_profiles_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device_assignments" ADD CONSTRAINT "device_assignments_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results_final" ADD CONSTRAINT "results_final_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results_interval" ADD CONSTRAINT "results_interval_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry" ADD CONSTRAINT "telemetry_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry" ADD CONSTRAINT "telemetry_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry_peers" ADD CONSTRAINT "telemetry_peers_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry_peers" ADD CONSTRAINT "telemetry_peers_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry_peers" ADD CONSTRAINT "telemetry_peers_peer_device_id_devices_id_fk" FOREIGN KEY ("peer_device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "telemetry_event_device_timestamp_idx" ON "telemetry" USING btree ("event_id","device_id","timestamp_ms");--> statement-breakpoint
CREATE INDEX "telemetry_peers_event_device_timestamp_idx" ON "telemetry_peers" USING btree ("event_id","device_id","timestamp_ms");--> statement-breakpoint
CREATE INDEX "telemetry_peers_event_peer_timestamp_idx" ON "telemetry_peers" USING btree ("event_id","peer_device_id","timestamp_ms");