import type { RuleResult, RuleEvidence } from "./types";
import { severityWeight } from "./severity";

export interface EngineResult {
  overall: boolean;
  score: number;
  totalRules: number;
  passed: number;
  failed: number;
  skipped: number;
  results: RuleResult[];
  evidence: RuleEvidence[];
  executionTimeMs: number;
}

export function buildEngineResult(results: RuleResult[]): EngineResult {
  const failedCount = results.filter((r) => r.status === "failed").length;
  const passedCount = results.filter((r) => r.status === "passed").length;
  const skippedCount = results.filter((r) => r.status === "skipped").length;

  const evidence = results
    .filter((r) => r.evidence !== null)
    .map((r) => r.evidence!);

  const score = calculateScore(results);
  const overall = failedCount === 0;

  return {
    overall,
    score,
    totalRules: results.length,
    passed: passedCount,
    failed: failedCount,
    skipped: skippedCount,
    results,
    evidence,
    executionTimeMs: 0,
  };
}

function calculateScore(results: RuleResult[]): number {
  if (results.length === 0) return 1.0;
  let deductions = 0;
  for (const r of results) {
    if (r.status === "failed") {
      deductions += severityWeight(r.severity) * 0.1;
    }
  }
  return Math.max(0, Math.min(1, 1 - deductions));
}
