// Enterprise Preference Framework
// Single source of truth for all user interface preferences.

// Types
export type { PreferenceType, PersistenceBackend, PreferenceDefinition, PreferenceSchema, PreferenceValues } from "./types";

// Constants
export { THEME_COOKIE, DEV_MODE_COOKIE, CURRENT_SCHEMA_VERSION } from "./constants";

// Defaults
export {
  DEFAULT_THEME, DEFAULT_DEV_MODE, DEFAULT_LANGUAGE, DEFAULT_DENSITY,
  DEFAULT_ANIMATIONS, DEFAULT_ACCESSIBILITY, DEFAULT_DASHBOARD_LAYOUT,
  DEFAULT_EXPERIMENTAL, DEFAULT_NOTIFICATIONS, DEFAULT_AI_MODE,
} from "./defaults";

// Validators
export {
  validateTheme, validateDeveloperMode, validateBoolean,
  validateLanguage, validateDensity, validateAccessibility,
  validateDashboardLayout, validateNotifications, validateAiMode,
} from "./validators";
export type { Theme, Density, Accessibility, DashboardLayout, Notifications, AiMode } from "./validators";

// Cookies
export { setClientCookie, getClientCookie, removeClientCookie, getAllClientCookies } from "./cookies";

// Storage
export type { StorageBackend } from "./storage";

// Registry
export { getCurrentSchema, getDefinition, getAllKeys, getDefaultValue, getCategoryPreferences, getStorageKey } from "./registry";

// Store
export { PreferenceStore } from "./store";

// Migration
export { getStoredSchemaVersion, setStoredSchemaVersion, runMigrations, migrateFromLegacy } from "./migration";

// Provider
export { PreferencesProvider, usePreferenceContext } from "./provider";

// Hooks
export { usePreference, usePreferenceValue, usePreferenceActions } from "./hooks";
