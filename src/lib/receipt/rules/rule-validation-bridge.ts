import { RuleEngine, createRuleContext } from "@/lib/rule-engine";
import { registerReceiptRules } from "@/lib/receipt/rules/receipt-rules";
import type { ParsedReceipt, ValidationResult, ValidationIssue, EvidenceItem } from "@/lib/receipt/types";

let initialized = false;

function ensureInitialized(): void {
  if (initialized) return;
  registerReceiptRules();
  initialized = true;
}

let evidenceCounter = 0;

function generateEvidenceId(): string {
  evidenceCounter++;
  const seq = String(evidenceCounter).padStart(4, "0");
  return "RVB-" + Date.now().toString(36).toUpperCase() + "-" + seq;
}

export function validateWithRuleEngine(parsed: ParsedReceipt): ValidationResult {
  ensureInitialized();
  const engine = new RuleEngine();
  const ctx = createRuleContext("receipt", {
    storeName: parsed.storeName,
    storeAddress: parsed.storeAddress,
    storePhone: parsed.storePhone,
    date: parsed.date,
    time: parsed.time,
    receiptNumber: parsed.receiptNumber,
    items: parsed.items,
    subtotal: parsed.subtotal,
    tax: parsed.tax,
    discount: parsed.discount,
    total: parsed.total,
    paymentMethod: parsed.paymentMethod,
    cashier: parsed.cashier,
  });
  const engineResult = engine.evaluate(ctx);
  const issues: ValidationIssue[] = [];
  const warnings: string[] = [];
  const passedChecks: string[] = [];
  const evidence: EvidenceItem[] = [];

  for (const ruleResult of engineResult.results) {
    switch (ruleResult.status) {
      case "failed": {
        const ev = ruleResult.evidence;
        const severity = mapSeverity(ruleResult.severity);
        issues.push({ field: ev?.field ?? "unknown", message: ruleResult.message, severity, expected: ev?.expected, actual: ev?.actual });
        evidence.push({ evidenceId: generateEvidenceId(), type: "validation", message: ruleResult.message, sourceField: ev?.field ?? "unknown", sourceValue: ev?.actual ?? "", severity, confidence: severity === "error" ? 0.9 : severity === "warning" ? 0.7 : 0.5 });
        break;
      }
      case "passed":
        passedChecks.push(ruleResult.message);
        break;
    }
  }

  const score = calculateScore(issues);
  const valid = issues.filter((i) => i.severity === "error").length === 0;
  return { valid, score, issues, warnings, passedChecks, evidence };
}

function mapSeverity(s: string): "error" | "warning" | "info" {
  switch (s) { case "critical": case "error": return "error"; case "warning": return "warning"; default: return "info"; }
}

function calculateScore(issues: ValidationIssue[]): number {
  if (issues.length === 0) return 1.0;
  let deductions = 0;
  for (const issue of issues) {
    switch (issue.severity) { case "error": deductions += 0.2; break; case "warning": deductions += 0.1; break; case "info": deductions += 0.02; break; }
  }
  return Math.max(0, Math.min(1, 1 - deductions));
}
