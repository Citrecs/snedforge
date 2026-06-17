import { describe, it, expect } from 'vitest';
import type { Question } from '../types/content';
import {
  makeRng,
  shuffle,
  pickDistinct,
  buildOptions,
  OPTIONS_PER_QUESTION,
} from './shuffle';

describe('makeRng', () => {
  it('is deterministic for a given seed', () => {
    const a = makeRng(42);
    const b = makeRng(42);
    const seqA = [a(), a(), a(), a()];
    const seqB = [b(), b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it('produces different sequences for different seeds', () => {
    const a = makeRng(1);
    const b = makeRng(2);
    expect([a(), a(), a()]).not.toEqual([b(), b(), b()]);
  });

  it('returns values in [0, 1)', () => {
    const rng = makeRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('shuffle', () => {
  it('does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffle(input, makeRng(3));
    expect(input).toEqual(copy);
  });

  it('preserves all elements (is a permutation)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const out = shuffle(input, makeRng(99));
    expect([...out].sort((a, b) => a - b)).toEqual(input);
  });

  it('is deterministic for a given seed', () => {
    const input = ['a', 'b', 'c', 'd'];
    expect(shuffle(input, makeRng(5))).toEqual(shuffle(input, makeRng(5)));
  });
});

describe('pickDistinct', () => {
  it('returns the requested count', () => {
    const out = pickDistinct([1, 2, 3, 4, 5], 3, makeRng(1));
    expect(out).toHaveLength(3);
  });

  it('returns distinct items from the pool', () => {
    const pool = [1, 2, 3, 4, 5, 6];
    const out = pickDistinct(pool, 4, makeRng(11));
    expect(new Set(out).size).toBe(4);
    out.forEach((x) => expect(pool).toContain(x));
  });

  it('throws when asking for more than the pool holds', () => {
    expect(() => pickDistinct([1, 2], 3, makeRng(1))).toThrow();
  });
});

function makeQuestion(distractorCount: number): Question {
  return {
    id: 'q1',
    prompt: 'prompt?',
    correct: { id: 'correct', text: 'the correct one' },
    incorrect: Array.from({ length: distractorCount }, (_, i) => ({
      id: `wrong-${i}`,
      text: `wrong ${i}`,
    })),
    explanation: 'because',
    reference: { sourceTitle: 'src', locator: { kind: 'page', page: 1 } },
  };
}

describe('buildOptions', () => {
  it('returns exactly OPTIONS_PER_QUESTION options', () => {
    const { options } = buildOptions(makeQuestion(10), makeRng(1));
    expect(options).toHaveLength(OPTIONS_PER_QUESTION);
  });

  it('always includes the correct answer', () => {
    for (let seed = 0; seed < 50; seed++) {
      const { options, correctOptionId } = buildOptions(makeQuestion(10), makeRng(seed));
      expect(options.some((o) => o.id === correctOptionId)).toBe(true);
    }
  });

  it('has no duplicate option ids', () => {
    for (let seed = 0; seed < 50; seed++) {
      const { options } = buildOptions(makeQuestion(10), makeRng(seed));
      expect(new Set(options.map((o) => o.id)).size).toBe(options.length);
    }
  });

  it('includes exactly one correct and three distractors', () => {
    const { options, correctOptionId } = buildOptions(makeQuestion(10), makeRng(123));
    const correctCount = options.filter((o) => o.id === correctOptionId).length;
    expect(correctCount).toBe(1);
    expect(options.filter((o) => o.id !== correctOptionId)).toHaveLength(3);
  });

  it('works with the minimum of 3 distractors', () => {
    const { options } = buildOptions(makeQuestion(3), makeRng(1));
    expect(options).toHaveLength(OPTIONS_PER_QUESTION);
  });

  it('throws with fewer than 3 distractors', () => {
    expect(() => buildOptions(makeQuestion(2), makeRng(1))).toThrow();
  });

  it('varies option order across seeds', () => {
    const orderings = new Set<string>();
    for (let seed = 0; seed < 20; seed++) {
      const { options } = buildOptions(makeQuestion(10), makeRng(seed));
      orderings.add(options.map((o) => o.id).join(','));
    }
    // With shuffling + random distractor selection we expect many distinct orderings.
    expect(orderings.size).toBeGreaterThan(1);
  });
});
