import { describe, it, expect } from 'vitest';
import { buildSession, availableCount } from './quiz';
import { groups } from '../content';
import type { QuizConfig } from '../types/session';

const groupId = 'google-cloud-networking';
const allSubjectIds = groups[0].subjects.map((s) => s.id);

function cfg(partial: Partial<QuizConfig>): QuizConfig {
  return {
    groupId,
    subjectIds: allSubjectIds,
    gradingMode: 'immediate',
    ordering: 'inOrder',
    questionCount: 10,
    seed: 1,
    ...partial,
  };
}

describe('content loads and validates', () => {
  it('exposes the Google Cloud Networking group with subjects that all have questions', () => {
    expect(groups).toHaveLength(1);
    expect(groups[0].id).toBe(groupId);
    expect(groups[0].subjects.length).toBeGreaterThan(0);
    for (const subject of groups[0].subjects) {
      expect(subject.questions.length).toBeGreaterThan(0);
    }
  });
});

describe('buildSession', () => {
  it('produces the requested number of questions', () => {
    expect(buildSession(cfg({ questionCount: 5, ordering: 'shuffle' }))).toHaveLength(5);
  });

  it('caps at the available pool size', () => {
    const avail = availableCount({ groupId, subjectIds: ['fund'] });
    const session = buildSession(cfg({ subjectIds: ['fund'], questionCount: 9999 }));
    expect(session).toHaveLength(avail);
  });

  it('gives each question exactly 4 distinct options including the correct one', () => {
    for (const q of buildSession(cfg({ subjectIds: ['fund'], seed: 7 }))) {
      expect(q.options).toHaveLength(4);
      expect(q.options.some((o) => o.id === q.correctOptionId)).toBe(true);
      expect(new Set(q.options.map((o) => o.id)).size).toBe(4);
    }
  });

  it('is deterministic given a seed', () => {
    const c = cfg({ subjectIds: ['fund', 'b4'], ordering: 'shuffle', questionCount: 8, seed: 99 });
    const a = buildSession(c);
    const b = buildSession(c);
    expect(a.map((q) => q.questionId)).toEqual(b.map((q) => q.questionId));
    expect(a.map((q) => q.options.map((o) => o.id))).toEqual(
      b.map((q) => q.options.map((o) => o.id)),
    );
  });

  it('preserves content order when ordering is inOrder', () => {
    const session = buildSession(cfg({ subjectIds: ['fund'], questionCount: 3 }));
    const expected = groups[0].subjects
      .find((s) => s.id === 'fund')!
      .questions.slice(0, 3)
      .map((q) => q.id);
    expect(session.map((q) => q.questionId)).toEqual(expected);
  });
});
