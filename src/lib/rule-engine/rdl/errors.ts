import type { RdlValidationError } from "./types";

export class RdlValidationErrorSet extends Error {
  readonly errors: RdlValidationError[];

  constructor(errors: RdlValidationError[]) {
    const summary = errors.map((e) => `[${e.code}] ${e.path}: ${e.message}`).join("; ");
    super(`RDL validation failed: ${summary}`);
    this.name = "RdlValidationErrorSet";
    this.errors = errors;
  }
}

export class RdlCompileError extends Error {
  readonly ruleId: string;
  readonly detail: string;

  constructor(ruleId: string, detail: string) {
    super(`RDL compile error for rule "${ruleId}": ${detail}`);
    this.name = "RdlCompileError";
    this.ruleId = ruleId;
    this.detail = detail;
  }
}

export class RdlLoadError extends Error {
  readonly source: string;

  constructor(source: string, message: string) {
    super(`RDL load error from "${source}": ${message}`);
    this.name = "RdlLoadError";
    this.source = source;
  }
}
