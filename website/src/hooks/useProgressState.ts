import { useState, useCallback, useEffect } from 'react';
import type { UserProgress, QuestionStatus, LeetCodeAccount } from '../types';
import {
  fetchLeetCodeData,
  matchLeetCodeSubmissionsWithDetails,
  type SyncOutcome,
  type SyncStatusDetails,
} from '../services/leetcodeService';
import { fetchAllQuestions } from './useAllQuestions';
import {
  validateAndParseBackup,
  CURRENT_BACKUP_SCHEMA_VERSION,
} from '../utils/backupValidation';

const STORAGE_KEY = 'companywise-progress';
const LEGACY_STORAGE_KEY = 'codewise-progress';
const LC_STORAGE_KEY = 'companywise-leetcode-account';
const LEGACY_LC_STORAGE_KEY = 'codewise-leetcode-account';

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultProgress(): UserProgress {
  return {
    solvedQuestions: {},
    bookmarks: [],
    targetCompanies: [],
    recentCompanies: [],
    recentQuestions: [],
    recentQuestionTimestamps: {},
    solvedQuestionTimestamps: {},
    activityHistory: {},
    lastUpdated: new Date().toISOString(),
  };
}

function loadProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const activityHistory = parsed.activityHistory || {};
      const solvedCount = Object.keys(parsed.solvedQuestions || {}).length;
      if (solvedCount > 0 && Object.keys(activityHistory).length === 0) {
        const today = getLocalDateString();
        activityHistory[today] = solvedCount;
      }
      return {
        ...getDefaultProgress(),
        ...parsed,
        targetCompanies: parsed.targetCompanies || [],
        recentQuestionTimestamps: parsed.recentQuestionTimestamps || {},
        solvedQuestionTimestamps: parsed.solvedQuestionTimestamps || {},
        activityHistory,
      };
    }
  } catch {}
  return getDefaultProgress();
}

function loadLeetCodeAccount(): LeetCodeAccount | null {
  try {
    const stored = localStorage.getItem(LC_STORAGE_KEY) || localStorage.getItem(LEGACY_LC_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return null;
}

function saveProgress(progress: UserProgress) {
  progress.lastUpdated = new Date().toISOString();
  try {
    const serialized = JSON.stringify(progress);
    localStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(LEGACY_STORAGE_KEY, serialized);
  } catch {}
}

function saveLeetCodeAccount(account: LeetCodeAccount | null) {
  try {
    if (account) {
      const serialized = JSON.stringify(account);
      localStorage.setItem(LC_STORAGE_KEY, serialized);
      localStorage.setItem(LEGACY_LC_STORAGE_KEY, serialized);
    } else {
      localStorage.removeItem(LC_STORAGE_KEY);
      localStorage.removeItem(LEGACY_LC_STORAGE_KEY);
    }
  } catch {}
}

/**
 * Standalone state hook for progress management.
 * Tested independently or injected into ProgressProvider.
 */
export function useProgressState() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [lcAccount, setLcAccount] = useState<LeetCodeAccount | null>(loadLeetCodeAccount);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncOutcome>('idle');
  const [syncDetails, setSyncDetails] = useState<SyncStatusDetails | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveLeetCodeAccount(lcAccount);
  }, [lcAccount]);

  const getStatus = useCallback(
    (id: number): QuestionStatus => progress.solvedQuestions[id] || 'unsolved',
    [progress.solvedQuestions]
  );

  // Toggle solved with accurate date-based activity tracking
  const toggleSolved = useCallback((id: number) => {
    setProgress(prev => {
      const current = prev.solvedQuestions[id] || 'unsolved';
      const newQuestions = { ...prev.solvedQuestions };
      const solvedTimestamps = { ...(prev.solvedQuestionTimestamps || {}) };
      const activityHistory = { ...(prev.activityHistory || {}) };
      const today = getLocalDateString();

      if (current === 'solved') {
        // Unmark problem
        delete newQuestions[id];
        // Decrement activity on the date it was actually solved, NOT today
        const originalTs = solvedTimestamps[id];
        if (originalTs) {
          const originalDate = getLocalDateString(new Date(originalTs));
          if (activityHistory[originalDate] && activityHistory[originalDate] > 0) {
            activityHistory[originalDate] = Math.max(0, activityHistory[originalDate] - 1);
          }
          delete solvedTimestamps[id];
        }
      } else {
        // Mark as solved
        newQuestions[id] = 'solved';
        solvedTimestamps[id] = new Date().toISOString();
        activityHistory[today] = (activityHistory[today] || 0) + 1;
      }
      return {
        ...prev,
        solvedQuestions: newQuestions,
        solvedQuestionTimestamps: solvedTimestamps,
        activityHistory,
      };
    });
  }, []);

  const markBatchSolved = useCallback((items: Array<number | { id: number; timestamp?: string }>) => {
    setProgress(prev => {
      const newQuestions = { ...prev.solvedQuestions };
      const solvedTimestamps = { ...(prev.solvedQuestionTimestamps || {}) };
      const activityHistory = { ...(prev.activityHistory || {}) };
      const today = getLocalDateString();
      let changed = false;

      for (const item of items) {
        const id = typeof item === 'number' ? item : item.id;
        const subTs = typeof item === 'number' ? undefined : item.timestamp;

        // Idempotent: skip if already solved
        if (newQuestions[id] === 'solved') {
          continue;
        }

        newQuestions[id] = 'solved';
        changed = true;

        if (subTs) {
          const numTs = parseInt(subTs, 10);
          if (!isNaN(numTs) && numTs > 0) {
            const subDate = new Date(numTs * 1000);
            const dateStr = getLocalDateString(subDate);
            solvedTimestamps[id] = subDate.toISOString();
            activityHistory[dateStr] = (activityHistory[dateStr] || 0) + 1;
            continue;
          }
        }

        // If no genuine timestamp available, do not fabricate today's date for historical imports
        if (typeof item !== 'number') {
          // Imported LeetCode problem with unknown exact timestamp
          solvedTimestamps[id] = new Date().toISOString();
        } else {
          // Manual batch solve today
          solvedTimestamps[id] = new Date().toISOString();
          activityHistory[today] = (activityHistory[today] || 0) + 1;
        }
      }

      return changed
        ? {
            ...prev,
            solvedQuestions: newQuestions,
            solvedQuestionTimestamps: solvedTimestamps,
            activityHistory,
          }
        : prev;
    });
  }, []);

  const toggleAttempted = useCallback((id: number) => {
    setProgress(prev => {
      const current = prev.solvedQuestions[id] || 'unsolved';
      const newQuestions = { ...prev.solvedQuestions };
      const solvedTimestamps = { ...(prev.solvedQuestionTimestamps || {}) };
      const activityHistory = { ...(prev.activityHistory || {}) };

      if (current === 'attempted') {
        delete newQuestions[id];
      } else {
        // If transitioning from solved to attempted, decrement activity on original date
        if (current === 'solved') {
          const originalTs = solvedTimestamps[id];
          if (originalTs) {
            const originalDate = getLocalDateString(new Date(originalTs));
            if (activityHistory[originalDate] && activityHistory[originalDate] > 0) {
              activityHistory[originalDate] = Math.max(0, activityHistory[originalDate] - 1);
            }
            delete solvedTimestamps[id];
          }
        }
        newQuestions[id] = 'attempted';
      }
      return {
        ...prev,
        solvedQuestions: newQuestions,
        solvedQuestionTimestamps: solvedTimestamps,
        activityHistory,
      };
    });
  }, []);

  const setQuestionStatus = useCallback((id: number, status: QuestionStatus) => {
    setProgress(prev => {
      const current = prev.solvedQuestions[id] || 'unsolved';
      if (current === status) return prev;

      const newQuestions = { ...prev.solvedQuestions };
      const solvedTimestamps = { ...(prev.solvedQuestionTimestamps || {}) };
      const activityHistory = { ...(prev.activityHistory || {}) };
      const today = getLocalDateString();

      // If formerly solved, decrement original solve date
      if (current === 'solved') {
        const originalTs = solvedTimestamps[id];
        if (originalTs) {
          const originalDate = getLocalDateString(new Date(originalTs));
          if (activityHistory[originalDate] && activityHistory[originalDate] > 0) {
            activityHistory[originalDate] = Math.max(0, activityHistory[originalDate] - 1);
          }
          delete solvedTimestamps[id];
        }
      }

      if (status === 'unsolved') {
        delete newQuestions[id];
      } else if (status === 'solved') {
        newQuestions[id] = 'solved';
        solvedTimestamps[id] = new Date().toISOString();
        activityHistory[today] = (activityHistory[today] || 0) + 1;
      } else {
        newQuestions[id] = 'attempted';
      }

      return {
        ...prev,
        solvedQuestions: newQuestions,
        solvedQuestionTimestamps: solvedTimestamps,
        activityHistory,
      };
    });
  }, []);

  const markBatchStatus = useCallback((ids: number[], status: QuestionStatus) => {
    setProgress(prev => {
      const newQuestions = { ...prev.solvedQuestions };
      const solvedTimestamps = { ...(prev.solvedQuestionTimestamps || {}) };
      const activityHistory = { ...(prev.activityHistory || {}) };
      const today = getLocalDateString();
      let changed = false;

      for (const id of ids) {
        const current = newQuestions[id] || 'unsolved';
        if (current === status) continue;

        if (current === 'solved') {
          const originalTs = solvedTimestamps[id];
          if (originalTs) {
            const originalDate = getLocalDateString(new Date(originalTs));
            if (activityHistory[originalDate] && activityHistory[originalDate] > 0) {
              activityHistory[originalDate] = Math.max(0, activityHistory[originalDate] - 1);
            }
            delete solvedTimestamps[id];
          }
        }

        if (status === 'unsolved') {
          delete newQuestions[id];
          changed = true;
        } else if (status === 'solved') {
          newQuestions[id] = 'solved';
          solvedTimestamps[id] = new Date().toISOString();
          activityHistory[today] = (activityHistory[today] || 0) + 1;
          changed = true;
        } else {
          newQuestions[id] = 'attempted';
          changed = true;
        }
      }

      return changed
        ? {
            ...prev,
            solvedQuestions: newQuestions,
            solvedQuestionTimestamps: solvedTimestamps,
            activityHistory,
          }
        : prev;
    });
  }, []);

  const toggleBookmark = useCallback((id: number) => {
    setProgress(prev => {
      const bookmarks = prev.bookmarks.includes(id)
        ? prev.bookmarks.filter(b => b !== id)
        : [...prev.bookmarks, id];
      return { ...prev, bookmarks };
    });
  }, []);

  const isBookmarked = useCallback(
    (id: number) => progress.bookmarks.includes(id),
    [progress.bookmarks]
  );

  const toggleTargetCompany = useCallback((slug: string) => {
    setProgress(prev => {
      const current = prev.targetCompanies || [];
      const updated = current.includes(slug)
        ? current.filter(s => s !== slug)
        : [...current, slug];
      return { ...prev, targetCompanies: updated };
    });
  }, []);

  const isTargeted = useCallback(
    (slug: string) => Boolean(progress.targetCompanies?.includes(slug)),
    [progress.targetCompanies]
  );

  const addRecentCompany = useCallback((slug: string) => {
    setProgress(prev => {
      const filtered = prev.recentCompanies.filter(s => s !== slug);
      return { ...prev, recentCompanies: [slug, ...filtered].slice(0, 10) };
    });
  }, []);

  const addRecentQuestion = useCallback((id: number) => {
    setProgress(prev => {
      const filtered = prev.recentQuestions.filter(q => q !== id);
      const recentQuestionTimestamps = { ...(prev.recentQuestionTimestamps || {}) };
      recentQuestionTimestamps[id] = new Date().toISOString();
      return {
        ...prev,
        recentQuestions: [id, ...filtered].slice(0, 20),
        recentQuestionTimestamps,
      };
    });
  }, []);

  // LeetCode connection & synchronization with clear separation of outcomes
  const connectLeetCode = useCallback(async (
    username: string,
    allQuestions?: { id: number; title: string; link: string }[]
  ) => {
    setIsSyncing(true);
    setSyncStatus('syncing');
    setSyncError(null);
    setSyncDetails(null);

    let account: LeetCodeAccount;
    try {
      account = await fetchLeetCodeData(username);
      setLcAccount(account);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to connect LeetCode account';
      setSyncStatus('failed');
      setSyncError(errorMsg);
      setIsSyncing(false);
      throw err;
    }

    // Step 2: Catalog matching
    let catalog = allQuestions;
    let catalogError: string | null = null;
    if (!catalog || catalog.length === 0) {
      try {
        catalog = await fetchAllQuestions();
      } catch (catErr: any) {
        catalogError = catErr.message || 'Could not load question catalog';
      }
    }

    if (catalogError || !catalog || catalog.length === 0) {
      const details: SyncStatusDetails = {
        outcome: 'partial',
        connectedAt: new Date().toISOString(),
        totalSolvedOnProfile: account.totalSolved,
        recentSubmissionsCount: account.recentSubmissions.length,
        matchedCount: 0,
        unmatchedCount: account.recentSubmissions.length,
        newlySolvedCount: 0,
        isPartial: true,
        message: `Connected to LeetCode (@${account.username}). Question catalog could not be loaded; problem matching was skipped.`,
        error: catalogError,
      };
      setSyncStatus('partial');
      setSyncDetails(details);
      setSyncNotice(details.message);
      setIsSyncing(false);
      return account;
    }

    // Perform matching with details
    const matchResult = matchLeetCodeSubmissionsWithDetails(account.recentSubmissions, catalog);
    const existingSolved = progress.solvedQuestions;
    const newlySolvedItems = matchResult.matchedItems.filter(item => existingSolved[item.id] !== 'solved');

    if (newlySolvedItems.length > 0) {
      markBatchSolved(newlySolvedItems);
    }

    const isPartial = matchResult.unmatchedSubmissions.length > 0 || account.totalSolved > matchResult.matchedCount;
    const outcome: SyncOutcome = isPartial ? 'partial' : 'completed';

    let noticeMsg = `Connected to LeetCode (@${account.username})! Synced ${matchResult.matchedCount} problems (${newlySolvedItems.length} new).`;
    if (account.totalSolved > matchResult.matchedCount) {
      noticeMsg += ` (Note: ${account.totalSolved} lifetime solved on LeetCode; public API provides recent submissions).`;
    }

    const details: SyncStatusDetails = {
      outcome,
      connectedAt: new Date().toISOString(),
      totalSolvedOnProfile: account.totalSolved,
      recentSubmissionsCount: account.recentSubmissions.length,
      matchedCount: matchResult.matchedCount,
      unmatchedCount: matchResult.unmatchedSubmissions.length,
      newlySolvedCount: newlySolvedItems.length,
      isPartial,
      message: noticeMsg,
    };

    setSyncStatus(outcome);
    setSyncDetails(details);
    setSyncNotice(noticeMsg);
    setIsSyncing(false);
    return account;
  }, [markBatchSolved, progress.solvedQuestions]);

  const syncLeetCode = useCallback(async (
    allQuestions?: { id: number; title: string; link: string }[]
  ) => {
    if (!lcAccount) return;
    setIsSyncing(true);
    setSyncStatus('syncing');
    setSyncError(null);

    let account: LeetCodeAccount;
    try {
      account = await fetchLeetCodeData(lcAccount.username);
      setLcAccount(account);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to sync with LeetCode';
      setSyncStatus('failed');
      setSyncError(errorMsg);
      setIsSyncing(false);
      return;
    }

    let catalog = allQuestions;
    let catalogError: string | null = null;
    if (!catalog || catalog.length === 0) {
      try {
        catalog = await fetchAllQuestions();
      } catch (catErr: any) {
        catalogError = catErr.message || 'Could not load question catalog';
      }
    }

    if (catalogError || !catalog || catalog.length === 0) {
      const details: SyncStatusDetails = {
        outcome: 'partial',
        connectedAt: account.lastSyncedAt,
        totalSolvedOnProfile: account.totalSolved,
        recentSubmissionsCount: account.recentSubmissions.length,
        matchedCount: 0,
        unmatchedCount: account.recentSubmissions.length,
        newlySolvedCount: 0,
        isPartial: true,
        message: `Profile updated (@${account.username}), but question catalog could not be loaded for matching.`,
        error: catalogError,
      };
      setSyncStatus('partial');
      setSyncDetails(details);
      setSyncNotice(details.message);
      setIsSyncing(false);
      return;
    }

    const matchResult = matchLeetCodeSubmissionsWithDetails(account.recentSubmissions, catalog);
    const existingSolved = progress.solvedQuestions;
    const newlySolvedItems = matchResult.matchedItems.filter(item => existingSolved[item.id] !== 'solved');

    if (newlySolvedItems.length > 0) {
      markBatchSolved(newlySolvedItems);
    }

    const isPartial = matchResult.unmatchedSubmissions.length > 0 || account.totalSolved > matchResult.matchedCount;
    const outcome: SyncOutcome = isPartial ? 'partial' : 'completed';

    let noticeMsg = `LeetCode synced! Verified ${matchResult.matchedCount} problems (${newlySolvedItems.length} new).`;
    if (account.totalSolved > matchResult.matchedCount) {
      noticeMsg += ` (${account.totalSolved} total on profile; synced from public recent history).`;
    }

    const details: SyncStatusDetails = {
      outcome,
      connectedAt: account.lastSyncedAt,
      totalSolvedOnProfile: account.totalSolved,
      recentSubmissionsCount: account.recentSubmissions.length,
      matchedCount: matchResult.matchedCount,
      unmatchedCount: matchResult.unmatchedSubmissions.length,
      newlySolvedCount: newlySolvedItems.length,
      isPartial,
      message: noticeMsg,
    };

    setSyncStatus(outcome);
    setSyncDetails(details);
    setSyncNotice(noticeMsg);
    setIsSyncing(false);
  }, [lcAccount, markBatchSolved, progress.solvedQuestions]);

  const disconnectLeetCode = useCallback(() => {
    setLcAccount(null);
    setSyncStatus('idle');
    setSyncDetails(null);
    setSyncNotice('LeetCode account disconnected.');
    setTimeout(() => setSyncNotice(null), 3500);
  }, []);

  const exportProgress = useCallback(() => {
    return JSON.stringify(
      {
        version: CURRENT_BACKUP_SCHEMA_VERSION,
        ...progress,
        leetcodeAccount: lcAccount,
      },
      null,
      2
    );
  }, [progress, lcAccount]);

  /**
   * Atomic import with comprehensive schema and domain validation.
   * On failure: returns { success: false, error: string } and preserves state.
   * On success: updates state and returns { success: true }.
   */
  const importProgress = useCallback((jsonStr: string) => {
    const result = validateAndParseBackup(jsonStr);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    setProgress(result.progress);
    if (result.leetcodeAccount !== undefined) {
      setLcAccount(result.leetcodeAccount);
    }
    return { success: true };
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(getDefaultProgress());
    setLcAccount(null);
    setSyncStatus('idle');
    setSyncDetails(null);
  }, []);

  const totalSolved = Object.values(progress.solvedQuestions).filter(s => s === 'solved').length;
  const totalAttempted = Object.values(progress.solvedQuestions).filter(s => s === 'attempted').length;

  return {
    progress,
    lcAccount,
    isSyncing,
    syncStatus,
    syncDetails,
    syncError,
    syncNotice,
    getStatus,
    toggleSolved,
    markBatchSolved,
    setQuestionStatus,
    markBatchStatus,
    toggleAttempted,
    toggleBookmark,
    isBookmarked,
    toggleTargetCompany,
    isTargeted,
    targetCompanies: progress.targetCompanies || [],
    addRecentCompany,
    addRecentQuestion,
    connectLeetCode,
    syncLeetCode,
    disconnectLeetCode,
    exportProgress,
    importProgress,
    resetProgress,
    totalSolved,
    totalAttempted,
  };
}

export type ProgressStateReturn = ReturnType<typeof useProgressState>;
