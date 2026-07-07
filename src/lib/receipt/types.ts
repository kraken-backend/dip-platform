export type { DocumentType, ProviderType } from "@/lib/document/types";

export enum ProcessingOption {
  OcrOnly = 1,
  OcrAndValidation = 2,
  OcrAndFraud = 3,
  FullPlatform = 4,
}

export enum PipelineStageName {
  Ocr = "OCR",
  Normalization = "NORMALIZATION",
  Canonicalization = "CANONICALIZATION",
  Parsing = "PARSING",
  Confidence = "CONFIDENCE",
  Validation = "VALIDATION",
  Fraud = "FRAUD",
  Analytics = "ANALYTICS",
}

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

export interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ParsedReceipt {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  date: string;
  time: string;
  receiptNumber: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  cashier: string;
}

export interface ValidationIssue {
  field: string;
  message: string;
  severity: "error" | "warning" | "info";
  expected?: string;
  actual?: string;
}

export interface ValidationResult {
  valid: boolean;
  score: number;
  issues: ValidationIssue[];
  warnings: string[];
  passedChecks: string[];
  evidence: EvidenceItem[];
}

export interface FraudFlag {
  type: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  confidence: number;
}

export interface FraudResult {
  score: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  flags: FraudFlag[];
  summary: string;
  recommendedAction: string;
  evidence: EvidenceItem[];
}

export interface AnalyticsData {
  totalReceiptsProcessed: number;
  averageConfidence: number;
  validationPassRate: number;
  fraudDetectionRate: number;
  totalAmountProcessed: number;
  topStores: { name: string; count: number; total: number }[];
  dailyVolume: { date: string; count: number; total: number }[];
  processingTimeAvg: number;
}

export interface AiInsight {
  category: string;
  insight: string;
  impact: "positive" | "negative" | "neutral";
  recommendation: string;
}

export interface PipelineStage {
  stage: PipelineStageName;
  status: "success" | "skipped" | "error";
  durationMs: number;
  message: string;
}

export type PipelineTrace = PipelineStage[];

export interface NormalizationResult {
  originalText: string;
  normalizedText: string;
  notes: string[];
}

export interface LineItemCandidate {
  raw: string;
  normalized: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  confidence: number;
}

export interface CandidateField<T> {
  raw: string;
  normalized: T;
  confidence: number;
}

export interface CanonicalReceipt {
  documentId: string;
  documentType: "receipt" | "invoice" | "unknown";
  sourceFileName: string;
  rawText: string;
  normalizedText: string;
  detectedLanguage: string;
  merchantCandidate: CandidateField<string>;
  transactionNumberCandidate: CandidateField<string>;
  transactionDateCandidate: CandidateField<string>;
  transactionTimeCandidate: CandidateField<string>;
  totalCandidate: CandidateField<number>;
  currency: string;
  lineItemsCandidate: LineItemCandidate[];
  metadata: Record<string, string>;
  overallConfidence: number;
}

export interface FieldConfidence {
  field: string;
  value: string | number;
  confidence: number;
  reason: string;
}

export interface ConfidenceResult {
  merchant: FieldConfidence;
  transactionNumber: FieldConfidence;
  date: FieldConfidence;
  time: FieldConfidence;
  total: FieldConfidence;
  tax: FieldConfidence;
  paymentMethod: FieldConfidence;
  items: FieldConfidence;
  overall: number;
}

export interface EvidenceItem {
  evidenceId: string;
  type: "validation" | "fraud" | "info";
  message: string;
  sourceField: string;
  sourceValue: string;
  severity: "error" | "warning" | "info" | "critical" | "high" | "medium" | "low";
  confidence: number;
  relatedReceiptId?: string;
}

export interface ProcessingResult {
  option: ProcessingOption;
  fileName: string;
  fileSize: number;
  timestamp: string;
  ocr: RawOcrResult;
  canonical: CanonicalReceipt;
  parsed: ParsedReceipt;
  confidence: ConfidenceResult;
  validation?: ValidationResult;
  fraud?: FraudResult;
  analytics?: AnalyticsData;
  insights?: AiInsight[];
  pipelineTrace: PipelineTrace;
  groundTruthComparison?: GroundTruthComparisonResult;
}

export interface DemoReceipt {
  id: string;
  fileName: string;
  storeName: string;
  ocrResult: RawOcrResult;
  parsed: ParsedReceipt;
  validation: ValidationResult;
  fraud: FraudResult;
}

export interface GroundTruthData {
  receiptId: string;
  groundTruth: ParsedReceipt;
}

export interface ReceiptMetadata {
  receiptId: string;
  title: string;
  description: string;
  category: string;
  country: string;
  currency: string;
  scenario: string;
  risk: string;
  tags: string[];
}

export interface DatasetReceiptEntry {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  groundTruthPath: string;
  metadataPath: string;
  category: string;
  country: string;
  currency: string;
  scenario: string;
  risk: string;
}

export interface DatasetManifest {
  version: string;
  description: string;
  totalReceipts: number;
  receipts: DatasetReceiptEntry[];
}

export interface GroundTruthComparison {
  field: string;
  expected: string;
  actual: string;
  match: "exact" | "partial" | "none";
  confidence: number;
}

export interface GroundTruthComparisonResult {
  overallMatchRate: number;
  totalFields: number;
  matchedFields: number;
  partialFields: number;
  mismatchedFields: number;
  comparisons: GroundTruthComparison[];
}
