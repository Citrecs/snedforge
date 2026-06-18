import { Navigate, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { AnswerOption } from '../components/AnswerOption';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { useQuizSession } from '../state/QuizSessionContext';
import { useHistory } from '../hooks/useHistory';
import { useContent } from '../hooks/useContent';
import { buildAttempt } from '../lib/scoring';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function QuizRunnerPage() {
  const { session, answer, next, prev, finish, reset } = useQuizSession();
  const { record } = useHistory();
  const { getSubject } = useContent();
  const navigate = useNavigate();

  // Guard: no active session (e.g. page refreshed) -> back to setup.
  if (!session || session.status !== 'active') {
    return <Navigate to="/setup" replace />;
  }

  const total = session.questions.length;
  const index = session.currentIndex;
  const current = session.questions[index];
  const answerRecord = session.answers[current.questionId];
  const answered = !!answerRecord;
  const immediate = session.config.gradingMode === 'immediate';
  const reveal = immediate && answered;
  const isLast = index === total - 1;
  const answeredCount = Object.keys(session.answers).length;
  const subjectName = getSubject(session.config.groupId, current.subjectId)?.name ?? '';

  function onSelect(optionId: string) {
    // In immediate mode, lock the answer once chosen. In deferred mode allow changing.
    if (immediate && answered) return;
    answer(current.questionId, optionId);
  }

  function onFinish() {
    const attempt = buildAttempt(session!, crypto.randomUUID(), Date.now());
    record(attempt);
    finish();
    navigate('/summary');
  }

  function onExit() {
    reset();
    navigate('/setup');
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm">
        <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
          {subjectName}
        </span>
        <button onClick={onExit} className="text-slate-400 dark:text-slate-500 hover:text-red-600">
          Exit quiz
        </button>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Question {index + 1} of {total}
          </span>
          <span>
            {answeredCount} answered
            {immediate ? '' : ' · feedback at the end'}
          </span>
        </div>
        <ProgressBar value={index + 1} max={total} />
      </div>

      <Card>
        <h2 className="text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100">{current.prompt}</h2>
        <div className="mt-4 grid gap-2">
          {current.options.map((option, i) => (
            <AnswerOption
              key={option.id}
              label={LETTERS[i]}
              text={option.text}
              selected={answerRecord?.selectedOptionId === option.id}
              isCorrect={option.id === current.correctOptionId}
              reveal={reveal}
              disabled={reveal}
              onClick={() => onSelect(option.id)}
            />
          ))}
        </div>

        {reveal && (
          <ExplanationPanel
            explanation={current.explanation}
            reference={current.reference}
            verdict={answerRecord?.correct ? 'correct' : 'incorrect'}
          />
        )}
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={prev} disabled={index === 0}>
          ← Prev
        </Button>
        <div className="flex gap-2">
          {!isLast && (
            <Button variant="ghost" onClick={onFinish}>
              Finish early
            </Button>
          )}
          {isLast ? (
            <Button onClick={onFinish}>Finish quiz</Button>
          ) : (
            <Button onClick={next}>Next →</Button>
          )}
        </div>
      </div>
    </div>
  );
}
