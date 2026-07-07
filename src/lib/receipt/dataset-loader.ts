import fs from "fs";
import path from "path";
import type {
  DatasetManifest,
  DatasetReceiptEntry,
  GroundTruthData,
  ReceiptMetadata,
  ParsedReceipt,
  GroundTruthComparison,
  GroundTruthComparisonResult,
} from "./types";

const RECEIPTS_DIR = path.join(process.cwd(), "public", "receipts");

let manifestCache: DatasetManifest | null = null;

export function loadManifest(): DatasetManifest {
  if (manifestCache) return manifestCache;
  const manifestPath = path.join(RECEIPTS_DIR, "manifest.json");
  const raw = fs.readFileSync(manifestPath, "utf-8");
  manifestCache = JSON.parse(raw) as DatasetManifest;
  return manifestCache;
}

export function getReceipts(): DatasetReceiptEntry[] {
  return loadManifest().receipts;
}

export function getReceiptById(id: string): DatasetReceiptEntry | undefined {
  return getReceipts().find((r) => r.id === id);
}

export function loadGroundTruth(id: string): GroundTruthData | null {
  try {
    const filePath = path.join(RECEIPTS_DIR, `${id}.json`);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadMetadata(id: string): ReceiptMetadata | null {
  try {
    const filePath = path.join(RECEIPTS_DIR, `${id}.meta.json`);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearManifestCache(): void {
  manifestCache = null;
}

const COMPARISON_FIELDS: { key: keyof ParsedReceipt; label: string }[] = [
  { key: "storeName", label: "Store Name" },
  { key: "storeAddress", label: "Store Address" },
  { key: "storePhone", label: "Store Phone" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "receiptNumber", label: "Receipt Number" },
  { key: "subtotal", label: "Subtotal" },
  { key: "tax", label: "Tax" },
  { key: "discount", label: "Discount" },
  { key: "total", label: "Total" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "cashier", label: "Cashier" },
];

function compareValue(expected: unknown, actual: unknown): { match: "exact" | "partial" | "none"; confidence: number } {
  if (expected === actual) {
    return { match: "exact", confidence: 1.0 };
  }

  const exp = String(expected ?? "").toLowerCase().trim();
  const act = String(actual ?? "").toLowerCase().trim();

  if (exp === act) {
    return { match: "exact", confidence: 1.0 };
  }

  if (exp.includes(act) || act.includes(exp)) {
    return { match: "partial", confidence: 0.7 };
  }

  if (typeof expected === "number" && typeof actual === "number") {
    const diff = Math.abs(expected - actual);
    const ratio = diff / Math.max(Math.abs(expected), 1);
    if (ratio < 0.01) return { match: "exact", confidence: 0.98 };
    if (ratio < 0.1) return { match: "partial", confidence: 0.6 };
  }

  return { match: "none", confidence: 0.0 };
}

export function compareReceiptWithGroundTruth(
  parsed: ParsedReceipt,
  groundTruth: ParsedReceipt
): GroundTruthComparisonResult {
  const comparisons: GroundTruthComparison[] = [];

  for (const field of COMPARISON_FIELDS) {
    const expectedVal = groundTruth[field.key];
    const actualVal = parsed[field.key];
    const expected = typeof expectedVal === "number" ? String(expectedVal) : (expectedVal as string);
    const actual = typeof actualVal === "number" ? String(actualVal) : (actualVal as string);
    const { match, confidence } = compareValue(expectedVal, actualVal);

    comparisons.push({
      field: field.label,
      expected,
      actual,
      match,
      confidence,
    });
  }

  const matchedFields = comparisons.filter((c) => c.match === "exact").length;
  const partialFields = comparisons.filter((c) => c.match === "partial").length;
  const mismatchedFields = comparisons.filter((c) => c.match === "none").length;
  const totalFields = comparisons.length;

  const overallMatchRate = totalFields > 0
    ? Math.round(((matchedFields + partialFields * 0.5) / totalFields) * 100) / 100
    : 0;

  return {
    overallMatchRate,
    totalFields,
    matchedFields,
    partialFields,
    mismatchedFields,
    comparisons,
  };
}
