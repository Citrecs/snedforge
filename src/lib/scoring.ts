import type {
  AttemptQuestionResult,
  QuizAttempt,
  QuizSession,
} from '../types/session';

/** Build the per-question results for a (finished) session. */
export function buildResults(session: QuizSession): AttemptQuestionResult[] {
  return session.questions.map((q) => {
    const answer = session.answers[q.questionId];
    return {
      questionId: q.questionId,
      subjectId: q.subjectId,
      selectedOptionId: answer?.selectedOptionId ?? null,
      correctOptionId: q.correctOptionId,
      correct: answer?.correct ?? false,
      tags: q.tags,
    };
  });
}

export function scoreOf(results: AttemptQuestionResult[]): number {
  return results.filter((r) => r.correct).length;
}

/** Turn a finished session into a persistable attempt record. */
export function buildAttempt(session: QuizSession, id: string, finishedAt: number): QuizAttempt {
  const results = buildResults(session);
  return {
    id,
    groupId: session.config.groupId,
    subjectIds: session.config.subjectIds,
    gradingMode: session.config.gradingMode,
    startedAt: session.startedAt,
    finishedAt,
    total: session.questions.length,
    score: scoreOf(results),
    results,
  };
}
