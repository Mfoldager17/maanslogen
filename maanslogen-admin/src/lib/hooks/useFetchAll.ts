"use client";

import { useEffect, useState, useCallback } from "react";
import { getApiError } from "./useApiError";

type ApiResponse<T = unknown> = { data?: T; error?: unknown };

/**
 * Promise.all with loading and error state.
 * Pass an array of functions that return API promises.
 * Error is taken from the first response (primary request); data is the array of .data from each.
 * Returns { data: [d1, d2, ...] | null, loading, error, refetch }.
 */
export function useFetchAll<T extends unknown[]>(
  fetchFns: { [K in keyof T]: () => Promise<ApiResponse<T[K]>> },
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
      const results = await Promise.all(fetchFns.map((fn) => fn()));
      const firstErr = getApiError(results[0]);
      if (firstErr) {
        setError(firstErr);
        setData(null);
      } else {
        setData(results.map((r) => r.data ?? null) as T);
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
    Promise.all(fetchFns.map((fn) => fn()))
      .then((results) => {
        if (cancelled) return;
        const firstErr = getApiError(results[0]);
        if (firstErr) {
          setError(firstErr);
          setData(null);
        } else {
          setData(results.map((r) => r.data ?? null) as T);
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
