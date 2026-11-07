import { describe, it, expect } from 'vitest';

describe('Progress Page Company Progress Calculation Optimization', () => {
  const mockIndex = {
    companies: [
      { slug: 'google', name: 'Google', questionCount: 10 },
      { slug: 'meta', name: 'Meta', questionCount: 5 },
      { slug: 'amazon', name: 'Amazon', questionCount: 8 },
    ],
  };

  const mockQuestions = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', companySlugs: ['google', 'meta', 'amazon'] },
    { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', companySlugs: ['amazon'] },
    { id: 3, title: 'Longest Substring', difficulty: 'Medium', companySlugs: ['google'] },
    { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', companySlugs: ['meta'] },
  ];

  // Map constructed once for O(1) lookup
  const questionCompanyMap = new Map<number, string[]>();
  mockQuestions.forEach(q => questionCompanyMap.set(q.id, q.companySlugs));

  function computeOriginal(solvedQuestions: Record<number, string>) {
    const solvedByCompany = new Map<string, number>();
    const attemptedByCompany = new Map<string, number>();

    // Original way: scan all questions
    for (const q of mockQuestions) {
      const s = solvedQuestions[q.id] || 'unsolved';
      if (s === 'solved') {
        for (const slug of q.companySlugs) {
          solvedByCompany.set(slug, (solvedByCompany.get(slug) || 0) + 1);
        }
      } else if (s === 'attempted') {
        for (const slug of q.companySlugs) {
          attemptedByCompany.set(slug, (attemptedByCompany.get(slug) || 0) + 1);
        }
      }
    }

    return mockIndex.companies.map(c => ({
      slug: c.slug,
      solved: solvedByCompany.get(c.slug) || 0,
      attempted: attemptedByCompany.get(c.slug) || 0,
    }));
  }

  function computeOptimized(solvedQuestions: Record<number, string>) {
    const solvedByCompany = new Map<string, number>();
    const attemptedByCompany = new Map<string, number>();

    // Optimized way: scan only user progress records
    for (const [idStr, status] of Object.entries(solvedQuestions)) {
      const id = Number(idStr);
      const companySlugs = questionCompanyMap.get(id);
      if (!companySlugs) continue;

      if (status === 'solved') {
        for (const slug of companySlugs) {
          solvedByCompany.set(slug, (solvedByCompany.get(slug) || 0) + 1);
        }
      } else if (status === 'attempted') {
        for (const slug of companySlugs) {
          attemptedByCompany.set(slug, (attemptedByCompany.get(slug) || 0) + 1);
        }
      }
    }

    return mockIndex.companies.map(c => ({
      slug: c.slug,
      solved: solvedByCompany.get(c.slug) || 0,
      attempted: attemptedByCompany.get(c.slug) || 0,
    }));
  }

  it('produces identical results to original calculation for empty progress', () => {
    const emptyProgress = {};
    expect(computeOptimized(emptyProgress)).toEqual(computeOriginal(emptyProgress));
  });

  it('produces identical results for mixed solved and attempted questions across multiple companies', () => {
    const userProgress = {
      1: 'solved',    // google, meta, amazon
      2: 'attempted', // amazon
      3: 'solved',    // google
    };
    expect(computeOptimized(userProgress)).toEqual(computeOriginal(userProgress));
  });

  it('gracefully ignores question IDs in progress that do not exist in the catalog', () => {
    const progressWithUnknownIds = {
      1: 'solved',
      999999: 'solved', // unknown question
    };
    expect(computeOptimized(progressWithUnknownIds)).toEqual(computeOriginal(progressWithUnknownIds));
  });
});
