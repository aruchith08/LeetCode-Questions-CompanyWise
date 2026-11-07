import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchLeetCodeData } from '../src/services/leetcodeService';

describe('LeetCode Fallback API 10-Second Timeout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('times out and throws user-friendly error when fallback mirror hangs or is aborted', async () => {
    // Mock fetch: proxy fails, fallback simulates an AbortError
    globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      if (url === '/api/leetcode/graphql') {
        return { ok: false, status: 500 };
      }
      if (url.includes('alfa-leetcode-api.onrender.com')) {
        // Return a promise that rejects with AbortError when signal aborts
        return new Promise((_, reject) => {
          const abortError = new Error('The operation was aborted');
          abortError.name = 'AbortError';
          if (init?.signal?.aborted) {
            reject(abortError);
          } else {
            init?.signal?.addEventListener('abort', () => reject(abortError));
            // Simulate immediate abort to test error message
            setTimeout(() => reject(abortError), 10);
          }
        });
      }
      return { ok: false };
    });

    await expect(fetchLeetCodeData('someuser')).rejects.toThrow(
      'LeetCode mirror timed out after 10 seconds. Please try again.'
    );
  });

  it('successfully retrieves data from fallback mirror within the timeout window', async () => {
    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url === '/api/leetcode/graphql') {
        return { ok: false, status: 500 };
      }
      if (url.includes('/acSubmission')) {
        return {
          ok: true,
          json: async () => ({
            submission: [{ id: '999', title: 'Two Sum', titleSlug: 'two-sum', timestamp: '1700000000' }],
          }),
        };
      }
      if (url.includes('/solved')) {
        return {
          ok: true,
          json: async () => ({
            solvedProblem: 10,
            easySolved: 5,
            mediumSolved: 4,
            hardSolved: 1,
          }),
        };
      }
      if (url.includes('alfa-leetcode-api.onrender.com/someuser')) {
        return {
          ok: true,
          json: async () => ({
            name: 'Some User',
            avatar: 'https://example.com/avatar.jpg',
            ranking: 54321,
          }),
        };
      }
      return { ok: false };
    });

    const account = await fetchLeetCodeData('someuser');
    expect(account.username).toBe('someuser');
    expect(account.totalSolved).toBe(10);
    expect(account.recentSubmissions).toHaveLength(1);
    expect(account.recentSubmissions[0].titleSlug).toBe('two-sum');
  });
});
