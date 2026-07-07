export type Theme = "light" | "dark" | "auto";
export type Density = "compact" | "normal" | "comfortable";
export type Accessibility = "none" | "high-contrast" | "reduced-motion" | "screen-reader";
export type DashboardLayout = "grid" | "list" | "custom";
export type Notifications = "all" | "important" | "none";
export type AiMode = "assist" | "auto" | "manual";

const THEME_VALUES = ["light", "dark", "auto"] as const;
const DENSITY_VALUES = ["compact", "normal", "comfortable"] as const;
const ACCESSIBILITY_VALUES = ["none", "high-contrast", "reduced-motion", "screen-reader"] as const;
const DASHBOARD_LAYOUT_VALUES = ["grid", "list", "custom"] as const;
const NOTIFICATIONS_VALUES = ["all", "important", "none"] as const;
const AI_MODE_VALUES = ["assist", "auto", "manual"] as const;

export function validateTheme(v: unknown): v is Theme {
  return THEME_VALUES.includes(v as Theme);
}

export function validateDeveloperMode(v: unknown): v is boolean {
  return v === true || v === false;
}

export function validateBoolean(v: unknown): v is boolean {
  return v === true || v === false;
}

export function validateLanguage(v: unknown): v is string {
  return typeof v === "string" && /^[a-z]{2}(-[A-Z]{2})?$/.test(v);
}

export function validateDensity(v: unknown): v is Density {
  return DENSITY_VALUES.includes(v as Density);
}

export function validateAccessibility(v: unknown): v is Accessibility {
  return ACCESSIBILITY_VALUES.includes(v as Accessibility);
}

export function validateDashboardLayout(v: unknown): v is DashboardLayout {
  return DASHBOARD_LAYOUT_VALUES.includes(v as DashboardLayout);
}

export function validateNotifications(v: unknown): v is Notifications {
  return NOTIFICATIONS_VALUES.includes(v as Notifications);
}

export function validateAiMode(v: unknown): v is AiMode {
  return AI_MODE_VALUES.includes(v as AiMode);
}

export type OcrProvider = "demo" | "tesseract";
const OCR_PROVIDER_VALUES = ["demo", "tesseract"] as const;

export function validateOcrProvider(v: unknown): v is OcrProvider {
  return OCR_PROVIDER_VALUES.includes(v as OcrProvider);
}

export function getValidatorForType(type: string): ((v: unknown) => boolean) | undefined {
  switch (type) {
    case "boolean": return validateBoolean;
    case "enum": return (v: unknown) => typeof v === "string";
    case "string": return (v: unknown) => typeof v === "string";
    case "number": return (v: unknown) => typeof v === "number" && !isNaN(v as number);
    default: return undefined;
  }
}
