import { clsx } from 'clsx';
import { Link, NavLink, Outlet } from 'react-router-dom';

function NavItem({ to, label, end }: { to: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        clsx(
          'rounded-md px-3 py-1.5 transition',
          isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100',
        )
      }
    >
      {label}
    </NavLink>
  );
}

export default function App() {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <span className="text-brand-600">◆</span> LearnCard
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <NavItem to="/" label="Home" end />
            <NavItem to="/browse" label="Browse" />
            <NavItem to="/setup" label="New Quiz" />
            <NavItem to="/history" label="History" />
            <button
              type="button"
              onClick={() => window.location.reload()}
              title="Reload to pick up edits you've made to the content files"
              className="ml-1 inline-flex items-center gap-1 rounded-md border-l border-slate-200 pl-3 pr-2 py-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <span aria-hidden className="text-base leading-none">⟳</span>
              Refresh
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
