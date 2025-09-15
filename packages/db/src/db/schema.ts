// packages/db/src/schema.ts
import { sql } from 'drizzle-orm';
import { check } from 'drizzle-orm/gel-core';
import { pgTable, uuid, text, timestamp, integer, bigint, jsonb, index, unique } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // References auth.users(id)
  nickname: text('nickname'),
  gender: text('gender'),
  imageUrl: text('image_url'),
  bio: text('bio'),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  validRole: check('valid_role', sql`role IN ('admin', 'user')`),
}));

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  startsAtMs: bigint('starts_at_ms', { mode: 'number' }).notNull(),
  endsAtMs: bigint('ends_at_ms', { mode: 'number' }).notNull(),
  status: text('status').notNull(), // 'preparing' | 'active' | 'interval' | 'ended' | 'published'
  createdAt: timestamp('created_at').defaultNow(),
});

export const devices = pgTable('devices', {
  id: text('id').primaryKey(),
  note: text('note'),
  registeredAt: timestamp('registered_at').defaultNow(),
});

export const deviceAssignments = pgTable('device_assignments', {
  eventId: uuid('event_id').references(() => events.id),
  participantId: uuid('participant_id').references(() => profiles.id),
  deviceId: text('device_id').references(() => devices.id),
  assignedAt: timestamp('assigned_at').defaultNow(),
}, (table) => ({
  uniqueEventParticipant: unique().on(table.eventId, table.participantId),
  uniqueEventDevice: unique().on(table.eventId, table.deviceId),
}));

export const telemetry = pgTable('telemetry', {
  eventId: uuid('event_id').references(() => events.id),
  deviceId: text('device_id').references(() => devices.id),
  timestampMs: bigint('timestamp_ms', { mode: 'number' }).notNull(),
  heartRateBpm: integer('heart_rate_bpm'),
  batteryPct: integer('battery_pct'),
}, (table) => ({
  eventDeviceTimestamp: index('telemetry_event_device_timestamp_idx')
    .on(table.eventId, table.deviceId, table.timestampMs),
}));

export const telemetryPeers = pgTable('telemetry_peers', {
  eventId: uuid('event_id').references(() => events.id),
  deviceId: text('device_id').references(() => devices.id),
  peerDeviceId: text('peer_device_id').references(() => devices.id),
  timestampMs: bigint('timestamp_ms', { mode: 'number' }).notNull(),
  distanceM: integer('distance_m').notNull(),
}, (table) => ({
  eventDeviceTimestamp: index('telemetry_peers_event_device_timestamp_idx')
    .on(table.eventId, table.deviceId, table.timestampMs),
  eventPeerTimestamp: index('telemetry_peers_event_peer_timestamp_idx')
    .on(table.eventId, table.peerDeviceId, table.timestampMs),
}));

export const resultsInterval = pgTable('results_interval', {
  eventId: uuid('event_id').references(() => events.id).primaryKey(),
  generatedAtMs: bigint('generated_at_ms', { mode: 'number' }).notNull(),
  perParticipantJson: jsonb('per_participant_json').notNull(),
});

export const resultsFinal = pgTable('results_final', {
  eventId: uuid('event_id').references(() => events.id).primaryKey(),
  generatedAtMs: bigint('generated_at_ms', { mode: 'number' }).notNull(),
  perParticipantJson: jsonb('per_participant_json').notNull(),
});