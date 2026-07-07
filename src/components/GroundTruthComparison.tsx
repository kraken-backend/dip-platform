// Path: src/components/GroundTruthComparison.tsx
"use client";

import type { GroundTruthComparisonResult } from "@/lib/receipt/types";

interface GroundTruthComparisonProps {
  comparison: GroundTruthComparisonResult;
}

function MatchBadge({ match }: { match: "exact" | "partial" | "none" }) {
  const styles = {
    exact: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30",
    partial: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/30",
    none: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/30",
  };

  const labels = {
    exact: "EXACT MATCH",
    partial: "PARTIAL MATCH",
    none: "MISMATCHED",
  };

  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-wide font-mono ${styles[match]}`}>
      {labels[match]}
    </span>
  );
}

export default function GroundTruthComparison({ comparison }: GroundTruthComparisonProps) {
  return (
    <div className="glass-panel rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      {/* Header Metric Bar */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-white/30 dark:bg-gray-900/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">
              Accuracy Benchmark & Ground Truth Audit
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">
              {comparison.matchedFields} of {comparison.totalFields} canonical fields verified exactly
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
              Comparing platform output against manually verified benchmark records.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-800">
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {(comparison.overallMatchRate * 100).toFixed(0)}%
              </p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono">Comparison Score</p>
            </div>
            <div className="w-1.5 h-10 bg-blue-500 rounded-full" />
          </div>
        </div>

        {/* Small Progress Dots Legend */}
        <div className="mt-4 flex items-center gap-4 text-[10px] font-medium text-gray-500 dark:text-gray-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{comparison.matchedFields} Exact Match</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{comparison.partialFields} Partial Match</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{comparison.mismatchedFields} Mismatched</span>
          </span>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-950/20 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 font-mono uppercase tracking-wider text-[9px] font-bold">
              <th className="p-4">Field</th>
              <th className="p-4">Ground Truth</th>
              <th className="p-4">OCR</th>
              <th className="p-4">Canonical Value</th>
              <th className="p-4">Match</th>
              <th className="p-4 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800/60">
            {comparison.comparisons.map((comp, i) => {
              const isMismatch = comp.match === "none";
              const isPartial = comp.match === "partial";
              
              const friendlyFieldNames: Record<string, string> = {
                storeName: "Merchant Store",
                storeAddress: "Store Address",
                storePhone: "Contact Number",
                date: "Transaction Date",
                time: "Transaction Time",
                receiptNumber: "Invoice/Receipt #",
                subtotal: "Subtotal Amount",
                tax: "Tax (PPN 11%)",
                discount: "Discount Checked",
                total: "Grand Total Amount",
                paymentMethod: "Payment Method",
              };
              const label = friendlyFieldNames[comp.field] || comp.field;

              return (
                <tr
                  key={i}
                  className={`transition-colors duration-200 ${
                    isMismatch 
                      ? "bg-rose-50/30 dark:bg-rose-950/5 hover:bg-rose-50/50 dark:hover:bg-rose-950/10" 
                      : isPartial
                        ? "bg-amber-50/30 dark:bg-amber-950/5 hover:bg-amber-50/50 dark:hover:bg-amber-950/10"
                        : "hover:bg-gray-50/40 dark:hover:bg-gray-900/10"
                  }`}
                >
                  <td className="p-4 font-semibold text-gray-900 dark:text-white font-mono text-[10px]">
                    {label}
                  </td>

                  <td className="p-4 font-mono text-gray-700 dark:text-gray-300">
                    {comp.expected || <span className="text-gray-400 dark:text-gray-600">—</span>}
                  </td>

                  <td className="p-4 font-mono text-gray-500 dark:text-gray-400">
                    {comp.actual || <span className="text-gray-400 dark:text-gray-600">—</span>}
                  </td>

                  <td className={`p-4 font-mono font-medium ${
                    isMismatch ? "text-rose-600 dark:text-rose-400" : "text-gray-750 dark:text-gray-200"
                  }`}>
                    {comp.actual || <span className="text-gray-400 dark:text-gray-600">—</span>}
                  </td>

                  <td className="p-4">
                    <MatchBadge match={comp.match} />
                    {comp.expected !== comp.actual && !isMismatch && (
                      <p className="text-[9px] text-amber-600 dark:text-amber-400 mt-1 font-mono">
                        normalized transformation applied
                      </p>
                    )}
                  </td>

                  <td className={`p-4 text-right font-mono font-bold ${
                    comp.confidence >= 0.8 ? "text-emerald-600 dark:text-emerald-400" :
                    comp.confidence >= 0.5 ? "text-amber-500" : "text-rose-500"
                  }`}>
                    {(comp.confidence * 100).toFixed(0)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
