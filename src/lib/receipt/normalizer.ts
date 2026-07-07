import type { NormalizationResult } from "./types";

export function normalizeText(rawText: string): NormalizationResult {
  const notes: string[] = [];

  const lines = rawText.split("\n").map((l) => l.trim());

  const emptyCount = lines.filter((l) => l.length === 0).length;
  const nonEmptyLines = lines.filter((l) => l.length > 0);
  if (emptyCount > 0) {
    notes.push(`Removed ${emptyCount} empty line(s)`);
  }

  const cleanedLines = nonEmptyLines.map((l) => l.replace(/\s+/g, " "));

  const separatorPattern = /^[=\-*]{5,}$/;
  const separatorCount = cleanedLines.filter((l) => separatorPattern.test(l)).length;
  const withoutSeparators = cleanedLines.filter((l) => !separatorPattern.test(l));
  if (separatorCount > 0) {
    notes.push(`Removed ${separatorCount} separator line(s)`);
  }

  const normalizedText = withoutSeparators.join("\n");

  if (normalizedText === rawText) {
    notes.push("Text already normalized");
  } else {
    notes.push("Whitespace trimmed and normalized");
  }

  return {
    originalText: rawText,
    normalizedText,
    notes,
  };
}

export function normalizeCurrencyText(text: string): string {
  return text
    .replace(/Rp\s*/gi, "Rp ")
    .replace(/\.(?=\d{3})/g, "")
    .replace(/Rp\s+(\d+)/gi, (_, digits) => `Rp ${digits}`);
}

export function normalizeDateString(raw: string): string {
  const cleaned = raw.replace(/[^0-9\/\-]/g, "").trim();

  const slashMatch = cleaned.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    const d = slashMatch[1].padStart(2, "0");
    const m = slashMatch[2].padStart(2, "0");
    const y = slashMatch[3];
    return `${d}/${m}/${y}`;
  }

  const dashMatch = cleaned.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dashMatch) {
    return `${dashMatch[3]}/${dashMatch[2]}/${dashMatch[1]}`;
  }

  const shortMatch = raw.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return shortMatch?.[0] || raw;
}
