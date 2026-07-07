import type { EvidenceItem, ValidationIssue, FraudFlag } from "./types";

let evidenceCounter = 0;

function generateEvidenceId(): string {
  evidenceCounter++;
  const seq = String(evidenceCounter).padStart(4, "0");
  return `EVD-${Date.now().toString(36).toUpperCase()}-${seq}`;
}

function mapValidationSeverity(severity: "error" | "warning" | "info"): EvidenceItem["severity"] {
  return severity as EvidenceItem["severity"];
}

function mapFraudSeverity(severity: "critical" | "high" | "medium" | "low"): EvidenceItem["severity"] {
  return severity as EvidenceItem["severity"];
}

export function createValidationEvidence(
  issue: ValidationIssue
): EvidenceItem {
  return {
    evidenceId: generateEvidenceId(),
    type: "validation",
    message: issue.message,
    sourceField: issue.field,
    sourceValue: issue.actual || issue.expected || "",
    severity: mapValidationSeverity(issue.severity),
    confidence: issue.severity === "error" ? 0.9 : issue.severity === "warning" ? 0.7 : 0.5,
  };
}

export function createFraudEvidence(flag: FraudFlag): EvidenceItem {
  return {
    evidenceId: generateEvidenceId(),
    type: "fraud",
    message: flag.description,
    sourceField: flag.type,
    sourceValue: flag.type.replace(/_/g, " "),
    severity: mapFraudSeverity(flag.severity),
    confidence: flag.confidence,
  };
}

export function createInfoEvidence(
  message: string,
  sourceField: string,
  sourceValue: string
): EvidenceItem {
  return {
    evidenceId: generateEvidenceId(),
    type: "info",
    message,
    sourceField,
    sourceValue,
    severity: "info",
    confidence: 1.0,
  };
}
