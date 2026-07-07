import type { RdlRuleDefinition, RdlValidationError, RdlOperator, RdlCategory, RdlSeverity } from "./types";
import { VALID_CATEGORIES, VALID_SEVERITIES, VALID_OPERATORS, REQUIRED_FIELDS, OPERATOR_VALUE_TYPES } from "./schema";
import { RdlValidationErrorSet } from "./errors";

export function validateRdlRule(raw: unknown, index: number): RdlRuleDefinition {
  const errors: RdlValidationError[] = [];
  const path = `rules[${index}]`;

  if (!raw || typeof raw !== "object") {
    throw new RdlValidationErrorSet([{ path, message: "Rule must be a non-null object", code: "INVALID_TYPE" }]);
  }

  const rule = raw as Record<string, unknown>;

  for (const field of REQUIRED_FIELDS) {
    if (rule[field] === undefined || rule[field] === null) {
      errors.push({ path: `${path}.${field}`, message: `Missing required field: ${field}`, code: "MISSING_FIELD" });
    }
  }

  if (typeof rule.id !== "string" || !rule.id.trim()) {
    errors.push({ path: `${path}.id`, message: "id must be a non-empty string", code: "INVALID_ID" });
  }

  if (typeof rule.name !== "string" || !rule.name.trim()) {
    errors.push({ path: `${path}.name`, message: "name must be a non-empty string", code: "INVALID_NAME" });
  }

  if (typeof rule.description !== "string") {
    errors.push({ path: `${path}.description`, message: "description must be a string", code: "INVALID_DESCRIPTION" });
  }

  if (typeof rule.documentType !== "string" || !rule.documentType.trim()) {
    errors.push({ path: `${path}.documentType`, message: "documentType must be a non-empty string", code: "INVALID_DOCUMENT_TYPE" });
  }

  if (!VALID_CATEGORIES.includes(rule.category as RdlCategory)) {
    errors.push({ path: `${path}.category`, message: `Invalid category. Valid: ${VALID_CATEGORIES.join(", ")}`, code: "INVALID_CATEGORY" });
  }

  if (!VALID_SEVERITIES.includes(rule.severity as RdlSeverity)) {
    errors.push({ path: `${path}.severity`, message: `Invalid severity. Valid: ${VALID_SEVERITIES.join(", ")}`, code: "INVALID_SEVERITY" });
  }

  if (rule.enabled !== undefined && typeof rule.enabled !== "boolean") {
    errors.push({ path: `${path}.enabled`, message: "enabled must be a boolean if provided", code: "INVALID_ENABLED" });
  }

  if (!rule.condition || typeof rule.condition !== "object") {
    errors.push({ path: `${path}.condition`, message: "condition must be an object", code: "MISSING_CONDITION" });
  } else {
    const cond = rule.condition as Record<string, unknown>;

    if (typeof cond.field !== "string" || !cond.field.trim()) {
      errors.push({ path: `${path}.condition.field`, message: "condition.field must be a non-empty string", code: "INVALID_CONDITION_FIELD" });
    }

    if (!VALID_OPERATORS.includes(cond.operator as RdlOperator)) {
      errors.push({ path: `${path}.condition.operator`, message: `Invalid operator. Valid: ${VALID_OPERATORS.join(", ")}`, code: "INVALID_OPERATOR" });
    }

    const valType = OPERATOR_VALUE_TYPES[cond.operator as RdlOperator];
    if (valType && valType !== "none (ignored)" && valType !== "any") {
      if (valType === "number" && typeof cond.value !== "number") {
        errors.push({ path: `${path}.condition.value`, message: `Operator "${cond.operator}" requires a number value`, code: "INVALID_VALUE_TYPE" });
      }
      if (valType === "array" && !Array.isArray(cond.value)) {
        errors.push({ path: `${path}.condition.value`, message: `Operator "${cond.operator}" requires an array value`, code: "INVALID_VALUE_TYPE" });
      }
      if (valType === "string (regex pattern)" && typeof cond.value !== "string") {
        errors.push({ path: `${path}.condition.value`, message: `Operator "${cond.operator}" requires a string regex pattern`, code: "INVALID_VALUE_TYPE" });
      }
    }
  }

  if (!rule.evidence || typeof rule.evidence !== "object") {
    errors.push({ path: `${path}.evidence`, message: "evidence must be an object", code: "MISSING_EVIDENCE" });
  } else {
    const ev = rule.evidence as Record<string, unknown>;
    if (typeof ev.sourceField !== "string") {
      errors.push({ path: `${path}.evidence.sourceField`, message: "evidence.sourceField must be a string", code: "INVALID_EVIDENCE_SOURCE_FIELD" });
    }
    if (typeof ev.expected !== "string") {
      errors.push({ path: `${path}.evidence.expected`, message: "evidence.expected must be a string", code: "INVALID_EVIDENCE_EXPECTED" });
    }
    if (typeof ev.recommendation !== "string") {
      errors.push({ path: `${path}.evidence.recommendation`, message: "evidence.recommendation must be a string", code: "INVALID_EVIDENCE_RECOMMENDATION" });
    }
  }

  if (typeof rule.message !== "string") {
    errors.push({ path: `${path}.message`, message: "message must be a string", code: "INVALID_MESSAGE" });
  }

  if (typeof rule.recommendation !== "string") {
    errors.push({ path: `${path}.recommendation`, message: "recommendation must be a string", code: "INVALID_RECOMMENDATION" });
  }

  if (errors.length > 0) {
    throw new RdlValidationErrorSet(errors);
  }

  return {
    id: rule.id as string,
    name: rule.name as string,
    description: rule.description as string,
    documentType: rule.documentType as string,
    category: rule.category as RdlCategory,
    severity: rule.severity as RdlSeverity,
    enabled: rule.enabled !== false,
    condition: {
      field: (rule.condition as Record<string, unknown>).field as string,
      operator: (rule.condition as Record<string, unknown>).operator as RdlOperator,
      value: (rule.condition as Record<string, unknown>).value,
    },
    evidence: {
      sourceField: (rule.evidence as Record<string, unknown>).sourceField as string,
      expected: (rule.evidence as Record<string, unknown>).expected as string,
      recommendation: (rule.evidence as Record<string, unknown>).recommendation as string,
    },
    message: rule.message as string,
    recommendation: rule.recommendation as string,
  };
}

export function validateRdlRules(rules: unknown[]): RdlRuleDefinition[] {
  const allErrors: RdlValidationError[] = [];

  const validated = rules.map((raw, i) => {
    try {
      return validateRdlRule(raw, i);
    } catch (err) {
      if (err instanceof RdlValidationErrorSet) {
        allErrors.push(...err.errors);
      } else {
        allErrors.push({ path: `rules[${i}]`, message: String(err), code: "UNKNOWN_ERROR" });
      }
      return null;
    }
  });

  if (allErrors.length > 0) {
    throw new RdlValidationErrorSet(allErrors);
  }

  return validated.filter((r): r is RdlRuleDefinition => r !== null);
}
