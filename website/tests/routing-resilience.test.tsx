import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from '../src/components/ui/ErrorBoundary';
import ScrollToTop from '../src/components/layout/ScrollToTop';
import NotFoundPage from '../src/pages/NotFoundPage';

describe('Routing & Error Resilience', () => {
  describe('NotFoundPage (404 Handling)', () => {
    it('renders branded 404 page with navigation cards', () => {
      render(
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      );

      // Verify header and badge
      expect(screen.getByTestId('not-found-page')).toBeTruthy();
      expect(screen.getByText(/Error 404 · Page Not Found/i)).toBeTruthy();
      expect(screen.getByText(/Lost in the problem space\?/i)).toBeTruthy();

      // Verify quick navigation cards
      expect(screen.getByText('Company Question Sets')).toBeTruthy();
      expect(screen.getByText('Problems Catalog')).toBeTruthy();
      expect(screen.getByText('DSA Patterns')).toBeTruthy();
      expect(screen.getByText('Personal Progress')).toBeTruthy();

      // Verify return to home button
      expect(screen.getByText('Return to CompanyWise Home')).toBeTruthy();
    });

    it('renders NotFoundPage when navigating to an unmapped route in Routes', () => {
      render(
        <MemoryRouter initialEntries={['/non-existent-page-url']}>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('not-found-page')).toBeTruthy();
      expect(screen.queryByText('Home')).toBeNull();
    });
  });

  describe('ScrollToTop Component', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      window.scrollTo = vi.fn();
    });

    it('invokes window.scrollTo(0, 0) on route transition', () => {
      function TestNavigation() {
        return (
          <MemoryRouter initialEntries={['/initial']}>
            <ScrollToTop />
            <Routes>
              <Route
                path="/initial"
                element={<Link to="/destination">Go to Destination</Link>}
              />
              <Route path="/destination" element={<div>Destination Page</div>} />
            </Routes>
          </MemoryRouter>
        );
      }

      render(<TestNavigation />);

      // Initial mount triggers scrollTo
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

      // Transition to new route
      fireEvent.click(screen.getByText('Go to Destination'));
      expect(screen.getByText('Destination Page')).toBeTruthy();
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('ErrorBoundary Component', () => {
    // Suppress console.error in test runner for expected throw
    const originalConsoleError = console.error;
    beforeEach(() => {
      console.error = vi.fn();
    });

    afterEach(() => {
      console.error = originalConsoleError;
    });

    function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
      if (shouldThrow) {
        throw new Error('Test crash in child component');
      }
      return <div>Normal Content</div>;
    }

    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <BuggyComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Normal Content')).toBeTruthy();
      expect(screen.queryByTestId('error-boundary-fallback')).toBeNull();
    });

    it('catches rendering errors and displays recovery card instead of crashing', () => {
      render(
        <ErrorBoundary>
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-boundary-fallback')).toBeTruthy();
      expect(screen.getByText('Something went wrong')).toBeTruthy();
      expect(screen.getByText(/Your saved progress, bookmarks, and solved questions are completely safe/i)).toBeTruthy();
      expect(screen.getByText('Try Again')).toBeTruthy();
      expect(screen.getByText('Return to Home')).toBeTruthy();
    });

    it('supports custom fallback render prop', () => {
      render(
        <ErrorBoundary
          fallback={({ error }) => (
            <div data-testid="custom-fallback">Custom: {error?.message}</div>
          )}
        >
          <BuggyComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeTruthy();
      expect(screen.getByText('Custom: Test crash in child component')).toBeTruthy();
    });
  });
});
