'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export function useSession(code: string) {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (!code) return;
    try {
      const data = await api.getSession(code);
      setSession(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Session not found');
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return { session, isLoading, error, refetch: fetchSession };
}
