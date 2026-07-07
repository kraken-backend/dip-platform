"use client";

import { useMemo } from "react";

export interface PipelineNode {
  key: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
}

interface PipelineVisualizerProps {
  activeStageIndex: number | null;
  completedStageIndices: number[];
  stageTimings?: Record<string, number>;
  failedStageIndex?: number | null;
}

export default function PipelineVisualizer({
  activeStageIndex,
  completedStageIndices,
  stageTimings,
  failedStageIndex = null,
}: PipelineVisualizerProps) {
  const nodes: PipelineNode[] = useMemo(() => [
    {
      key: "Ingestion",
      label: "Document Ingestion",
      shortLabel: "Receipt",
      description: "File uploaded and validated",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
    {
      key: "OCR",
      label: "OCR Extraction",
      shortLabel: "OCR",
      description: "Raw text characters parsing",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: "Normalization",
      label: "Text Normalization",
      shortLabel: "Normalization",
      description: "Standardizing encodings",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      ),
    },
    {
      key: "Canonicalization",
      label: "Canonical Mapping",
      shortLabel: "Canonical",
      description: "Store fuzzy candidate matching",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: "Validation",
      label: "Compliance Validation",
      shortLabel: "Validation",
      description: "Arithmetic & tax policy checks",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: "Fraud",
      label: "Fraud Guard Heuristics",
      shortLabel: "Fraud",
      description: "Risk score index scanning",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      key: "Knowledge",
      label: "Knowledge Graph Linker",
      shortLabel: "Knowledge",
      description: "Entity relation building",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      key: "Analytics",
      label: "Intelligence Insights",
      shortLabel: "Analytics",
      description: "Aggregating store dashboard metrics",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ], []);

  return (
    <div className="w-full">
      {/* Horizontal Pipeline (Desktop) */}
      <div className="hidden md:flex items-center justify-between relative py-6">
        {/* Connector Line Background */}
        <div className="absolute left-[3%] right-[3%] top-[34px] h-[2px] bg-gray-200 dark:bg-gray-800 -z-10" />

        {nodes.map((node, index) => {
          const isActive = activeStageIndex === index;
          const isCompleted = completedStageIndices.includes(index);
          const isFailed = failedStageIndex === index;
          const time = stageTimings ? stageTimings[node.key.toUpperCase()] || stageTimings[node.key] : undefined;

          let stateColor = "text-gray-400 bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800";
          if (isActive) {
            stateColor = "text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-blue-500 dark:border-blue-400 ring-4 ring-blue-100 dark:ring-blue-950/40";
          } else if (isCompleted) {
            stateColor = "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-400 shadow-sm shadow-emerald-500/10";
          } else if (isFailed) {
            stateColor = "text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-500 dark:border-rose-400 shadow-sm shadow-rose-500/10";
          }

          return (
            <div key={node.key} className="flex flex-col items-center flex-1 text-center relative group">
              {/* Connector Highlight (Line segment completed) */}
              {index > 0 && completedStageIndices.includes(index) && (
                <div
                  className="absolute right-[50%] left-[-50%] top-[10px] h-[2px] bg-emerald-400 dark:bg-emerald-600 -z-10 connector-fill"
                  style={{ width: "100%" }}
                />
              )}

              {/* Connector Active Pulsing Line */}
              {index > 0 && isActive && !isCompleted && (
                <div
                  className="absolute right-[50%] left-[-50%] top-[10px] h-[2px] bg-blue-400 dark:bg-blue-500 -z-10"
                  style={{ width: "100%", animation: "progressPulse 1.5s ease-in-out infinite" }}
                />
              )}

              {/* Node Dot / Bubble */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${stateColor} ${isActive ? "scale-110" : ""}`}>
                {node.icon}
              </div>

              {/* Node Title */}
              <span className={`text-[10px] font-bold mt-2 transition-colors duration-300 ${
                isActive ? "text-blue-600 dark:text-blue-400" :
                isCompleted ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"
              }`}>
                {node.shortLabel}
              </span>

              {/* Optional timing */}
              {time !== undefined && (
                <span className="text-[8px] font-mono text-gray-400 mt-0.5">{time}ms</span>
              )}

              {/* Node Hover Details Popover */}
              <div className="absolute top-[52px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-2.5 rounded-lg shadow-xl text-left w-48 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-30">
                <p className="text-[10px] font-bold text-gray-900 dark:text-white">{node.label}</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1 leading-normal">{node.description}</p>
                {time !== undefined && (
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">Processed in {time}ms</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vertical Pipeline (Mobile/Tablet Stack) */}
      <div className="md:hidden flex flex-col gap-4 pl-3 relative py-2">
        {/* Connector vertical line */}
        <div className="absolute left-[20px] top-[10px] bottom-[10px] w-[2px] bg-gray-200 dark:bg-gray-800 -z-10" />

        {nodes.map((node, index) => {
          const isActive = activeStageIndex === index;
          const isCompleted = completedStageIndices.includes(index);
          const isFailed = failedStageIndex === index;
          const time = stageTimings ? stageTimings[node.key.toUpperCase()] || stageTimings[node.key] : undefined;

          let stateColor = "text-gray-400 bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800";
          let lineOverlay = "";
          if (isActive) {
            stateColor = "text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-blue-500 dark:border-blue-400 ring-4 ring-blue-100 dark:ring-blue-950/40";
          } else if (isCompleted) {
            stateColor = "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-400";
            lineOverlay = "bg-emerald-500";
          } else if (isFailed) {
            stateColor = "text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-500 dark:border-rose-400";
          }

          return (
            <div key={node.key} className="flex items-center gap-3 relative">
              {/* Connector highlight overlay */}
              {index > 0 && completedStageIndices.includes(index) && (
                <div className={`absolute left-[7px] top-[-25px] w-[2px] h-[30px] ${lineOverlay} -z-10`} />
              )}

              {/* Dot */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 ${stateColor} ${isActive ? "scale-110" : ""}`}>
                {node.icon}
              </div>

              {/* Title & Desc */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${
                    isActive ? "text-blue-600 dark:text-blue-400" :
                    isCompleted ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"
                  }`}>
                    {node.label}
                  </span>
                  {time !== undefined && (
                    <span className="text-[9px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{time}ms</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate leading-relaxed">{node.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
