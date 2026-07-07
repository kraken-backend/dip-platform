import type { RuleEvidence } from "./types";
import type { Severity } from "./severity";

export function createRuleEvidence(params: {
  ruleId: string;
  field: string;
  expected: string;
  actual: string;
  message: string;
  severity: Severity;
  recommendation: string;
}): RuleEvidence {
  return { ...params };
}
