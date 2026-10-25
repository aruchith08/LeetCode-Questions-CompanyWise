import { useState, useEffect } from 'react';
import type { GlobalQuestion } from '../types';

let cachedQuestions: GlobalQuestion[] | null = null;

export function useAllQuestions() {
  const [data, setData] = useState<GlobalQuestion[] | null>(cachedQuestions);
  const [loading, setLoading] = useState(!cachedQuestions);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedQuestions) return;
    fetch('/data/questions.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load questions');
        return res.json();
      })
      .then((d: GlobalQuestion[]) => {
        cachedQuestions = d;
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
