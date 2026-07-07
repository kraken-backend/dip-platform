import { Rule } from "./rule";
import type { RuleDefinition } from "./types";

class RuleRegistry {
  private rules = new Map<string, Rule>();

  register(def: RuleDefinition): Rule {
    if (this.rules.has(def.id)) {
      throw new Error(`Rule "${def.id}" is already registered`);
    }
    const rule = new Rule(def);
    this.rules.set(def.id, rule);
    return rule;
  }

  get(id: string): Rule | undefined {
    return this.rules.get(id);
  }

  getAll(): Rule[] {
    return Array.from(this.rules.values());
  }

  getByDocumentType(documentType: string): Rule[] {
    return this.getAll().filter((r) => r.documentType === documentType);
  }

  getEnabled(): Rule[] {
    return this.getAll().filter((r) => r.enabled);
  }

  getEnabledByDocumentType(documentType: string): Rule[] {
    return this.getByDocumentType(documentType).filter((r) => r.enabled);
  }

  disable(id: string): boolean {
    const rule = this.rules.get(id);
    if (!rule) return false;
    this.rules.set(id, new Rule({ ...toDef(rule), enabled: false }));
    return true;
  }

  enable(id: string): boolean {
    const rule = this.rules.get(id);
    if (!rule) return false;
    this.rules.set(id, new Rule({ ...toDef(rule), enabled: true }));
    return true;
  }

  clear(): void {
    this.rules.clear();
  }

  get count(): number {
    return this.rules.size;
  }
}

function toDef(rule: Rule): RuleDefinition {
  return {
    id: rule.id,
    name: rule.name,
    description: rule.description,
    documentType: rule.documentType,
    category: rule.category,
    severity: rule.severity,
    condition: { field: "", operator: "exists", value: true },
    evidence: { field: "", expected: "", actual: "", message: "", severity: rule.severity, recommendation: "" },
    enabled: rule.enabled,
  };
}

export const ruleRegistry = new RuleRegistry();
