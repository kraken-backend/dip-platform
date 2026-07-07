import type { ParsedReceipt, ValidationResult, ValidationIssue, EvidenceItem } from "./types";
import { createValidationEvidence, createInfoEvidence } from "./evidence";

const KNOWN_MERCHANTS = [
  "Summarecon Mall Food Court",
  "Electronic Pro - Summarecon",
  "Fashion Hub - Summarecon",
];

const PHONE_PATTERN = /^\(\d{3}\)\s*\d{4}-\d{4}$/;
const RECEIPT_PATTERN = /^[A-Z]{2,3}-\d{4}-\d{2}-\d{5}$/;

export function validateReceipt(parsed: ParsedReceipt): ValidationResult {
  const issues: ValidationIssue[] = [];
  const warnings: string[] = [];
  const passedChecks: string[] = [];
  const evidence: EvidenceItem[] = [];

  validateStoreName(parsed, issues, passedChecks, evidence);
  validateStoreAddress(parsed, issues, passedChecks, evidence);
  validateStorePhone(parsed, issues, warnings, passedChecks, evidence);
  validateDate(parsed, issues, passedChecks, evidence);
  validateReceiptNumber(parsed, issues, warnings, passedChecks, evidence);
  validateItems(parsed, issues, passedChecks, evidence);
  validateSubtotal(parsed, issues, passedChecks, evidence);
  validateTax(parsed, issues, passedChecks, evidence);
  validateTotal(parsed, issues, passedChecks, evidence);
  validatePaymentMethod(parsed, issues, passedChecks, evidence);

  const score = calculateScore(issues);
  const valid = issues.filter((i) => i.severity === "error").length === 0;

  return {
    valid,
    score,
    issues,
    warnings,
    passedChecks,
    evidence,
  };
}

function validateStoreName(
  parsed: ParsedReceipt,
  issues: ValidationIssue[],
  passed: string[],
  evidence: EvidenceItem[]
): void {
  if (!parsed.storeName || parsed.storeName === "Unknown Store") {
    const issue: ValidationIssue = {
      field: "storeName",
      message: "Store name could not be detected from receipt",
      severity: "error",
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
  } else if (
    !KNOWN_MERCHANTS.some((m) =>
      parsed.storeName.toLowerCase().includes(m.toLowerCase()) ||
      m.toLowerCase().includes(parsed.storeName.toLowerCase())
    )
  ) {
    const issue: ValidationIssue = {
      field: "storeName",
      message: "Store name does not match known Summarecon Mall merchants",
      severity: "error",
      expected: "Registered Summarecon Mall merchant",
      actual: parsed.storeName,
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
  } else {
    passed.push("Store name detected and matches merchant records");
    evidence.push(createInfoEvidence("Store name verified against merchant database", "storeName", parsed.storeName));
  }
}

function validateStoreAddress(
  parsed: ParsedReceipt,
  issues: ValidationIssue[],
  passed: string[],
  evidence: EvidenceItem[]
): void {
  if (!parsed.storeAddress || parsed.storeAddress === "Address not detected") {
    const issue: ValidationIssue = {
      field: "storeAddress",
      message: "Store address could not be read clearly",
      severity: "warning",
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
  } else {
    passed.push("Store address detected");
  }
}

function validateStorePhone(
  parsed: ParsedReceipt,
  issues: ValidationIssue[],
  warnings: string[],
  passed: string[],
  evidence: EvidenceItem[]
): void {
  if (!parsed.storePhone || parsed.storePhone === "Phone not detected") {
    warnings.push("Store phone number not detected");
    return;
  }

  if (!PHONE_PATTERN.test(parsed.storePhone)) {
    warnings.push("Store phone number format differs from standard format");
    evidence.push(createInfoEvidence("Store phone number format differs from standard", "storePhone", parsed.storePhone));
  } else {
    passed.push("Store phone number format valid");
  }
}

function validateDate(
  parsed: ParsedReceipt,
  issues: ValidationIssue[],
  passed: string[],
  evidence: EvidenceItem[]
): void {
  if (!parsed.date || parsed.date === "Date not detected") {
    const issue: ValidationIssue = {
      field: "date",
      message: "Transaction date could not be determined",
      severity: "error",
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
    return;
  }

  const dateMatch = parsed.date.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!dateMatch) {
    const issue: ValidationIssue = {
      field: "date",
      message: "Date format is invalid",
      severity: "error",
      expected: "DD/MM/YYYY",
      actual: parsed.date,
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
    return;
  }

  const day = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10);
  const year = parseInt(dateMatch[3], 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    const issue: ValidationIssue = {
      field: "date",
      message: "Date values are out of valid range",
      severity: "error",
      expected: "Valid calendar date",
      actual: parsed.date,
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
    return;
  }

  const receiptDate = new Date(year, month - 1, day);
  const today = new Date();
  const diffDays = (today.getTime() - receiptDate.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) {
    const issue: ValidationIssue = {
      field: "date",
      message: "Receipt date is in the future",
      severity: "error",
      expected: "Date on or before today",
      actual: parsed.date,
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
    return;
  }

  if (diffDays > 365) {
    const issue: ValidationIssue = {
      field: "date",
      message: "Receipt is older than 1 year",
      severity: "warning",
      expected: "Within last 12 months",
      actual: parsed.date,
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
  }

  passed.push("Date format valid and within acceptable range");
}

function validateReceiptNumber(
  parsed: ParsedReceipt,
  issues: ValidationIssue[],
  warnings: string[],
  passed: string[],
  evidence: EvidenceItem[]
): void {
  if (!parsed.receiptNumber || parsed.receiptNumber === "Not detected") {
    warnings.push("Receipt number not clearly detected");
    return;
  }

  if (!RECEIPT_PATTERN.test(parsed.receiptNumber)) {
    warnings.push("Receipt number format does not match standard format");
    evidence.push(createInfoEvidence("Receipt number format non-standard", "receiptNumber", parsed.receiptNumber));
  } else {
    passed.push("Receipt number format valid");
  }
}

function validateItems(
  parsed: ParsedReceipt,
  issues: ValidationIssue[],
  passed: string[],
  evidence: EvidenceItem[]
): void {
  if (!parsed.items || parsed.items.length === 0) {
    const issue: ValidationIssue = {
      field: "items",
      message: "No items detected on receipt",
      severity: "error",
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
    return;
  }

  for (const item of parsed.items) {
    if (item.unitPrice <= 0) {
      const issue: ValidationIssue = {
        field: "items",
        message: `Item "${item.name}" has zero or negative price`,
        severity: "error",
      };
      issues.push(issue);
      evidence.push(createValidationEvidence(issue));
    }
    if (item.quantity <= 0) {
      const issue: ValidationIssue = {
        field: "items",
        message: `Item "${item.name}" has invalid quantity`,
        severity: "error",
      };
      issues.push(issue);
      evidence.push(createValidationEvidence(issue));
    }
    if (item.totalPrice !== item.quantity * item.unitPrice) {
      const issue: ValidationIssue = {
        field: "items",
        message: `Item "${item.name}" total price mismatch`,
        severity: "warning",
        expected: `Rp ${(item.quantity * item.unitPrice).toLocaleString("id-ID")}`,
        actual: `Rp ${item.totalPrice.toLocaleString("id-ID")}`,
      };
      issues.push(issue);
      evidence.push(createValidationEvidence(issue));
    }
  }

  passed.push(`Items list complete (${parsed.items.length} items)`);
}

function validateSubtotal(
  parsed: ParsedReceipt,
  issues: ValidationIssue[],
  passed: string[],
  evidence: EvidenceItem[]
): void {
  const calculatedSubtotal = parsed.items.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  if (parsed.subtotal <= 0) {
    const issue: ValidationIssue = {
      field: "subtotal",
      message: "Subtotal is zero or negative",
      severity: "error",
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
    return;
  }

  const diff = Math.abs(parsed.subtotal - calculatedSubtotal);
  if (diff > 100) {
    const issue: ValidationIssue = {
      field: "subtotal",
      message: `Subtotal mismatch: calculated Rp ${calculatedSubtotal.toLocaleString("id-ID")} vs receipt Rp ${parsed.subtotal.toLocaleString("id-ID")}`,
      severity: "warning",
      expected: `Rp ${calculatedSubtotal.toLocaleString("id-ID")}`,
      actual: `Rp ${parsed.subtotal.toLocaleString("id-ID")}`,
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
  } else {
    passed.push("Subtotal matches sum of item prices");
    evidence.push(createInfoEvidence("Subtotal matches item sum", "subtotal", `Rp ${parsed.subtotal.toLocaleString("id-ID")}`));
  }
}

function validateTax(
  parsed: ParsedReceipt,
  issues: ValidationIssue[],
  passed: string[],
  evidence: EvidenceItem[]
): void {
  const taxableAmount = parsed.subtotal - parsed.discount;
  const expectedTax = Math.round(taxableAmount * 0.11);

  if (parsed.tax === 0 && taxableAmount > 0) {
    const issue: ValidationIssue = {
      field: "tax",
      message: "PPN (11% VAT) is missing for taxable transaction",
      severity: "error",
      expected: `PPN 11% ~ Rp ${expectedTax.toLocaleString("id-ID")}`,
      actual: "Rp 0",
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
    return;
  }

  const taxDiff = Math.abs(parsed.tax - expectedTax);
  if (taxDiff > 100) {
    const issue: ValidationIssue = {
      field: "tax",
      message: `Tax amount seems incorrect. Expected ~Rp ${expectedTax.toLocaleString("id-ID")} but found Rp ${parsed.tax.toLocaleString("id-ID")}`,
      severity: "warning",
      expected: `~Rp ${expectedTax.toLocaleString("id-ID")}`,
      actual: `Rp ${parsed.tax.toLocaleString("id-ID")}`,
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
  } else {
    passed.push("PPN (VAT) calculation verified");
    evidence.push(createInfoEvidence("PPN 11% calculation verified", "tax", `Rp ${parsed.tax.toLocaleString("id-ID")}`));
  }
}

function validateTotal(
  parsed: ParsedReceipt,
  issues: ValidationIssue[],
  passed: string[],
  evidence: EvidenceItem[]
): void {
  const expectedTotal = parsed.subtotal - parsed.discount + parsed.tax;

  if (parsed.total <= 0) {
    const issue: ValidationIssue = {
      field: "total",
      message: "Total amount is zero or negative",
      severity: "error",
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
    return;
  }

  const diff = Math.abs(parsed.total - expectedTotal);
  if (diff > 100) {
    const issue: ValidationIssue = {
      field: "total",
      message: `Total amount mismatch: expected Rp ${expectedTotal.toLocaleString("id-ID")} but receipt shows Rp ${parsed.total.toLocaleString("id-ID")}`,
      severity: "error",
      expected: `Rp ${expectedTotal.toLocaleString("id-ID")}`,
      actual: `Rp ${parsed.total.toLocaleString("id-ID")}`,
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
  } else {
    passed.push("Total calculation verified");
    evidence.push(createInfoEvidence("Total amount verified", "total", `Rp ${parsed.total.toLocaleString("id-ID")}`));
  }
}

function validatePaymentMethod(
  parsed: ParsedReceipt,
  issues: ValidationIssue[],
  passed: string[],
  evidence: EvidenceItem[]
): void {
  if (!parsed.paymentMethod || parsed.paymentMethod === "Not detected") {
    const issue: ValidationIssue = {
      field: "paymentMethod",
      message: "Payment method not detected",
      severity: "warning",
    };
    issues.push(issue);
    evidence.push(createValidationEvidence(issue));
  } else {
    passed.push("Payment method detected");
  }
}

function calculateScore(issues: ValidationIssue[]): number {
  if (issues.length === 0) return 1.0;

  let deductions = 0;
  for (const issue of issues) {
    switch (issue.severity) {
      case "error":
        deductions += 0.2;
        break;
      case "warning":
        deductions += 0.1;
        break;
      case "info":
        deductions += 0.02;
        break;
    }
  }

  return Math.max(0, Math.min(1, 1 - deductions));
}
