import type { PreferenceDefinition, PreferenceSchema } from "./types";
import { THEME_COOKIE, DEV_MODE_COOKIE, LS_THEME_KEY, LS_DEV_MODE_KEY, CURRENT_SCHEMA_VERSION } from "./constants";
import {
  DEFAULT_THEME, DEFAULT_DEV_MODE, DEFAULT_LANGUAGE, DEFAULT_DENSITY,
  DEFAULT_ANIMATIONS, DEFAULT_ACCESSIBILITY, DEFAULT_DASHBOARD_LAYOUT,
  DEFAULT_EXPERIMENTAL, DEFAULT_NOTIFICATIONS, DEFAULT_AI_MODE,
} from "./defaults";
import {
  validateTheme, validateDeveloperMode, validateBoolean,
  validateLanguage, validateDensity, validateAccessibility,
  validateDashboardLayout, validateNotifications, validateAiMode,
} from "./validators";

const STORAGE_KEY_MAP: Record<string, string> = {
  theme: THEME_COOKIE,
  developerMode: DEV_MODE_COOKIE,
};

export function getStorageKey(key: string): string {
  return STORAGE_KEY_MAP[key] ?? `dip-${key}`;
}

function define<T>(def: PreferenceDefinition<T>): PreferenceDefinition<T> {
  return Object.freeze(def);
}

const current: PreferenceDefinition[] = [
  define({
    key: "theme",
    type: "enum",
    defaultValue: DEFAULT_THEME,
    validValues: ["light", "dark", "auto"] as const,
    validator: validateTheme,
    persistence: ["cookie", "localStorage"],
    category: "appearance",
    description: "Color theme preference",
    migrate: (old: unknown) => {
      if (validateTheme(old)) return old;
      return DEFAULT_THEME;
    },
  }),

  define({
    key: "developerMode",
    type: "boolean",
    defaultValue: DEFAULT_DEV_MODE,
    validator: validateDeveloperMode,
    persistence: ["cookie", "localStorage"],
    category: "developer",
    description: "Enable developer-only UI panels and data",
  }),

  define({
    key: "language",
    type: "string",
    defaultValue: DEFAULT_LANGUAGE,
    validator: validateLanguage,
    persistence: ["cookie"],
    category: "internationalization",
    description: "UI language (ISO 639-1 code)",
  }),

  define({
    key: "density",
    type: "enum",
    defaultValue: DEFAULT_DENSITY,
    validValues: ["compact", "normal", "comfortable"] as const,
    validator: validateDensity,
    persistence: ["localStorage"],
    category: "appearance",
    description: "UI density/spacing preference",
  }),

  define({
    key: "animations",
    type: "boolean",
    defaultValue: DEFAULT_ANIMATIONS,
    validator: validateBoolean,
    persistence: ["localStorage"],
    category: "accessibility",
    description: "Enable UI animations",
  }),

  define({
    key: "accessibility",
    type: "enum",
    defaultValue: DEFAULT_ACCESSIBILITY,
    validValues: ["none", "high-contrast", "reduced-motion", "screen-reader"] as const,
    validator: validateAccessibility,
    persistence: ["localStorage"],
    category: "accessibility",
    description: "Accessibility mode",
  }),

  define({
    key: "dashboardLayout",
    type: "enum",
    defaultValue: DEFAULT_DASHBOARD_LAYOUT,
    validValues: ["grid", "list", "custom"] as const,
    validator: validateDashboardLayout,
    persistence: ["localStorage"],
    category: "layout",
    description: "Dashboard view layout",
  }),

  define({
    key: "experimental",
    type: "boolean",
    defaultValue: DEFAULT_EXPERIMENTAL,
    validator: validateBoolean,
    persistence: ["localStorage"],
    category: "developer",
    description: "Enable experimental features",
  }),

  define({
    key: "notifications",
    type: "enum",
    defaultValue: DEFAULT_NOTIFICATIONS,
    validValues: ["all", "important", "none"] as const,
    validator: validateNotifications,
    persistence: ["localStorage"],
    category: "notifications",
    description: "Notification preference level",
  }),

  define({
    key: "aiMode",
    type: "enum",
    defaultValue: DEFAULT_AI_MODE,
    validValues: ["assist", "auto", "manual"] as const,
    validator: validateAiMode,
    persistence: ["localStorage"],
    category: "ai",
    description: "AI processing mode",
  }),
];

export function getCurrentSchema(): PreferenceSchema {
  return { version: CURRENT_SCHEMA_VERSION, preferences: [...current] };
}

export function getDefinition(key: string): PreferenceDefinition | undefined {
  return current.find((p) => p.key === key);
}

export function getAllKeys(): string[] {
  return current.map((p) => p.key);
}

export function getDefaultValue(key: string): unknown {
  const def = getDefinition(key);
  return def ? def.defaultValue : undefined;
}

export function getCategoryPreferences(category: string): PreferenceDefinition[] {
  return current.filter((p) => p.category === category);
}

export const LEGACY_KEY_MAP: Record<string, string[]> = {
  theme: [LS_THEME_KEY],
  developerMode: [LS_DEV_MODE_KEY],
};

export function cookieKey(prefKey: string): string {
  return getStorageKey(prefKey);
}
