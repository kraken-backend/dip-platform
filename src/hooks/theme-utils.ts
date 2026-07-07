// Path: src/hooks/theme-utils.ts
import type { Theme } from "@/lib/preferences/validators";

export function applyThemeClass(theme: Theme): void {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "auto") {
    root.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
  } else {
    root.classList.remove("dark");
  }
}
