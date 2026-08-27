"use client";

import { useCallback } from "react";
import { getApiError } from "./useApiError";
import { useAsyncData } from "./useAsyncData";

type ApiResponse<T> = { data?: T; error?: unknown };

/**
 * Single async fetch with loading and error state.
 * Pass a function that returns an API promise (e.g. () => getXById({ path: { id } })).
 * Error is extracted from the response via getApiError.
 */
export function useFetch<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  deps: React.DependencyList,
  options?: { enabled?: boolean },
) {
  const load = useCallback(async () => {
    const res = await fetchFn();
    const err = getApiError(res);
    return { data: err ? null : (res.data ?? null), error: err };
    // Hookens API tager (som React Query) en deps-liste fra kalderen:
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  }, deps);

  return useAsyncData<T>(load, options?.enabled !== false);
}
