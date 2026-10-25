import { useState, useCallback } from 'react';
import type { CompanyData } from '../types';

const cache = new Map<string, CompanyData>();

export function useCompanyData() {
  const [data, setData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCompany = useCallback(async (slug: string) => {
    if (cache.has(slug)) {
      setData(cache.get(slug)!);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/data/companies/${slug}.json`);
      if (!res.ok) throw new Error(`Company "${slug}" not found`);
      const d: CompanyData = await res.json();
      cache.set(slug, d);
      setData(d);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, loadCompany };
}
