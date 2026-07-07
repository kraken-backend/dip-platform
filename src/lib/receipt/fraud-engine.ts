import type { ParsedReceipt, ValidationResult, FraudResult, FraudFlag, EvidenceItem } from "./types";
import { createFraudEvidence, createInfoEvidence } from "./evidence";

const KNOWN_MERCHANTS = [
  "Summarecon Mall Food Court",
  "Electronic Pro - Summarecon",
  "Fashion Hub - Summarecon",
];

const SUSPICIOUS_KEYWORDS = ["barang x", "sparepart", "tanpa nama", "cash"];
const HIGH_VALUE_THRESHOLD = 2000000;
const UNUSUAL_HOUR_START = 22;
const UNUSUAL_HOUR_END = 6;

export function analyzeFraud(
  parsed: ParsedReceipt,
  validation: ValidationResult
): FraudResult {
  const flags: FraudFlag[] = [];
  const evidence: EvidenceItem[] = [];

  checkUnregisteredMerchant(parsed, flags, evidence);
  checkMissingTax(parsed, flags, evidence);
  checkUnusualHours(parsed, flags, evidence);
  checkHighValueCash(parsed, flags, evidence);
  checkGenericItems(parsed, flags, evidence);
  checkSuspiciousKeywords(parsed, flags, evidence);
  checkReceiptFormat(parsed, flags, evidence);
  checkValidationIssues(validation, flags, evidence);
  checkAmountAnomaly(parsed, flags, evidence);

  const score = calculateFraudScore(flags);
  const riskLevel = determineRiskLevel(score);

  if (flags.length === 0) {
    evidence.push(createInfoEvidence("No fraud indicators detected", "overall", "clean"));
  }

  return {
    score,
    riskLevel,
    flags,
    evidence,
    summary: generateSummary(riskLevel, flags),
    recommendedAction: generateRecommendedAction(riskLevel),
  };
}

function checkUnregisteredMerchant(
  parsed: ParsedReceipt,
  flags: FraudFlag[],
  evidence: EvidenceItem[]
): void {
  const isRegistered = KNOWN_MERCHANTS.some(
    (m) =>
      parsed.storeName.toLowerCase().includes(m.toLowerCase()) ||
      m.toLowerCase().includes(parsed.storeName.toLowerCase())
  );

  if (!isRegistered && parsed.storeName !== "Unknown Store") {
    const flag: FraudFlag = {
      type: "unregistered_merchant",
      description: `Store "${parsed.storeName}" is not registered in the Summarecon Mall merchant database`,
      severity: "critical",
      confidence: 0.92,
    };
    flags.push(flag);
    evidence.push(createFraudEvidence(flag));
  }
}

function checkMissingTax(parsed: ParsedReceipt, flags: FraudFlag[], evidence: EvidenceItem[]): void {
  const taxableAmount = parsed.subtotal - parsed.discount;
  if (parsed.tax === 0 && taxableAmount > 100000) {
    const flag: FraudFlag = {
      type: "missing_tax",
      description: `No PPN (11% VAT) applied to transaction of Rp ${taxableAmount.toLocaleString("id-ID")}`,
      severity: "high",
      confidence: 0.88,
    };
    flags.push(flag);
    evidence.push(createFraudEvidence(flag));
  }
}

function checkUnusualHours(parsed: ParsedReceipt, flags: FraudFlag[], evidence: EvidenceItem[]): void {
  if (!parsed.time || parsed.time === "Time not detected") return;

  const match = parsed.time.match(/(\d{2}):\d{2}/);
  if (!match) return;

  const hour = parseInt(match[1], 10);
  if (hour >= UNUSUAL_HOUR_START || hour < UNUSUAL_HOUR_END) {
    const flag: FraudFlag = {
      type: "unusual_hours",
      description: `Transaction occurred outside normal operating hours (${parsed.time})`,
      severity: hour >= 23 || hour < 5 ? "high" : "medium",
      confidence: hour >= 23 ? 0.85 : 0.7,
    };
    flags.push(flag);
    evidence.push(createFraudEvidence(flag));
  }
}

function checkHighValueCash(parsed: ParsedReceipt, flags: FraudFlag[], evidence: EvidenceItem[]): void {
  const isCash =
    parsed.paymentMethod?.toLowerCase().includes("tunai") ||
    parsed.paymentMethod?.toLowerCase().includes("cash");

  if (isCash && parsed.total >= HIGH_VALUE_THRESHOLD) {
    const flag: FraudFlag = {
      type: "high_value_cash",
      description: `Large cash transaction of Rp ${parsed.total.toLocaleString("id-ID")} without digital trail`,
      severity: "high",
      confidence: 0.8,
    };
    flags.push(flag);
    evidence.push(createFraudEvidence(flag));
  }
}

function checkGenericItems(parsed: ParsedReceipt, flags: FraudFlag[], evidence: EvidenceItem[]): void {
  const genericNames = parsed.items.filter((item) =>
    SUSPICIOUS_KEYWORDS.some((keyword) =>
      item.name.toLowerCase().includes(keyword)
    )
  );

  if (genericNames.length > 0) {
    const flag: FraudFlag = {
      type: "generic_items",
      description: `Receipt contains generically named items: ${genericNames.map((i) => i.name).join(", ")}`,
      severity: "medium",
      confidence: 0.65,
    };
    flags.push(flag);
    evidence.push(createFraudEvidence(flag));
  }
}

function checkSuspiciousKeywords(
  parsed: ParsedReceipt,
  flags: FraudFlag[],
  evidence: EvidenceItem[]
): void {
  const textToCheck = [
    parsed.storeName,
    ...parsed.items.map((i) => i.name),
    parsed.paymentMethod,
  ].join(" ").toLowerCase();

  const found = SUSPICIOUS_KEYWORDS.filter((k) => textToCheck.includes(k));
  if (found.length > 0) {
    const flag: FraudFlag = {
      type: "suspicious_keywords",
      description: `Suspicious keywords detected: ${found.join(", ")}`,
      severity: "medium",
      confidence: 0.55,
    };
    flags.push(flag);
    evidence.push(createFraudEvidence(flag));
  }
}

function checkReceiptFormat(parsed: ParsedReceipt, flags: FraudFlag[], evidence: EvidenceItem[]): void {
  const hasStandardPattern =
    /^[A-Z]{2,3}-\d{4}-\d{2}-\d{5}$/.test(parsed.receiptNumber) ||
    /^FH-\d{4}-\d{2}-\d{4}$/.test(parsed.receiptNumber);

  if (!hasStandardPattern && parsed.receiptNumber !== "Not detected") {
    const flag: FraudFlag = {
      type: "generic_receipt",
      description: `Receipt format does not match any known Summarecon template (number: ${parsed.receiptNumber})`,
      severity: "medium",
      confidence: 0.7,
    };
    flags.push(flag);
    evidence.push(createFraudEvidence(flag));
  }
}

function checkValidationIssues(
  validation: ValidationResult,
  flags: FraudFlag[],
  evidence: EvidenceItem[]
): void {
  if (!validation.valid) {
    const errorCount = validation.issues.filter(
      (i) => i.severity === "error"
    ).length;

    if (errorCount >= 3) {
      const flag: FraudFlag = {
        type: "validation_failure",
        description: `Receipt failed validation with ${errorCount} critical errors`,
        severity: "high",
        confidence: 0.85,
      };
      flags.push(flag);
      evidence.push(createFraudEvidence(flag));
    }
  }
}

function checkAmountAnomaly(
  parsed: ParsedReceipt,
  flags: FraudFlag[],
  evidence: EvidenceItem[]
): void {
  if (parsed.discount > 0 && parsed.discount > parsed.subtotal * 0.5) {
    const flag: FraudFlag = {
      type: "excessive_discount",
      description: `Discount of ${Math.round((parsed.discount / parsed.subtotal) * 100)}% exceeds reasonable threshold`,
      severity: "medium",
      confidence: 0.6,
    };
    flags.push(flag);
    evidence.push(createFraudEvidence(flag));
  }

  if (parsed.items.length === 1 && parsed.total > HIGH_VALUE_THRESHOLD) {
    const flag: FraudFlag = {
      type: "single_item_high_value",
      description: `Single item transaction of high value (Rp ${parsed.total.toLocaleString("id-ID")})`,
      severity: "low",
      confidence: 0.4,
    };
    flags.push(flag);
    evidence.push(createFraudEvidence(flag));
  }
}

function calculateFraudScore(flags: FraudFlag[]): number {
  if (flags.length === 0) return 0;

  let score = 0;
  for (const flag of flags) {
    const severityWeight = getSeverityWeight(flag.severity);
    score += severityWeight * flag.confidence;
  }

  return Math.min(100, Math.round(score * 20));
}

function getSeverityWeight(severity: string): number {
  switch (severity) {
    case "critical":
      return 1.0;
    case "high":
      return 0.7;
    case "medium":
      return 0.4;
    case "low":
      return 0.15;
    default:
      return 0.1;
  }
}

function determineRiskLevel(score: number): "low" | "medium" | "high" | "critical" {
  if (score >= 70) return "critical";
  if (score >= 40) return "high";
  if (score >= 20) return "medium";
  return "low";
}

function generateSummary(
  riskLevel: string,
  flags: FraudFlag[]
): string {
  if (flags.length === 0) {
    return "No suspicious activity detected. Receipt appears authentic.";
  }

  const descriptions = flags.map((f) => f.description);
  return `${riskLevel.toUpperCase()} risk: ${descriptions.join(". ")}.`;
}

function generateRecommendedAction(
  riskLevel: string,
): string {
  switch (riskLevel) {
    case "critical":
      return "Immediate escalation required. Block transaction and notify fraud investigation team.";
    case "high":
      return "Flag for priority review. Verify merchant credentials and transaction validity before approval.";
    case "medium":
      return "Monitor transaction. Additional verification recommended before processing.";
    case "low":
      return "No action required. Standard processing.";
    default:
      return "Unable to determine recommended action.";
  }
}
