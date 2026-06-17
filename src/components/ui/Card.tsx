import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200', className)}
      {...rest}
    />
  );
}
