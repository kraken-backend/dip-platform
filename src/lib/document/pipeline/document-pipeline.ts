import { ProcessingStage } from "../types/document-types";
import type {
  RawOcrResult,
  DocumentSource,
  DocumentPipelineStage,
  DocumentPipelineTrace,
} from "../types/document-types";
import type { CanonicalDocument } from "../types/canonical-document";

export interface PipelineContext {
  source: DocumentSource;
  rawOcr: RawOcrResult | null;
  normalizedText: string | null;
  canonical: CanonicalDocument | null;
  parsed: unknown | null;
  confidence: unknown | null;
  validation: unknown | null;
  fraud: unknown | null;
  knowledge: unknown | null;
  similarity: unknown | null;
  analytics: unknown | null;
  insights: unknown | null;
}

export interface PipelineHandler {
  readonly stage: ProcessingStage;
  execute(ctx: PipelineContext): Promise<PipelineContext>;
}

export class DocumentPipeline {
  private stages: PipelineHandler[] = [];
  private trace: DocumentPipelineTrace = [];

  addStage(handler: PipelineHandler): this {
    this.stages.push(handler);
    return this;
  }

  getTrace(): DocumentPipelineTrace {
    return [...this.trace];
  }

  async execute(initial: PipelineContext): Promise<{
    context: PipelineContext;
    trace: DocumentPipelineTrace;
  }> {
    let ctx = initial;
    this.trace = [];

    for (const handler of this.stages) {
      const t0 = performance.now();
      try {
        ctx = await handler.execute(ctx);
        const durationMs = Math.round(performance.now() - t0);
        this.trace.push({
          stage: handler.stage,
          status: "success",
          durationMs,
          message: `${handler.stage} completed`,
        });
      } catch (err) {
        const durationMs = Math.round(performance.now() - t0);
        this.trace.push({
          stage: handler.stage,
          status: "error",
          durationMs,
          message: err instanceof Error ? err.message : "Unknown error",
        });
        break;
      }
    }

    return { context: ctx, trace: this.getTrace() };
  }
}

export function createStage(
  stage: ProcessingStage,
  status: DocumentPipelineStage["status"],
  startTime: number,
  message: string
): DocumentPipelineStage {
  const durationMs = Math.round(performance.now() - startTime);
  return { stage, status, durationMs, message };
}
