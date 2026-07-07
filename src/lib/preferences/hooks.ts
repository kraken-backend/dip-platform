"use client";

import { useCallback, useSyncExternalStore } from "react";
import { usePreferenceContext } from "./provider";

export function usePreferenceValue<T>(key: string): T {
  const { store } = usePreferenceContext();
  return useSyncExternalStore(
    useCallback((cb: () => void) => store.subscribe(cb), [store]),
    useCallback(() => store.get<T>(key), [store, key]),
    useCallback(() => store.get<T>(key), [store, key]),
  );
}

export function usePreferenceActions<T>(key: string): (value: T) => void {
  const { setPreference } = usePreferenceContext();
  return useCallback(
    (value: T) => setPreference(key, value),
    [key, setPreference],
  );
}

export function usePreference<T>(key: string): [T, (value: T) => void] {
  const value = usePreferenceValue<T>(key);
  const setter = usePreferenceActions<T>(key);
  return [value, setter];
}
