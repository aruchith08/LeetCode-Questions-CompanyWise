import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from '../src/components/ui/ErrorBoundary';
import ScrollToTop from '../src/components/layout/ScrollToTop';
import NotFoundPage from '../src/pages/NotFoundPage';
import CompanyDetailPage from '../src/pages/CompanyDetailPage';
import { ProgressProvider } from '../src/hooks/useProgress';

// Mock useCompanyData and useDataIndex for deterministic testing
vi.mock('../src/hooks/useCompanyData', () => ({
  useCompanyData: vi.fn(),
}));

vi.mock('../src/hooks/useDataIndex', () => ({
  useDataIndex: vi.fn(),
}));

import { useCompanyData } from '../src/hooks/useCompanyData';
import { useDataIndex } from '../src/hooks/useDataIndex';

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

    it('invokes window.scrollTo(0, 0) on route transition without hash', () => {
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
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

      fireEvent.click(screen.getByText('Go to Destination'));
      expect(screen.getByText('Destination Page')).toBeTruthy();
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('scrolls into view when anchor hash element is present', () => {
      const scrollIntoViewMock = vi.fn();
      const targetDiv = document.createElement('div');
      targetDiv.id = 'practice-section';
      targetDiv.scrollIntoView = scrollIntoViewMock;
      document.body.appendChild(targetDiv);

      render(
        <MemoryRouter initialEntries={['/patterns/sliding-window#practice-section']}>
          <ScrollToTop />
        </MemoryRouter>
      );

      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
      document.body.removeChild(targetDiv);
    });
  });

  describe('ErrorBoundary Component', () => {
    const originalConsoleError = console.error;
    beforeEach(() => {
      console.error = vi.fn();
    });

    afterEach(() => {
      console.error = originalConsoleError;
    });

    function DynamicBuggyComponent() {
      const [crash, setCrash] = useState(true);
      if (crash) {
        return (
          <div>
            <button onClick={() => setCrash(false)}>Fix</button>
            {(() => { throw new Error('Simulated UI crash'); })()}
          </div>
        );
      }
      return <div>Recovered Successfully!</div>;
    }

    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Healthy Content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Healthy Content')).toBeTruthy();
      expect(screen.queryByTestId('error-boundary-fallback')).toBeNull();
    });

    it('catches rendering errors and displays recovery card instead of crashing', () => {
      render(
        <ErrorBoundary>
          <DynamicBuggyComponent />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-boundary-fallback')).toBeTruthy();
      expect(screen.getByText('Something went wrong')).toBeTruthy();
      expect(screen.getByText('Try Again')).toBeTruthy();
      expect(screen.getByText('Return to Home')).toBeTruthy();
    });

    it('handles repeated failures gracefully by presenting hard reset action', () => {
      function AlwaysThrows() {
        throw new Error('Unrecoverable error');
      }

      render(
        <ErrorBoundary>
          <AlwaysThrows />
        </ErrorBoundary>
      );

      // First crash: retryCount = 0
      expect(screen.getByText('Something went wrong')).toBeTruthy();
      const retryBtn = screen.getByText('Try Again');

      // Click Try Again once: retryCount = 1
      fireEvent.click(retryBtn);
      expect(screen.getByText('Something went wrong')).toBeTruthy();

      // Click Try Again second time: retryCount = 2 -> repeated failure
      fireEvent.click(screen.getByText('Try Again'));
      expect(screen.getByText('Persistent Rendering Error')).toBeTruthy();
      expect(screen.getByText('Clear Cache & Reset')).toBeTruthy();
    });
  });

  describe('Invalid Company URLs vs Network Errors', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      localStorage.clear();
    });

    it('renders branded 404 page when company slug does not exist in catalog index', () => {
      (useDataIndex as any).mockReturnValue({
        data: {
          totalCompanies: 2,
          totalQuestions: 100,
          difficultyCounts: { Easy: 30, Medium: 50, Hard: 20 },
          companies: [
            { slug: 'google', name: 'Google', questionCount: 50 },
            { slug: 'amazon', name: 'Amazon', questionCount: 50 },
          ],
        },
        loading: false,
        error: null,
      });

      (useCompanyData as any).mockReturnValue({
        data: null,
        loading: false,
        error: 'Company "fake-company-slug" not found',
        isNotFound: true,
        loadCompany: vi.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/companies/fake-company-slug']}>
          <ProgressProvider>
            <Routes>
              <Route path="/companies/:slug" element={<CompanyDetailPage />} />
            </Routes>
          </ProgressProvider>
        </MemoryRouter>
      );

      // Must render branded NotFoundPage, not generic text
      expect(screen.getByTestId('not-found-page')).toBeTruthy();
      expect(screen.getByText(/Lost in the problem space\?/i)).toBeTruthy();
    });

    it('renders network retry card with functional retry button when valid company fails due to network', () => {
      const mockLoad = vi.fn();

      (useDataIndex as any).mockReturnValue({
        data: {
          totalCompanies: 2,
          totalQuestions: 100,
          difficultyCounts: { Easy: 30, Medium: 50, Hard: 20 },
          companies: [
            { slug: 'google', name: 'Google', questionCount: 50 },
          ],
        },
        loading: false,
        error: null,
      });

      (useCompanyData as any).mockReturnValue({
        data: null,
        loading: false,
        error: 'Network connection failed (Failed to fetch)',
        isNotFound: false,
        loadCompany: mockLoad,
      });

      render(
        <MemoryRouter initialEntries={['/companies/google']}>
          <ProgressProvider>
            <Routes>
              <Route path="/companies/:slug" element={<CompanyDetailPage />} />
            </Routes>
          </ProgressProvider>
        </MemoryRouter>
      );

      // Must render retry card
      expect(screen.getByText('Failed to load company questions')).toBeTruthy();
      expect(screen.getByText(/Network connection failed/i)).toBeTruthy();

      const retryBtn = screen.getByText('Retry Loading');
      fireEvent.click(retryBtn);
      expect(mockLoad).toHaveBeenCalledWith('google');
    });
  });
});
