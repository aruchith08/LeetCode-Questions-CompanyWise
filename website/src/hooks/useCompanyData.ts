import { useState, useCallback } from 'react';
import type { CompanyData } from '../types';

const cache = new Map<string, CompanyData>();

export function useCompanyData() {
  const [data, setData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const loadCompany = useCallback(async (slug: string) => {
    if (cache.has(slug)) {
      setData(cache.get(slug)!);
      setLoading(false);
      setIsNotFound(false);
      return;
    }
    setLoading(true);
    setError(null);
    setIsNotFound(false);
    try {
      const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
      const res = await fetch(`${basePath}/data/companies/${slug}.json?v=20261025`);
      if (res.status === 404) {
        setIsNotFound(true);
        throw new Error('NOT_FOUND');
      }
      if (!res.ok) throw new Error(`Failed to load company data (HTTP ${res.status})`);
      const d: CompanyData = await res.json();
      cache.set(slug, d);
      setData(d);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') {
        setIsNotFound(true);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, isNotFound, loadCompany };
}
