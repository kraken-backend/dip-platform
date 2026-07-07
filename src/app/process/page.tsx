// Path: src/app/process/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import ProcessingStatus from "@/components/ProcessingStatus";
import ResultPanel from "@/components/ResultPanel";
import Dashboard from "@/components/Dashboard";
import ReceiptGallery from "@/components/ReceiptGallery";
import ImagePreview from "@/components/ImagePreview";
import { ProcessingOption } from "@/lib/receipt/types";
import { useDemoSession } from "@/hooks/useDemoSession";
import { mapToProcessingStatus } from "@/lib/demo-session/session-helpers";

function ProcessContent() {
  const searchParams = useSearchParams();
  const optionParam = searchParams.get("option");
  const initialOption = [1, 2, 3, 4].includes(Number(optionParam))
    ? (Number(optionParam) as ProcessingOption)
    : ProcessingOption.OcrOnly;

  const {
    session,
    actions,
    displayState,
    previewInfo,
    optionInfo,
    process,
    reset,
  } = useDemoSession(initialOption);

  // Mock Provider state
  const [provider, setProvider] = useState("sandbox");

  useEffect(() => {
    actions.selectOption(initialOption);
  }, [initialOption]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Back Ribbon */}
      <div className="flex items-center gap-3 mb-5 text-xs">
        <Link
          href="/"
          className="text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 font-semibold transition-colors"
        >
          ← Return to Landing Page
        </Link>
        <span className="text-gray-300 dark:text-gray-800">|</span>
        <p className="text-gray-400 dark:text-gray-500 font-mono">Sandbox Environment ID: M{session.option}</p>
      </div>

      {/* Workspace Header Panel */}
      <div className="glass-panel p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/30 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 font-mono uppercase tracking-wider">
            Option {session.option} Workspace
          </span>
          <h1 className="text-xl font-black text-gray-950 dark:text-white mt-1.5">{optionInfo.title}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">{optionInfo.description}</p>
        </div>

        {/* OCR Provider Selector dropdown (Visual Mock only) */}
        <div className="flex flex-col gap-1 font-mono text-[10px] bg-gray-50 dark:bg-gray-900/50 px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 shrink-0">
          <label htmlFor="ocr-provider" className="text-gray-400 font-semibold uppercase tracking-wider">OCR Provider Model</label>
          <select
            id="ocr-provider"
            value={provider}
            onChange={(e) => {
              const val = e.target.value;
              if (val !== "sandbox") {
                alert(`${val === "tesseract" ? "Tesseract OCR" : "Google Cloud Vision"} provider config will activate in Task-006. Sandbox Mock fallback is applied.`);
              }
              setProvider("sandbox");
            }}
            className="bg-transparent text-gray-800 dark:text-gray-200 font-bold border-none outline-none focus:ring-0 p-0 text-[11px] cursor-pointer"
            aria-label="OCR Provider Selection"
          >
            <option value="sandbox">Sandbox Mock (Deterministic)</option>
            <option value="tesseract">Tesseract OCR (Task-006)</option>
            <option value="vision">Google Cloud Vision (Task-006)</option>
          </select>
        </div>
      </div>

      {/* Main Split Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Document Selection & Ingestion */}
        <div className="lg:col-span-1 space-y-5">
          <div className="glass-panel p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/30 space-y-5">
            <h3 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider font-mono">
              Document Ingestion Center
            </h3>

            {/* Manifest Dataset Pick Gallery */}
            <ReceiptGallery
              onSelect={actions.selectSample}
              selectedId={session.selectedSample?.id}
            />

            {/* Visual separating line */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-[10px] font-mono">
                <span className="bg-white dark:bg-gray-900 px-2.5 text-gray-400 uppercase tracking-widest font-bold">OR CUSTOM FILE</span>
              </div>
            </div>

            {/* Custom file Drag & Drop Upload Zone */}
            <UploadZone
              onFileSelect={actions.selectFile}
              disabled={displayState.isBusy}
            />

            {/* Ingestion Image Preview Panel */}
            {previewInfo.src && (
              <ImagePreview
                src={previewInfo.src}
                fileName={previewInfo.fileName}
                fileSize={previewInfo.fileSize}
                onClear={reset}
              />
            )}

            {/* Processing Execution Button Trigger */}
            <button
              onClick={process}
              disabled={!displayState.canProcess}
              className={`
                w-full py-3 px-6 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer
                ${displayState.canProcess
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white hover:opacity-95 hover:-translate-y-0.5 shadow-lg shadow-blue-500/15 hover:shadow-xl hover:shadow-blue-500/20 focus:ring-2 focus:ring-blue-500/50"
                  : "bg-gray-100 dark:bg-gray-850 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-800 cursor-not-allowed"}
              `}
              aria-label={displayState.canProcess ? "Execute Ingest Pipeline" : "Select a document to begin"}
            >
              {displayState.isProcessing ? (
                <span className="flex items-center justify-center gap-2 font-mono uppercase tracking-wider">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running Pipeline M{session.option}...
                </span>
              ) : displayState.canProcess ? (
                <span className="flex items-center justify-center gap-2 font-mono uppercase tracking-wider">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Execute Ingest Pipeline
                </span>
              ) : (
                <span className="font-mono uppercase tracking-wider">Select a document to begin</span>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Pipeline Execution & Results */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Active Processing Live Status (animating visual pipeline) */}
          {(displayState.isProcessing || displayState.isBusy) && (
            <ProcessingStatus
              status={mapToProcessingStatus(session.status)}
              message={session.errorMessage}
            />
          )}

          {/* Empty Placeholder State - improved with contextual guidance */}
          {displayState.showPlaceholder && (
            <div className="glass-panel rounded-xl border border-gray-200 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center bg-white/30 dark:bg-gray-900/10 min-h-[420px]">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center mb-5 shadow-inner">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">AI Platform Pipeline Awaiting Document Ingestion</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md leading-relaxed mb-6">
                Select a sample audited receipt from our manifestation gallery or drop a custom invoice image to begin. The platform will automatically parse character mappings, run compliance validations, check risk factors, and output operational BI analytics.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono text-gray-400 dark:text-gray-500">
                <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">Supported: JPG, PNG, WebP, TIFF</span>
                <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">4 Sample Receipts Available</span>
                <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">Sub-second Processing</span>
              </div>
            </div>
          )}

          {/* Success Results Display */}
          {displayState.showResult && session.result && (
            <div className="space-y-5">
              <ResultPanel result={session.result} groundTruthComparison={session.result.groundTruthComparison} />
              
              {/* If full analytics dashboard option active */}
              {session.option === ProcessingOption.FullPlatform && session.result.analytics && session.result.insights && (
                <Dashboard analytics={session.result.analytics} insights={session.result.insights} />
              )}

              {/* Dashboard Upgrade Teaser for options 1-3 - more enterprise, less marketing */}
              {session.option !== ProcessingOption.FullPlatform && session.result.validation && (
                <div className="glass-panel rounded-xl border border-blue-200/60 dark:border-blue-900/40 p-6 bg-gradient-to-br from-blue-50/40 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/5 hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/10">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Expand to Enterprise Platform</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-lg leading-relaxed">
                          Current option processes focused modules only. Full Platform unlocks enterprise analytics, knowledge graph mapping, cross-tenant intelligence, and operational dashboards for comprehensive document observability.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/process?option=4"
                      className="shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-xs font-bold shadow-lg shadow-blue-500/10 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Expand to Full Platform
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pipeline Failed State */}
          {displayState.showError && (
            <div className="glass-panel border border-rose-200 dark:border-rose-900/50 rounded-xl p-8 text-center bg-rose-50/20 dark:bg-rose-950/10 animate-[fadeInUp_0.3s_ease-out]">
              <svg className="w-12 h-12 text-rose-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Pipeline Execution Suspended</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">{session.errorMessage}</p>
              
              {/* Retry button to trigger session.retry callback */}
              <button 
                onClick={process}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold font-mono tracking-wider uppercase hover:bg-rose-700 hover:-translate-y-0.5 shadow-md transition-all duration-200 cursor-pointer"
              >
                Re-initialize Ingest Pipeline
              </button>
            </div>
          )}
          
        </div>
      </div>
    </main>
  );
}

export default function ProcessPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-400 font-mono mt-3">Loading workspace environment...</p>
          </div>
        }
      >
        <ProcessContent />
      </Suspense>
    </div>
  );
}
