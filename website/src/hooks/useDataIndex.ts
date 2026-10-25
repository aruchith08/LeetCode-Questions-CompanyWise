import { useState, useEffect } from 'react';
import type { DataIndex } from '../types';

let cachedIndex: DataIndex | null = null;

export function useDataIndex() {
  const [data, setData] = useState<DataIndex | null>(cachedIndex);
  const [loading, setLoading] = useState(!cachedIndex);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedIndex) return;
    const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    fetch(`${basePath}/data/index.json?v=20261025`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load data index');
        return res.json();
      })
      .then((d: DataIndex) => {
        cachedIndex = d;
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
