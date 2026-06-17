import type { Reference } from '../types/content';

export function ReferenceLink({ reference }: { reference: Reference }) {
  const locator =
    reference.locator.kind === 'page'
      ? `p. ${reference.locator.page}`
      : `§ ${reference.locator.section}`;

  return (
    <p className="text-sm text-slate-500">
      <span className="font-medium text-slate-600">Reference:</span>{' '}
      {reference.url ? (
        <a
          href={reference.url}
          target="_blank"
          rel="noreferrer"
          className="text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
        >
          {reference.sourceTitle}
        </a>
      ) : (
        <span className="text-slate-600">{reference.sourceTitle}</span>
      )}{' '}
      <span className="text-slate-400">— {locator}</span>
    </p>
  );
}
