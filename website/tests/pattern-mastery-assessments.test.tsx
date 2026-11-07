import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { isPatternQuizPassed, isPatternMastered } from '../src/utils/patternMastery';
import { ProgressProvider } from '../src/hooks/useProgress';
import UnderstandingCheck from '../src/components/patterns/UnderstandingCheck';
import PatternCard from '../src/components/patterns/PatternCard';
import PatternsPage from '../src/pages/PatternsPage';
import { PATTERNS_CATALOG } from '../src/data/patternsData';
import { validateAndParseBackup, validateProgressSchema } from '../src/utils/backupValidation';
import type { QuizQuestion } from '../src/types/patterns';

describe('Pattern Mastery & Assessment System', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Mastery Evaluation Invariants', () => {
    it('evaluates quiz pass criteria: requires at least 2/3 (66.7%) correct', () => {
      expect(isPatternQuizPassed(null)).toBe(false);
      expect(isPatternQuizPassed(undefined)).toBe(false);
      expect(isPatternQuizPassed({ score: 1, total: 3, passed: false, completedAt: '' })).toBe(false);
      expect(isPatternQuizPassed({ score: 2, total: 3, passed: false, completedAt: '' })).toBe(true);
      expect(isPatternQuizPassed({ score: 3, total: 3, passed: true, completedAt: '' })).toBe(true);
    });

    it('evaluates pattern mastery: requires passed quiz AND at least 1 solved practice problem', () => {
      // 0 solved practice questions
      expect(isPatternMastered({ score: 3, total: 3, passed: true, completedAt: '' }, 0)).toBe(false);
      // Failed quiz with solved questions
      expect(isPatternMastered({ score: 1, total: 3, passed: false, completedAt: '' }, 5)).toBe(false);
      // Passed quiz with at least 1 solved question
      expect(isPatternMastered({ score: 2, total: 3, passed: true, completedAt: '' }, 1)).toBe(true);
      expect(isPatternMastered({ score: 3, total: 3, passed: true, completedAt: '' }, 4)).toBe(true);
    });
  });

  describe('UnderstandingCheck Integration & Persistence', () => {
    const mockQuiz: QuizQuestion[] = [
      {
        id: 'q1',
        question: 'What is time complexity of two pointers?',
        options: [
          { id: 'opt-a', text: 'O(N)' },
          { id: 'opt-b', text: 'O(N^2)' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'Single linear pass.',
      },
      {
        id: 'q2',
        question: 'When does sliding window apply?',
        options: [
          { id: 'opt-c', text: 'Contiguous subarrays' },
          { id: 'opt-d', text: 'Arbitrary subsets' },
        ],
        correctOptionId: 'opt-c',
        explanation: 'Window slides contiguously.',
      },
    ];

    it('records quiz answers into ProgressContext and renders completion banner', () => {
      function TestWrapper() {
        return (
          <ProgressProvider>
            <UnderstandingCheck
              quiz={mockQuiz}
              patternSlug="sliding-window"
              patternTitle="Sliding Window Check"
            />
          </ProgressProvider>
        );
      }

      render(<TestWrapper />);

      // Select answers to both questions
      const optA = screen.getByText('O(N)');
      fireEvent.click(optA);

      const optC = screen.getByText('Contiguous subarrays');
      fireEvent.click(optC);

      // Verify completion banner is shown
      expect(screen.getByTestId('quiz-completion-banner')).toBeTruthy();
      expect(screen.getByText(/Quiz passed!/i)).toBeTruthy();

      // Verify in localStorage
      const raw = localStorage.getItem('companywise-progress');
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw!);
      expect(parsed.patternQuizScores['sliding-window']).toBeDefined();
      expect(parsed.patternQuizScores['sliding-window'].score).toBe(2);
      expect(parsed.patternQuizScores['sliding-window'].passed).toBe(true);
    });
  });

  describe('PatternCard Mastery Badge', () => {
    it('renders Mastered badge when isMastered is true', () => {
      const pattern = PATTERNS_CATALOG[0];
      render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <PatternCard
            pattern={pattern}
            solvedCount={3}
            totalQuestions={10}
            isMastered={true}
          />
        </MemoryRouter>
      );

      expect(screen.getByTestId('mastered-badge')).toBeTruthy();
      expect(screen.getByText('Mastered')).toBeTruthy();
    });

    it('does NOT render Mastered badge when isMastered is false', () => {
      const pattern = PATTERNS_CATALOG[0];
      render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <PatternCard
            pattern={pattern}
            solvedCount={3}
            totalQuestions={10}
            isMastered={false}
          />
        </MemoryRouter>
      );

      expect(screen.queryByTestId('mastered-badge')).toBeNull();
    });
  });

  describe('PatternsPage Dynamic Mastery Counter', () => {
    it('renders dynamic Patterns mastered metric instead of Assessment coming soon', () => {
      render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ProgressProvider>
            <PatternsPage />
          </ProgressProvider>
        </MemoryRouter>
      );

      // Should render "Patterns mastered" label
      const masteryLabel = screen.getByText('Patterns mastered');
      expect(masteryLabel).toBeTruthy();

      // Verify the parent container displays / 18
      const statContainer = masteryLabel.parentElement!;
      expect(statContainer).toBeTruthy();
      expect(within(statContainer).getByText(/\/ 18/)).toBeTruthy();

      // Should NOT show "Assessment coming soon"
      expect(screen.queryByText('Assessment coming soon')).toBeNull();
    });
  });

  describe('Backup & Schema Validation with patternQuizScores', () => {
    it('successfully validates and parses backups containing patternQuizScores', () => {
      const validBackup = JSON.stringify({
        version: 2,
        exportedAt: new Date().toISOString(),
        solvedQuestions: { 1: 'solved' },
        bookmarks: [1],
        recentCompanies: [],
        recentQuestions: [],
        patternQuizScores: {
          'two-pointers': {
            score: 3,
            total: 3,
            passed: true,
            completedAt: new Date().toISOString(),
          },
        },
      });

      const result = validateAndParseBackup(validBackup);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.progress.patternQuizScores).toBeDefined();
        expect(result.progress.patternQuizScores?.['two-pointers'].passed).toBe(true);
      }
    });

    it('rejects corrupt patternQuizScores in validateProgressSchema', () => {
      const corruptData = {
        solvedQuestions: {},
        bookmarks: [],
        recentCompanies: [],
        recentQuestions: [],
        patternQuizScores: 'not-an-object',
      };

      const result = validateProgressSchema(corruptData);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('patternQuizScores');
    });
  });
});
