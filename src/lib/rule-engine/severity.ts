export enum Severity {
  Info = "info",
  Warning = "warning",
  Error = "error",
  Critical = "critical",
}

export const SEVERITY_ORDER: Severity[] = [
  Severity.Info,
  Severity.Warning,
  Severity.Error,
  Severity.Critical,
];

export function severityWeight(s: Severity): number {
  switch (s) {
    case Severity.Info: return 1;
    case Severity.Warning: return 2;
    case Severity.Error: return 3;
    case Severity.Critical: return 4;
  }
}
