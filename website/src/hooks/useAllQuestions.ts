import { useState, useEffect, useCallback } from 'react';
import type { GlobalQuestion } from '../types';

let cachedQuestions: GlobalQuestion[] | null = null;
let inFlightPromise: Promise<GlobalQuestion[]> | null = null;

export async function fetchAllQuestions(forceRefresh = false): Promise<GlobalQuestion[]> {
  if (!forceRefresh && cachedQuestions) {
    return cachedQuestions;
  }

  if (!forceRefresh && inFlightPromise) {
    return inFlightPromise;
  }

  const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const url = `${basePath}/data/questions.json?v=20261025`;

  inFlightPromise = (async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to load question catalog (HTTP ${res.status})`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Question catalog returned invalid data format (expected an array)');
      }
      cachedQuestions = data;
      return data;
    } finally {
      // Clear in-flight promise so future attempts or retries can re-fetch if failed
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

/**
 * Resets the in-memory cache and in-flight promise (primarily for tests).
 */
export function resetQuestionsCache() {
  cachedQuestions = null;
  inFlightPromise = null;
}

export function useAllQuestions() {
  const [data, setData] = useState<GlobalQuestion[] | null>(cachedQuestions);
  const [loading, setLoading] = useState(!cachedQuestions);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (force = false) => {
    setLoading(!cachedQuestions || force);
    setError(null);
    try {
      const result = await fetchAllQuestions(force);
      setData(result);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to load questions');
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    if (cachedQuestions) {
      setData(cachedQuestions);
      setLoading(false);
      return;
    }

    fetchAllQuestions()
      .then(d => {
        if (mounted) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message || 'Failed to load questions');
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const refetch = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  return { data, loading, error, refetch };
}
