import { RuleExecutor } from "./executor";
import { ruleRegistry } from "./registry";
import type { RuleDefinition, RuleContext } from "./types";
import type { EngineResult } from "./result";

export { RuleExecutor } from "./executor";
export { ruleRegistry } from "./registry";
export { Rule } from "./rule";
export { Severity } from "./severity";
export { evaluateCondition } from "./operators";
export { buildEngineResult } from "./result";
export type {
  RuleDefinition,
  RuleContext,
  RuleResult,
  RuleEvidence,
  RuleCondition,
  RuleCategory,
  ExecutionStatus,
  ComparisonOperator,
} from "./types";
export type { EngineResult } from "./result";

export class RuleEngine {
  private executor: RuleExecutor;

  constructor() {
    this.executor = new RuleExecutor();
  }

  register(def: RuleDefinition): void {
    ruleRegistry.register(def);
  }

  evaluate(ctx: RuleContext): EngineResult {
    return this.executor.executeAll(ctx);
  }

  evaluateByCategory(ctx: RuleContext, category: string): EngineResult {
    return this.executor.executeByCategory(ctx, category);
  }

  evaluateRuleIds(ctx: RuleContext, ruleIds: string[]): EngineResult {
    return this.executor.executeRuleIds(ctx, ruleIds);
  }

  getRegistry() {
    return ruleRegistry;
  }
}
