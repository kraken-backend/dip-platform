import type { Severity } from "./severity";

export type RuleCategory =
  | "arithmetic"
  | "consistency"
  | "format"
  | "business"
  | "compliance"
  | "fraud"
  | "knowledge"
  | "ai";

export type ExecutionStatus = "passed" | "failed" | "skipped";

export interface RuleCondition {
  field: string;
  operator: ComparisonOperator;
  value: unknown;
}

export type ComparisonOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "notIn"
  | "matches"
  | "exists"
  | "isEmpty"
  | "between";

export interface RuleEvidence {
  ruleId: string;
  field: string;
  expected: string;
  actual: string;
  message: string;
  severity: Severity;
  recommendation: string;
}

export interface RuleDefinition {
  id: string;
  name: string;
  description: string;
  documentType: string;
  category: RuleCategory;
  severity: Severity;
  condition: RuleCondition;
  evidence: Omit<RuleEvidence, "ruleId">;
  enabled: boolean;
}

export interface RuleResult {
  ruleId: string;
  ruleName: string;
  status: ExecutionStatus;
  severity: Severity;
  evidence: RuleEvidence | null;
  executionTimeMs: number;
  message: string;
}

export interface RuleContext {
  documentType: string;
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}
