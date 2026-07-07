// Path: src/app/page.tsx
"use client";

import Header from "@/components/Header";
import OptionCard from "@/components/OptionCard";
import { useScrollReveal } from "@/hooks/useTheme";

const OPTIONS = [
  {
    number: 1,
    title: "OCR Extraction Engine",
    description:
      "Advanced text extraction from raw receipt images. Standardizes OCR parsing outputs into structured JSON datasets.",
    features: [
      "Text extraction with confidence levels",
      "Language identification (ID/EN)",
      "Raw lines and bounding boxes",
      "Clean structured JSON schema",
    ],
    icon: "🔍",
  },
  {
    number: 2,
    title: "OCR + Validation Engine",
    description:
      "Automated policy validation against corporate compliance rules. Analyzes arithmetic, stores, taxes, and dates.",
    features: [
      "All OCR extraction features",
      "Arithmetic tax calculation check",
      "Store registry candidate matching",
      "Compliance policy enforcement",
    ],
    icon: "✅",
    recommended: true,
  },
  {
    number: 3,
    title: "OCR + Fraud Detection Guard",
    description:
      "Deep risk scanning using historical patterns and heuristics. Automatically flags suspicious merchant activity.",
    features: [
      "All compliance validation features",
      "Suspicious hour transaction flag",
      "Duplicate receipt hash scanning",
      "Merchant address anomalies",
    ],
    icon: "🛡️",
  },
  {
    number: 4,
    title: "AI Document Intelligence Platform",
    description:
      "Complete enterprise suite integrating knowledge graph mapping, analytics, and business intelligence.",
    features: [
      "All risk guard features",
      "Knowledge graph entity parsing",
      "Aggregate analytics dashboard",
      "Tenant performance insights",
    ],
    icon: "🧠",
  },
];

export default function Home() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Reduced height for earlier content visibility */}
        <section className="relative text-center py-10 sm:py-14 lg:py-16 overflow-hidden reveal-fade">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.06),transparent_50%)] pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Enterprise AI Document Intelligence Sandbox
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tight max-w-4xl mx-auto">
            AI-Powered Document Intelligence
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              Built for Summarecon Mall
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mt-4 leading-relaxed">
            Extract, validate, and secure transaction receipts. Our platform transforms unstructured paper and digital documents into real-time business intelligence and compliance audits.
          </p>

          <div className="flex items-center justify-center gap-6 mt-6 text-xs font-semibold text-gray-400 dark:text-gray-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ISO Compliant Architecture
            </span>
            <span className="text-gray-300 dark:text-gray-800">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Sub-second Processing Latency
            </span>
          </div>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {["01 Landing", "02 Choose Solution", "03 Choose Receipt", "04 Process", "05 Verify", "06 Insights"].map((step) => (
              <span key={step} className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                {step}
              </span>
            ))}
          </div>

          {/* Hero CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <a
              href="/process"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:opacity-90 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Enter Sandbox
            </a>
            <a
              href="#architecture"
              className="px-6 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              View Architecture
            </a>
          </div>
        </section>

        {/* Interactive Architecture Flow Diagram */}
        <section id="architecture" className="mb-16 scroll-mt-20 reveal">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">Observability</h2>
            <p className="text-xl font-extrabold text-gray-950 dark:text-white mt-1">Platform Processing Blueprint</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 max-w-lg mx-auto">The architecture decouples document ingestion from rules processing to run multiple compliance stages concurrently.</p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-0 max-w-5xl mx-auto">
            {[
              { step: "01", label: "INGEST", title: "Document Ingestion", desc: "Accepts image files or raw OCR requests. Prepares OCR pipelines via sandboxed mocks.", color: "text-blue-600 dark:text-blue-400" },
              { step: "02", label: "EXTRACT", title: "Canonical Engine", desc: "Normalizes OCR outputs. Performs fuzzy candidate matching against merchant registries.", color: "text-indigo-600 dark:text-indigo-400" },
              { step: "03", label: "AUDIT", title: "Compliance Rules", desc: "Runs algebraic checks (Tax/PPN 11%, discounts, item sums) and merchant audit validations.", color: "text-violet-600 dark:text-violet-400" },
              { step: "04", label: "RESOLVE", title: "Fraud & Insights", desc: "Runs heuristics check for duplicates, off-hour spikes, and aggregates data for analytics dashboards.", color: "text-pink-600 dark:text-pink-400" },
            ].map((item, i, arr) => (
              <div key={item.step} className={`flex flex-row md:flex-col items-stretch md:items-center flex-1 reveal-delay-${i + 1}`}>
                <div className="glass-panel p-5 rounded-xl border border-gray-200 dark:border-gray-800 flex-1 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-300">
                  <div className={`text-xs font-bold font-mono mb-2 ${item.color}`}>{item.step} / {item.label}</div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex items-center justify-center px-1 md:px-0 md:py-1 text-gray-400 dark:text-gray-600 shrink-0">
                    <svg className="w-4 h-4 md:rotate-90 rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Option Grid */}
        <section className="mb-16 reveal">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">Select Pipeline</h2>
            <p className="text-2xl font-black text-gray-950 dark:text-white mt-1">Available Processing Environments</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Pick an option below to enter the sandbox workspace environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {OPTIONS.map((option) => (
              <div key={option.number} className={`reveal reveal-delay-${option.number}`}>
                <OptionCard {...option} />
              </div>
            ))}
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="mb-16 max-w-5xl mx-auto reveal-scale">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">Capabilities Matrix</h2>
            <p className="text-xl font-extrabold text-gray-950 dark:text-white mt-1">Comparing Pipeline Capabilities</p>
          </div>

          <div className="glass-panel rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100/50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 font-mono border-b border-gray-200 dark:border-gray-800">
                    <th className="p-4 font-bold">Pipeline Stage</th>
                    <th className="p-4 font-bold text-center">OCR Only</th>
                    <th className="p-4 font-bold text-center">Validation</th>
                    <th className="p-4 font-bold text-center">Risk Guard</th>
                    <th className="p-4 font-bold text-center">Full Platform</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">OCR Text Extraction</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">Structured JSON Parsing</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">Arithmetic & Compliance Checks</td>
                    <td className="p-4 text-center text-gray-300 dark:text-gray-800">—</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">Ground Truth Accuracy Check</td>
                    <td className="p-4 text-center text-gray-300 dark:text-gray-800">—</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">Risk & Fraud Flagging Engine</td>
                    <td className="p-4 text-center text-gray-300 dark:text-gray-800">—</td>
                    <td className="p-4 text-center text-gray-300 dark:text-gray-800">—</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">Knowledge Graph Entities Map</td>
                    <td className="p-4 text-center text-gray-300 dark:text-gray-800">—</td>
                    <td className="p-4 text-center text-gray-300 dark:text-gray-800">—</td>
                    <td className="p-4 text-center text-gray-300 dark:text-gray-800">—</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">BI & Tenant Analytics Dashboard</td>
                    <td className="p-4 text-center text-gray-300 dark:text-gray-800">—</td>
                    <td className="p-4 text-center text-gray-300 dark:text-gray-800">—</td>
                    <td className="p-4 text-center text-gray-300 dark:text-gray-800">—</td>
                    <td className="p-4 text-center text-emerald-500">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Developer CTA / SDK Showcase */}
        <section className="glass-panel p-8 rounded-2xl border border-gray-200 dark:border-gray-800 max-w-4xl mx-auto bg-gradient-to-br from-white via-white to-blue-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950/20 shadow-md hover:shadow-lg transition-shadow duration-300 reveal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-950 dark:text-white">Ready for Integration?</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                {"Connect the Document Intelligence API directly into Summarecon's POS systems, loyalty apps, or finance auditing dashboards."}
              </p>
              <div className="flex items-center gap-3 mt-6">
                <span className="text-xs font-mono px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">v1.2.0-PoC</span>
                <span className="text-xs font-mono px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">TypeScript SDK Ready</span>
              </div>
            </div>

            <div className="bg-gray-950 dark:bg-black p-5 rounded-xl border border-gray-800 font-mono text-[11px] text-gray-300 shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800 mb-3">
                <span className="text-[10px] text-gray-500">NodeJS Quick Start</span>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
              </div>
              <p className="text-indigo-400">{"import "}<span className="text-white">{"{ DocumentClient }"}</span>{" from "}<span className="text-green-400">{"\"@summarecon/doc-intel\""}</span>{";"}</p>
              <p className="text-gray-500 mt-1">{"// Ingest and validate receipt document"}</p>
              <p className="text-indigo-400">{"const "}<span className="text-white">{"client"}</span>{" = new "}<span className="text-yellow-400">{"DocumentClient"}</span>({"{"}{" provider: \"sandbox\" "}{"}"});</p>
              <p className="text-indigo-400">{"const "}<span className="text-white">{"result"}</span>{" = await "}<span className="text-white">{"client"}</span>.<span className="text-yellow-400">{"processReceipt"}</span>({"file, "}{"{"}{" option: 4 "}{"}"});</p>
              <p className="text-indigo-400">{"console."}<span className="text-yellow-400">{"log"}</span>({"("}<span className="text-white">{"result.validation.valid"}</span>{"); "}<span className="text-gray-500">{"// true"}</span></p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Summarecon Mall IT. Confidential PoC Demo Environment.</p>
            <div className="flex gap-6">
              <span className="hover:text-blue-500 cursor-pointer transition-colors">Security Protocol</span>
              <span className="hover:text-blue-500 cursor-pointer transition-colors">Architecture API Docs</span>
              <span className="hover:text-blue-500 cursor-pointer transition-colors">Contact Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
