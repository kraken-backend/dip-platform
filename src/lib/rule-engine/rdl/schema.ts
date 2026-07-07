import type { RdlCategory, RdlSeverity, RdlOperator, RdlRuleDefinition } from "./types";

export const VALID_CATEGORIES: RdlCategory[] = [
  "arithmetic", "consistency", "format", "business",
  "compliance", "fraud", "knowledge", "ai",
];

export const VALID_SEVERITIES: RdlSeverity[] = [
  "info", "warning", "error", "critical",
];

export const VALID_OPERATORS: RdlOperator[] = [
  "exists", "notExists", "equals", "notEquals",
  "greaterThan", "greaterThanOrEqual",
  "lessThan", "lessThanOrEqual",
  "includes", "notIncludes",
  "matchesRegex", "inList", "between",
];

export const ENGINE_OPERATOR_MAP: Record<RdlOperator, string> = {
  exists: "exists",
  notExists: "isEmpty",
  equals: "eq",
  notEquals: "neq",
  greaterThan: "gt",
  greaterThanOrEqual: "gte",
  lessThan: "lt",
  lessThanOrEqual: "lte",
  includes: "in",
  notIncludes: "notIn",
  matchesRegex: "matches",
  inList: "in",
  between: "between",
};

export const REQUIRED_FIELDS: (keyof RdlRuleDefinition)[] = [
  "id", "name", "description", "documentType",
  "category", "severity", "condition", "evidence",
  "message", "recommendation",
];

export const OPERATOR_VALUE_TYPES: Partial<Record<RdlOperator, string>> = {
  exists: "none (ignored)",
  notExists: "none (ignored)",
  equals: "any",
  notEquals: "any",
  greaterThan: "number",
  greaterThanOrEqual: "number",
  lessThan: "number",
  lessThanOrEqual: "number",
  includes: "array",
  notIncludes: "array",
  matchesRegex: "string (regex pattern)",
  inList: "array",
  between: "array [min, max]",
};
