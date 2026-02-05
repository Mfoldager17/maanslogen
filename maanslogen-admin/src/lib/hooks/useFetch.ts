"use client";

import { useEffect, useState, useCallback } from "react";
import { getApiError } from "./useApiError";

type ApiResponse<T> = { data?: T; error?: unknown };

/**
 * Single async fetch with loading and error state.
 * Pass a function that returns an API promise (e.g. () => getXById({ path: { id } })).
 * Error is extracted from the first/only response via getApiError.
 */
export function useFetch<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  deps: React.DependencyList,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled !== false;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn();
      const err = getApiError(res);
      if (err) {
        setError(err);
        setData(null);
      } else {
        setData(res.data ?? null);
      }
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setData(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchFn()
      .then((res) => {
        if (cancelled) return;
        const err = getApiError(res);
        if (err) {
          setError(err);
          setData(null);
        } else {
          setData(res.data ?? null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error, refetch };
}
