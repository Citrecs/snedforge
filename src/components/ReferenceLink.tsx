import type { Reference } from '../types/content';

export function ReferenceLink({ reference }: { reference: Reference }) {
  const locator =
    reference.locator.kind === 'page'
      ? `p. ${reference.locator.page}`
      : `§ ${reference.locator.section}`;

  return (
    <p className="text-sm text-slate-500 dark:text-slate-400">
      <span className="font-medium text-slate-600 dark:text-slate-300">Reference:</span>{' '}
      {reference.url ? (
        <a
          href={reference.url}
          target="_blank"
          rel="noreferrer"
          className="text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700 dark:text-brand-400 dark:decoration-brand-700 dark:hover:text-brand-300"
        >
          {reference.sourceTitle}
        </a>
      ) : (
        <span className="text-slate-600 dark:text-slate-300">{reference.sourceTitle}</span>
      )}{' '}
      <span className="text-slate-400 dark:text-slate-500">— {locator}</span>
    </p>
  );
}
