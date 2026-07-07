// Path: src/components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import { useDeveloperMode } from "@/hooks/useDeveloperMode";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { developerMode, setDeveloperMode } = useDeveloperMode();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 glass-panel border-b transition-all duration-300 ${
      scrolled
        ? "border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-950/90 shadow-md shadow-black/5"
        : "border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Return to Home">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-all duration-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">AI Document Intelligence</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">PoC</span>
                {developerMode && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-600 text-white border border-indigo-500 font-mono tracking-wider">DEV</span>
                )}
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Summarecon Mall Platform</p>
            </div>
          </Link>

          {/* Environment Info Badges (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
              </svg>
              <span>Dataset: <strong className="text-gray-700 dark:text-gray-200">Summarecon 2026 Manifest</strong></span>
            </div>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Provider: <strong className="text-gray-700 dark:text-gray-200">Sandbox OCR</strong></span>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="flex items-center gap-4">
            {/* Developer Mode Toggle */}
            <div className="flex items-center gap-2">
              <label htmlFor="dev-mode-switch" className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 cursor-pointer">
                <svg className={`w-4 h-4 transition-colors ${developerMode ? "text-indigo-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="hidden sm:inline">Developer Mode</span>
              </label>
              <button
                id="dev-mode-switch"
                onClick={() => setDeveloperMode(!developerMode)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  developerMode ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-800"
                }`}
                role="switch"
                aria-checked={developerMode}
                aria-label="Toggle Developer Mode"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    developerMode ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Theme Toggle Select */}
            <div className="relative flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700" role="radiogroup" aria-label="Theme selection">
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-md transition-all ${theme === "light" ? "bg-white dark:bg-gray-700 text-amber-500 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                title="Light Mode"
                aria-label="Use Light Theme"
                role="radio"
                aria-checked={theme === "light"}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-md transition-all ${theme === "dark" ? "bg-white dark:bg-gray-700 text-blue-400 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                title="Dark Mode"
                aria-label="Use Dark Theme"
                role="radio"
                aria-checked={theme === "dark"}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              <button
                onClick={() => setTheme("auto")}
                className={`p-1.5 rounded-md transition-all ${theme === "auto" ? "bg-white dark:bg-gray-700 text-violet-500 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                title="System Auto Mode"
                aria-label="Use Auto Theme"
                role="radio"
                aria-checked={theme === "auto"}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
