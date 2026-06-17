import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useHistory } from '../hooks/useHistory';
import { useContent } from '../hooks/useContent';
import { overallStats, weakAreas } from '../lib/stats';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function HistoryPage() {
  const { attempts, clear } = useHistory();
  const { getGroup, getSubject } = useContent();
  const stats = overallStats(attempts);
  const weak = weakAreas(attempts, 4);

  if (attempts.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">History</h1>
        <Card className="text-center">
          <p className="text-slate-600">No quizzes yet.</p>
          <Link to="/setup" className="mt-4 inline-block">
            <Button>Take your first quiz</Button>
          </Link>
        </Card>
      </div>
    );
  }

  function onClear() {
    if (window.confirm('Clear all saved quiz history? This cannot be undone.')) {
      clear();
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">History</h1>
        <Button variant="ghost" onClick={onClear} className="text-red-600 hover:bg-red-50">
          Clear history
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Quizzes taken</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.attempts}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Questions answered</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.questionsAnswered}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Lifetime accuracy</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {Math.round(stats.accuracy * 100)}%
          </p>
        </Card>
      </section>

      {weak.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Weak areas</h2>
          <Card>
            <p className="mb-3 text-sm text-slate-500">
              Subjects with the lowest accuracy (at least 4 questions answered). Good targets for
              your next quiz.
            </p>
            <div className="space-y-2">
              {weak.slice(0, 6).map((s) => {
                const subjectName = getSubject(s.groupId, s.subjectId)?.name ?? s.subjectId;
                const pct = Math.round(s.accuracy * 100);
                return (
                  <div key={`${s.groupId}::${s.subjectId}`} className="flex items-center gap-3">
                    <span className="w-56 flex-none truncate text-sm text-slate-700">
                      {subjectName}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={clsx(
                          'h-full rounded-full',
                          pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-500',
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-20 flex-none text-right text-sm text-slate-600">
                      {pct}% ({s.correct}/{s.total})
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Past attempts</h2>
        <div className="space-y-2">
          {attempts.map((a) => {
            const group = getGroup(a.groupId);
            const subjectNames = a.subjectIds
              .map((id) => getSubject(a.groupId, id)?.name ?? id)
              .join(', ');
            const pct = a.total ? Math.round((a.score / a.total) * 100) : 0;
            return (
              <Card key={a.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">
                    {group?.name ?? a.groupId}
                  </p>
                  <p className="truncate text-xs text-slate-500">{subjectNames}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(a.finishedAt)} ·{' '}
                    {a.gradingMode === 'immediate' ? 'Immediate' : 'Deferred'}
                  </p>
                </div>
                <div className="flex-none text-right">
                  <p
                    className={clsx(
                      'text-lg font-semibold',
                      pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-amber-500' : 'text-red-600',
                    )}
                  >
                    {a.score}/{a.total}
                  </p>
                  <p className="text-xs text-slate-500">{pct}%</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="flex justify-center">
        <Link to="/setup">
          <Button>New quiz</Button>
        </Link>
      </div>
    </div>
  );
}
