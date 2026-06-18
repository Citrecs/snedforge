import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useContent } from '../hooks/useContent';
import { useQuizSession } from '../state/QuizSessionContext';
import type { GradingMode, Ordering } from '../types/session';

interface ChoiceProps<T extends string> {
  value: T;
  current: T;
  title: string;
  description: string;
  onSelect: (v: T) => void;
}

function Choice<T extends string>({ value, current, title, description, onSelect }: ChoiceProps<T>) {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={clsx(
        'rounded-lg border p-3 text-left transition',
        active
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 ring-1 ring-brand-500'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600',
      )}
    >
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{description}</p>
    </button>
  );
}

export function QuizSetupPage() {
  const { groups } = useContent();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { start } = useQuizSession();

  const paramGroup = params.get('group');
  const initialGroupId =
    paramGroup && groups.some((g) => g.id === paramGroup) ? paramGroup : groups[0].id;

  const [groupId, setGroupId] = useState(initialGroupId);
  const group = groups.find((g) => g.id === groupId) ?? groups[0];

  const paramSubject = params.get('subject');
  const [subjectIds, setSubjectIds] = useState<string[]>(() => {
    if (paramSubject && group.subjects.some((s) => s.id === paramSubject)) return [paramSubject];
    return group.subjects.map((s) => s.id);
  });

  const [gradingMode, setGradingMode] = useState<GradingMode>('immediate');
  const [ordering, setOrdering] = useState<Ordering>('shuffle');
  const [questionCount, setQuestionCount] = useState(10);

  const available = useMemo(
    () =>
      group.subjects
        .filter((s) => subjectIds.includes(s.id))
        .reduce((n, s) => n + s.questions.length, 0),
    [group, subjectIds],
  );

  function changeGroup(id: string) {
    setGroupId(id);
    const next = groups.find((g) => g.id === id)!;
    setSubjectIds(next.subjects.map((s) => s.id));
  }

  function toggleSubject(id: string) {
    setSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function onStart() {
    if (available === 0) return;
    const count = Math.min(Math.max(1, questionCount), available);
    start({ groupId, subjectIds, gradingMode, ordering, questionCount: count });
    navigate('/quiz');
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">New quiz</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">Choose what to study and how you want to be graded.</p>
      </header>

      {groups.length > 1 && (
        <Card>
          <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">Subject group</label>
          <select
            value={groupId}
            onChange={(e) => changeGroup(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 px-3 py-2 text-sm"
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </Card>
      )}

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Subjects</h2>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              className="text-brand-600 dark:text-brand-400 hover:underline"
              onClick={() => setSubjectIds(group.subjects.map((s) => s.id))}
            >
              Select all
            </button>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <button
              type="button"
              className="text-brand-600 dark:text-brand-400 hover:underline"
              onClick={() => setSubjectIds([])}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {group.subjects.map((subject) => {
            const checked = subjectIds.includes(subject.id);
            return (
              <label
                key={subject.id}
                className={clsx(
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition',
                  checked ? 'border-brand-400 bg-brand-50 dark:bg-brand-950/50' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSubject(subject.id)}
                  className="mt-1 h-4 w-4 accent-brand-600"
                />
                <span>
                  <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">{subject.name}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {subject.questions.length} questions
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">Grading</h2>
          <div className="grid gap-2">
            <Choice
              value="immediate"
              current={gradingMode}
              onSelect={setGradingMode}
              title="Immediate feedback"
              description="Show correct/incorrect right after each answer, with the explanation."
            />
            <Choice
              value="deferred"
              current={gradingMode}
              onSelect={setGradingMode}
              title="Hide until the end"
              description="No feedback during the quiz; see everything on the summary page."
            />
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">Question order</h2>
          <div className="grid gap-2">
            <Choice
              value="shuffle"
              current={ordering}
              onSelect={setOrdering}
              title="Shuffle"
              description="Random order each time you take the quiz."
            />
            <Choice
              value="inOrder"
              current={ordering}
              onSelect={setOrdering}
              title="In order"
              description="Questions in the order they're authored."
            />
          </div>
        </Card>
      </div>

      <Card>
        <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100">
          Number of questions
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={available}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-24 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 px-3 py-2 text-sm"
          />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            of {available} available
            {questionCount > available && available > 0 && ' (will be capped)'}
          </span>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {available === 0 ? 'Select at least one subject to begin.' : `${Math.min(Math.max(1, questionCount), available)} questions ready.`}
        </p>
        <Button onClick={onStart} disabled={available === 0}>
          Start quiz →
        </Button>
      </div>
    </div>
  );
}
