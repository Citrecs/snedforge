import type { Question } from '../types/content';
import type { PresentedQuestion, QuizConfig } from '../types/session';
import { getGroup } from '../content';
import { buildOptions, makeRng, shuffle } from './shuffle';

interface PooledQuestion {
  question: Question;
  subjectId: string;
}

/** Gather all questions from the selected subjects, tagged with their subject id. */
function collectPool(config: QuizConfig): PooledQuestion[] {
  const group = getGroup(config.groupId);
  if (!group) {
    throw new Error(`Unknown group "${config.groupId}"`);
  }
  return group.subjects
    .filter((s) => config.subjectIds.includes(s.id))
    .flatMap((s) => s.questions.map((question) => ({ question, subjectId: s.id })));
}

/**
 * Turn a QuizConfig + content into the concrete list of questions for a session:
 * ordered, sliced to the requested count, with 4 options chosen + shuffled each.
 * A single RNG (seeded from config.seed ?? Date.now()) drives all randomness so a
 * whole session is reproducible from one seed.
 */
export function buildSession(config: QuizConfig): PresentedQuestion[] {
  const seed = config.seed ?? Date.now();
  const rng = makeRng(seed);

  const pool = collectPool(config);
  const ordered = config.ordering === 'shuffle' ? shuffle(pool, rng) : pool;

  const count = Math.max(1, Math.min(config.questionCount, ordered.length));
  const chosen = ordered.slice(0, count);

  return chosen.map(({ question, subjectId }) => {
    const { options, correctOptionId } = buildOptions(question, rng);
    return {
      questionId: question.id,
      subjectId,
      prompt: question.prompt,
      options,
      correctOptionId,
      explanation: question.explanation,
      reference: question.reference,
      tags: question.tags,
    };
  });
}

/** How many questions are available for the chosen group + subjects. */
export function availableCount(config: Pick<QuizConfig, 'groupId' | 'subjectIds'>): number {
  return collectPool({ ...config, gradingMode: 'immediate', ordering: 'inOrder', questionCount: 0 }).length;
}
