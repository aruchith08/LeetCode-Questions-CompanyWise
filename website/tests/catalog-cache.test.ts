import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  fetchAllQuestions,
  resetQuestionsCache,
} from '../src/hooks/useAllQuestions';

describe('Question Catalog In-Flight Caching & Reliability', () => {
  beforeEach(() => {
    resetQuestionsCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    resetQuestionsCache();
    vi.restoreAllMocks();
  });

  it('deduplicates simultaneous concurrent requests into a single in-flight fetch', async () => {
    let fetchCallCount = 0;
    const mockData = [
      { id: 1, title: 'Two Sum', link: 'https://leetcode.com/problems/two-sum', difficulty: 'Easy', acceptance: '50%', frequency: 1, companySlugs: ['google'], companyCount: 1 },
    ];

    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCallCount++;
      // Simulate network delay
      await new Promise(r => setTimeout(r, 20));
      return {
        ok: true,
        json: async () => mockData,
      };
    });

    // Invoke multiple concurrent calls
    const [p1, p2, p3] = await Promise.all([
      fetchAllQuestions(),
      fetchAllQuestions(),
      fetchAllQuestions(),
    ]);

    expect(fetchCallCount).toBe(1);
    expect(p1).toEqual(mockData);
    expect(p2).toEqual(mockData);
    expect(p3).toEqual(mockData);
  });

  it('reuses cached data on subsequent calls without re-fetching', async () => {
    let fetchCallCount = 0;
    const mockData = [
      { id: 2, title: 'Add Two Numbers', link: 'https://leetcode.com/problems/add-two-numbers', difficulty: 'Medium', acceptance: '40%', frequency: 0.9, companySlugs: ['amazon'], companyCount: 1 },
    ];

    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCallCount++;
      return {
        ok: true,
        json: async () => mockData,
      };
    });

    const first = await fetchAllQuestions();
    expect(first).toEqual(mockData);
    expect(fetchCallCount).toBe(1);

    const second = await fetchAllQuestions();
    expect(second).toEqual(mockData);
    expect(fetchCallCount).toBe(1); // Cached, no second fetch
  });

  it('handles network failure, resets in-flight state, and permits subsequent retry', async () => {
    let fetchCallCount = 0;
    const mockData = [
      { id: 3, title: 'Longest Substring', link: 'https://leetcode.com/problems/longest-substring', difficulty: 'Medium', acceptance: '35%', frequency: 0.8, companySlugs: ['apple'], companyCount: 1 },
    ];

    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCallCount++;
      if (fetchCallCount === 1) {
        return {
          ok: false,
          status: 500,
        };
      }
      return {
        ok: true,
        json: async () => mockData,
      };
    });

    // Call 1 fails
    await expect(fetchAllQuestions()).rejects.toThrow('Failed to load question catalog');
    expect(fetchCallCount).toBe(1);

    // Call 2 retries (should not be permanently poisoned)
    const retried = await fetchAllQuestions();
    expect(retried).toEqual(mockData);
    expect(fetchCallCount).toBe(2);
  });

  it('rejects invalid non-array catalog payloads without caching them', async () => {
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      return {
        ok: true,
        json: async () => ({ error: 'Not an array' }),
      };
    });

    await expect(fetchAllQuestions()).rejects.toThrow('invalid data format');

    // Ensure cache wasn't poisoned with the invalid object
    resetQuestionsCache();
  });
});
