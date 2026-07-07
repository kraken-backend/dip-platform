// Path: src/components/OptionCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface OptionCardProps {
  number: number;
  title: string;
  description: string;
  features: string[];
  icon: string;
  recommended?: boolean;
}

const OPTION_THEMES: Record<number, { 
  primary: string; 
  badgeBg: string; 
  badgeText: string; 
  accent: string; 
  glow: string;
  badgeLabel: string;
  ringColor: string;
}> = {
  1: {
    primary: "from-blue-500 to-indigo-600",
    badgeBg: "bg-blue-50 dark:bg-blue-950/30",
    badgeText: "text-blue-600 dark:text-blue-400",
    accent: "border-blue-500/20 dark:border-blue-500/30",
    glow: "shadow-blue-500/10",
    badgeLabel: "M1: Extraction Only",
    ringColor: "focus-visible:ring-blue-500",
  },
  2: {
    primary: "from-emerald-500 to-teal-600",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/30",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    accent: "border-emerald-500/20 dark:border-emerald-500/30",
    glow: "shadow-emerald-500/10",
    badgeLabel: "M2: Extraction + Compliance",
    ringColor: "focus-visible:ring-emerald-500",
  },
  3: {
    primary: "from-violet-500 to-purple-600",
    badgeBg: "bg-violet-50 dark:bg-violet-950/30",
    badgeText: "text-violet-600 dark:text-violet-400",
    accent: "border-violet-500/20 dark:border-violet-500/30",
    glow: "shadow-violet-500/10",
    badgeLabel: "M3: M2 + Fraud Guard",
    ringColor: "focus-visible:ring-violet-500",
  },
  4: {
    primary: "from-amber-500 to-orange-600",
    badgeBg: "bg-amber-50 dark:bg-amber-950/30",
    badgeText: "text-amber-600 dark:text-amber-400",
    accent: "border-amber-500/20 dark:border-amber-500/30",
    glow: "shadow-amber-500/10",
    badgeLabel: "M4: Full AI Intelligence",
    ringColor: "focus-visible:ring-amber-500",
  },
};

export default function OptionCard({
  number,
  title,
  description,
  features,
  icon,
  recommended,
}: OptionCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const themeInfo = OPTION_THEMES[number];

  const handleClick = () => {
    router.push(`/process?option=${number}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Select ${title}`}
      className={`relative group cursor-pointer h-full outline-none ${themeInfo.ringColor} focus-visible:ring-2 focus-visible:ring-offset-2 rounded-xl`}
    >
      {recommended && (
        <div className="absolute -top-3 left-6 z-10">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full shadow-lg shadow-blue-500/30 uppercase">
            RECOMMENDED SOLUTION
          </span>
        </div>
      )}

      <div
        className={`
          h-full rounded-xl border
          bg-white dark:bg-gray-900/60
          backdrop-blur-md p-6 flex flex-col justify-between
          transition-all duration-300 ease-out
          ${isHovered
            ? `-translate-y-1 shadow-xl ${themeInfo.glow} border-gray-300 dark:border-gray-700`
            : recommended
              ? "shadow-md border-blue-200 dark:border-blue-900/50"
              : "shadow-sm border-gray-200 dark:border-gray-800/80"}
        `}
      >
        <div>
          {/* Card Header Info */}
          <div className="flex items-start justify-between mb-4">
            <div className={`
              w-12 h-12 rounded-lg bg-gradient-to-br ${themeInfo.primary}
              flex items-center justify-center text-xl shadow-md text-white
              ${isHovered ? "scale-110" : ""} transition-transform duration-300
            `}>
              {icon}
            </div>
            <span className={`
              text-[10px] font-bold px-2 py-1 rounded-full border ${themeInfo.accent}
              ${themeInfo.badgeBg} ${themeInfo.badgeText} tracking-wider font-mono
            `}>
              {themeInfo.badgeLabel}
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
            {description}
          </p>

          {/* Capability Features Checklist */}
          <div className="space-y-2">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
            {isHovered ? "Next Step ↓ Choose Receipt" : "Select Solution"}
          </span>
          <div className={`
            w-7 h-7 rounded-full flex items-center justify-center
            transition-all duration-300
            ${isHovered
              ? `bg-gradient-to-r ${themeInfo.primary} text-white translate-x-1 shadow-md`
              : recommended
                ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"}
          `}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
