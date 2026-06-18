import { clsx } from 'clsx';

interface Props {
  label: string; // A / B / C / D
  text: string;
  selected: boolean; // user picked this option
  isCorrect: boolean; // this option is the correct answer
  reveal: boolean; // show correct/incorrect coloring
  disabled?: boolean;
  onClick?: () => void;
}

export function AnswerOption({ label, text, selected, isCorrect, reveal, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={clsx(
        'flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition',
        // Selection highlight (no correctness shown yet)
        !reveal &&
          selected &&
          'border-brand-500 bg-brand-50 ring-1 ring-brand-500 dark:bg-brand-950/50',
        !reveal &&
          !selected &&
          'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800',
        // Correctness revealed
        reveal && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-950/40',
        reveal && !isCorrect && selected && 'border-red-500 bg-red-50 dark:bg-red-950/40',
        reveal &&
          !isCorrect &&
          !selected &&
          'border-slate-200 bg-white opacity-70 dark:border-slate-700 dark:bg-slate-900',
        disabled && !reveal && 'cursor-default',
      )}
    >
      <span
        className={clsx(
          'flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-semibold',
          !reveal && selected && 'bg-brand-600 text-white',
          !reveal && !selected && 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
          reveal && isCorrect && 'bg-green-600 text-white',
          reveal && !isCorrect && selected && 'bg-red-600 text-white',
          reveal &&
            !isCorrect &&
            !selected &&
            'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        )}
      >
        {label}
      </span>
      <span className="pt-0.5">{text}</span>
      {reveal && isCorrect && (
        <span className="ml-auto pt-0.5 font-semibold text-green-600 dark:text-green-400">✓</span>
      )}
      {reveal && !isCorrect && selected && (
        <span className="ml-auto pt-0.5 font-semibold text-red-600 dark:text-red-400">✗</span>
      )}
    </button>
  );
}
