export type RdlOperator =
  | "exists"
  | "notExists"
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "greaterThanOrEqual"
  | "lessThan"
  | "lessThanOrEqual"
  | "includes"
  | "notIncludes"
  | "matchesRegex"
  | "inList"
  | "between";

export type RdlSeverity = "info" | "warning" | "error" | "critical";

export type RdlCategory =
  | "arithmetic"
  | "consistency"
  | "format"
  | "business"
  | "compliance"
  | "fraud"
  | "knowledge"
  | "ai";

export interface RdlCondition {
  field: string;
  operator: RdlOperator;
  value: unknown;
}

export interface RdlEvidence {
  sourceField: string;
  expected: string;
  recommendation: string;
}

export interface RdlRuleDefinition {
  id: string;
  name: string;
  description: string;
  documentType: string;
  category: RdlCategory;
  severity: RdlSeverity;
  enabled?: boolean;
  condition: RdlCondition;
  evidence: RdlEvidence;
  message: string;
  recommendation: string;
}

export interface RdlValidationError {
  path: string;
  message: string;
  code: string;
}

export interface RdlLoadResult {
  rules: RdlRuleDefinition[];
  errors: RdlValidationError[];
  source: string;
}
