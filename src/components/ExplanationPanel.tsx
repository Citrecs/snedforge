import { clsx } from 'clsx';
import type { Reference } from '../types/content';
import { ReferenceLink } from './ReferenceLink';

interface Props {
  explanation: string;
  reference: Reference;
  verdict?: 'correct' | 'incorrect' | null;
}

export function ExplanationPanel({ explanation, reference, verdict }: Props) {
  return (
    <div className="mt-4 rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
      {verdict && (
        <p
          className={clsx(
            'mb-2 text-sm font-semibold',
            verdict === 'correct' ? 'text-green-700' : 'text-red-700',
          )}
        >
          {verdict === 'correct' ? '✓ Correct' : '✗ Incorrect'}
        </p>
      )}
      <p className="text-sm leading-relaxed text-slate-700">{explanation}</p>
      <div className="mt-3">
        <ReferenceLink reference={reference} />
      </div>
    </div>
  );
}
