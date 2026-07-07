import type { DocumentIdentity } from "../types/document-types";
import { createHash } from "crypto";

export interface SimilarityResult {
  score: number;
  matchedFields: string[];
  mismatchedFields: string[];
  method: "exact" | "fuzzy" | "field-comparison";
}

export function computeDocumentFingerprint(
  identity: DocumentIdentity
): string {
  return identity.contentHash;
}

export function computeContentHash(content: string): string {
  const normalized = content.replace(/\s+/g, " ").trim().toLowerCase();
  return createHash("sha256").update(normalized).digest("hex");
}

export function compareDocuments(
  docA: { content: string; identity: DocumentIdentity },
  docB: { content: string; identity: DocumentIdentity }
): SimilarityResult {
  const hashA = computeContentHash(docA.content);
  const hashB = computeContentHash(docB.content);

  if (hashA === hashB) {
    return {
      score: 1.0,
      matchedFields: ["content"],
      mismatchedFields: [],
      method: "exact",
    };
  }

  const wordsA = new Set(docA.content.toLowerCase().split(/\s+/));
  const wordsB = new Set(docB.content.toLowerCase().split(/\s+/));
  const intersection = new Set([...wordsA].filter((w) => wordsB.has(w)));
  const union = new Set([...wordsA, ...wordsB]);

  const jaccard =
    union.size > 0 ? intersection.size / union.size : 0;

  return {
    score: Math.round(jaccard * 100) / 100,
    matchedFields: intersection.size > 0 ? ["content"] : [],
    mismatchedFields: hashA !== hashB ? ["content-hash"] : [],
    method: "fuzzy",
  };
}

export function compareFieldSimilarity(
  fieldA: string,
  fieldB: string
): number {
  if (!fieldA || !fieldB) return 0;
  const a = fieldA.toLowerCase().trim();
  const b = fieldB.toLowerCase().trim();
  if (a === b) return 1.0;
  const longer = a.length >= b.length ? a : b;
  const shorter = a.length >= b.length ? b : a;
  if (longer.length === 0) return 1.0;
  const editDist = levenshteinDistance(longer, shorter);
  return (longer.length - editDist) / longer.length;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}
