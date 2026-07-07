import type { RuleContext, RuleResult } from "./types";
import { ruleRegistry } from "./registry";
import { buildEngineResult, type EngineResult } from "./result";

export class RuleExecutor {
  executeAll(ctx: RuleContext): EngineResult {
    const rules = ruleRegistry.getEnabledByDocumentType(ctx.documentType);
    const results: RuleResult[] = rules.map((rule) => rule.execute(ctx));
    return buildEngineResult(results);
  }

  executeByCategory(ctx: RuleContext, category: string): EngineResult {
    const rules = ruleRegistry
      .getEnabledByDocumentType(ctx.documentType)
      .filter((r) => r.category === category);
    const results: RuleResult[] = rules.map((rule) => rule.execute(ctx));
    return buildEngineResult(results);
  }

  executeRuleIds(ctx: RuleContext, ruleIds: string[]): EngineResult {
    const results: RuleResult[] = [];
    for (const id of ruleIds) {
      const rule = ruleRegistry.get(id);
      if (rule) {
        results.push(rule.execute(ctx));
      }
    }
    return buildEngineResult(results);
  }
}
