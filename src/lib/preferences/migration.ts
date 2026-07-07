import type { PreferenceDefinition, PreferenceValues } from "./types";
import { SCHEMA_VERSION_COOKIE } from "./constants";
import { getClientCookie, setClientCookie } from "./cookies";
import { getCurrentSchema, getStorageKey, LEGACY_KEY_MAP } from "./registry";
import { readPreference, writePreference } from "./storage";

export function getStoredSchemaVersion(): number {
  const raw = getClientCookie(SCHEMA_VERSION_COOKIE);
  if (raw === null) return 0;
  const v = parseInt(raw, 10);
  return isNaN(v) ? 0 : v;
}

export function setStoredSchemaVersion(version: number): void {
  setClientCookie(SCHEMA_VERSION_COOKIE, String(version));
}

export function runMigrations(
  initialValues: PreferenceValues,
): { values: PreferenceValues; migrated: boolean } {
  const storedVersion = getStoredSchemaVersion();
  const schema = getCurrentSchema();
  const values = { ...initialValues };
  let migrated = false;

  if (storedVersion < schema.version) {
    for (const def of schema.preferences) {
      if (def.migrate && values[def.key] !== undefined) {
        const migratedValue = def.migrate(values[def.key], storedVersion);
        if (migratedValue !== values[def.key]) {
          values[def.key] = migratedValue;
          migrated = true;
        }
      }
    }
    setStoredSchemaVersion(schema.version);
  }

  return { values, migrated };
}

export function migrateFromLegacy(definitions: PreferenceDefinition[]): PreferenceValues {
  const result: PreferenceValues = {};

  for (const def of definitions) {
    const legacyKeys = LEGACY_KEY_MAP[def.key];
    const storageKey = getStorageKey(def.key);
    const stored = readPreference(storageKey, def.persistence, legacyKeys);

    if (stored !== null) {
      const parsed = coerceToType(stored, def.type);
      if (def.validator ? def.validator(parsed) : true) {
        result[def.key] = parsed;
        continue;
      }
    }

    result[def.key] = def.defaultValue;
  }

  return result;
}

function coerceToType(value: string, type: string): unknown {
  switch (type) {
    case "boolean":
      return value === "true";
    case "number": {
      const n = Number(value);
      return isNaN(n) ? value : n;
    }
    default:
      return value;
  }
}

export function persistAfterMigration(
  values: PreferenceValues,
  definitions: PreferenceDefinition[],
): void {
  for (const def of definitions) {
    const value = values[def.key];
    if (value === undefined) continue;
    const serialized = String(value);
    writePreference(getStorageKey(def.key), serialized, def.persistence);

    const legacyKeys = LEGACY_KEY_MAP[def.key];
    if (legacyKeys && typeof window !== "undefined") {
      try {
        for (const legacy of legacyKeys) {
          localStorage.setItem(legacy, serialized);
        }
      } catch {}
    }
  }
}
