import type { UserProgress, QuestionStatus, LeetCodeAccount, LeetCodeSubmission } from '../types';
import { normalizeTimestampToISO, normalizeTimestampToSecondsString } from './timestampUtils';

export const CURRENT_BACKUP_SCHEMA_VERSION = 2;

export interface ValidationSuccess {
  success: true;
  progress: UserProgress;
  leetcodeAccount: LeetCodeAccount | null;
}

export interface ValidationFailure {
  success: false;
  error: string;
}

export type BackupValidationResult = ValidationSuccess | ValidationFailure;

const VALID_STATUSES: Set<string> = new Set(['solved', 'attempted', 'unsolved']);
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates that a string is a real calendar date in YYYY-MM-DD format.
 * Rejects impossible dates such as 2026-99-99 or 2026-02-31 by verifying
 * UTC calendar boundary rollover.
 */
export function isValidCalendarDate(dateStr: string): boolean {
  if (!DATE_REGEX.test(dateStr)) {
    return false;
  }
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month < 1 || month > 12) {
    return false;
  }
  if (day < 1 || day > 31) {
    return false;
  }

  // Create date in UTC to prevent timezone shifts
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return (
    utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() === month - 1 &&
    utcDate.getUTCDate() === day
  );
}

/**
 * Validates and migrates an exported backup JSON string.
 * Atomic: Never mutates existing state or throws. Returns a structured result.
 */
export function validateAndParseBackup(jsonStr: string): BackupValidationResult {
  if (!jsonStr || typeof jsonStr !== 'string') {
    return { success: false, error: 'Backup data is empty or invalid string.' };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (err: any) {
    return { success: false, error: `Invalid JSON syntax: ${err.message}` };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { success: false, error: 'Backup payload must be a JSON object.' };
  }

  // Schema version check
  if (parsed.version !== undefined) {
    if (typeof parsed.version !== 'number' || !Number.isInteger(parsed.version) || parsed.version < 1) {
      return { success: false, error: 'Malformed schema version in backup file.' };
    }
    if (parsed.version > CURRENT_BACKUP_SCHEMA_VERSION) {
      return {
        success: false,
        error: `Unsupported backup version (${parsed.version}). This version of CompanyWise supports backup versions up to v${CURRENT_BACKUP_SCHEMA_VERSION}.`,
      };
    }
  }

  // solvedQuestions validation
  if (!parsed.solvedQuestions || typeof parsed.solvedQuestions !== 'object' || Array.isArray(parsed.solvedQuestions)) {
    return { success: false, error: 'Missing or malformed "solvedQuestions" field.' };
  }

  const validatedSolved: Record<number, QuestionStatus> = {};
  for (const [key, status] of Object.entries(parsed.solvedQuestions)) {
    const idNum = Number(key);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return { success: false, error: `Invalid question ID "${key}". Question IDs must be positive integers.` };
    }
    if (typeof status !== 'string' || !VALID_STATUSES.has(status)) {
      return {
        success: false,
        error: `Invalid question status "${status}" for question #${key}. Allowed statuses: solved, attempted, unsolved.`,
      };
    }
    if (status === 'solved' || status === 'attempted') {
      validatedSolved[idNum] = status;
    }
  }

  // bookmarks validation
  const bookmarks: number[] = [];
  if (parsed.bookmarks !== undefined) {
    if (!Array.isArray(parsed.bookmarks)) {
      return { success: false, error: 'Field "bookmarks" must be an array of question IDs.' };
    }
    for (const b of parsed.bookmarks) {
      const bNum = Number(b);
      if (!Number.isInteger(bNum) || bNum <= 0) {
        return { success: false, error: `Invalid bookmark ID "${b}". IDs must be positive integers.` };
      }
      if (!bookmarks.includes(bNum)) {
        bookmarks.push(bNum);
      }
    }
  }

  // targetCompanies validation
  const targetCompanies: string[] = [];
  if (parsed.targetCompanies !== undefined) {
    if (!Array.isArray(parsed.targetCompanies)) {
      return { success: false, error: 'Field "targetCompanies" must be an array of company slugs.' };
    }
    for (const slug of parsed.targetCompanies) {
      if (typeof slug !== 'string' || !slug.trim()) {
        return { success: false, error: 'Target company slugs must be non-empty strings.' };
      }
      const cleanSlug = slug.trim().toLowerCase();
      if (!targetCompanies.includes(cleanSlug)) {
        targetCompanies.push(cleanSlug);
      }
    }
  }

  // activityHistory validation
  const activityHistory: Record<string, number> = {};
  if (parsed.activityHistory !== undefined) {
    if (typeof parsed.activityHistory !== 'object' || Array.isArray(parsed.activityHistory) || parsed.activityHistory === null) {
      return { success: false, error: 'Field "activityHistory" must be an object mapping YYYY-MM-DD dates to solve counts.' };
    }
    for (const [dateStr, count] of Object.entries(parsed.activityHistory)) {
      if (!isValidCalendarDate(dateStr)) {
        return { success: false, error: `Invalid date format or calendar date "${dateStr}" in activityHistory. Expected valid real calendar date in YYYY-MM-DD format.` };
      }
      const countNum = Number(count);
      if (typeof count !== 'number' || !Number.isInteger(countNum) || countNum < 0) {
        return { success: false, error: `Invalid activity count for date "${dateStr}". Count must be a non-negative integer.` };
      }
      activityHistory[dateStr] = countNum;
    }
  }

  // solvedQuestionTimestamps validation (optional metadata for completion date accuracy)
  const solvedQuestionTimestamps: Record<number, string> = {};
  if (parsed.solvedQuestionTimestamps !== undefined) {
    if (typeof parsed.solvedQuestionTimestamps === 'object' && !Array.isArray(parsed.solvedQuestionTimestamps) && parsed.solvedQuestionTimestamps !== null) {
      for (const [qId, ts] of Object.entries(parsed.solvedQuestionTimestamps)) {
        const idNum = Number(qId);
        if (Number.isInteger(idNum) && idNum > 0 && typeof ts === 'string') {
          const parsedDate = Date.parse(ts);
          if (!isNaN(parsedDate)) {
            solvedQuestionTimestamps[idNum] = new Date(parsedDate).toISOString();
          }
        }
      }
    }
  }

  // recentQuestionTimestamps validation
  const recentQuestionTimestamps: Record<number, string> = {};
  if (parsed.recentQuestionTimestamps !== undefined) {
    if (typeof parsed.recentQuestionTimestamps === 'object' && !Array.isArray(parsed.recentQuestionTimestamps) && parsed.recentQuestionTimestamps !== null) {
      for (const [qId, ts] of Object.entries(parsed.recentQuestionTimestamps)) {
        const idNum = Number(qId);
        if (Number.isInteger(idNum) && idNum > 0 && typeof ts === 'string') {
          const parsedDate = Date.parse(ts);
          if (!isNaN(parsedDate)) {
            recentQuestionTimestamps[idNum] = new Date(parsedDate).toISOString();
          }
        }
      }
    }
  }

  // recentCompanies validation
  const recentCompanies: string[] = [];
  if (Array.isArray(parsed.recentCompanies)) {
    for (const c of parsed.recentCompanies) {
      if (typeof c === 'string' && c.trim()) {
        recentCompanies.push(c.trim().toLowerCase());
      }
    }
  }

  // recentQuestions validation
  const recentQuestions: number[] = [];
  if (Array.isArray(parsed.recentQuestions)) {
    for (const q of parsed.recentQuestions) {
      const qNum = Number(q);
      if (Number.isInteger(qNum) && qNum > 0 && !recentQuestions.includes(qNum)) {
        recentQuestions.push(qNum);
      }
    }
  }

  // LeetCode account validation
  let validatedLcAccount: LeetCodeAccount | null = null;
  const rawLc = parsed.leetcodeAccount || parsed.lcAccount;
  if (rawLc !== undefined && rawLc !== null) {
    if (typeof rawLc !== 'object' || Array.isArray(rawLc)) {
      return { success: false, error: 'Field "leetcodeAccount" must be an object.' };
    }
    if (typeof rawLc.username !== 'string' || !rawLc.username.trim()) {
      return { success: false, error: 'LeetCode account must have a valid non-empty username.' };
    }
    // Validate recentSubmissions array
    const validatedSubmissions: LeetCodeSubmission[] = [];
    if (rawLc.recentSubmissions !== undefined) {
      if (!Array.isArray(rawLc.recentSubmissions)) {
        return { success: false, error: 'Field "recentSubmissions" in leetcodeAccount must be an array.' };
      }
      for (const sub of rawLc.recentSubmissions) {
        if (
          sub &&
          typeof sub === 'object' &&
          typeof sub.title === 'string' &&
          sub.title.trim() &&
          typeof sub.titleSlug === 'string' &&
          sub.titleSlug.trim()
        ) {
          validatedSubmissions.push({
            id: String(sub.id || sub.titleSlug),
            title: sub.title.trim(),
            titleSlug: sub.titleSlug.trim().toLowerCase(),
            timestamp: sub.timestamp ? normalizeTimestampToSecondsString(sub.timestamp) : undefined,
          });
        }
      }
    }

    validatedLcAccount = {
      username: rawLc.username.trim(),
      realName: typeof rawLc.realName === 'string' ? rawLc.realName : undefined,
      avatar: typeof rawLc.avatar === 'string' ? rawLc.avatar : undefined,
      ranking: typeof rawLc.ranking === 'number' ? rawLc.ranking : undefined,
      totalSolved: typeof rawLc.totalSolved === 'number' && rawLc.totalSolved >= 0 ? rawLc.totalSolved : 0,
      easySolved: typeof rawLc.easySolved === 'number' && rawLc.easySolved >= 0 ? rawLc.easySolved : 0,
      mediumSolved: typeof rawLc.mediumSolved === 'number' && rawLc.mediumSolved >= 0 ? rawLc.mediumSolved : 0,
      hardSolved: typeof rawLc.hardSolved === 'number' && rawLc.hardSolved >= 0 ? rawLc.hardSolved : 0,
      lastSyncedAt: typeof rawLc.lastSyncedAt === 'string' ? rawLc.lastSyncedAt : new Date().toISOString(),
      recentSubmissions: validatedSubmissions,
      autoSync: Boolean(rawLc.autoSync),
    };
  }

  const progress: UserProgress = {
    solvedQuestions: validatedSolved,
    bookmarks,
    targetCompanies,
    recentCompanies: recentCompanies.slice(0, 10),
    recentQuestions: recentQuestions.slice(0, 20),
    recentQuestionTimestamps,
    solvedQuestionTimestamps,
    activityHistory,
    lastUpdated: typeof parsed.lastUpdated === 'string' ? parsed.lastUpdated : new Date().toISOString(),
  };

  return {
    success: true,
    progress,
    leetcodeAccount: validatedLcAccount,
  };
}

/**
 * Validates saved progress directly from localStorage schema.
 * Rejects syntactically valid JSON containing invalid application data types
 * (e.g. non-array bookmarks, invalid question status, non-numeric timestamps).
 */
export function validateProgressSchema(data: any): { valid: boolean; error?: string; progress?: UserProgress } {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, error: 'Saved progress must be a non-null object.' };
  }

  // 1. solvedQuestions validation
  const validatedSolved: Record<number, QuestionStatus> = {};
  if (data.solvedQuestions !== undefined) {
    if (typeof data.solvedQuestions !== 'object' || Array.isArray(data.solvedQuestions) || data.solvedQuestions === null) {
      return { valid: false, error: 'Field "solvedQuestions" must be an object.' };
    }
    for (const [key, status] of Object.entries(data.solvedQuestions)) {
      const idNum = Number(key);
      if (!Number.isInteger(idNum) || idNum <= 0) {
        return { valid: false, error: `Invalid question ID "${key}". Question IDs must be positive integers.` };
      }
      if (typeof status !== 'string' || !VALID_STATUSES.has(status)) {
        return {
          valid: false,
          error: `Invalid question status "${status}" for question #${key}. Allowed statuses: solved, attempted, unsolved.`,
        };
      }
      if (status === 'solved' || status === 'attempted') {
        validatedSolved[idNum] = status;
      }
    }
  }

  // 2. bookmarks validation
  const bookmarks: number[] = [];
  if (data.bookmarks !== undefined) {
    if (!Array.isArray(data.bookmarks)) {
      return { valid: false, error: 'Field "bookmarks" must be an array of question IDs.' };
    }
    for (const b of data.bookmarks) {
      const bNum = Number(b);
      if (!Number.isInteger(bNum) || bNum <= 0) {
        return { valid: false, error: `Invalid bookmark ID "${b}". IDs must be positive integers.` };
      }
      if (!bookmarks.includes(bNum)) {
        bookmarks.push(bNum);
      }
    }
  }

  // 3. targetCompanies validation
  const targetCompanies: string[] = [];
  if (data.targetCompanies !== undefined) {
    if (!Array.isArray(data.targetCompanies)) {
      return { valid: false, error: 'Field "targetCompanies" must be an array of company slugs.' };
    }
    for (const slug of data.targetCompanies) {
      if (typeof slug !== 'string' || !slug.trim()) {
        return { valid: false, error: 'Target company slugs must be non-empty strings.' };
      }
      const cleanSlug = slug.trim().toLowerCase();
      if (!targetCompanies.includes(cleanSlug)) {
        targetCompanies.push(cleanSlug);
      }
    }
  }

  // 4. activityHistory validation
  const activityHistory: Record<string, number> = {};
  if (data.activityHistory !== undefined) {
    if (typeof data.activityHistory !== 'object' || Array.isArray(data.activityHistory) || data.activityHistory === null) {
      return { valid: false, error: 'Field "activityHistory" must be an object.' };
    }
    for (const [dateStr, count] of Object.entries(data.activityHistory)) {
      if (!isValidCalendarDate(dateStr)) {
        return { valid: false, error: `Invalid date format or calendar date "${dateStr}" in activityHistory.` };
      }
      const countNum = Number(count);
      if (typeof count !== 'number' || !Number.isInteger(countNum) || countNum < 0) {
        return { valid: false, error: `Invalid activity count for date "${dateStr}". Count must be a non-negative integer.` };
      }
      activityHistory[dateStr] = countNum;
    }
  }

  // 5. solvedQuestionTimestamps validation
  const solvedQuestionTimestamps: Record<number, string> = {};
  if (data.solvedQuestionTimestamps !== undefined) {
    if (typeof data.solvedQuestionTimestamps !== 'object' || Array.isArray(data.solvedQuestionTimestamps) || data.solvedQuestionTimestamps === null) {
      return { valid: false, error: 'Field "solvedQuestionTimestamps" must be an object.' };
    }
    for (const [qId, ts] of Object.entries(data.solvedQuestionTimestamps)) {
      const idNum = Number(qId);
      if (Number.isInteger(idNum) && idNum > 0) {
        const iso = normalizeTimestampToISO(ts as any);
        if (iso) {
          solvedQuestionTimestamps[idNum] = iso;
        }
      }
    }
  }

  // 6. recentQuestionTimestamps validation
  const recentQuestionTimestamps: Record<number, string> = {};
  if (data.recentQuestionTimestamps !== undefined) {
    if (typeof data.recentQuestionTimestamps !== 'object' || Array.isArray(data.recentQuestionTimestamps) || data.recentQuestionTimestamps === null) {
      return { valid: false, error: 'Field "recentQuestionTimestamps" must be an object.' };
    }
    for (const [qId, ts] of Object.entries(data.recentQuestionTimestamps)) {
      const idNum = Number(qId);
      if (Number.isInteger(idNum) && idNum > 0) {
        const iso = normalizeTimestampToISO(ts as any);
        if (iso) {
          recentQuestionTimestamps[idNum] = iso;
        }
      }
    }
  }

  // 7. recentCompanies validation
  const recentCompanies: string[] = [];
  if (data.recentCompanies !== undefined) {
    if (!Array.isArray(data.recentCompanies)) {
      return { valid: false, error: 'Field "recentCompanies" must be an array.' };
    }
    for (const c of data.recentCompanies) {
      if (typeof c === 'string' && c.trim()) {
        recentCompanies.push(c.trim().toLowerCase());
      }
    }
  }

  // 8. recentQuestions validation
  const recentQuestions: number[] = [];
  if (data.recentQuestions !== undefined) {
    if (!Array.isArray(data.recentQuestions)) {
      return { valid: false, error: 'Field "recentQuestions" must be an array.' };
    }
    for (const q of data.recentQuestions) {
      const qNum = Number(q);
      if (Number.isInteger(qNum) && qNum > 0 && !recentQuestions.includes(qNum)) {
        recentQuestions.push(qNum);
      }
    }
  }

  const progress: UserProgress = {
    solvedQuestions: validatedSolved,
    bookmarks,
    targetCompanies,
    recentCompanies: recentCompanies.slice(0, 10),
    recentQuestions: recentQuestions.slice(0, 20),
    recentQuestionTimestamps,
    solvedQuestionTimestamps,
    activityHistory,
    lastUpdated: typeof data.lastUpdated === 'string' ? data.lastUpdated : new Date().toISOString(),
  };

  return { valid: true, progress };
}
