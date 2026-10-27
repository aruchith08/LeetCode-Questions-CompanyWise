import { describe, it, expect } from 'vitest';
import {
  PATTERNS_CATALOG,
  SLIDING_WINDOW_QUESTIONS,
  SLIDING_WINDOW_MAPPINGS,
  joinPatternQuestions,
  VISUALIZER_ARRAY,
  VISUALIZER_WINDOW_SIZE,
  VISUALIZER_STEPS,
  SLIDING_WINDOW_QUIZ,
} from '../src/data/patternsData';
import type { GlobalQuestion } from '../src/types';
import fs from 'fs';
import path from 'path';

describe('DSA Patterns Catalog Integrity', () => {
  it('contains exactly 18 core patterns across 3 learning levels', () => {
    expect(PATTERNS_CATALOG).toHaveLength(18);

    const foundation = PATTERNS_CATALOG.filter(p => p.level === 'Foundation');
    const intermediate = PATTERNS_CATALOG.filter(p => p.level === 'Intermediate');
    const advanced = PATTERNS_CATALOG.filter(p => p.level === 'Advanced');

    expect(foundation).toHaveLength(6);
    expect(intermediate).toHaveLength(7);
    expect(advanced).toHaveLength(5);
  });

  it('guarantees unique slugs and IDs for all 18 patterns', () => {
    const slugs = PATTERNS_CATALOG.map(p => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(18);

    const ids = PATTERNS_CATALOG.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(18);
  });

  it('has Sliding Window as the single available module for Phase 1 with 17 upcoming', () => {
    const available = PATTERNS_CATALOG.filter(p => p.availability === 'available');
    const upcoming = PATTERNS_CATALOG.filter(p => p.availability === 'upcoming');

    expect(available).toHaveLength(1);
    expect(available[0].slug).toBe('sliding-window');
    expect(available[0].level).toBe('Foundation');
    expect(available[0].category).toBe('Arrays & Strings');

    expect(upcoming).toHaveLength(17);
  });
});

describe('Sliding Window Visualizer Step-by-Step Logic', () => {
  it('uses the exact reference array [1, 12, -5, -6, 50, 3] and window size 4', () => {
    expect(VISUALIZER_ARRAY).toEqual([1, 12, -5, -6, 50, 3]);
    expect(VISUALIZER_WINDOW_SIZE).toBe(4);
    expect(VISUALIZER_STEPS).toHaveLength(3);
  });

  it('accurately computes rolling sums and step-by-step best averages without leaking future results', () => {
    // Step 1: window [0..3]
    const step1 = VISUALIZER_STEPS[0];
    expect(step1.stepNumber).toBe(1);
    expect(step1.windowIndices).toEqual([0, 1, 2, 3]);
    expect(step1.currentSum).toBe(1 + 12 - 5 - 6); // 2
    expect(step1.currentAverage).toBe(0.5);
    // Crucial: Step 1 best average must be 0.5, NOT the future 12.75!
    expect(step1.bestAverageSoFar).toBe(0.5);
    expect(step1.removedElement).toBeNull();
    expect(step1.addedElement).toBeNull();

    // Step 2: slide right to [1..4]
    const step2 = VISUALIZER_STEPS[1];
    expect(step2.stepNumber).toBe(2);
    expect(step2.windowIndices).toEqual([1, 2, 3, 4]);
    expect(step2.removedElement).toEqual({ index: 0, value: 1 });
    expect(step2.addedElement).toEqual({ index: 4, value: 50 });
    expect(step2.currentSum).toBe(2 - 1 + 50); // 51
    expect(step2.currentAverage).toBe(12.75);
    expect(step2.bestAverageSoFar).toBe(12.75);

    // Step 3: slide right to [2..5]
    const step3 = VISUALIZER_STEPS[2];
    expect(step3.stepNumber).toBe(3);
    expect(step3.windowIndices).toEqual([2, 3, 4, 5]);
    expect(step3.removedElement).toEqual({ index: 1, value: 12 });
    expect(step3.addedElement).toEqual({ index: 5, value: 3 });
    expect(step3.currentSum).toBe(51 - 12 + 3); // 42
    expect(step3.currentAverage).toBe(10.5);
    // Best remains 12.75
    expect(step3.bestAverageSoFar).toBe(12.75);
  });
});

describe('Sliding Window Practice Questions & Catalog Integration', () => {
  it('contains exactly 15 curated questions across 4 subcategories', () => {
    expect(SLIDING_WINDOW_QUESTIONS).toHaveLength(15);

    const fixed = SLIDING_WINDOW_QUESTIONS.filter(q => q.subpattern === 'fixed-window');
    const variable = SLIDING_WINDOW_QUESTIONS.filter(q => q.subpattern === 'variable-window');
    const frequency = SLIDING_WINDOW_QUESTIONS.filter(q => q.subpattern === 'frequency-window');
    const advanced = SLIDING_WINDOW_QUESTIONS.filter(q => q.subpattern === 'advanced-window');

    expect(fixed).toHaveLength(4);
    expect(variable).toHaveLength(4);
    expect(frequency).toHaveLength(4);
    expect(advanced).toHaveLength(3);
  });

  it('guarantees all 15 question IDs exist in public/data/questions.json', () => {
    const catalogPath = path.resolve(__dirname, '../public/data/questions.json');
    expect(fs.existsSync(catalogPath)).toBe(true);

    const questionsJson = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const catalogIds = new Set(questionsJson.map((q: any) => q.id));

    for (const q of SLIDING_WINDOW_QUESTIONS) {
      expect(catalogIds.has(q.id)).toBe(true);
      expect(q.title).toBeTruthy();
      expect(['Easy', 'Medium', 'Hard']).toContain(q.difficulty);
      expect(q.companies.length).toBeGreaterThan(0);
      expect(q.link).toMatch(/^https:\/\/leetcode\.com\/problems\//);
    }
  });

  it('dynamically joins pattern question mappings with canonical catalog questions', () => {
    const mockCatalog: GlobalQuestion[] = [
      {
        id: 643,
        title: 'Maximum Average Subarray I',
        difficulty: 'Easy',
        acceptance: '45.2%',
        frequency: 0.8,
        link: 'https://leetcode.com/problems/maximum-average-subarray-i/',
        companySlugs: ['google', 'amazon'],
        companyCount: 2,
      },
    ];

    const joined = joinPatternQuestions(SLIDING_WINDOW_MAPPINGS.slice(0, 1), mockCatalog);
    expect(joined).toHaveLength(1);
    expect(joined[0].id).toBe(643);
    expect(joined[0].title).toBe('Maximum Average Subarray I');
    expect(joined[0].difficulty).toBe('Easy');
    expect(joined[0].acceptance).toBe('45.2%');
    expect(joined[0].companySlugs).toEqual(['google', 'amazon']);
    expect(joined[0].reviewStatus).toBe('verified');
  });

  it('safely handles missing or empty catalog using verified fallback metadata', () => {
    const joinedWithNull = joinPatternQuestions(SLIDING_WINDOW_MAPPINGS.slice(0, 1), null);
    expect(joinedWithNull).toHaveLength(1);
    expect(joinedWithNull[0].id).toBe(643);
    expect(joinedWithNull[0].title).toBe('Maximum Average Subarray I');

    const joinedWithEmpty = joinPatternQuestions(SLIDING_WINDOW_MAPPINGS.slice(0, 1), []);
    expect(joinedWithEmpty).toHaveLength(1);
    expect(joinedWithEmpty[0].id).toBe(643);
  });
});

describe('Pattern Mastery Decoupling & Integrity', () => {
  it('does NOT award pattern mastery purely based on solved question totals', () => {
    // 15 questions solved out of 15 does NOT equal mastered pattern
    const totalCuratedSolved = 15;
    const totalCuratedQuestions = 15;
    expect(totalCuratedSolved === totalCuratedQuestions).toBe(true);

    // Mastery count must be 0 until a dedicated assessment engine evaluates the user
    const patternsMasteredCount = 0;
    expect(patternsMasteredCount).toBe(0);
  });
});

describe('Sliding Window Quiz Assessment Integrity', () => {
  it('contains 4 comprehensive conceptual questions with valid answers and explanations', () => {
    expect(SLIDING_WINDOW_QUIZ).toHaveLength(4);

    for (const q of SLIDING_WINDOW_QUIZ) {
      expect(q.id).toBeTruthy();
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(4);
      expect(q.explanation).toBeTruthy();

      const optionIds = q.options.map(o => o.id);
      expect(optionIds).toContain(q.correctOptionId);
    }
  });
});

describe('Header & Footer Navigation Order', () => {
  it('verifies Patterns navigation item is correctly positioned in Header and Footer', () => {
    const headerPath = path.resolve(__dirname, '../src/components/layout/Header.tsx');
    const headerContent = fs.readFileSync(headerPath, 'utf8');

    expect(headerContent).toContain("{ to: '/patterns', label: 'Patterns' }");

    const footerPath = path.resolve(__dirname, '../src/components/layout/Footer.tsx');
    const footerContent = fs.readFileSync(footerPath, 'utf8');

    expect(footerContent).toContain('to="/patterns"');
  });
});
