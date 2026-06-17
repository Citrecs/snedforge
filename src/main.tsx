import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QuizSessionProvider } from './state/QuizSessionContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QuizSessionProvider>
      <RouterProvider router={router} />
    </QuizSessionProvider>
  </React.StrictMode>,
);
