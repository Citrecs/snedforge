import type { Answer, Question } from '../types/content';

/** A random number generator returning a float in [0, 1). */
export type Rng = () => number;

/** Number of distractors (incorrect options) shown per question. */
export const DISTRACTOR_COUNT = 3;
/** Total options shown per question (1 correct + distractors). */
export const OPTIONS_PER_QUESTION = DISTRACTOR_COUNT + 1;

/**
 * Deterministic seedable PRNG (mulberry32). Same seed => same sequence, which
 * makes everything built on top of it reproducible and testable.
 */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pure Fisher–Yates shuffle. Returns a new array; does not mutate the input. */
export function shuffle<T>(arr: readonly T[], rng: Rng): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick `n` distinct items from `pool` (without replacement). Throws if n > pool size. */
export function pickDistinct<T>(pool: readonly T[], n: number, rng: Rng): T[] {
  if (n > pool.length) {
    throw new Error(`Cannot pick ${n} distinct items from a pool of ${pool.length}`);
  }
  return shuffle(pool, rng).slice(0, n);
}

/**
 * Build the set of options shown for a question: the correct answer plus
 * DISTRACTOR_COUNT randomly chosen distinct incorrect answers, all shuffled.
 * Throws if the question doesn't have enough distractors.
 */
export function buildOptions(
  question: Question,
  rng: Rng,
): { options: Answer[]; correctOptionId: string } {
  if (question.incorrect.length < DISTRACTOR_COUNT) {
    throw new Error(
      `Question "${question.id}" needs at least ${DISTRACTOR_COUNT} incorrect answers, ` +
        `but has ${question.incorrect.length}`,
    );
  }
  const distractors = pickDistinct(question.incorrect, DISTRACTOR_COUNT, rng);
  const options = shuffle([question.correct, ...distractors], rng);
  return { options, correctOptionId: question.correct.id };
}
