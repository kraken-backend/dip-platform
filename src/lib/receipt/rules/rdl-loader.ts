import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { compileRdlRules } from "@/lib/rule-engine/rdl/compiler";
import { validateRdlRules } from "@/lib/rule-engine/rdl/validator";
import { RdlLoadError, RdlValidationErrorSet } from "@/lib/rule-engine/rdl/errors";
import { ruleRegistry } from "@/lib/rule-engine/registry";
import type { RuleDefinition } from "@/lib/rule-engine/types";

const RDL_DEFINITIONS_DIR = join(process.cwd(), "src/lib/receipt/rules/definitions");

export function loadRdlFileSync(filePath: string): RuleDefinition[] {
  const content = readFileSync(filePath, "utf-8");
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch (err) {
    throw new RdlLoadError(filePath, `Invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!Array.isArray(parsed)) {
    throw new RdlLoadError(filePath, "RDL file must contain a JSON array");
  }

  try {
    const rdlRules = validateRdlRules(parsed);
    return compileRdlRules(rdlRules);
  } catch (err) {
    if (err instanceof RdlValidationErrorSet) {
      throw new RdlLoadError(filePath, `Validation failed with ${err.errors.length} error(s)`);
    }
    throw err;
  }
}

export function loadRdlDirectorySync(dirPath: string): RuleDefinition[] {
  if (!existsSync(dirPath)) {
    throw new RdlLoadError(dirPath, "Directory does not exist");
  }

  const files = readdirSync(dirPath).filter((f) => f.endsWith(".json"));
  const all: RuleDefinition[] = [];

  for (const file of files) {
    const filePath = join(dirPath, file);
    const rules = loadRdlFileSync(filePath);
    all.push(...rules);
  }

  return all;
}

export function registerReceiptRdlRules(): { registered: number; skipped: number } {
  let registered = 0;
  let skipped = 0;

  try {
    const rules = loadRdlDirectorySync(RDL_DEFINITIONS_DIR);
    for (const def of rules) {
      try {
        ruleRegistry.register(def);
        registered++;
      } catch {
        skipped++;
      }
    }
  } catch (err) {
    console.warn("[RDL] Failed to load receipt rules:", err instanceof Error ? err.message : String(err));
  }

  return { registered, skipped };
}
