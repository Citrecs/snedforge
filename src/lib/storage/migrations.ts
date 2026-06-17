import type { HistoryStore } from '../../types/session';
import { CURRENT_SCHEMA_VERSION } from './keys';

// A migration upgrades a stored blob from one schema version to the next.
type Migration = (store: Record<string, unknown>) => Record<string, unknown>;

// Keyed by the version they upgrade FROM. v1 is the first version, so there are
// no migrations yet — when the shape changes, add e.g. `1: (s) => ({...})`.
const migrations: Record<number, Migration> = {};

/**
 * Run any applicable migrations to bring a parsed blob up to the current version.
 * Unknown/old blobs are upgraded step by step; the version field is then stamped.
 */
export function runMigrations(raw: unknown): HistoryStore {
  let store = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  let version = typeof store.schemaVersion === 'number' ? store.schemaVersion : 0;

  while (version < CURRENT_SCHEMA_VERSION && migrations[version]) {
    store = migrations[version](store);
    version += 1;
  }

  return { ...(store as object), schemaVersion: CURRENT_SCHEMA_VERSION } as HistoryStore;
}
