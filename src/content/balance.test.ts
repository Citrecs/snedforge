import { describe, it, expect } from 'vitest';
import { groups } from './index';
import { DISTRACTOR_COUNT } from '../lib/shuffle';

// Guardrail: answer length must NOT correlate with correctness. It is not enough
// for the correct answer to "never be the longest" — that just inverts the tell
// (you could always eliminate the longest option). The correct answer must be the
// longest about as often as it is the shortest, so that at quiz time none of these
// strategies beats random chance (= 1 / options shown = 25%):
//   - always pick the longest option
//   - always pick the shortest option
//
// We compute the EXACT success rate of each strategy given that the quiz shows the
// correct answer + DISTRACTOR_COUNT (3) randomly chosen distractors.

const SHOWN = DISTRACTOR_COUNT; // distractors shown per question
const CHANCE = 1 / (SHOWN + 1); // 0.25 with 4 options

function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return r;
}

interface Q {
  subject: string;
  id: string;
  correctLen: number;
  distractorLens: number[];
}

function allQuestions(): Q[] {
  const out: Q[] = [];
  for (const g of groups) {
    for (const s of g.subjects) {
      for (const q of s.questions) {
        out.push({
          subject: s.id,
          id: q.id,
          correctLen: q.correct.text.length,
          distractorLens: q.incorrect.map((a) => a.text.length),
        });
      }
    }
  }
  return out;
}

// P(correct is the strictly longest of the shown set) = P(all SHOWN drawn distractors are shorter).
function pickLongestWin(q: Q): number {
  const shorter = q.distractorLens.filter((l) => l < q.correctLen).length;
  const total = choose(q.distractorLens.length, SHOWN);
  return total === 0 ? 0 : choose(shorter, SHOWN) / total;
}
function pickShortestWin(q: Q): number {
  const longer = q.distractorLens.filter((l) => l > q.correctLen).length;
  const total = choose(q.distractorLens.length, SHOWN);
  return total === 0 ? 0 : choose(longer, SHOWN) / total;
}

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

describe('answer-length carries no signal', () => {
  const questions = allQuestions();
  // Allow a margin around the 25% chance rate.
  const LO = 0.15;
  const HI = 0.35;

  it('the "pick the longest" strategy is no better than chance', () => {
    const rate = mean(questions.map(pickLongestWin));
    expect(
      rate,
      `"Always pick longest" succeeds ${(rate * 100).toFixed(1)}% of the time ` +
        `(chance is ${(CHANCE * 100).toFixed(0)}%). Should be within ${LO * 100}-${HI * 100}%.`,
    ).toBeGreaterThanOrEqual(LO);
    expect(rate).toBeLessThanOrEqual(HI);
  });

  it('the "pick the shortest" strategy is no better than chance', () => {
    const rate = mean(questions.map(pickShortestWin));
    expect(
      rate,
      `"Always pick shortest" succeeds ${(rate * 100).toFixed(1)}% of the time ` +
        `(chance is ${(CHANCE * 100).toFixed(0)}%). Should be within ${LO * 100}-${HI * 100}%.`,
    ).toBeGreaterThanOrEqual(LO);
    expect(rate).toBeLessThanOrEqual(HI);
  });

  it('no single subject is length-skewed (each subject near chance, since quizzes are often per-subject)', () => {
    const bySubject = new Map<string, typeof questions>();
    for (const q of questions) {
      const arr = bySubject.get(q.subject) ?? [];
      arr.push(q);
      bySubject.set(q.subject, arr);
    }
    const PER_LO = 0.1;
    const PER_HI = 0.42;
    const offenders: string[] = [];
    for (const [subject, qs] of bySubject) {
      const lon = mean(qs.map(pickLongestWin));
      const sho = mean(qs.map(pickShortestWin));
      if (lon < PER_LO || lon > PER_HI || sho < PER_LO || sho > PER_HI) {
        offenders.push(
          `${subject}: pick-longest ${(lon * 100).toFixed(0)}%, pick-shortest ${(sho * 100).toFixed(0)}% (each should be ${PER_LO * 100}-${PER_HI * 100}%)`,
        );
      }
    }
    expect(offenders, `Length-skewed subjects:\n${offenders.join('\n')}`).toEqual([]);
  });

  it('no single question is a blatant length outlier', () => {
    // Loose guard so one question can't be wildly skewed even if the averages pass.
    const offenders = questions
      .map((q) => {
        const lens = [q.correctLen, ...q.distractorLens];
        const max = Math.max(...lens);
        const min = Math.min(...lens);
        return { q, range: max - min, tol: Math.max(65, Math.round(0.75 * max)) };
      })
      .filter((x) => x.range > x.tol)
      .map((x) => `${x.q.subject}/${x.q.id} (range ${x.range} > tol ${x.tol})`);
    expect(offenders, `Length outliers:\n${offenders.join('\n')}`).toEqual([]);
  });
});
