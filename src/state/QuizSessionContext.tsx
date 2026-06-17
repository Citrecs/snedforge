import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { QuizConfig, QuizSession } from '../types/session';
import { buildSession } from '../lib/quiz';

type Action =
  | { type: 'START'; config: QuizConfig; startedAt: number }
  | { type: 'ANSWER'; questionId: string; selectedOptionId: string | null; answeredAt: number }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GOTO'; index: number }
  | { type: 'FINISH' }
  | { type: 'RESET' };

function clampIndex(session: QuizSession, index: number): number {
  return Math.max(0, Math.min(index, session.questions.length - 1));
}

function reducer(state: QuizSession | null, action: Action): QuizSession | null {
  switch (action.type) {
    case 'START':
      return {
        config: action.config,
        questions: buildSession(action.config),
        currentIndex: 0,
        answers: {},
        status: 'active',
        startedAt: action.startedAt,
      };
    case 'ANSWER': {
      if (!state) return state;
      const question = state.questions.find((q) => q.questionId === action.questionId);
      if (!question) return state;
      const correct = action.selectedOptionId === question.correctOptionId;
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: {
            questionId: action.questionId,
            selectedOptionId: action.selectedOptionId,
            correct,
            answeredAt: action.answeredAt,
          },
        },
      };
    }
    case 'NEXT':
      return state ? { ...state, currentIndex: clampIndex(state, state.currentIndex + 1) } : state;
    case 'PREV':
      return state ? { ...state, currentIndex: clampIndex(state, state.currentIndex - 1) } : state;
    case 'GOTO':
      return state ? { ...state, currentIndex: clampIndex(state, action.index) } : state;
    case 'FINISH':
      return state ? { ...state, status: 'finished' } : state;
    case 'RESET':
      return null;
  }
}

interface QuizSessionContextValue {
  session: QuizSession | null;
  start: (config: QuizConfig) => void;
  answer: (questionId: string, selectedOptionId: string | null) => void;
  next: () => void;
  prev: () => void;
  goto: (index: number) => void;
  finish: () => void;
  reset: () => void;
}

const QuizSessionContext = createContext<QuizSessionContextValue | null>(null);

export function QuizSessionProvider({ children }: { children: ReactNode }) {
  const [session, dispatch] = useReducer(reducer, null);

  const value = useMemo<QuizSessionContextValue>(
    () => ({
      session,
      start: (config) => dispatch({ type: 'START', config, startedAt: Date.now() }),
      answer: (questionId, selectedOptionId) =>
        dispatch({ type: 'ANSWER', questionId, selectedOptionId, answeredAt: Date.now() }),
      next: () => dispatch({ type: 'NEXT' }),
      prev: () => dispatch({ type: 'PREV' }),
      goto: (index) => dispatch({ type: 'GOTO', index }),
      finish: () => dispatch({ type: 'FINISH' }),
      reset: () => dispatch({ type: 'RESET' }),
    }),
    [session],
  );

  return <QuizSessionContext.Provider value={value}>{children}</QuizSessionContext.Provider>;
}

export function useQuizSession(): QuizSessionContextValue {
  const ctx = useContext(QuizSessionContext);
  if (!ctx) {
    throw new Error('useQuizSession must be used within a QuizSessionProvider');
  }
  return ctx;
}
