import type { DocumentType, DocumentEvidence } from "../types/document-types";

export interface DocumentEntity {
  entityId: string;
  type: string;
  value: string;
  confidence: number;
  sourceField: string;
}

export interface DocumentRelationship {
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: string;
  confidence: number;
}

export interface RiskSignal {
  signalId: string;
  type: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  sourceField: string;
}

export interface DocumentKnowledge {
  documentId: string;
  documentType: DocumentType;
  entities: DocumentEntity[];
  relationships: DocumentRelationship[];
  observations: string[];
  riskSignals: RiskSignal[];
  auditEvidence: DocumentEvidence[];
}

export function createEmptyKnowledge(
  documentId: string,
  documentType: DocumentType
): DocumentKnowledge {
  return {
    documentId,
    documentType,
    entities: [],
    relationships: [],
    observations: [],
    riskSignals: [],
    auditEvidence: [],
  };
}
