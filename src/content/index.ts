import type { SubjectGroup } from '../types/content';
import { groupsSchema } from './schema';
import { googleCloudNetworking } from './groups/google-cloud-networking';

// Register all subject groups here. Add new groups to this array.
const rawGroups: SubjectGroup[] = [googleCloudNetworking];

// Validate at module load so a bad hand-edit fails fast with a readable error
// (which question / which field) instead of breaking the UI mysteriously.
const result = groupsSchema.safeParse(rawGroups);
if (!result.success) {
  console.error('LearnCard content failed validation:', result.error.format());
  throw new Error('LearnCard content failed validation — see console for details.');
}

export const groups: SubjectGroup[] = rawGroups;

export function getGroup(groupId: string): SubjectGroup | undefined {
  return groups.find((g) => g.id === groupId);
}

export function getSubject(groupId: string, subjectId: string) {
  return getGroup(groupId)?.subjects.find((s) => s.id === subjectId);
}

/** Total question count for a set of subjects within a group. */
export function countQuestions(groupId: string, subjectIds: string[]): number {
  const group = getGroup(groupId);
  if (!group) return 0;
  return group.subjects
    .filter((s) => subjectIds.includes(s.id))
    .reduce((sum, s) => sum + s.questions.length, 0);
}
