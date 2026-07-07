import type { NormalizationResult, CanonicalReceipt, LineItemCandidate } from "./types";
import type { RawOcrResult } from "./types";

let documentCounter = 0;

function generateDocumentId(): string {
  documentCounter++;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = String(documentCounter).padStart(4, "0");
  return `CAN-${dateStr}-${seq}`;
}

function detectLanguage(lines: string[]): string {
  const idKeywords = ["tanggal", "kasir", "pembayaran", "subtotal", "diskon", "ppn", "nota", "tunai", "qris", "terima kasih"];
  const text = lines.join(" ").toLowerCase();
  const idScore = idKeywords.filter((kw) => text.includes(kw)).length;
  return idScore >= 2 ? "id" : "en";
}

function extractMerchantCandidate(lines: string[]): { raw: string; normalized: string; confidence: number } {
  const merchantKeywords = ["summarecon", "food court", "electronic", "fashion", "toko"];
  const topLines = lines.slice(0, 5);

  for (const line of topLines) {
    const hasKeyword = merchantKeywords.some((kw) => line.toLowerCase().includes(kw));
    if (hasKeyword && line.length > 3) {
      return {
        raw: line,
        normalized: line.toUpperCase(),
        confidence: 0.85,
      };
    }
  }

  if (topLines.length > 0 && topLines[0].length > 2) {
    return {
      raw: topLines[0],
      normalized: topLines[0],
      confidence: 0.5,
    };
  }

  return { raw: "", normalized: "", confidence: 0 };
}

function extractTransactionNumber(lines: string[]): { raw: string; normalized: string; confidence: number } {
  const patterns = [
    /(?:No\.?\s*(?:Nota|Invoice|Receipt|Faktur)?\s*:\s*)(.+)/i,
    /(?:INV|FK|FH)-\d{4}-\d{2}-\d{5}/i,
    /(?:INV|FK|FH)-\d{4}-\d{2}-\d{4}/i,
  ];

  for (const line of lines) {
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const value = match[1] || match[0];
        return {
          raw: value.trim(),
          normalized: value.trim(),
          confidence: 0.9,
        };
      }
    }
  }

  return { raw: "", normalized: "", confidence: 0 };
}

function extractDateCandidate(lines: string[]): { raw: string; normalized: string; confidence: number } {
  const dateLine = lines.find((l) => l.toLowerCase().includes("tanggal"));
  if (!dateLine) return { raw: "", normalized: "", confidence: 0 };

  const match = dateLine.match(/(\d{2}\/\d{2}\/\d{4})/);
  if (match) {
    return { raw: match[1], normalized: match[1], confidence: 0.95 };
  }

  return { raw: "", normalized: "", confidence: 0 };
}

function extractTimeCandidate(lines: string[]): { raw: string; normalized: string; confidence: number } {
  const timeLine = lines.find((l) => l.toLowerCase().includes("tanggal") || l.toLowerCase().includes("jam"));
  if (!timeLine) return { raw: "", normalized: "", confidence: 0 };

  const match = timeLine.match(/(\d{2}:\d{2})/);
  if (match) {
    return { raw: match[1], normalized: match[1], confidence: 0.9 };
  }

  return { raw: "", normalized: "", confidence: 0 };
}

function extractTotalCandidate(lines: string[]): { raw: string; normalized: number; confidence: number } {
  const totalLine = lines.find((l) => /^TOTAL/i.test(l.trim()));
  if (!totalLine) return { raw: "", normalized: 0, confidence: 0 };

  const match = totalLine.match(/Rp\s+([\d.]+)/);
  if (match) {
    const value = parseInt(match[1].replace(/\./g, ""), 10);
    return { raw: match[0], normalized: value, confidence: 0.95 };
  }

  return { raw: "", normalized: 0, confidence: 0 };
}

function extractLineItems(lines: string[]): LineItemCandidate[] {
  const items: LineItemCandidate[] = [];
  let inItemsSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "Item:" || trimmed.toLowerCase().startsWith("item")) {
      inItemsSection = true;
      continue;
    }

    if (inItemsSection) {
      if (/^(Subtotal|TOTAL)/i.test(trimmed) || /^[=\-*]{3,}$/.test(trimmed)) {
        break;
      }

      const itemMatch = trimmed.match(/(\d+)x\s+(.+?)\s+Rp\s+([\d.]+)/);
      if (itemMatch) {
        const quantity = parseInt(itemMatch[1], 10);
        const name = itemMatch[2].trim();
        const totalPrice = parseInt(itemMatch[3].replace(/\./g, ""), 10);
        const unitPrice = quantity > 0 ? Math.round(totalPrice / quantity) : totalPrice;

        items.push({
          raw: trimmed,
          normalized: `${quantity}x ${name} @ Rp ${unitPrice.toLocaleString("id-ID")}`,
          quantity,
          unitPrice,
          totalPrice,
          confidence: 0.85,
        });
      }
    }
  }

  return items;
}

function detectCurrency(lines: string[]): string {
  const hasRp = lines.some((l) => /Rp\s/.test(l));
  return hasRp ? "IDR" : "unknown";
}

function extractMetadata(lines: string[]): Record<string, string> {
  const metadata: Record<string, string> = {};

  const paymentLine = lines.find((l) => l.toLowerCase().includes("pembayaran") || l.toLowerCase().includes("payment"));
  if (paymentLine) {
    const parts = paymentLine.split(":");
    if (parts.length > 1) metadata.paymentMethod = parts[1].trim();
  }

  const cashierLine = lines.find((l) => l.toLowerCase().includes("kasir"));
  if (cashierLine) {
    const parts = cashierLine.split(":");
    if (parts.length > 1) metadata.cashier = parts[1].trim();
  }

  const phoneLine = lines.find((l) => l.includes("Telp"));
  if (phoneLine) {
    const parts = phoneLine.split(":");
    if (parts.length > 1) metadata.phone = parts[1].trim();
  }

  return metadata;
}

export function buildCanonicalReceipt(
  normalized: NormalizationResult,
  ocrResult: RawOcrResult,
  fileName: string
): CanonicalReceipt {
  const lines = normalized.normalizedText.split("\n");

  const merchantCandidate = extractMerchantCandidate(lines);
  const transactionNumberCandidate = extractTransactionNumber(lines);
  const transactionDateCandidate = extractDateCandidate(lines);
  const transactionTimeCandidate = extractTimeCandidate(lines);
  const totalCandidate = extractTotalCandidate(lines);
  const lineItemsCandidate = extractLineItems(lines);
  const detectedLanguage = ocrResult.language !== "unknown" ? ocrResult.language : detectLanguage(lines);

  const fieldConfidences = [
    merchantCandidate.confidence,
    transactionNumberCandidate.confidence || 0.5,
    transactionDateCandidate.confidence || 0.5,
    transactionTimeCandidate.confidence || 0.5,
    totalCandidate.confidence || 0.5,
    lineItemsCandidate.length > 0 ? 0.85 : 0,
  ];

  const overallConfidence =
    fieldConfidences.reduce((sum, c) => sum + c, 0) / fieldConfidences.length;

  return {
    documentId: generateDocumentId(),
    documentType: "receipt",
    sourceFileName: fileName,
    rawText: normalized.originalText,
    normalizedText: normalized.normalizedText,
    detectedLanguage,
    merchantCandidate: {
      raw: merchantCandidate.raw,
      normalized: merchantCandidate.normalized,
      confidence: merchantCandidate.confidence,
    },
    transactionNumberCandidate: {
      raw: transactionNumberCandidate.raw,
      normalized: transactionNumberCandidate.normalized,
      confidence: transactionNumberCandidate.confidence,
    },
    transactionDateCandidate: {
      raw: transactionDateCandidate.raw,
      normalized: transactionDateCandidate.normalized,
      confidence: transactionDateCandidate.confidence,
    },
    transactionTimeCandidate: {
      raw: transactionTimeCandidate.raw,
      normalized: transactionTimeCandidate.normalized,
      confidence: transactionTimeCandidate.confidence,
    },
    totalCandidate: {
      raw: totalCandidate.raw,
      normalized: totalCandidate.normalized,
      confidence: totalCandidate.confidence,
    },
    currency: detectCurrency(lines),
    lineItemsCandidate,
    metadata: extractMetadata(lines),
    overallConfidence,
  };
}
