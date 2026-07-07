"use client";

import type { ReactNode } from "react";
import type { AnalyticsData, AiInsight } from "@/lib/receipt/types";

interface DashboardProps {
  analytics: AnalyticsData;
  insights: AiInsight[];
}

export default function Dashboard({ analytics, insights }: DashboardProps) {
  const knowledgeScore = Math.round((analytics.averageConfidence * 0.7 + analytics.validationPassRate * 0.3) * 100);

  return (
    <div className="space-y-6">
      {/* Alert Header Bar */}
      <div className="bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-xl border border-blue-100 dark:border-blue-900/40 p-4">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">
            Intelligence Analytics Console
          </h3>
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          Showing real-time AI modeling, compliance validation scores, and knowledge graph extractions for Summarecon Mall.
        </p>
      </div>

      {/* Grid of AI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardMetric
          label="OCR Confidence Index"
          value={`${(analytics.averageConfidence * 100).toFixed(1)}%`}
          description="Fuzzy character match confidence"
          icon="ocr"
          color="blue"
        />
        <DashboardMetric
          label="Validation Integrity"
          value={`${(analytics.validationPassRate * 100).toFixed(0)}%`}
          description="Compliance validation pass rate"
          icon="validation"
          color="green"
        />
        <DashboardMetric
          label="Fraud Prevention Index"
          value={`${((1 - analytics.fraudDetectionRate) * 100).toFixed(0)}%`}
          description="Transactions clean of fraud risk"
          icon="fraud"
          color="indigo"
        />
        <DashboardMetric
          label="Knowledge Graph Sync"
          value={`${knowledgeScore}%`}
          description="Relation & entity map accuracy"
          icon="knowledge"
          color="purple"
        />
        <DashboardMetric
          label="Avg Pipeline Latency"
          value={`${analytics.processingTimeAvg}ms`}
          description="End-to-end processing timing"
          icon="latency"
          color="yellow"
        />
        <DashboardMetric
          label="Audited Volume"
          value={`Rp ${analytics.totalAmountProcessed.toLocaleString("id-ID")}`}
          description="Ingested transaction values"
          icon="volume"
          color="emerald"
        />
        <DashboardMetric
          label="Aggregated Documents"
          value={analytics.totalReceiptsProcessed.toString()}
          description="Total manifest receipts processed"
          icon="documents"
          color="cyan"
        />
        <DashboardMetric
          label="Tenant Stores Tracked"
          value={analytics.topStores.length.toString()}
          description="Verified Summarecon merchant list"
          icon="stores"
          color="orange"
        />
      </div>

      {/* Chart Visualizer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Stores CSS Bar Chart */}
        <div className="glass-panel rounded-xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900/30 hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">Top Merchant Volume</h4>
            <span className="text-[10px] text-gray-400 font-mono">By Ingestion Count</span>
          </div>
          <div className="space-y-3.5">
            {analytics.topStores.map((store, i) => {
              const maxTxns = Math.max(...analytics.topStores.map((s) => s.count));
              const percent = maxTxns > 0 ? (store.count / maxTxns) * 100 : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[150px]">{store.name}</span>
                    <span className="font-mono text-gray-500 dark:text-gray-400">
                      {store.count} txns <span className="text-[10px] text-gray-400 font-normal">({(store.total / 1000).toFixed(0)}k IDR)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ingestion Timeline CSS Bar Chart */}
        <div className="glass-panel rounded-xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900/30 hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">Ingestion Volume Timeline</h4>
            <span className="text-[10px] text-gray-400 font-mono">Daily Ingress Total</span>
          </div>
          <div className="space-y-3.5">
            {analytics.dailyVolume.map((day, i) => {
              const maxTotal = Math.max(...analytics.dailyVolume.map((d) => d.total));
              const percent = maxTotal > 0 ? (day.total / maxTotal) * 100 : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{day.date}</span>
                    <span className="font-mono text-gray-500 dark:text-gray-400">
                      Rp {(day.total / 1000000).toFixed(2)}M <span className="text-[10px] text-gray-400 font-normal">({day.count} receipts)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-violet-600 dark:bg-violet-500 h-full rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Operational Insights section */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 font-mono">
          AI Audit Insights & Operational Actions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, i) => {
            const isPositive = insight.impact === "positive";
            const isNegative = insight.impact === "negative";

            return (
              <div
                key={i}
                className={`
                  rounded-xl p-4 border transition-all duration-300 hover:shadow-md
                  ${isPositive
                    ? "bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/10 dark:border-emerald-900/30"
                    : isNegative
                      ? "bg-rose-50/40 border-rose-200 dark:bg-rose-950/10 dark:border-rose-900/30"
                      : "bg-blue-50/40 border-blue-200 dark:bg-blue-950/10 dark:border-blue-900/30"}
                `}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`
                    text-[9px] font-bold px-2 py-0.5 rounded-full border
                    ${isPositive ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30" : ""}
                    ${isNegative ? "bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/30" : ""}
                    ${insight.impact === "neutral" ? "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/30" : ""}
                  `}>
                    {insight.category.toUpperCase()}
                  </span>
                  <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 font-mono">IMPACT: {insight.impact.toUpperCase()}</span>
                </div>
                <p className="text-xs font-bold text-gray-900 dark:text-white leading-relaxed">{insight.insight}</p>
                
                <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-800/50 flex items-start gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                  <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>
                    <strong className="text-gray-700 dark:text-gray-300">Action Plan: </strong>
                    {insight.recommendation}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DashboardMetric({
  label,
  value,
  description,
  icon,
  color,
}: {
  label: string;
  value: string;
  description: string;
  icon: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    green: "bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
    indigo: "bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50",
    purple: "bg-purple-50/50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
    yellow: "bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    emerald: "bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
    cyan: "bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/50",
    orange: "bg-orange-50/50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50",
  };

  const iconsMap: Record<string, ReactNode> = {
    ocr: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    validation: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    fraud: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    knowledge: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    latency: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    volume: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    documents: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    ),
    stores: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  };

  return (
    <div className={`rounded-xl p-4 border bg-white/40 dark:bg-gray-900/20 backdrop-blur-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider font-mono opacity-80">{label}</span>
        <div className="opacity-90">{iconsMap[icon]}</div>
      </div>
      <p className="text-lg font-extrabold leading-none text-gray-900 dark:text-white mt-1">{value}</p>
      <p className="text-[9px] opacity-75 mt-1 font-mono">{description}</p>
    </div>
  );
}
