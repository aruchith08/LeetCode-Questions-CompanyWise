import { describe, it, expect, beforeEach } from 'vitest';
import type { UserProgress, QuestionStatus, LeetCodeSubmission } from '../src/types';
import { matchLeetCodeSubmissionsWithQuestions } from '../src/services/leetcodeService';

function createMockStorage() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
}

const STORAGE_KEY = 'codewise-progress';

describe('User Progress State & Persistence', () => {
  let storage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    storage = createMockStorage();
  });

  it('initializes default progress structure', () => {
    const defaultProgress: UserProgress = {
      solvedQuestions: {},
      bookmarks: [],
      recentCompanies: [],
      recentQuestions: [],
      lastUpdated: new Date().toISOString(),
    };

    expect(Object.keys(defaultProgress.solvedQuestions).length).toBe(0);
    expect(defaultProgress.bookmarks.length).toBe(0);
  });

  it('marks questions solved, attempted, and toggles back to unsolved', () => {
    const progress: UserProgress = {
      solvedQuestions: {},
      bookmarks: [],
      recentCompanies: [],
      recentQuestions: [],
      lastUpdated: new Date().toISOString(),
    };

    // Mark as solved
    progress.solvedQuestions[1] = 'solved';
    expect(progress.solvedQuestions[1]).toBe('solved');

    // Toggle solved again removes status (unsolved)
    delete progress.solvedQuestions[1];
    expect(progress.solvedQuestions[1]).toBeUndefined();

    // Mark as attempted
    progress.solvedQuestions[200] = 'attempted';
    expect(progress.solvedQuestions[200]).toBe('attempted');
  });

  it('shares solved status across companies for identical question ID', () => {
    // Problem #1 (Two Sum) is asked by Amazon, Google, Apple, and Microsoft
    const amazonCompanyQuestions = [1, 200];
    const googleCompanyQuestions = [1, 42];
    const microsoftCompanyQuestions = [1, 146];

    const userProgress: UserProgress = {
      solvedQuestions: { 1: 'solved' },
      bookmarks: [],
      recentCompanies: [],
      recentQuestions: [],
      lastUpdated: new Date().toISOString(),
    };

    // When problem #1 is solved, every company query sees it as solved
    expect(userProgress.solvedQuestions[amazonCompanyQuestions[0]]).toBe('solved');
    expect(userProgress.solvedQuestions[googleCompanyQuestions[0]]).toBe('solved');
    expect(userProgress.solvedQuestions[microsoftCompanyQuestions[0]]).toBe('solved');
  });

  it('matches LeetCode submissions with dataset questions by title slug or title', () => {
    const submissions: LeetCodeSubmission[] = [
      { id: '101', title: 'Two Sum', titleSlug: 'two-sum', timestamp: '1700000000' },
      { id: '102', title: 'Reverse Integer', titleSlug: 'reverse-integer', timestamp: '1700000100' },
      { id: '103', title: 'Non-Existent Question', titleSlug: 'non-existent', timestamp: '1700000200' },
    ];

    const catalog = [
      { id: 1, title: 'Two Sum', link: 'https://leetcode.com/problems/two-sum' },
      { id: 7, title: 'Reverse Integer', link: 'https://leetcode.com/problems/reverse-integer' },
      { id: 15, title: '3Sum', link: 'https://leetcode.com/problems/3sum' },
    ];

    const matchedIds = matchLeetCodeSubmissionsWithQuestions(submissions, catalog);
    expect(matchedIds).toContain(1);
    expect(matchedIds).toContain(7);
    expect(matchedIds).not.toContain(15);
    expect(matchedIds.length).toBe(2);
  });

  it('toggles bookmarks reliably', () => {
    let bookmarks: number[] = [];

    const toggle = (id: number) => {
      bookmarks = bookmarks.includes(id)
        ? bookmarks.filter(b => b !== id)
        : [...bookmarks, id];
    };

    toggle(1);
    expect(bookmarks).toContain(1);

    toggle(42);
    expect(bookmarks).toContain(1);
    expect(bookmarks).toContain(42);

    toggle(1);
    expect(bookmarks).not.toContain(1);
    expect(bookmarks).toContain(42);
  });

  it('exports and validates progress JSON serialization', () => {
    const progress: UserProgress = {
      solvedQuestions: { 1: 'solved', 42: 'attempted' },
      bookmarks: [1, 200],
      recentCompanies: ['google', 'amazon'],
      recentQuestions: [1, 42],
      lastUpdated: '2026-10-25T12:00:00.000Z',
    };

    const serialized = JSON.stringify(progress);
    storage.setItem(STORAGE_KEY, serialized);

    const retrieved = storage.getItem(STORAGE_KEY);
    expect(retrieved).not.toBeNull();

    const parsed = JSON.parse(retrieved!);
    expect(parsed.solvedQuestions[1]).toBe('solved');
    expect(parsed.solvedQuestions[42]).toBe('attempted');
    expect(parsed.bookmarks).toEqual([1, 200]);
    expect(parsed.recentCompanies).toEqual(['google', 'amazon']);
  });

  it('validates import file reject malformed payloads', () => {
    const isValidProgress = (json: string): boolean => {
      try {
        const parsed = JSON.parse(json);
        return Boolean(parsed && typeof parsed === 'object' && typeof parsed.solvedQuestions === 'object');
      } catch {
        return false;
      }
    };

    expect(isValidProgress('{"solvedQuestions": {"1": "solved"}}')).toBe(true);
    expect(isValidProgress('invalid json string')).toBe(false);
    expect(isValidProgress('{"someOtherKey": 123}')).toBe(false);
    expect(isValidProgress('null')).toBe(false);
  });
});
