import { z } from 'zod';
import { DISTRACTOR_COUNT } from '../lib/shuffle';

// Runtime validation for hand-authored content. Mirrors src/types/content.ts and
// adds cross-field checks so authoring mistakes surface immediately (in dev).

export const referenceSchema = z.object({
  sourceTitle: z.string().min(1),
  url: z.string().url().optional(),
  locator: z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('page'), page: z.number().int().positive() }),
    z.object({ kind: z.literal('section'), section: z.string().min(1) }),
  ]),
});

export const answerSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

export const questionSchema = z
  .object({
    id: z.string().min(1),
    prompt: z.string().min(1),
    correct: answerSchema,
    incorrect: z.array(answerSchema).min(DISTRACTOR_COUNT),
    explanation: z.string().min(1),
    reference: referenceSchema,
    tags: z.array(z.string().min(1)).optional(),
  })
  .superRefine((q, ctx) => {
    const ids = [q.correct.id, ...q.incorrect.map((a) => a.id)];
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Question "${q.id}" has duplicate answer ids`,
      });
    }
  });

export const subjectSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    questions: z.array(questionSchema).min(1),
  })
  .superRefine((s, ctx) => {
    const ids = s.questions.map((q) => q.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Subject "${s.id}" has duplicate question ids`,
      });
    }
  });

export const subjectGroupSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    subjects: z.array(subjectSchema).min(1),
  })
  .superRefine((g, ctx) => {
    const ids = g.subjects.map((s) => s.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Group "${g.id}" has duplicate subject ids`,
      });
    }
  });

export const groupsSchema = z.array(subjectGroupSchema).superRefine((groups, ctx) => {
  const groupIds = groups.map((g) => g.id);
  if (new Set(groupIds).size !== groupIds.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Duplicate group ids across content' });
  }
  const questionIds = groups.flatMap((g) => g.subjects.flatMap((s) => s.questions.map((q) => q.id)));
  if (new Set(questionIds).size !== questionIds.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Duplicate question ids across all content (ids must be globally unique)',
    });
  }
});
