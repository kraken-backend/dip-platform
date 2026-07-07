// Path: src/components/ReceiptGallery.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import type { DatasetReceiptEntry } from "@/lib/receipt/types";

interface ReceiptGalleryProps {
  onSelect: (receipt: DatasetReceiptEntry) => void;
  selectedId?: string;
}

const RISK_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  low: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800/50",
  },
  high: {
    bg: "bg-rose-50 dark:bg-rose-950/20",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800/50",
  },
};

const CATEGORY_BADGES: Record<string, { bg: string; text: string }> = {
  "F&B": { bg: "bg-amber-100 dark:bg-amber-950/30", text: "text-amber-800 dark:text-amber-400" },
  Electronics: { bg: "bg-blue-100 dark:bg-blue-950/30", text: "text-blue-800 dark:text-blue-400" },
  Fashion: { bg: "bg-violet-100 dark:bg-violet-950/30", text: "text-violet-800 dark:text-violet-400" },
  Suspicious: { bg: "bg-rose-100 dark:bg-rose-950/30", text: "text-rose-800 dark:text-rose-400" },
};

function getCategoryStyles(category: string) {
  return CATEGORY_BADGES[category] || { bg: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400" };
}

export default function ReceiptGallery({ onSelect, selectedId }: ReceiptGalleryProps) {
  const [receipts, setReceipts] = useState<DatasetReceiptEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [risk, setRisk] = useState("all");
  const [country, setCountry] = useState("all");
  const [merchant, setMerchant] = useState("all");

  useEffect(() => {
    const loadManifest = async () => {
      try {
        const response = await fetch("/receipts/manifest.json");
        const data = await response.json();
        setReceipts(data.receipts || []);
      } catch {
        setReceipts([]);
      } finally {
        setLoading(false);
      }
    };

    void loadManifest();
  }, []);

  const filteredReceipts = useMemo(() => {
    return receipts.filter((receipt) => {
      const matchesSearch =
        receipt.title.toLowerCase().includes(search.toLowerCase()) ||
        receipt.scenario.toLowerCase().includes(search.toLowerCase()) ||
        receipt.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || receipt.category === category;
      const matchesRisk = risk === "all" || receipt.risk === risk;
      const matchesCountry = country === "all" || receipt.country === country;
      const matchesMerchant =
        merchant === "all" ||
        receipt.title.toLowerCase().includes(merchant.toLowerCase());

      return matchesSearch && matchesCategory && matchesRisk && matchesCountry && matchesMerchant;
    });
  }, [receipts, search, category, risk, country, merchant]);

  const categories = useMemo(() => ["all", ...new Set(receipts.map((r) => r.category))], [receipts]);
  const countries = useMemo(() => ["all", ...new Set(receipts.map((r) => r.country))], [receipts]);
  const risks = useMemo(() => ["all", ...new Set(receipts.map((r) => r.risk))], [receipts]);
  const merchants = useMemo(
    () =>
      [
        "all",
        ...new Set(
          receipts.map((receipt) => receipt.title.split("-")[0]?.trim()).filter(Boolean)
        ),
      ],
    [receipts]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-mono">Loading sandbox manifest...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 font-mono">
          Dataset Manifest Registry ({filteredReceipts.length}/{receipts.length} loaded)
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
          <div className="relative col-span-2">
            <input
              type="text"
              placeholder="Search receipts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Search receipts"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.filter((c) => c !== "all").map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            aria-label="Filter by risk level"
          >
            <option value="all">All Risk Levels</option>
            {risks.filter((r) => r !== "all").map((r) => (
              <option key={r} value={r}>{r.toUpperCase()}</option>
            ))}
          </select>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            aria-label="Filter by country"
          >
            <option value="all">All Countries</option>
            {countries.filter((co) => co !== "all").map((co) => (
              <option key={co} value={co}>{co}</option>
            ))}
          </select>

          <select
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className="col-span-2 sm:col-span-1 text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            aria-label="Filter by merchant"
          >
            <option value="all">All Merchants</option>
            {merchants.filter((item) => item !== "all").map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredReceipts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900/20 rounded-xl border border-dashed border-gray-300 dark:border-gray-800 text-center">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">No Receipts Match Query</p>
          <p className="text-[10px] text-gray-400 mt-1">Try resetting search or filter terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
          {filteredReceipts.map((receipt) => {
            const isSelected = selectedId === receipt.id;
            const riskInfo = RISK_BADGES[receipt.risk] || RISK_BADGES.low;
            const categoryInfo = getCategoryStyles(receipt.category);

            return (
              <button
                key={receipt.id}
                onClick={() => onSelect(receipt)}
                className={`
                  relative rounded-xl border text-left transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer
                  ${isSelected
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/30"
                    : "border-gray-200 dark:border-gray-800/80 bg-white dark:bg-gray-900/40 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-900/60 hover:-translate-y-0.5 hover:shadow-md"}
                `}
                aria-label={`Select ${receipt.title}`}
                aria-pressed={isSelected}
              >
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-950 overflow-hidden relative border-b border-gray-100 dark:border-gray-800/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={receipt.imagePath}
                    alt={receipt.title}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22260%22%3E%3Crect fill=%22%231f2937%22 width=%22200%22 height=%22260%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b7280%22 font-size=%2214%22%3EReceipt%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  {/* Risk Badge overlay */}
                  <div className="absolute top-2 right-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${riskInfo.border} ${riskInfo.bg} ${riskInfo.text} font-mono tracking-wider`}>
                      {receipt.risk.toUpperCase()}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-x-2 top-2">
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold px-2 py-1 rounded-full bg-blue-600 text-white shadow-md font-mono tracking-wider">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        SELECTED
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Details Block */}
                <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {receipt.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">{receipt.scenario}</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${categoryInfo.bg} ${categoryInfo.text}`}>
                        {receipt.category}
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono">{receipt.currency}</span>
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium">{receipt.country}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
