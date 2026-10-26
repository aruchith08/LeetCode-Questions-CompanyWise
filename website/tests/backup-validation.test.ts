import { describe, it, expect } from 'vitest';
import {
  validateAndParseBackup,
  CURRENT_BACKUP_SCHEMA_VERSION,
} from '../src/utils/backupValidation';
import type { UserProgress, LeetCodeAccount } from '../src/types';

describe('Backup Import Validation & Data Safety', () => {
  it('successfully validates and parses a valid modern backup with version', () => {
    const validPayload = {
      version: CURRENT_BACKUP_SCHEMA_VERSION,
      solvedQuestions: {
        '1': 'solved',
        '42': 'attempted',
      },
      bookmarks: [1, 15, 200],
      targetCompanies: ['google', 'amazon'],
      recentCompanies: ['google'],
      recentQuestions: [1, 42],
      activityHistory: {
        '2026-10-24': 3,
        '2026-10-25': 2,
      },
      solvedQuestionTimestamps: {
        '1': '2026-10-24T10:00:00.000Z',
      },
      lastUpdated: '2026-10-25T14:00:00.000Z',
      leetcodeAccount: {
        username: 'tour_de_code',
        totalSolved: 120,
        easySolved: 50,
        mediumSolved: 60,
        hardSolved: 10,
        autoSync: true,
      },
    };

    const res = validateAndParseBackup(JSON.stringify(validPayload));
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.progress.solvedQuestions[1]).toBe('solved');
      expect(res.progress.solvedQuestions[42]).toBe('attempted');
      expect(res.progress.bookmarks).toEqual([1, 15, 200]);
      expect(res.progress.targetCompanies).toEqual(['google', 'amazon']);
      expect(res.progress.activityHistory?.['2026-10-24']).toBe(3);
      expect(res.progress.solvedQuestionTimestamps?.[1]).toBe('2026-10-24T10:00:00.000Z');
      expect(res.leetcodeAccount?.username).toBe('tour_de_code');
    }
  });

  it('safely migrates a legacy v1 backup without version field', () => {
    const legacyPayload = {
      solvedQuestions: {
        '1': 'solved',
      },
      bookmarks: [1],
      recentCompanies: ['apple'],
      recentQuestions: [1],
      lastUpdated: '2026-10-20T10:00:00.000Z',
    };

    const res = validateAndParseBackup(JSON.stringify(legacyPayload));
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.progress.solvedQuestions[1]).toBe('solved');
      expect(res.progress.bookmarks).toEqual([1]);
      expect(res.progress.targetCompanies).toEqual([]);
      expect(res.leetcodeAccount).toBeNull();
    }
  });

  it('rejects unsupported future schema versions', () => {
    const futurePayload = {
      version: 99,
      solvedQuestions: { '1': 'solved' },
    };

    const res = validateAndParseBackup(JSON.stringify(futurePayload));
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain('Unsupported backup version (99)');
    }
  });

  it('rejects invalid JSON syntax', () => {
    const res = validateAndParseBackup('{ broken json }');
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain('Invalid JSON syntax');
    }
  });

  it('rejects non-object payloads such as null, numbers, or arrays', () => {
    expect(validateAndParseBackup('null').success).toBe(false);
    expect(validateAndParseBackup('12345').success).toBe(false);
    expect(validateAndParseBackup('["array"]').success).toBe(false);
    expect(validateAndParseBackup('').success).toBe(false);
  });

  it('rejects missing or non-object solvedQuestions', () => {
    const noSolved = { bookmarks: [1] };
    const res = validateAndParseBackup(JSON.stringify(noSolved));
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain('"solvedQuestions"');
    }
  });

  it('rejects invalid question IDs (non-numeric or negative)', () => {
    const invalidId = {
      solvedQuestions: { 'not-an-id': 'solved' },
    };
    const res = validateAndParseBackup(JSON.stringify(invalidId));
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain('Invalid question ID "not-an-id"');
    }
  });

  it('rejects invalid question statuses', () => {
    const invalidStatus = {
      solvedQuestions: { '1': 'completed' }, // 'completed' is not in 'solved' | 'attempted' | 'unsolved'
    };
    const res = validateAndParseBackup(JSON.stringify(invalidStatus));
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain('Invalid question status "completed"');
    }
  });

  it('rejects malformed activityHistory date formats or negative counts', () => {
    const invalidDate = {
      solvedQuestions: { '1': 'solved' },
      activityHistory: { '24-10-2026': 1 }, // not YYYY-MM-DD
    };
    const res1 = validateAndParseBackup(JSON.stringify(invalidDate));
    expect(res1.success).toBe(false);
    if (!res1.success) {
      expect(res1.error).toContain('Invalid date format');
    }

    const negativeCount = {
      solvedQuestions: { '1': 'solved' },
      activityHistory: { '2026-10-24': -5 },
    };
    const res2 = validateAndParseBackup(JSON.stringify(negativeCount));
    expect(res2.success).toBe(false);
    if (!res2.success) {
      expect(res2.error).toContain('must be a non-negative integer');
    }
  });

  it('rejects malformed leetcodeAccount missing a username', () => {
    const badLc = {
      solvedQuestions: { '1': 'solved' },
      leetcodeAccount: { totalSolved: 50 }, // missing username
    };
    const res = validateAndParseBackup(JSON.stringify(badLc));
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain('username');
    }
  });
});
