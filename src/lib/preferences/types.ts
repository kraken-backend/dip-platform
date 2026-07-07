export type PreferenceType = "string" | "boolean" | "enum" | "number";

export type PersistenceBackend = "cookie" | "localStorage";

export interface PreferenceDefinition<T = unknown> {
  key: string;
  type: PreferenceType;
  defaultValue: T;
  validValues?: readonly T[];
  validator?: (value: unknown) => value is T;
  persistence: PersistenceBackend[];
  category?: string;
  description?: string;
  migrate?: (oldValue: unknown, fromVersion?: number) => T;
}

export interface PreferenceSchema {
  version: number;
  preferences: PreferenceDefinition[];
}

export type PreferenceValues = Record<string, unknown>;

export type PreferenceValueType<T extends PreferenceDefinition> =
  T extends PreferenceDefinition<infer V> ? V : never;
