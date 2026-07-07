export enum DocumentType {
  Receipt = "receipt",
  Invoice = "invoice",
  Voucher = "voucher",
  TaxInvoice = "tax-invoice",
  Ktp = "ktp",
  Npwp = "npwp",
  Sim = "sim",
  Passport = "passport",
  DeliveryOrder = "delivery-order",
  PurchaseOrder = "purchase-order",
  Unknown = "unknown",
}

export enum ProcessingStage {
  Acquire = "ACQUIRE",
  Ocr = "OCR",
  Normalize = "NORMALIZE",
  Canonicalize = "CANONICALIZE",
  Parse = "PARSE",
  ScoreConfidence = "CONFIDENCE",
  Validate = "VALIDATE",
  ComputeSimilarity = "SIMILARITY",
  DetectFraud = "FRAUD",
  BuildKnowledge = "KNOWLEDGE",
  Analyze = "ANALYZE",
}

export type ProviderType =
  | "demo"
  | "tesseract"
  | "google-vision"
  | "azure-vision"
  | "aws-textract"
  | "llm-vision";

export type PipelineStageStatus = "success" | "skipped" | "error";

export interface RawOcrLine {
  text: string;
  confidence: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export interface RawOcrResult {
  rawText: string;
  lines: RawOcrLine[];
  confidence: number;
  processingTimeMs: number;
  language: string;
}

export interface ExtractedField {
  name: string;
  raw: string;
  normalized: string;
  confidence: number;
}

export interface DocumentSource {
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface DocumentIdentity {
  documentId: string;
  contentHash: string;
  visualFingerprint: string;
  sourceFileName: string;
  uploadedAt: string;
  version: number;
}

export interface DocumentEvidence {
  evidenceId: string;
  type: "validation" | "fraud" | "info";
  message: string;
  sourceField: string;
  sourceValue: string;
  severity: "error" | "warning" | "info" | "critical" | "high" | "medium" | "low";
  confidence: number;
  relatedDocumentId?: string;
}

export interface DocumentFieldConfidence {
  field: string;
  value: string | number;
  confidence: number;
  reason: string;
}

export interface DocumentConfidence {
  fields: DocumentFieldConfidence[];
  overall: number;
}

export interface DocumentPipelineStage {
  stage: ProcessingStage;
  status: PipelineStageStatus;
  durationMs: number;
  message: string;
}

export type DocumentPipelineTrace = DocumentPipelineStage[];
