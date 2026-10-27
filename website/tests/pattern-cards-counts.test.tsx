import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PatternCard from '../src/components/patterns/PatternCard';
import { PATTERNS_CATALOG } from '../src/data/patternsData';
import type { DSAPattern } from '../src/types/patterns';

describe('Pattern Cards Display & Real Question Counts', () => {
  it('renders real curated question count and progress for available pattern (Sliding Window)', () => {
    const slidingWindowPattern = PATTERNS_CATALOG.find(p => p.slug === 'sliding-window')!;

    render(
      <MemoryRouter>
        <PatternCard
          pattern={slidingWindowPattern}
          solvedCount={3}
          totalQuestions={15}
        />
      </MemoryRouter>
    );

    // Should display real progress: 3/15 (20%)
    expect(screen.getByText('3/15 (20%)')).toBeTruthy();
    expect(screen.getByRole('link', { name: /start learning/i })).toBeTruthy();
  });

  it('does NOT render fabricated question counts or fictional progress bars for upcoming patterns', () => {
    const mockUpcomingPattern: DSAPattern = {
      id: 'mock-upcoming',
      slug: 'mock-upcoming',
      title: 'Mock Upcoming Pattern',
      shortDescription: 'Upcoming description',
      level: 'Foundation',
      availability: 'upcoming',
      category: 'Mock Category',
      tags: ['Mock'],
    };

    const { unmount } = render(
      <MemoryRouter>
        <PatternCard
          pattern={mockUpcomingPattern}
          solvedCount={0}
        />
      </MemoryRouter>
    );

    // Should display "Coming Soon" and "Phase 2" placeholder
    const btn = screen.getByRole('button', { name: /coming soon/i });
    expect(btn).toBeTruthy();
    expect(btn.hasAttribute('disabled')).toBe(true);
    expect(screen.getByText(/curated practice collection/i)).toBeTruthy();
    expect(screen.getByText(/phase 2/i)).toBeTruthy();

    // Should NOT render any fabricated progress text (e.g. "0/42 (0%)" or "0/38")
    expect(screen.queryByText(/\d+\/\d+\s*\(\d+%\)/)).toBeNull();

    unmount();
  });

  it('guarantees all 18 available patterns in PATTERNS_CATALOG contain real questionCount', () => {
    const availablePatterns = PATTERNS_CATALOG.filter(p => p.availability === 'available');
    expect(availablePatterns.length).toBe(18);
    for (const p of availablePatterns) {
      expect(p.questionCount).toBeGreaterThan(0);
    }
  });
});
