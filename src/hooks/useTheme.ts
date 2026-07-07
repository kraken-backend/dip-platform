// Path: src/hooks/useTheme.ts
"use client";

import { useEffect } from "react";
import { usePreference } from "@/lib/preferences/hooks";
import { applyThemeClass } from "./theme-utils";

export type Theme = "light" | "dark" | "auto";

export function useTheme() {
  const [theme, setTheme] = usePreference<Theme>("theme");

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyThemeClass("auto");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return { theme, setTheme };
}

export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const elements = document.querySelectorAll(".reveal, .reveal-scale, .reveal-fade");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
