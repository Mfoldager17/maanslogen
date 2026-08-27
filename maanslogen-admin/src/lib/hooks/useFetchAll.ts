"use client";

import { useCallback } from "react";
import { getApiError } from "./useApiError";
import { useAsyncData } from "./useAsyncData";

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
  const load = useCallback(async () => {
    const results = await Promise.all(fetchFns.map((fn) => fn()));
    const err = getApiError(results[0]);
    return {
      data: err ? null : (results.map((r) => r.data ?? null) as T),
      error: err,
    };
    // Hookens API tager (som React Query) en deps-liste fra kalderen:
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  }, deps);

  return useAsyncData<T>(load, options?.enabled !== false);
}
