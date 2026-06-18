# SnedForge

A personal flashcard / quiz trainer. Organize material as **Subject Group → Subject → Questions**,
take quizzes with either immediate or end-of-quiz grading, review every answer with explanations and
source references, and track your accuracy over time to find weak areas.

Ships with a study set for Google's *Technical Program Manager III, Workspace Delivery, Cloud
Networking* role: **B4**, **Jupiter Rising**, **Jupiter Evolving**, core datacenter-networking terms,
and physical-layer/RCDD refreshers.

## Running it

```bash
npm install      # first time only
npm run dev      # open the printed http://localhost:5173
```

Other scripts:

```bash
npm test         # unit + integration tests (Vitest)
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## How a question works

Each question stores **one correct answer** and a **pool of incorrect answers of any size**. When the
question is shown, the app picks the correct answer plus **3 random distinct distractors** from the pool
and shuffles them, so you see 4 options and the wrong choices vary between runs. After answering you get
an **explanation** and a **reference** (source title, optional link, and a page number or section header).

Quizzes have two grading modes, chosen on the setup screen:

- **Immediate** — correct/incorrect (and the explanation) is shown right after each answer.
- **Deferred** — nothing is revealed until the end-of-quiz summary.

The summary shows your score, a per-subject breakdown, and a full review of every question. Completed
quizzes are saved to your browser (localStorage); the **History** page shows past attempts and your
weakest subjects.

## Adding or editing content

Content is plain TypeScript so you get autocomplete and compile-time checks. Each subject is one file:

```
src/content/
  index.ts                         # registers all groups (add new groups here)
  schema.ts                        # zod validation (runs at load; bad edits fail fast)
  groups/google-cloud-networking/
    index.ts                       # the SubjectGroup (lists its subjects)
    fundamentals.ts                # a Subject = { id, name, questions: [...] }
    b4.ts
    jupiter-rising.ts
    jupiter-evolving.ts
    physical-layer.ts
```

To add a question, append to a subject's `questions` array following the existing shape. Rules enforced
by validation: every question needs **≥ 3 incorrect answers**, answer `id`s must be unique within a
question, and question `id`s must be globally unique. To add a whole new subject, create a file exporting
a `Subject` and add it to that group's `index.ts`; to add a new group, create a folder and register it in
`src/content/index.ts`.

## Project layout

- `src/types/` — content and session type definitions.
- `src/lib/` — pure logic: `shuffle.ts` (seedable option selection), `quiz.ts` (builds a session),
  `scoring.ts`, `stats.ts`, and `storage/` (the localStorage data-access layer).
- `src/state/QuizSessionContext.tsx` — the active-quiz state machine.
- `src/components/` and `src/pages/` — the UI.
