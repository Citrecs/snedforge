import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useContent } from '../hooks/useContent';

export function BrowsePage() {
  const { groups } = useContent();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Browse content</h1>
        <p className="mt-1 text-slate-600">All subject groups and their subjects.</p>
      </header>

      {groups.map((group) => (
        <section key={group.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">{group.name}</h2>
            <Link to={`/setup?group=${group.id}`}>
              <Button variant="secondary">Quiz whole group</Button>
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {group.subjects.map((subject) => (
              <Card key={subject.id} className="flex flex-col">
                <h3 className="font-semibold text-slate-900">{subject.name}</h3>
                {subject.description && (
                  <p className="mt-1 text-sm text-slate-600">{subject.description}</p>
                )}
                <p className="mt-2 text-xs text-slate-500">{subject.questions.length} questions</p>
                <div className="mt-4 flex-1" />
                <Link
                  to={`/setup?group=${group.id}&subject=${subject.id}`}
                  className="mt-2 self-start"
                >
                  <Button>Start quiz</Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
