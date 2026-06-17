// Content model: SubjectGroup -> Subject -> Question.
// These are the shapes you hand-author in src/content. The zod schemas in
// src/content/schema.ts mirror these and validate the data at load time.

/** Where a question's answer comes from, so you can go verify / study the source. */
export interface Reference {
  /** Human-readable title of the source, e.g. the paper or doc name. */
  sourceTitle: string;
  /** Optional link to the source. */
  url?: string;
  /** A page number or a section header to locate the material within the source. */
  locator:
    | { kind: 'page'; page: number }
    | { kind: 'section'; section: string };
}

/** A single answer option. `id` is unique within its question. */
export interface Answer {
  id: string;
  text: string;
}

export interface Question {
  /** Globally unique across all content (used as the key in saved history). */
  id: string;
  prompt: string;
  /** The one correct answer. */
  correct: Answer;
  /** Pool of incorrect answers of any size (>= 3). 3 are drawn at display time. */
  incorrect: Answer[];
  /** Shown after the question is answered. */
  explanation: string;
  reference: Reference;
  /** Optional free-form tags for cross-cutting weak-area analysis. */
  tags?: string[];
}

export interface Subject {
  /** Unique within its group. */
  id: string;
  name: string;
  description?: string;
  questions: Question[];
}

export interface SubjectGroup {
  /** Globally unique. */
  id: string;
  name: string;
  description?: string;
  subjects: Subject[];
}
