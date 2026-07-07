import type { ComparisonOperator, RuleContext } from "./types";

export function evaluateCondition(
  field: string,
  operator: ComparisonOperator,
  value: unknown,
  ctx: RuleContext
): boolean {
  const actual = resolveField(field, ctx.data);

  switch (operator) {
    case "eq":
      return actual === value;
    case "neq":
      return actual !== value;
    case "gt":
      return typeof actual === "number" && typeof value === "number" && actual > value;
    case "gte":
      return typeof actual === "number" && typeof value === "number" && actual >= value;
    case "lt":
      return typeof actual === "number" && typeof value === "number" && actual < value;
    case "lte":
      return typeof actual === "number" && typeof value === "number" && actual <= value;
    case "in":
      return Array.isArray(value) && value.includes(actual);
    case "notIn":
      return Array.isArray(value) && !value.includes(actual);
    case "matches":
      return typeof actual === "string" && typeof value === "string" && new RegExp(value).test(actual);
    case "exists":
      return actual !== undefined && actual !== null && actual !== "";
    case "isEmpty":
      return actual === undefined || actual === null || actual === "";
    case "between":
      return (
        Array.isArray(value) &&
        value.length === 2 &&
        typeof actual === "number" &&
        typeof value[0] === "number" &&
        typeof value[1] === "number" &&
        actual >= value[0] &&
        actual <= value[1]
      );
    default:
      return false;
  }
}

function resolveField(field: string, data: Record<string, unknown>): unknown {
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
