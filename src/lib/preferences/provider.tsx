"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
  useEffect,
  startTransition,
  ReactNode,
} from "react";
import type { PreferenceValues } from "./types";
import { getCurrentSchema, getDefinition, getAllKeys, getStorageKey, LEGACY_KEY_MAP } from "./registry";
import { PreferenceStore } from "./store";
import { migrateFromLegacy, persistAfterMigration, runMigrations } from "./migration";
import { writePreference } from "./storage";
import { getClientCookie } from "./cookies";

interface PreferenceContextValue {
  store: PreferenceStore;
  setPreference: (key: string, value: unknown) => void;
  serverValues: PreferenceValues;
}

const PreferenceContext = createContext<PreferenceContextValue | null>(null);

export function PreferencesProvider({
  children,
  initialValues: serverInitialValues = {},
}: {
  children: ReactNode;
  initialValues?: PreferenceValues;
}) {
  const schema = getCurrentSchema();

  const [store] = useState(() => {
    const merged: PreferenceValues = {};
    for (const def of schema.preferences) {
      merged[def.key] = serverInitialValues[def.key] ?? def.defaultValue;
    }
    return new PreferenceStore(merged);
  });

  const setPreference = useCallback(
    (key: string, value: unknown) => {
      const def = getDefinition(key);
      if (!def) return;
      if (def.validator && !def.validator(value)) return;

      const serialized = String(value);
      writePreference(getStorageKey(key), serialized, def.persistence);

      const legacyKeys = LEGACY_KEY_MAP[key];
      if (legacyKeys && typeof window !== "undefined") {
        try {
          for (const lk of legacyKeys) {
            localStorage.setItem(lk, serialized);
          }
        } catch {}
      }

      startTransition(() => store.set(key, value));
    },
    [store],
  );

  const ctx = useMemo(
    () => ({ store, setPreference, serverValues: serverInitialValues }),
    [store, setPreference, serverInitialValues],
  );

  useEffect(() => {
    const clientValues = migrateFromLegacy(schema.preferences);
    const { values: migrated, migrated: didMigrate } = runMigrations(clientValues);
    let changed = false;
    for (const [key, value] of Object.entries(migrated)) {
      const current = store.get(key);
      if (current !== value) {
        store.set(key, value);
        changed = true;
      }
    }
    if (changed || didMigrate) {
      persistAfterMigration(migrated, schema.preferences);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      for (const key of getAllKeys()) {
        const def = getDefinition(key);
        if (!def) continue;
        const cookieVal = getClientCookie(getStorageKey(key));
        if (cookieVal !== null) {
          const parsed = def.type === "boolean" ? cookieVal === "true" : cookieVal;
          if (def.validator ? def.validator(parsed) : true) {
            startTransition(() => store.set(key, parsed));
          }
        }
        const legacyKeys = LEGACY_KEY_MAP[key];
        if (legacyKeys && legacyKeys.includes(e.key || "")) {
          const raw = e.newValue;
          const parsed = def.type === "boolean" ? raw === "true" : raw;
          if (def.validator ? def.validator(parsed) : true) {
            startTransition(() => store.set(key, parsed));
          }
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [store]);

  return (
    <PreferenceContext.Provider value={ctx}>
      {children}
    </PreferenceContext.Provider>
  );
}

export function usePreferenceContext(): PreferenceContextValue {
  const ctx = useContext(PreferenceContext);
  if (!ctx) {
    throw new Error("usePreferenceContext must be used within a PreferencesProvider");
  }
  return ctx;
}

export { PreferenceStore };
