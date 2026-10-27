import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  SLIDING_WINDOW_MAPPINGS,
  joinPatternQuestions,
} from '../src/data/patternsData';
import type { GlobalQuestion } from '../src/types';
import PracticeQuestionsSection from '../src/components/patterns/PracticeQuestionsSection';
import { ProgressProvider } from '../src/context/ProgressContext';
import * as useAllQuestionsModule from '../src/hooks/useAllQuestions';

describe('Pattern Question Data Integrity & Loading States', () => {
  const mockCatalog: GlobalQuestion[] = [
    {
      id: 643,
      title: 'Maximum Average Subarray I',
      difficulty: 'Easy',
      acceptance: '49.5%',
      link: 'https://leetcode.com/problems/maximum-average-subarray-i/',
      companySlugs: ['amazon', 'google'],
      companyCount: 2,
      frequency: 0.85,
    },
    {
      id: 1456,
      title: 'Maximum Number of Vowels in a Substring of Given Length',
      difficulty: 'Medium',
      acceptance: '58.1%',
      link: 'https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/',
      companySlugs: ['microsoft'],
      companyCount: 1,
      frequency: 0.65,
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('joins canonical catalog data without inventing frequency 50 or fabricated metadata', () => {
    const joined = joinPatternQuestions(SLIDING_WINDOW_MAPPINGS.slice(0, 2), mockCatalog);

    expect(joined).toHaveLength(2);

    // Question 1: 643
    expect(joined[0].id).toBe(643);
    expect(joined[0].title).toBe('Maximum Average Subarray I');
    expect(joined[0].difficulty).toBe('Easy');
    expect(joined[0].acceptance).toBe('49.5%');
    expect(joined[0].frequency).toBe(0.85); // Canonical frequency preserved
    expect(joined[0].frequency).not.toBe(50); // NOT fabricated 50
    expect(joined[0].isCatalogAvailable).toBe(true);

    // Question 2: 1456
    expect(joined[1].id).toBe(1456);
    expect(joined[1].title).toBe('Maximum Number of Vowels in a Substring of Given Length');
    expect(joined[1].difficulty).toBe('Medium');
    expect(joined[1].acceptance).toBe('58.1%');
    expect(joined[1].frequency).toBe(0.65);
    expect(joined[1].frequency).not.toBe(50);
  });

  it('safely handles missing question IDs without fabricating difficulty or frequency', () => {
    // Only pass catalog with question 643, missing question 1456
    const partialCatalog = [mockCatalog[0]];
    const joined = joinPatternQuestions(SLIDING_WINDOW_MAPPINGS.slice(0, 2), partialCatalog);

    expect(joined).toHaveLength(2);

    // Missing question 1456:
    expect(joined[1].id).toBe(1456);
    expect(joined[1].title).toBe('Problem #1456');
    expect(joined[1].difficulty).toBeUndefined(); // Never invented 'Medium'
    expect(joined[1].acceptance).toBe('—'); // Never invented percentage
    expect(joined[1].frequency).toBeUndefined(); // Never invented 50
    expect(joined[1].companies).toEqual([]);
    expect(joined[1].isCatalogAvailable).toBe(false);
  });

  it('renders a proper loading state while catalog information is fetching', () => {
    vi.spyOn(useAllQuestionsModule, 'useAllQuestions').mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <ProgressProvider>
        <PracticeQuestionsSection />
      </ProgressProvider>
    );

    expect(screen.getByText(/loading practice problems from question catalog/i)).toBeTruthy();
  });

  it('renders network error and functional retry button upon catalog loading failure', () => {
    const mockRefetch = vi.fn();
    vi.spyOn(useAllQuestionsModule, 'useAllQuestions').mockReturnValue({
      data: null,
      loading: false,
      error: 'HTTP 500: Server error',
      refetch: mockRefetch,
    });

    render(
      <ProgressProvider>
        <PracticeQuestionsSection />
      </ProgressProvider>
    );

    expect(screen.getByText(/failed to load question catalog: HTTP 500/i)).toBeTruthy();

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    expect(retryBtn).toBeTruthy();

    fireEvent.click(retryBtn);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('shares solved question status with the global progress store', () => {
    localStorage.setItem(
      'companywise-progress',
      JSON.stringify({
        solvedQuestions: { 643: 'solved' },
        bookmarks: [643],
      })
    );

    vi.spyOn(useAllQuestionsModule, 'useAllQuestions').mockReturnValue({
      data: mockCatalog,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <ProgressProvider>
        <PracticeQuestionsSection />
      </ProgressProvider>
    );

    // Problem 643 should display as solved (line-through title)
    const titleEl = screen.getByText('Maximum Average Subarray I');
    expect(titleEl.className).toContain('line-through');
  });
});
