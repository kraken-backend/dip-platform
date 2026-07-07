import type { RdlLoadResult } from "./types";
import { validateRdlRules } from "./validator";
import { compileRdlRules } from "./compiler";
import { RdlValidationErrorSet, RdlLoadError } from "./errors";
import type { RuleDefinition } from "@/lib/rule-engine/types";

export function loadRdlFile(content: string, source: string): RdlLoadResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    throw new RdlLoadError(source, `Invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!Array.isArray(parsed)) {
    throw new RdlLoadError(source, "RDL file must contain a JSON array of rule definitions");
  }

  try {
    const rules = validateRdlRules(parsed);
    return { rules, errors: [], source };
  } catch (err) {
    if (err instanceof RdlValidationErrorSet) {
      return { rules: [], errors: err.errors, source };
    }
    throw err;
  }
}

export function loadRdlRules(content: string, source: string): RuleDefinition[] {
  const result = loadRdlFile(content, source);
  if (result.errors.length > 0) {
    throw new RdlLoadError(source, `Validation failed with ${result.errors.length} error(s)`);
  }
  return compileRdlRules(result.rules);
}

export { RdlLoadError, RdlValidationErrorSet };
