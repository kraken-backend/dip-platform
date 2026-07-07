import type { RuleDefinition, RuleResult, RuleContext } from "./types";
import type { Severity } from "./severity";
import { evaluateCondition } from "./operators";

export class Rule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly documentType: string;
  readonly category: RuleDefinition["category"];
  readonly severity: Severity;
  readonly enabled: boolean;

  private readonly condition: RuleDefinition["condition"];
  private readonly evidenceTemplate: RuleDefinition["evidence"];

  constructor(def: RuleDefinition) {
    this.id = def.id;
    this.name = def.name;
    this.description = def.description;
    this.documentType = def.documentType;
    this.category = def.category;
    this.severity = def.severity;
    this.enabled = def.enabled;
    this.condition = def.condition;
    this.evidenceTemplate = def.evidence;
  }

  execute(ctx: RuleContext): RuleResult {
    const t0 = performance.now();

    if (!this.enabled) {
      return {
        ruleId: this.id,
        ruleName: this.name,
        status: "skipped",
        severity: this.severity,
        evidence: null,
        executionTimeMs: Math.round(performance.now() - t0),
        message: `Rule "${this.name}" is disabled`,
      };
    }

    const passed = evaluateCondition(
      this.condition.field,
      this.condition.operator,
      this.condition.value,
      ctx
    );

    if (passed) {
      return {
        ruleId: this.id,
        ruleName: this.name,
        status: "passed",
        severity: this.severity,
        evidence: null,
        executionTimeMs: Math.round(performance.now() - t0),
        message: `Rule "${this.name}" passed`,
      };
    }

    const actualValue = resolveFieldValue(this.condition.field, ctx.data);

    return {
      ruleId: this.id,
      ruleName: this.name,
      status: "failed",
      severity: this.severity,
      evidence: {
        ruleId: this.id,
        field: this.evidenceTemplate.field,
        expected: this.evidenceTemplate.expected,
        actual: String(actualValue ?? ""),
        message: this.evidenceTemplate.message,
        severity: this.severity,
        recommendation: this.evidenceTemplate.recommendation,
      },
      executionTimeMs: Math.round(performance.now() - t0),
      message: `Rule "${this.name}" failed: ${this.evidenceTemplate.message}`,
    };
  }
}

function resolveFieldValue(field: string, data: Record<string, unknown>): unknown {
  const parts = field.split(".");
  let current: unknown = data;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}
