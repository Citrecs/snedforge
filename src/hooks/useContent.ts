import { groups, getGroup, getSubject, countQuestions } from '../content';

/** Thin accessor for the (static, validated) content tree. */
export function useContent() {
  return { groups, getGroup, getSubject, countQuestions };
}
