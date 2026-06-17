import type { QuizAttempt } from '../types/session';

export interface OverallStats {
  attempts: number;
  questionsAnswered: number;
  correct: number;
  accuracy: number; // 0..1
}

export interface SubjectStat {
  groupId: string;
  subjectId: string;
  total: number;
  correct: number;
  accuracy: number; // 0..1
}

export function overallStats(attempts: QuizAttempt[]): OverallStats {
  let questionsAnswered = 0;
  let correct = 0;
  for (const a of attempts) {
    questionsAnswered += a.total;
    correct += a.score;
  }
  return {
    attempts: attempts.length,
    questionsAnswered,
    correct,
    accuracy: questionsAnswered ? correct / questionsAnswered : 0,
  };
}

/** Accuracy per subject, keyed by group+subject (subject ids are unique within a group). */
export function perSubjectStats(attempts: QuizAttempt[]): SubjectStat[] {
  const map = new Map<string, SubjectStat>();
  for (const a of attempts) {
    for (const r of a.results) {
      const key = `${a.groupId}::${r.subjectId}`;
      const cur =
        map.get(key) ??
        { groupId: a.groupId, subjectId: r.subjectId, total: 0, correct: 0, accuracy: 0 };
      cur.total += 1;
      if (r.correct) cur.correct += 1;
      map.set(key, cur);
    }
  }
  const arr = [...map.values()];
  for (const s of arr) s.accuracy = s.total ? s.correct / s.total : 0;
  return arr;
}

/**
 * Subjects you're weakest at, lowest accuracy first. `minSamples` avoids flagging
 * a subject as "weak" off a single unlucky answer.
 */
export function weakAreas(attempts: QuizAttempt[], minSamples = 4): SubjectStat[] {
  return perSubjectStats(attempts)
    .filter((s) => s.total >= minSamples)
    .sort((a, b) => a.accuracy - b.accuracy);
}
