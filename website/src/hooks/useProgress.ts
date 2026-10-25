import { useState, useCallback, useEffect } from 'react';
import type { UserProgress, QuestionStatus, LeetCodeAccount } from '../types';
import { fetchLeetCodeData, matchLeetCodeSubmissionsWithQuestions } from '../services/leetcodeService';

const STORAGE_KEY = 'companywise-progress';
const LEGACY_STORAGE_KEY = 'codewise-progress';
const LC_STORAGE_KEY = 'companywise-leetcode-account';
const LEGACY_LC_STORAGE_KEY = 'codewise-leetcode-account';

function getDefaultProgress(): UserProgress {
  return {
    solvedQuestions: {},
    bookmarks: [],
    targetCompanies: [],
    recentCompanies: [],
    recentQuestions: [],
    recentQuestionTimestamps: {},
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
        const today = new Date().toISOString().split('T')[0];
        activityHistory[today] = solvedCount;
      }
      return {
        ...getDefaultProgress(),
        ...parsed,
        targetCompanies: parsed.targetCompanies || [],
        recentQuestionTimestamps: parsed.recentQuestionTimestamps || {},
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(progress));
}

function saveLeetCodeAccount(account: LeetCodeAccount | null) {
  if (account) {
    localStorage.setItem(LC_STORAGE_KEY, JSON.stringify(account));
    localStorage.setItem(LEGACY_LC_STORAGE_KEY, JSON.stringify(account));
  } else {
    localStorage.removeItem(LC_STORAGE_KEY);
    localStorage.removeItem(LEGACY_LC_STORAGE_KEY);
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [lcAccount, setLcAccount] = useState<LeetCodeAccount | null>(loadLeetCodeAccount);
  const [isSyncing, setIsSyncing] = useState(false);
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
    [progress]
  );

  const toggleSolved = useCallback((id: number) => {
    setProgress(prev => {
      const current = prev.solvedQuestions[id] || 'unsolved';
      const newQuestions = { ...prev.solvedQuestions };
      const today = new Date().toISOString().split('T')[0];
      const activityHistory = { ...(prev.activityHistory || {}) };

      if (current === 'solved') {
        delete newQuestions[id];
      } else {
        newQuestions[id] = 'solved';
        activityHistory[today] = (activityHistory[today] || 0) + 1;
      }
      return { ...prev, solvedQuestions: newQuestions, activityHistory };
    });
  }, []);

  const markBatchSolved = useCallback((ids: number[]) => {
    setProgress(prev => {
      const newQuestions = { ...prev.solvedQuestions };
      const today = new Date().toISOString().split('T')[0];
      const activityHistory = { ...(prev.activityHistory || {}) };
      let changed = false;
      for (const id of ids) {
        if (newQuestions[id] !== 'solved') {
          newQuestions[id] = 'solved';
          activityHistory[today] = (activityHistory[today] || 0) + 1;
          changed = true;
        }
      }
      return changed ? { ...prev, solvedQuestions: newQuestions, activityHistory } : prev;
    });
  }, []);

  const toggleAttempted = useCallback((id: number) => {
    setProgress(prev => {
      const current = prev.solvedQuestions[id] || 'unsolved';
      const newQuestions = { ...prev.solvedQuestions };
      const today = new Date().toISOString().split('T')[0];
      const activityHistory = { ...(prev.activityHistory || {}) };

      if (current === 'attempted') {
        delete newQuestions[id];
      } else {
        newQuestions[id] = 'attempted';
        activityHistory[today] = (activityHistory[today] || 0) + 1;
      }
      return { ...prev, solvedQuestions: newQuestions, activityHistory };
    });
  }, []);

  const setQuestionStatus = useCallback((id: number, status: QuestionStatus) => {
    setProgress(prev => {
      const newQuestions = { ...prev.solvedQuestions };
      const today = new Date().toISOString().split('T')[0];
      const activityHistory = { ...(prev.activityHistory || {}) };

      if (status === 'unsolved') {
        delete newQuestions[id];
      } else {
        newQuestions[id] = status;
        activityHistory[today] = (activityHistory[today] || 0) + 1;
      }
      return { ...prev, solvedQuestions: newQuestions, activityHistory };
    });
  }, []);

  const markBatchStatus = useCallback((ids: number[], status: QuestionStatus) => {
    setProgress(prev => {
      const newQuestions = { ...prev.solvedQuestions };
      const today = new Date().toISOString().split('T')[0];
      const activityHistory = { ...(prev.activityHistory || {}) };
      let changed = false;

      for (const id of ids) {
        if (status === 'unsolved') {
          if (newQuestions[id]) {
            delete newQuestions[id];
            changed = true;
          }
        } else {
          if (newQuestions[id] !== status) {
            newQuestions[id] = status;
            activityHistory[today] = (activityHistory[today] || 0) + 1;
            changed = true;
          }
        }
      }
      return changed ? { ...prev, solvedQuestions: newQuestions, activityHistory } : prev;
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
    [progress]
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
        recentQuestionTimestamps
      };
    });
  }, []);

  // LeetCode Account actions
  const connectLeetCode = useCallback(async (
    username: string,
    allQuestions?: { id: number; title: string; link: string }[]
  ) => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const acc = await fetchLeetCodeData(username);
      setLcAccount(acc);

      let matchedIds: number[] = [];
      if (allQuestions && acc.recentSubmissions.length > 0) {
        matchedIds = matchLeetCodeSubmissionsWithQuestions(acc.recentSubmissions, allQuestions);
        if (matchedIds.length > 0) {
          markBatchSolved(matchedIds);
        }
      }

      setSyncNotice(`Connected to LeetCode (@${acc.username})! Synced ${matchedIds.length} solved problems.`);
      setTimeout(() => setSyncNotice(null), 5000);
      return acc;
    } catch (err: any) {
      setSyncError(err.message || 'Failed to connect LeetCode account');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, [markBatchSolved]);

  const syncLeetCode = useCallback(async (
    allQuestions?: { id: number; title: string; link: string }[]
  ) => {
    if (!lcAccount) return;
    setIsSyncing(true);
    setSyncError(null);
    try {
      const acc = await fetchLeetCodeData(lcAccount.username);
      setLcAccount(acc);

      let matchedIds: number[] = [];
      if (allQuestions && acc.recentSubmissions.length > 0) {
        matchedIds = matchLeetCodeSubmissionsWithQuestions(acc.recentSubmissions, allQuestions);
        if (matchedIds.length > 0) {
          markBatchSolved(matchedIds);
        }
      }

      setSyncNotice(`LeetCode synced! Verified ${matchedIds.length} solved problems.`);
      setTimeout(() => setSyncNotice(null), 4000);
    } catch (err: any) {
      setSyncError(err.message || 'Failed to sync with LeetCode');
    } finally {
      setIsSyncing(false);
    }
  }, [lcAccount, markBatchSolved]);

  const disconnectLeetCode = useCallback(() => {
    setLcAccount(null);
    setSyncNotice('LeetCode account disconnected.');
    setTimeout(() => setSyncNotice(null), 3000);
  }, []);

  const exportProgress = useCallback(() => {
    return JSON.stringify({
      ...progress,
      leetcodeAccount: lcAccount,
    }, null, 2);
  }, [progress, lcAccount]);

  const importProgress = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (parsed && typeof parsed.solvedQuestions === 'object') {
        setProgress({ ...getDefaultProgress(), ...parsed });
        if (parsed.leetcodeAccount) {
          setLcAccount(parsed.leetcodeAccount);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(getDefaultProgress());
    setLcAccount(null);
  }, []);

  const totalSolved = Object.values(progress.solvedQuestions).filter(s => s === 'solved').length;
  const totalAttempted = Object.values(progress.solvedQuestions).filter(s => s === 'attempted').length;

  return {
    progress,
    lcAccount,
    isSyncing,
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
