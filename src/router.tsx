import { createHashRouter, type RouteObject } from 'react-router-dom';
import App from './App';
import { MenuPage } from './pages/MenuPage';
import { BrowsePage } from './pages/BrowsePage';
import { QuizSetupPage } from './pages/QuizSetupPage';
import { QuizRunnerPage } from './pages/QuizRunnerPage';
import { SummaryPage } from './pages/SummaryPage';
import { HistoryPage } from './pages/HistoryPage';

// Exported so tests can mount the same tree with a memory router.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <MenuPage /> },
      { path: 'browse', element: <BrowsePage /> },
      { path: 'setup', element: <QuizSetupPage /> },
      { path: 'quiz', element: <QuizRunnerPage /> },
      { path: 'summary', element: <SummaryPage /> },
      { path: 'history', element: <HistoryPage /> },
    ],
  },
];

// Hash routing keeps deep links and page refreshes working on static hosts like
// GitHub Pages (no server-side rewrite needed).
export const router = createHashRouter(routes);
