import { clsx } from 'clsx';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';

function NavItem({ to, label, end }: { to: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        clsx(
          'rounded-md px-3 py-1.5 transition',
          isActive
            ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
        )
      }
    >
      {label}
    </NavLink>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100"
          >
            <span className="text-brand-600 dark:text-brand-400">◆</span> SnedForge
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <NavItem to="/" label="Home" end />
            <NavItem to="/browse" label="Browse" />
            <NavItem to="/setup" label="New Quiz" />
            <NavItem to="/history" label="History" />
            <span className="ml-1 flex items-center gap-1 border-l border-slate-200 pl-1 dark:border-slate-700">
              <button
                type="button"
                onClick={() => window.location.reload()}
                title="Reload the app"
                aria-label="Reload the app"
                className="rounded-md px-2 py-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                ⟳
              </button>
              <button
                type="button"
                onClick={toggle}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle dark mode"
                className="rounded-md px-2 py-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                {theme === 'dark' ? '☀' : '☾'}
              </button>
            </span>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
