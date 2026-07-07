// Path: src/components/ResultPanel.tsx
"use client";

import { useState } from "react";
import type { ProcessingResult, GroundTruthComparisonResult } from "@/lib/receipt/types";
import GroundTruthComparison from "./GroundTruthComparison";
import PipelineVisualizer from "./PipelineVisualizer";
import { useDeveloperMode } from "@/hooks/useDeveloperMode";

interface ResultPanelProps {
  result: ProcessingResult;
  groundTruthComparison?: GroundTruthComparisonResult | null;
}

const TABS = [
  { id: "overview", label: "Overview", icon: "📊", workflow: "01" },
  { id: "ocr", label: "OCR Extract", icon: "🔍", workflow: "02" },
  { id: "ground_truth", label: "Ground Truth", icon: "🎯", workflow: "03" },
  { id: "validation", label: "Validation", icon: "✅", workflow: "04" },
  { id: "fraud", label: "Fraud Guard", icon: "🛡️", workflow: "05" },
  { id: "knowledge", label: "Knowledge Graph", icon: "🧠", workflow: "06" },
  { id: "pipeline", label: "Pipeline Trace", icon: "⚙️", workflow: "07" },
];

export default function ResultPanel({ result, groundTruthComparison }: ResultPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { developerMode } = useDeveloperMode();

  // Build tab list with developer tabs appended
  const tabs = [
    ...TABS,
    ...(developerMode
      ? [
          { id: "developer", label: "Developer Mode", icon: "💻", workflow: "08" },
          { id: "json", label: "Raw JSON", icon: "📄", workflow: "09" },
        ]
      : []),
  ];

  const formatRupiah = (amount: number) =>
    `Rp ${amount.toLocaleString("id-ID")}`;

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className="space-y-5">
      {/* Overview Ingestion Summary Ribbon */}
      <div className="glass-panel rounded-xl p-5 border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-900/20 backdrop-blur-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">
              Audit Target Document ID: {result.canonical.documentId}
            </p>
            <h2 className="text-lg font-black text-gray-900 dark:text-white mt-1 truncate max-w-sm sm:max-w-md">
              {result.fileName}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Verified Ingress • {(result.ocr.confidence * 100).toFixed(0)}% Character Confidence
            </p>
          </div>
          
          <div className="flex gap-4 text-xs font-mono border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto border-gray-150 dark:border-gray-800">
            <div>
              <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">LATENCY</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">{result.ocr.processingTimeMs}ms</p>
            </div>
            <span className="text-gray-200 dark:text-gray-800">|</span>
            <div>
              <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">OPTION LEVEL</p>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">M{result.option}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selector Bar - Workflow Progression */}
      <div className="border-b border-gray-200 dark:border-gray-800 overflow-x-auto" role="tablist" aria-label="Result inspection tabs">
        <div className="flex gap-1 pb-0.5 min-w-max">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            const isPrev = idx < activeIndex;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-label={`View ${tab.label}`}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-all shrink-0 cursor-pointer relative
                  ${isActive
                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm border-t border-l border-r border-gray-200 dark:border-gray-800 -mb-px"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/40"}
                `}
              >
                <span className="text-[9px] font-mono text-gray-400 dark:text-gray-600 font-bold">{tab.workflow}</span>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {isPrev && !isActive && (
                  <span className="ml-1 w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels Contents */}
      <div className="glass-panel p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/30 min-h-[300px] animate-[fadeInUp_0.3s_ease-out]">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono mb-2">Ingestion Pipeline Map</h3>
              <div className="border border-gray-100 dark:border-gray-850 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-950/20">
                <PipelineVisualizer
                  activeStageIndex={null}
                  completedStageIndices={[0, 1, 2, 3, 4, 5, 6, 7]}
                  stageTimings={result.pipelineTrace.reduce((acc, stage) => {
                    acc[stage.stage] = stage.durationMs;
                    return acc;
                  }, {} as Record<string, number>)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-950/40 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono mb-3">Ingested Document Meta</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Document Type</span><span className="font-semibold text-gray-800 dark:text-gray-200 uppercase">{result.canonical.documentType}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Fuzzy Language</span><span className="font-semibold text-gray-800 dark:text-gray-200">{result.canonical.detectedLanguage.toUpperCase()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Registry Match Store</span><span className="font-semibold text-gray-800 dark:text-gray-200">{result.canonical.merchantCandidate.normalized || "Unmatched"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Registry Match Rate</span><span className="font-semibold text-emerald-600 dark:text-emerald-400">{(result.canonical.merchantCandidate.confidence * 100).toFixed(0)}% Match</span></div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-950/40 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono mb-3">Arithmetic Extraction Summary</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal parsed</span><span className="font-mono text-gray-800 dark:text-gray-200">{formatRupiah(result.parsed.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Calculated PPN 11%</span><span className="font-mono text-gray-800 dark:text-gray-200">{formatRupiah(result.parsed.tax)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Parsed Grand Total</span><span className="font-mono font-bold text-gray-900 dark:text-white">{formatRupiah(result.parsed.total)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Arithmetic Confidence</span><span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{(result.canonical.totalCandidate.confidence * 100).toFixed(0)}%</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OCR TAB */}
        {activeTab === "ocr" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Raw Text Buffer ({result.ocr.lines.length} lines parsed)</span>
              <span className="font-mono text-gray-400">Time: {result.ocr.processingTimeMs}ms | Lang: {result.ocr.language.toUpperCase()}</span>
            </div>
            
            <div className="bg-gray-950 dark:bg-black rounded-lg p-4 font-mono text-[11px] text-emerald-500 dark:text-emerald-400 border border-gray-850 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto shadow-inner">
              {result.ocr.rawText}
            </div>

            {/* Character Confidence Meter */}
            <div className="bg-gray-50 dark:bg-gray-950/40 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono mb-3">OCR Confidence Meters</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.ocr.lines.slice(0, 10).map((line, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400 w-6 font-mono text-[10px]">L{i + 1}</span>
                    <span className="text-gray-700 dark:text-gray-300 truncate flex-1 font-mono text-[10px]">{line.text}</span>
                    <span className={`font-mono text-[10px] font-bold ${line.confidence >= 0.8 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"}`}>
                      {(line.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
              {result.ocr.lines.length > 10 && (
                <p className="text-[10px] text-gray-400 mt-3 text-center">... showing top 10 rows ...</p>
              )}
            </div>
          </div>
        )}

        {/* GROUND TRUTH TAB */}
        {activeTab === "ground_truth" && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed border-l-2 border-blue-400 pl-3">
              Comparing platform output against manually verified benchmark records for this receipt. Ground Truth data is only available for preloaded manifest samples.
            </p>
            {groundTruthComparison ? (
              <GroundTruthComparison comparison={groundTruthComparison} />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h4 className="text-sm font-bold text-gray-800 dark:text-white">Ground Truth Unavailable</h4>
                <p className="text-xs text-gray-500 mt-2 max-w-sm leading-relaxed">
                  Ground Truth comparison is only available for preloaded manifest samples. To compare against benchmark data, select a sample receipt from the document gallery.
                </p>
                <span className="mt-4 text-[10px] font-mono px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                  Switch to &ldquo;Sample Receipt&rdquo; mode in Document Ingestion
                </span>
              </div>
            )}
          </div>
        )}

        {/* VALIDATION TAB */}
        {activeTab === "validation" && (
          <div className="space-y-4">
            {result.validation ? (
              <>
                <div key={activeTab} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-950/30 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className={`
                    px-4 py-2 rounded-lg font-bold text-sm border
                    ${result.validation.valid 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30" 
                      : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/30"}
                  `}>
                    {result.validation.valid ? "PASSED COMPLIANCE" : "COMPLIANCE FAILURE"}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            result.validation.score >= 0.8 ? "bg-emerald-500" :
                            result.validation.score >= 0.5 ? "bg-amber-500" : "bg-rose-500"
                          }`}
                          style={{ width: `${result.validation.score * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white font-mono">{(result.validation.score * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {result.validation.passedChecks.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 font-mono">Passed Integrity Checks</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {result.validation.passedChecks.map((check, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{check}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.validation.issues.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 font-mono">Compliance Violations / Warnings</h4>
                    <div className="space-y-2">
                      {result.validation.issues.map((issue, i) => (
                        <div
                          key={i}
                          className={`
                            p-3 rounded-lg text-xs border
                            ${issue.severity === "error" ? "bg-rose-50/50 border-rose-200 dark:bg-rose-950/10 dark:border-rose-900/30" : ""}
                            ${issue.severity === "warning" ? "bg-amber-50/50 border-amber-200 dark:bg-amber-950/10 dark:border-amber-900/30" : ""}
                            ${issue.severity === "info" ? "bg-blue-50/50 border-blue-200 dark:bg-blue-950/10 dark:border-blue-900/30" : ""}
                          `}
                        >
                          <div className="flex items-start gap-2">
                            <span className={`
                              text-[9px] font-bold uppercase shrink-0 px-1.5 py-0.5 rounded border
                              ${issue.severity === "error" ? "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/30" : ""}
                              ${issue.severity === "warning" ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/30" : ""}
                              ${issue.severity === "info" ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/30" : ""}
                            `}>
                              {issue.severity}
                            </span>
                            <div>
                              <p className="text-gray-900 dark:text-gray-100 font-bold">{issue.message}</p>
                              {(issue.expected || issue.actual) && (
                                <div className="mt-1 flex gap-4 text-[10px] text-gray-400 font-mono">
                                  {issue.expected && <span>Expected: {issue.expected}</span>}
                                  {issue.actual && <span>Actual: {issue.actual}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">Compliance Validation not active for Option level {result.option}. Enter under Standard Validation (Option 2) or above.</p>
            )}
          </div>
        )}

        {/* FRAUD TAB */}
        {activeTab === "fraud" && (
          <div className="space-y-4">
            {result.fraud ? (
              <>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-950/30 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className={`
                    px-4 py-2 rounded-lg font-bold text-sm border
                    ${result.fraud.riskLevel === "low" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30" : ""}
                    ${result.fraud.riskLevel === "medium" ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/30" : ""}
                    ${result.fraud.riskLevel === "high" || result.fraud.riskLevel === "critical" ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/30" : ""}
                  `}>
                    RISK LEVEL: {result.fraud.riskLevel.toUpperCase()}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            result.fraud.score < 20 ? "bg-emerald-500" :
                            result.fraud.score < 50 ? "bg-amber-500" : "bg-rose-500"
                          }`}
                          style={{ width: `${Math.min(100, result.fraud.score)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white font-mono">{result.fraud.score}/100 Risk</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-950/40 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono mb-2">Model Risk Summary</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{result.fraud.summary}</p>
                </div>

                {result.fraud.flags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 font-mono">Risk Flag Triggers</h4>
                    <div className="space-y-2">
                      {result.fraud.flags.map((flag, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                          <div className="flex items-start justify-between gap-3 text-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                                  flag.severity === "critical" ? "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/30 animate-pulse" :
                                  flag.severity === "high" ? "bg-orange-100 text-orange-850 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800/30" :
                                  "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                }`}>
                                  {flag.severity.toUpperCase()}
                                </span>
                                <span className="font-bold text-gray-800 dark:text-gray-200">{flag.type.replace(/_/g, " ")}</span>
                              </div>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{flag.description}</p>
                            </div>
                            <span className="text-[10px] font-mono text-gray-400 shrink-0">{(flag.confidence * 100).toFixed(0)}% confidence</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-amber-50/60 dark:bg-amber-950/15 border border-amber-200 dark:border-amber-900/40 rounded-lg p-4 text-xs">
                  <h5 className="font-bold text-amber-900 dark:text-amber-400 mb-1">Recommended Auditor Action</h5>
                  <p className="text-gray-700 dark:text-gray-300 leading-normal">{result.fraud.recommendedAction}</p>
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">Risk scanning is not active for Option level {result.option}. Enter under Risk Guard (Option 3) or above.</p>
            )}
          </div>
        )}

        {/* KNOWLEDGE TAB */}
        {activeTab === "knowledge" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">Canonical Fields</h4>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/50 pb-1.5 text-xs"><span className="text-gray-500">Merchant Store</span><span className="font-semibold text-gray-800 dark:text-gray-200">{result.parsed.storeName || "—"}</span></div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/50 pb-1.5 text-xs"><span className="text-gray-500">Store Address</span><span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[200px]">{result.parsed.storeAddress || "—"}</span></div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/50 pb-1.5 text-xs"><span className="text-gray-500">Store Contact</span><span className="font-semibold text-gray-800 dark:text-gray-200">{result.parsed.storePhone || "—"}</span></div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/50 pb-1.5 text-xs"><span className="text-gray-500">Receipt Invoice #</span><span className="font-mono text-gray-800 dark:text-gray-200">{result.parsed.receiptNumber || "—"}</span></div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/50 pb-1.5 text-xs"><span className="text-gray-500">Date/Time Extracted</span><span className="font-semibold text-gray-800 dark:text-gray-200">{result.parsed.date} {result.parsed.time}</span></div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/50 pb-1.5 text-xs"><span className="text-gray-500">Method of Payment</span><span className="font-semibold text-gray-800 dark:text-gray-200">{result.parsed.paymentMethod || "—"}</span></div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/50 pb-1.5 text-xs"><span className="text-gray-500">Cashier ID</span><span className="font-semibold text-gray-800 dark:text-gray-200">{result.parsed.cashier || "—"}</span></div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">Invoice Calculations</h4>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/50 pb-1.5 text-xs"><span className="text-gray-500">Subtotal Amount</span><span className="font-mono text-gray-800 dark:text-gray-200">{formatRupiah(result.parsed.subtotal)}</span></div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/50 pb-1.5 text-xs"><span className="text-gray-500 font-semibold text-blue-600 dark:text-blue-400">Discount Checked</span><span className="font-mono font-semibold text-blue-600 dark:text-blue-400">-{formatRupiah(result.parsed.discount)}</span></div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/50 pb-1.5 text-xs"><span className="text-gray-500">PPN Tax (11%)</span><span className="font-mono text-gray-800 dark:text-gray-200">{formatRupiah(result.parsed.tax)}</span></div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/50 pb-1.5 text-xs"><span className="text-gray-500 font-bold">Grand Total audited</span><span className="font-mono font-bold text-gray-900 dark:text-white text-sm">{formatRupiah(result.parsed.total)}</span></div>
                </div>
              </div>
            </div>

            {/* Invoiced items list table */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 font-mono">Parsed Line Items ({result.parsed.items.length})</h4>
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-mono border-b border-gray-200 dark:border-gray-800">
                      <th className="p-3 font-semibold">Item Description</th>
                      <th className="p-3 font-semibold text-center">Qty</th>
                      <th className="p-3 font-semibold text-right">Unit Price</th>
                      <th className="p-3 font-semibold text-right">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/40">
                    {result.parsed.items.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 text-gray-700 dark:text-gray-300">
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3 text-center font-mono">{item.quantity}</td>
                        <td className="p-3 text-right font-mono">{formatRupiah(item.unitPrice)}</td>
                        <td className="p-3 text-right font-mono font-semibold text-gray-900 dark:text-white">{formatRupiah(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PIPELINE TRACE TAB */}
        {activeTab === "pipeline" && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">Pipeline Execution Logs</h4>
            <div className="space-y-2">
              {result.pipelineTrace.map((stage, i) => {
                const statusStyles = {
                  success: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/20",
                  skipped: "bg-gray-100 text-gray-500 border-gray-250 dark:bg-gray-900 dark:text-gray-500 dark:border-gray-800",
                  error: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/20",
                };

                return (
                  <div
                    key={i}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border text-xs bg-white dark:bg-gray-900/35 border-gray-200 dark:border-gray-850 hover:border-gray-300 dark:hover:border-gray-700 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${statusStyles[stage.status]}`}>
                        {stage.status.toUpperCase()}
                      </span>
                      <span className="font-bold text-gray-850 dark:text-gray-250 font-mono text-[10px] w-32 shrink-0">{stage.stage}</span>
                      <span className="text-gray-500 dark:text-gray-400 truncate max-w-xs">{stage.message}</span>
                    </div>
                    <span className="font-mono text-gray-400 text-[10px] bg-gray-50 dark:bg-gray-950 px-2 py-0.5 rounded border border-gray-200/50 dark:border-gray-800/40">
                      Duration: {stage.durationMs}ms
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-950/40 p-3 rounded-lg text-xs font-mono text-gray-500">
              <span>Total Pipeline Time: {result.pipelineTrace.reduce((s, t) => s + t.durationMs, 0)}ms</span>
              <span>•</span>
              <span>{result.pipelineTrace.filter((t) => t.status === "success").length} modules executed successfully</span>
            </div>
          </div>
        )}

        {/* DEVELOPER MODE TABS (TIMINGS) */}
        {activeTab === "developer" && (
          <div className="space-y-4 font-mono text-xs text-gray-600 dark:text-gray-400">
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">Sandbox Timings</h4>
            <div className="space-y-1.5 bg-gray-50 dark:bg-gray-950/30 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <p>Session ID: <strong className="text-gray-800 dark:text-gray-200">demo-session-{result.canonical.documentId.split("-")[1] || "sandbox"}</strong></p>
              <p>Dataset Manifest Name: <strong className="text-gray-800 dark:text-gray-200">Summarecon Receipt Manifest v1.0</strong></p>
              <p>Selected OCR Provider: <strong className="text-gray-800 dark:text-gray-200">Sandbox Deterministic Mock</strong></p>
              <p>API Endpoint: <strong className="text-gray-800 dark:text-gray-200">POST /api/process-receipt</strong></p>
            </div>

            {/* Performance metrics breakdown */}
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono pt-3">Engine Latency Metrics</h4>
            <div className="space-y-2">
              {result.pipelineTrace.map((stage, i) => (
                <div key={i} className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span>{stage.stage}</span>
                    <span>{stage.durationMs}ms</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-850 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 dark:bg-indigo-500 h-full" style={{ width: `${Math.min(100, (stage.durationMs / 300) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RAW JSON TAB */}
        {activeTab === "json" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Raw JSON Payload API Response</span>
              <button 
                onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                className="px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-500 dark:text-gray-400 font-semibold cursor-pointer text-[10px] transition-colors"
                aria-label="Copy Raw JSON to clipboard"
              >
                Copy JSON
              </button>
            </div>
            <pre className="bg-gray-950 dark:bg-black rounded-lg p-4 font-mono text-[10px] text-gray-300 border border-gray-850 overflow-x-auto max-h-[350px] leading-relaxed shadow-inner">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}
