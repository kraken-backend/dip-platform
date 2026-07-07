import type { RdlRuleDefinition } from "./types";
import type { RuleDefinition, ComparisonOperator } from "@/lib/rule-engine/types";
import { Severity } from "@/lib/rule-engine/severity";
import { ENGINE_OPERATOR_MAP } from "./schema";

export function compileRdlRule(rdl: RdlRuleDefinition): RuleDefinition {
  const engineOperator = ENGINE_OPERATOR_MAP[rdl.condition.operator];

  return {
    id: rdl.id,
    name: rdl.name,
    description: rdl.description,
    documentType: rdl.documentType,
    category: rdl.category,
    severity: mapSeverity(rdl.severity),
    enabled: rdl.enabled ?? true,
    condition: {
      field: rdl.condition.field,
      operator: engineOperator as ComparisonOperator,
      value: rdl.condition.value,
    },
    evidence: {
      field: rdl.evidence.sourceField,
      expected: rdl.evidence.expected,
      actual: "",
      message: rdl.message,
      severity: mapSeverity(rdl.severity),
      recommendation: rdl.recommendation,
    },
  };
}

export function compileRdlRules(rdlRules: RdlRuleDefinition[]): RuleDefinition[] {
  return rdlRules.map(compileRdlRule);
}

function mapSeverity(s: RdlRuleDefinition["severity"]): Severity {
  switch (s) {
    case "critical": return Severity.Critical;
    case "error": return Severity.Error;
    case "warning": return Severity.Warning;
    case "info": return Severity.Info;
  }
}
