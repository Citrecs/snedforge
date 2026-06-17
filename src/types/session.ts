import type { Answer, Reference } from './content';

export type GradingMode = 'immediate' | 'deferred';
export type Ordering = 'shuffle' | 'inOrder';

/** Chosen on the setup screen; drives how a session is built and presented. */
export interface QuizConfig {
  groupId: string;
  subjectIds: string[];
  gradingMode: GradingMode;
  ordering: Ordering;
  questionCount: number;
  /** Optional fixed seed for reproducible runs (mostly for tests). */
  seed?: number;
}

/** A question instantiated for a session: 4 options already selected + shuffled. */
export interface PresentedQuestion {
  questionId: string;
  subjectId: string;
  prompt: string;
  /** Exactly 4 options, shuffled, distinct ids. */
  options: Answer[];
  correctOptionId: string;
  explanation: string;
  reference: Reference;
  tags?: string[];
}

export interface AnswerRecord {
  questionId: string;
  /** null when the question was skipped / left unanswered. */
  selectedOptionId: string | null;
  correct: boolean;
  answeredAt: number;
}

export type SessionStatus = 'active' | 'finished';

export interface QuizSession {
  config: QuizConfig;
  questions: PresentedQuestion[];
  currentIndex: number;
  /** Keyed by questionId. */
  answers: Record<string, AnswerRecord>;
  status: SessionStatus;
  startedAt: number;
}

// ----- Persisted history -----

export interface AttemptQuestionResult {
  questionId: string;
  subjectId: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  correct: boolean;
  tags?: string[];
}

export interface QuizAttempt {
  id: string;
  groupId: string;
  subjectIds: string[];
  gradingMode: GradingMode;
  startedAt: number;
  finishedAt: number;
  total: number;
  /** Count of correct answers. */
  score: number;
  results: AttemptQuestionResult[];
}

export interface HistoryStore {
  schemaVersion: number;
  attempts: QuizAttempt[];
}
