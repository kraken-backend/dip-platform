import { ruleRegistry } from "@/lib/rule-engine/registry";
import type { RuleDefinition } from "@/lib/rule-engine/types";
import { Severity } from "@/lib/rule-engine/severity";

const KNOWN_MERCHANTS: string[] = [
  "Summarecon Mall Food Court",
  "Electronic Pro - Summarecon",
  "Fashion Hub - Summarecon",
];

const receiptRules: RuleDefinition[] = [
  {
    id: "receipt-store-name-exists",
    name: "Store Name Detection",
    description: "Verifies that the store name was detected",
    documentType: "receipt",
    category: "format",
    severity: Severity.Error,
    condition: { field: "storeName", operator: "exists", value: true },
    evidence: {
      field: "storeName", expected: "A valid store name", actual: "",
      message: "Store name could not be detected from receipt",
      severity: Severity.Error,
      recommendation: "Ensure the receipt image clearly shows the merchant name.",
    },
    enabled: true,
  },
  {
    id: "receipt-store-name-known",
    name: "Known Merchant Verification",
    description: "Checks that the store is a registered merchant",
    documentType: "receipt",
    category: "business",
    severity: Severity.Error,
    condition: { field: "storeName", operator: "in", value: KNOWN_MERCHANTS },
    evidence: {
      field: "storeName", expected: "Known merchant", actual: "",
      message: "Store name does not match known merchants",
      severity: Severity.Error,
      recommendation: "Verify the receipt origin.",
    },
    enabled: true,
  },
  {
    id: "receipt-items-not-empty",
    name: "Items Present",
    description: "Verifies at least one item was detected",
    documentType: "receipt",
    category: "format",
    severity: Severity.Error,
    condition: { field: "items", operator: "exists", value: true },
    evidence: {
      field: "items", expected: "At least one line item", actual: "",
      message: "No items detected on receipt",
      severity: Severity.Error,
      recommendation: "Ensure the receipt image clearly shows the item list.",
    },
    enabled: true,
  },
  {
    id: "receipt-date-format",
    name: "Receipt Date Format",
    description: "Validates DD/MM/YYYY format",
    documentType: "receipt",
    category: "format",
    severity: Severity.Error,
    condition: { field: "date", operator: "matches", value: "^\\d{2}/\\d{2}/\\d{4}$" },
    evidence: {
      field: "date", expected: "DD/MM/YYYY", actual: "",
      message: "Date format is invalid.",
      severity: Severity.Error,
      recommendation: "Check the date field in the receipt.",
    },
    enabled: true,
  },
  {
    id: "receipt-tax-ppn",
    name: "PPN 11% VAT Verification",
    description: "Verifies PPN is present for taxable transactions",
    documentType: "receipt",
    category: "compliance",
    severity: Severity.Error,
    condition: { field: "tax", operator: "gt", value: 0 },
    evidence: {
      field: "tax", expected: "PPN 11% (> 0)", actual: "",
      message: "PPN (11% VAT) is missing",
      severity: Severity.Error,
      recommendation: "Indonesian tax regulation requires PPN 11%.",
    },
    enabled: true,
  },
  {
    id: "receipt-payment-method",
    name: "Payment Method Detection",
    description: "Verifies payment method was detected",
    documentType: "receipt",
    category: "format",
    severity: Severity.Warning,
    condition: { field: "paymentMethod", operator: "exists", value: true },
    evidence: {
      field: "paymentMethod", expected: "Cash, QRIS, Card", actual: "",
      message: "Payment method not detected",
      severity: Severity.Warning,
      recommendation: "Payment method is useful for reconciliation.",
    },
    enabled: true,
  },
];

export function registerReceiptRules(): void {
  for (const def of receiptRules) {
    try { ruleRegistry.register(def); } catch { /* skip duplicates */ }
  }
}

export { receiptRules };
