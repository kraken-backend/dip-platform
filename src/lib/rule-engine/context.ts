import type { RuleContext } from "./types";

export function createRuleContext(
  documentType: string,
  data: Record<string, unknown>,
  metadata?: Record<string, unknown>
): RuleContext {
  return { documentType, data, metadata };
}
