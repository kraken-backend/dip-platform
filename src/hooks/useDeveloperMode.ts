// Path: src/hooks/useDeveloperMode.ts
"use client";

import { usePreference } from "@/lib/preferences/hooks";

export function useDeveloperMode() {
  const [developerMode, setDeveloperMode] = usePreference<boolean>("developerMode");
  return { developerMode, setDeveloperMode };
}
