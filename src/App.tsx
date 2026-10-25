import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { useTheme } from './hooks/useTheme';
import LoadingSpinner from './components/ui/LoadingSpinner';

const HomePage = lazy(() => import('./pages/HomePage'));
const CompaniesPage = lazy(() => import('./pages/CompaniesPage'));
const CompanyDetailPage = lazy(() => import('./pages/CompanyDetailPage'));
const ProblemsPage = lazy(() => import('./pages/ProblemsPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));

export default function App() {
  const { isDark, toggle } = useTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout isDark={isDark} onToggleTheme={toggle} />}>
          <Route
            index
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="companies"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CompaniesPage />
              </Suspense>
            }
          />
          <Route
            path="companies/:slug"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CompanyDetailPage />
              </Suspense>
            }
          />
          <Route
            path="problems"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProblemsPage />
              </Suspense>
            }
          />
          <Route
            path="progress"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProgressPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
