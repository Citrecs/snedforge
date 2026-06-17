import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { routes } from './router';
import { QuizSessionProvider } from './state/QuizSessionContext';

// Use the component router (MemoryRouter + useRoutes) rather than the data router
// in tests: it reuses the same route config but navigates via history, avoiding
// the data router's fetch/AbortSignal incompatibility under jsdom + Node.
function AppRoutes() {
  return useRoutes(routes);
}

function renderAt(path: string) {
  return render(
    <QuizSessionProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </QuizSessionProvider>,
  );
}

// The 4 answer options are the only buttons rendered with aria-pressed.
function answerButtons() {
  return screen.getAllByRole('button', { pressed: false });
}

function startQuizWithTwoQuestions() {
  const count = screen.getByRole('spinbutton');
  fireEvent.change(count, { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: /start quiz/i }));
}

beforeEach(() => {
  localStorage.clear();
});

describe('quiz flow — immediate grading', () => {
  it('shows 4 options, reveals feedback after answering, and reaches the summary', () => {
    renderAt('/setup');
    startQuizWithTwoQuestions();

    expect(screen.getByText(/Question 1 of 2/)).toBeInTheDocument();
    expect(answerButtons()).toHaveLength(4);

    // No feedback before answering.
    expect(screen.queryByText('Reference:')).not.toBeInTheDocument();

    // Answer -> immediate feedback (verdict + reference) appears.
    fireEvent.click(answerButtons()[0]);
    expect(screen.getByText(/Correct|Incorrect/)).toBeInTheDocument();
    expect(screen.getByText('Reference:')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/Question 2 of 2/)).toBeInTheDocument();
    fireEvent.click(answerButtons()[0]);

    fireEvent.click(screen.getByRole('button', { name: /finish quiz/i }));

    expect(screen.getByText(/Quiz complete/i)).toBeInTheDocument();
    expect(screen.getByText(/\/ 2/)).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });
});

describe('quiz flow — deferred grading', () => {
  it('hides correctness until the summary', () => {
    renderAt('/setup');

    // Switch to deferred grading before starting.
    fireEvent.click(screen.getByText(/Hide until the end/i));
    startQuizWithTwoQuestions();

    expect(screen.getByText(/Question 1 of 2/)).toBeInTheDocument();
    fireEvent.click(answerButtons()[0]);

    // Deferred mode: no explanation/reference shown mid-quiz.
    expect(screen.queryByText('Reference:')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(answerButtons()[0]);
    fireEvent.click(screen.getByRole('button', { name: /finish quiz/i }));

    // Summary now reveals references for review.
    expect(screen.getByText(/Quiz complete/i)).toBeInTheDocument();
    expect(screen.getAllByText('Reference:').length).toBeGreaterThan(0);
  });
});

describe('history persistence', () => {
  it('records a completed attempt to localStorage', () => {
    renderAt('/setup');
    startQuizWithTwoQuestions();
    fireEvent.click(answerButtons()[0]);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(answerButtons()[0]);
    fireEvent.click(screen.getByRole('button', { name: /finish quiz/i }));

    const raw = localStorage.getItem('learncard.history.v1');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.attempts).toHaveLength(1);
    expect(parsed.attempts[0].total).toBe(2);
  });
});
