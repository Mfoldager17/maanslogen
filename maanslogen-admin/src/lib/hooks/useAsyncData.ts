"use client";

import { useEffect, useState, useCallback, useRef } from "react";

type AsyncState<T> = { data: T | null; loading: boolean; error: string | null };

/**
 * Fælles kerne for useFetch og useFetchAll: kører en async load-funktion
 * med loading/error state, refetch og beskyttelse mod forældede svar.
 * `load` skal være memoiseret (useCallback) – et nyt load genstarter fetch.
 */
export function useAsyncData<T>(
  load: () => Promise<{ data: T | null; error: string | null }>,
  enabled: boolean,
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: enabled,
    error: null,
  });
  const runIdRef = useRef(0);

  const refetch = useCallback(async () => {
    const runId = ++runIdRef.current;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const result = await load();
    if (runId !== runIdRef.current) return; // et nyere kald er i gang – smid dette svar væk
    setState({
      data: result.error ? null : result.data,
      loading: false,
      error: result.error,
    });
  }, [load]);

  useEffect(() => {
    if (!enabled) {
      runIdRef.current++; // annullér igangværende kald
      return;
    }
    // Data-fetch ved mount/dep-skift er et legitimt effect-formål her
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refetch();
  }, [enabled, refetch]);

  return {
    data: enabled ? state.data : null,
    loading: enabled ? state.loading : false,
    error: enabled ? state.error : null,
    refetch,
  };
}
