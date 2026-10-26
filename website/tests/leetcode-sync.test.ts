import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  fetchLeetCodeData,
  matchLeetCodeSubmissionsWithDetails,
  matchLeetCodeSubmissionsWithQuestions,
} from '../src/services/leetcodeService';
import type { LeetCodeSubmission } from '../src/types';

describe('LeetCode Synchronization Reliability & Matching', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects empty or whitespace-only usernames', async () => {
    await expect(fetchLeetCodeData('')).rejects.toThrow('Please enter a valid LeetCode username');
    await expect(fetchLeetCodeData('   ')).rejects.toThrow('Please enter a valid LeetCode username');
  });

  it('connects profile and parses public statistics via GraphQL proxy', async () => {
    const mockGraphQLResponse = {
      data: {
        matchedUser: {
          username: 'tour_de_code',
          profile: {
            userAvatar: 'https://assets.leetcode.com/avatar.jpg',
            ranking: 12345,
            realName: 'Tour de Code',
          },
          submitStats: {
            acSubmissionNum: [
              { difficulty: 'All', count: 180 },
              { difficulty: 'Easy', count: 80 },
              { difficulty: 'Medium', count: 80 },
              { difficulty: 'Hard', count: 20 },
            ],
          },
        },
        recentAcSubmissionList: [
          { id: '101', title: 'Two Sum', titleSlug: 'two-sum', timestamp: '1700000000' },
          { id: '102', title: 'Reverse Integer', titleSlug: 'reverse-integer', timestamp: '1700000100' },
        ],
      },
    };

    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url === '/api/leetcode/graphql') {
        return {
          ok: true,
          headers: { get: () => 'application/json' },
          json: async () => mockGraphQLResponse,
        };
      }
      return { ok: false };
    });

    const account = await fetchLeetCodeData('tour_de_code');
    expect(account.username).toBe('tour_de_code');
    expect(account.totalSolved).toBe(180);
    expect(account.easySolved).toBe(80);
    expect(account.mediumSolved).toBe(80);
    expect(account.hardSolved).toBe(20);
    expect(account.ranking).toBe(12345);
    expect(account.recentSubmissions.length).toBe(2);
  });

  it('accurately matches submissions by titleSlug and normalized title, and reports unmatched submissions', () => {
    const submissions: LeetCodeSubmission[] = [
      { id: '101', title: 'Two Sum', titleSlug: 'two-sum', timestamp: '1700000000' },
      { id: '102', title: 'Reverse Integer', titleSlug: 'reverse-integer', timestamp: '1700000100' },
      { id: '103', title: 'Niche Problem Outside Catalog', titleSlug: 'niche-problem', timestamp: '1700000200' },
    ];

    const catalog = [
      { id: 1, title: 'Two Sum', link: 'https://leetcode.com/problems/two-sum/' },
      { id: 7, title: 'Reverse Integer', link: 'https://leetcode.com/problems/reverse-integer' },
      { id: 15, title: '3Sum', link: 'https://leetcode.com/problems/3sum' },
    ];

    const result = matchLeetCodeSubmissionsWithDetails(submissions, catalog);

    expect(result.matchedIds).toEqual([1, 7]);
    expect(result.matchedCount).toBe(2);
    expect(result.unmatchedSubmissions.length).toBe(1);
    expect(result.unmatchedSubmissions[0].titleSlug).toBe('niche-problem');
    expect(result.totalSubmissions).toBe(3);
  });

  it('handles duplicate submissions for the same problem without duplicate match entries', () => {
    const submissions: LeetCodeSubmission[] = [
      { id: '101', title: 'Two Sum', titleSlug: 'two-sum', timestamp: '1700000000' },
      { id: '102', title: 'Two Sum (Retry)', titleSlug: 'two-sum', timestamp: '1700000500' },
    ];

    const catalog = [
      { id: 1, title: 'Two Sum', link: 'https://leetcode.com/problems/two-sum' },
    ];

    const result = matchLeetCodeSubmissionsWithDetails(submissions, catalog);
    expect(result.matchedIds).toEqual([1]);
    expect(result.matchedCount).toBe(1);
  });

  it('returns empty matches safely when catalog is empty or missing', () => {
    const submissions: LeetCodeSubmission[] = [
      { id: '101', title: 'Two Sum', titleSlug: 'two-sum', timestamp: '1700000000' },
    ];

    expect(matchLeetCodeSubmissionsWithDetails(submissions, []).matchedIds).toEqual([]);
    expect(matchLeetCodeSubmissionsWithQuestions(submissions, []).length).toBe(0);
  });

  it('matches questions by normalized title when slug is not provided or link is malformed', () => {
    const submissions: LeetCodeSubmission[] = [
      { id: '101', title: 'Valid Palindrome', titleSlug: '', timestamp: '1700000000' },
    ];

    const catalog = [
      { id: 125, title: 'Valid Palindrome', link: '' },
    ];

    const result = matchLeetCodeSubmissionsWithDetails(submissions, catalog);
    expect(result.matchedIds).toEqual([125]);
  });
});
