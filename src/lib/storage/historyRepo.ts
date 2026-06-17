import { z } from 'zod';
import type { HistoryStore, QuizAttempt } from '../../types/session';
import { CURRENT_SCHEMA_VERSION, STORAGE_KEY } from './keys';
import { runMigrations } from './migrations';

// The ONLY module that touches localStorage. Everything else goes through these
// functions, so persistence concerns (parsing, validation, migration) live here.

const attemptResultSchema = z.object({
  questionId: z.string(),
  subjectId: z.string(),
  selectedOptionId: z.string().nullable(),
  correctOptionId: z.string(),
  correct: z.boolean(),
  tags: z.array(z.string()).optional(),
});

const attemptSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  subjectIds: z.array(z.string()),
  gradingMode: z.enum(['immediate', 'deferred']),
  startedAt: z.number(),
  finishedAt: z.number(),
  total: z.number(),
  score: z.number(),
  results: z.array(attemptResultSchema),
});

const historySchema = z.object({
  schemaVersion: z.number(),
  attempts: z.array(attemptSchema),
});

function emptyStore(): HistoryStore {
  return { schemaVersion: CURRENT_SCHEMA_VERSION, attempts: [] };
}

function load(): HistoryStore {
  if (typeof localStorage === 'undefined') return emptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const migrated = runMigrations(JSON.parse(raw));
    const result = historySchema.safeParse(migrated);
    if (!result.success) {
      console.warn('Stored history failed validation; starting fresh.', result.error.format());
      return emptyStore();
    }
    return result.data as HistoryStore;
  } catch (err) {
    console.warn('Could not read history; starting fresh.', err);
    return emptyStore();
  }
}

function save(store: HistoryStore): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.warn('Could not save history.', err);
  }
}

export function getAttempts(): QuizAttempt[] {
  // Most-recent first.
  return [...load().attempts].sort((a, b) => b.finishedAt - a.finishedAt);
}

export function addAttempt(attempt: QuizAttempt): void {
  const store = load();
  store.attempts.push(attempt);
  save(store);
}

export function clearHistory(): void {
  save(emptyStore());
}
