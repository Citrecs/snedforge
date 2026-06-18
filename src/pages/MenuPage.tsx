import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useContent } from '../hooks/useContent';
import { useHistory } from '../hooks/useHistory';
import { overallStats } from '../lib/stats';

export function MenuPage() {
  const { groups } = useContent();
  const { attempts } = useHistory();
  const stats = overallStats(attempts);

  const totalQuestions = groups.reduce(
    (sum, g) => sum + g.subjects.reduce((s, sub) => s + sub.questions.length, 0),
    0,
  );

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">SnedForge</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          A personal flashcard &amp; quiz trainer. Pick a subject, choose how you want to be graded,
          and drill until it sticks.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/setup">
            <Button>Start a quiz</Button>
          </Link>
          <Link to="/browse">
            <Button variant="secondary">Browse subjects</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Subject groups</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{groups.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total questions</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{totalQuestions}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Quizzes taken</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{stats.attempts}</p>
          {stats.attempts > 0 && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {Math.round(stats.accuracy * 100)}% lifetime accuracy
            </p>
          )}
        </Card>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Subject groups</h2>
          <Link to="/history" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
            View history →
          </Link>
        </div>
        <div className="space-y-3">
          {groups.map((g) => (
            <Card key={g.id} className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{g.name}</h3>
                {g.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{g.description}</p>}
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {g.subjects.length} subjects ·{' '}
                  {g.subjects.reduce((s, sub) => s + sub.questions.length, 0)} questions
                </p>
              </div>
              <Link to={`/setup?group=${g.id}`} className="flex-none">
                <Button variant="secondary">Quiz this</Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
