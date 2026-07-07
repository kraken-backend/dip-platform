// Path: src/components/ProcessingStatus.tsx
"use client";

import { useEffect, useState } from "react";
import PipelineVisualizer from "./PipelineVisualizer";

interface ProcessingStatusProps {
  status: "idle" | "uploading" | "processing" | "complete" | "error";
  message?: string;
}

// Stage timing weights (heavier stages take longer)
const STAGE_DURATIONS = [600, 900, 700, 1100, 800, 1000, 1200, 500];
const TOTAL_DURATION = STAGE_DURATIONS.reduce((a, b) => a + b, 0);

export default function ProcessingStatus({ status, message }: ProcessingStatusProps) {
  const [simulatedStage, setSimulatedStage] = useState<number | null>(null);
  const [stageProgress, setStageProgress] = useState(0);
  const [showCompleteBanner, setShowCompleteBanner] = useState(false);

  // Simulate pipeline stages during processing with variable timing
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    const timeout = setTimeout(() => {
      if (status === "idle") {
        setSimulatedStage(null);
        setStageProgress(0);
      } else if (status === "uploading") {
        setSimulatedStage(0);
        setStageProgress(0);
      } else if (status === "processing") {
        setSimulatedStage(1);
        setStageProgress(0);
        
        // Schedule each stage transition with realistic timing
        let accumulatedTime = 0;
        for (let stage = 2; stage <= 7; stage++) {
          accumulatedTime += STAGE_DURATIONS[stage - 1];
          const timer = setTimeout(() => {
            setSimulatedStage(stage);
            if (stage === 7) {
              setStageProgress(100);
            }
          }, accumulatedTime);
          timeouts.push(timer);
        }

        // Progress bar animation
        const progressStart = Date.now();
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - progressStart;
          const pct = Math.min(95, (elapsed / TOTAL_DURATION) * 100);
          setStageProgress(pct);
        }, 50);
        timeouts.push(progressInterval as unknown as NodeJS.Timeout);
      } else if (status === "complete") {
        setStageProgress(100);
        setShowCompleteBanner(true);
        setTimeout(() => {
          setSimulatedStage(null);
          setShowCompleteBanner(false);
        }, 2000);
      } else if (status === "error") {
        setSimulatedStage(null);
        setShowCompleteBanner(false);
      }
    }, 0);

    return () => {
      clearTimeout(timeout);
      timeouts.forEach(clearTimeout);
    };
  }, [status]);

  if (status === "idle" && !showCompleteBanner) return null;

  // Compute completed stages for visualizer
  const completedStages = (() => {
    if (status === "complete") return [0, 1, 2, 3, 4, 5, 6, 7];
    if (status === "uploading") return [];
    if (status === "processing" && simulatedStage !== null) {
      return Array.from({ length: simulatedStage }, (_, i) => i);
    }
    return [0];
  })();

  const activeStage = (() => {
    if (status === "complete") return null;
    if (status === "uploading") return 0;
    if (status === "processing") return simulatedStage;
    return null;
  })();

  return (
    <div className="glass-panel rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-all duration-300 animate-[fadeInUp_0.3s_ease-out]">
      <div className="flex items-center gap-3 mb-6">
        {status === "processing" || status === "uploading" ? (
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        ) : status === "complete" || showCompleteBanner ? (
          <div className="w-6 h-6 rounded-full bg-emerald-500/10 dark:bg-emerald-950/40 flex items-center justify-center border border-emerald-300 dark:border-emerald-800">
            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center border border-rose-300 dark:border-rose-800">
            <svg className="w-4 h-4 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        
        <div>
          <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">
            {status === "uploading" && "Uploading document..."}
            {status === "processing" && "Executing Document Pipeline..."}
            {(status === "complete" || showCompleteBanner) && "Pipeline execution successful"}
            {status === "error" && "Pipeline execution failed"}
          </p>
          {message && <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{message}</p>}
        </div>
      </div>

      {/* Progress bar with gradient */}
      {(status === "processing" || status === "uploading") && (
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${status === "uploading" ? 10 : Math.max(5, stageProgress)}%` }}
          />
        </div>
      )}
      {(status === "complete" || showCompleteBanner) && (
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out" style={{ width: "100%" }} />
        </div>
      )}

      {/* Animated Pipeline Diagram */}
      <div className="border border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-950/30 p-3 rounded-lg">
        <PipelineVisualizer
          activeStageIndex={activeStage}
          completedStageIndices={completedStages}
          failedStageIndex={status === "error" ? 4 : null}
        />
      </div>
    </div>
  );
}
