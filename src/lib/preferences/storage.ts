import { getClientCookie, setClientCookie, removeClientCookie } from "./cookies";
import type { PersistenceBackend } from "./types";

export interface StorageBackend {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

const cookieBackend: StorageBackend = {
  get: (key) => getClientCookie(key),
  set: (key, value) => setClientCookie(key, value),
  remove: (key) => removeClientCookie(key),
};

const localStorageBackend: StorageBackend = {
  get: (key) => {
    if (typeof window === "undefined") return null;
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set: (key, value) => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(key, value); } catch {}
  },
  remove: (key) => {
    if (typeof window === "undefined") return;
    try { localStorage.removeItem(key); } catch {}
  },
};

const backends: Record<PersistenceBackend, StorageBackend> = {
  cookie: cookieBackend,
  localStorage: localStorageBackend,
};

const readPriority: PersistenceBackend[] = ["cookie", "localStorage"];

export function readPreference(
  key: string,
  storages: PersistenceBackend[],
  legacyKeys?: string[],
): string | null {
  for (const backend of readPriority) {
    if (!storages.includes(backend)) continue;
    const value = backends[backend].get(key);
    if (value !== null) return value;
    if (legacyKeys) {
      for (const legacy of legacyKeys) {
        const legacyValue = backends[backend].get(legacy);
        if (legacyValue !== null) return legacyValue;
      }
    }
  }
  return null;
}

export function writePreference(
  key: string,
  value: string,
  storages: PersistenceBackend[],
): void {
  for (const backend of storages) {
    backends[backend].set(key, value);
  }
}

export function removePreference(key: string, storages: PersistenceBackend[]): void {
  for (const backend of storages) {
    backends[backend].remove(key);
  }
}

export { backends };
