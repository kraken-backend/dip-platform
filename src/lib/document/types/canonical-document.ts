import type {
  DocumentType,
  DocumentSource,
  DocumentIdentity,
  ExtractedField,
  DocumentPipelineStage,
} from "./document-types";

export interface CanonicalDocument {
  documentId: string;
  documentType: DocumentType;
  source: DocumentSource;
  rawContent: string;
  normalizedContent: string;
  extractedCandidates: ExtractedField[];
  metadata: Record<string, string>;
  confidence: number;
  identity: DocumentIdentity;
  pipelineTrace?: DocumentPipelineStage[];
}

export type DocumentCandidate<T> = {
  raw: string;
  normalized: T;
  confidence: number;
};

export interface LineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
