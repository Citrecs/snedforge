import { Navigate, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AnswerOption } from '../components/AnswerOption';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { useQuizSession } from '../state/QuizSessionContext';
import { useContent } from '../hooks/useContent';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function SummaryPage() {
  const { session, reset, start } = useQuizSession();
  const { getSubject } = useContent();
  const navigate = useNavigate();

  if (!session || session.status !== 'finished') {
    return <Navigate to="/setup" replace />;
  }

  const total = session.questions.length;
  const score = session.questions.filter((q) => session.answers[q.questionId]?.correct).length;
  const pct = total ? Math.round((score / total) * 100) : 0;

  // Per-subject breakdown (shown when the quiz spanned more than one subject).
  const bySubject = new Map<string, { name: string; total: number; correct: number }>();
  for (const q of session.questions) {
    const name = getSubject(session.config.groupId, q.subjectId)?.name ?? q.subjectId;
    const entry = bySubject.get(q.subjectId) ?? { name, total: 0, correct: 0 };
    entry.total += 1;
    if (session.answers[q.questionId]?.correct) entry.correct += 1;
    bySubject.set(q.subjectId, entry);
  }

  function backToMenu() {
    reset();
    navigate('/');
  }

  function retake() {
    start(session!.config);
    navigate('/quiz');
  }

  function newQuiz() {
    reset();
    navigate('/setup');
  }

  return (
    <div className="space-y-6">
      <Card className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Quiz complete</p>
        <p
          className={clsx(
            'mt-2 text-5xl font-bold',
            pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-amber-500' : 'text-red-600',
          )}
        >
          {score} / {total}
        </p>
        <p className="mt-1 text-slate-600">{pct}% correct</p>

        {bySubject.size > 1 && (
          <div className="mx-auto mt-5 max-w-md space-y-1 text-left">
            {[...bySubject.values()].map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{s.name}</span>
                <span className="font-medium text-slate-800">
                  {s.correct}/{s.total}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={backToMenu}>Back to menu</Button>
          <Button variant="secondary" onClick={retake}>
            Retake this quiz
          </Button>
          <Button variant="ghost" onClick={newQuiz}>
            New quiz
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Review</h2>
        <div className="space-y-4">
          {session.questions.map((q, qi) => {
            const ans = session.answers[q.questionId];
            const verdict = !ans ? 'skipped' : ans.correct ? 'correct' : 'incorrect';
            const subjectName = getSubject(session.config.groupId, q.subjectId)?.name ?? '';
            return (
              <Card key={q.questionId}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Q{qi + 1} · {subjectName}
                  </span>
                  <span
                    className={clsx(
                      'font-semibold',
                      verdict === 'correct'
                        ? 'text-green-600'
                        : verdict === 'incorrect'
                          ? 'text-red-600'
                          : 'text-slate-400',
                    )}
                  >
                    {verdict === 'correct'
                      ? '✓ Correct'
                      : verdict === 'incorrect'
                        ? '✗ Incorrect'
                        : 'Skipped'}
                  </span>
                </div>
                <h3 className="font-semibold leading-snug text-slate-900">{q.prompt}</h3>
                <div className="mt-3 grid gap-2">
                  {q.options.map((o, i) => (
                    <AnswerOption
                      key={o.id}
                      label={LETTERS[i]}
                      text={o.text}
                      selected={ans?.selectedOptionId === o.id}
                      isCorrect={o.id === q.correctOptionId}
                      reveal
                      disabled
                    />
                  ))}
                </div>
                <ExplanationPanel explanation={q.explanation} reference={q.reference} />
              </Card>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <Button onClick={backToMenu}>Back to menu</Button>
      </div>
    </div>
  );
}
