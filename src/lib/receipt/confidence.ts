import type { CanonicalReceipt, ParsedReceipt, FieldConfidence, ConfidenceResult } from "./types";

export function scoreConfidence(
  canonical: CanonicalReceipt,
  parsed: ParsedReceipt
): ConfidenceResult {
  const merchant = scoreMerchant(canonical, parsed);
  const transactionNumber = scoreTransactionNumber(canonical, parsed);
  const date = scoreDate(canonical, parsed);
  const time = scoreTime(canonical, parsed);
  const total = scoreTotal(canonical, parsed);
  const tax = scoreTax(parsed);
  const paymentMethod = scorePaymentMethod(parsed);
  const items = scoreItems(canonical, parsed);

  const scores = [
    merchant.confidence,
    transactionNumber.confidence,
    date.confidence,
    time.confidence,
    total.confidence,
    tax.confidence,
    paymentMethod.confidence,
    items.confidence,
  ];

  const overall =
    scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
      : 0;

  return {
    merchant,
    transactionNumber,
    date,
    time,
    total,
    tax,
    paymentMethod,
    items,
    overall,
  };
}

function scoreMerchant(
  canonical: CanonicalReceipt,
  parsed: ParsedReceipt
): FieldConfidence {
  const merchantName = parsed.storeName;
  const canonicalMerchant = canonical.merchantCandidate.normalized;

  if (merchantName === "Unknown Store" || !merchantName) {
    return {
      field: "merchant",
      value: merchantName,
      confidence: 0,
      reason: "Store name not detected",
    };
  }

  const knownMerchants = [
    "Summarecon Mall Food Court",
    "Electronic Pro - Summarecon",
    "Fashion Hub - Summarecon",
  ];

  const isKnown = knownMerchants.some(
    (m) =>
      merchantName.toLowerCase().includes(m.toLowerCase()) ||
      m.toLowerCase().includes(merchantName.toLowerCase())
  );

  if (isKnown) {
    return {
      field: "merchant",
      value: merchantName,
      confidence: 0.95,
      reason: "Known Summarecon Mall merchant",
    };
  }

  if (canonicalMerchant && merchantName.toLowerCase().includes(canonicalMerchant.toLowerCase().slice(0, 5))) {
    return {
      field: "merchant",
      value: merchantName,
      confidence: 0.7,
      reason: "Partially matched canonical candidate",
    };
  }

  return {
    field: "merchant",
    value: merchantName,
    confidence: 0.3,
    reason: "Unrecognized merchant name",
  };
}

function scoreTransactionNumber(
  canonical: CanonicalReceipt,
  parsed: ParsedReceipt
): FieldConfidence {
  const receiptNum = parsed.receiptNumber;

  if (!receiptNum || receiptNum === "Not detected") {
    return {
      field: "transactionNumber",
      value: receiptNum,
      confidence: 0,
      reason: "Transaction number not detected",
    };
  }

  const standardPattern = /^[A-Z]{2,3}-\d{4}-\d{2}-\d{5}$/;
  if (standardPattern.test(receiptNum)) {
    return {
      field: "transactionNumber",
      value: receiptNum,
      confidence: 0.95,
      reason: "Standard receipt number format",
    };
  }

  const altPattern = /^FH-\d{4}-\d{2}-\d{4}$/;
  if (altPattern.test(receiptNum)) {
    return {
      field: "transactionNumber",
      value: receiptNum,
      confidence: 0.9,
      reason: "Alternate receipt number format",
    };
  }

  if (canonical.transactionNumberCandidate.confidence > 0) {
    return {
      field: "transactionNumber",
      value: receiptNum,
      confidence: 0.5,
      reason: "Format does not match standard pattern",
    };
  }

  return {
    field: "transactionNumber",
    value: receiptNum,
    confidence: 0.2,
    reason: "Unrecognized format",
  };
}

function scoreDate(
  canonical: CanonicalReceipt,
  parsed: ParsedReceipt
): FieldConfidence {
  const date = parsed.date;

  if (!date || date === "Date not detected") {
    return {
      field: "date",
      value: date,
      confidence: 0,
      reason: "Date not detected",
    };
  }

  const dateMatch = date.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!dateMatch) {
    return {
      field: "date",
      value: date,
      confidence: 0.1,
      reason: "Date format not recognized",
    };
  }

  const day = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10);
  const year = parseInt(dateMatch[3], 10);

  if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2020 && year <= 2030) {
    return {
      field: "date",
      value: date,
      confidence: 0.95,
      reason: "Valid date within expected range",
    };
  }

  return {
    field: "date",
    value: date,
    confidence: 0.4,
    reason: "Date validation warnings",
  };
}

function scoreTime(
  canonical: CanonicalReceipt,
  parsed: ParsedReceipt
): FieldConfidence {
  const time = parsed.time;

  if (!time || time === "Time not detected") {
    return {
      field: "time",
      value: time,
      confidence: 0,
      reason: "Time not detected",
    };
  }

  const timeMatch = time.match(/(\d{2}):(\d{2})/);
  if (!timeMatch) {
    return {
      field: "time",
      value: time,
      confidence: 0.1,
      reason: "Time format not recognized",
    };
  }

  const hour = parseInt(timeMatch[1], 10);
  const minute = parseInt(timeMatch[2], 10);

  if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
    return {
      field: "time",
      value: time,
      confidence: 0.9,
      reason: "Valid time format",
    };
  }

  return {
    field: "time",
    value: time,
    confidence: 0.3,
    reason: "Time values out of range",
  };
}

function scoreTotal(
  canonical: CanonicalReceipt,
  parsed: ParsedReceipt
): FieldConfidence {
  const total = parsed.total;

  if (total <= 0) {
    return {
      field: "total",
      value: total,
      confidence: 0,
      reason: "Total is zero or negative",
    };
  }

  const expected = parsed.subtotal - parsed.discount + parsed.tax;
  const diff = Math.abs(total - expected);

  if (diff === 0) {
    return {
      field: "total",
      value: total,
      confidence: 0.98,
      reason: "Total matches calculated value exactly",
    };
  }

  if (diff <= 100) {
    return {
      field: "total",
      value: total,
      confidence: 0.9,
      reason: "Total within acceptable tolerance",
    };
  }

  return {
    field: "total",
    value: total,
    confidence: 0.5,
    reason: `Total differs from calculation by Rp ${diff.toLocaleString("id-ID")}`,
  };
}

function scoreTax(parsed: ParsedReceipt): FieldConfidence {
  const tax = parsed.tax;

  if (tax < 0) {
    return {
      field: "tax",
      value: tax,
      confidence: 0,
      reason: "Negative tax value",
    };
  }

  const taxableAmount = parsed.subtotal - parsed.discount;
  if (taxableAmount <= 0) {
    return {
      field: "tax",
      value: tax,
      confidence: 1.0,
      reason: "No tax expected for zero taxable amount",
    };
  }

  const expectedTax = Math.round(taxableAmount * 0.11);
  const diff = Math.abs(tax - expectedTax);

  if (diff === 0) {
    return {
      field: "tax",
      value: tax,
      confidence: 0.95,
      reason: "PPN 11% calculated correctly",
    };
  }

  if (tax === 0 && taxableAmount > 100000) {
    return {
      field: "tax",
      value: tax,
      confidence: 0.1,
      reason: "Missing PPN for taxable transaction",
    };
  }

  return {
    field: "tax",
    value: tax,
    confidence: 0.7,
    reason: "Tax amount present but may not match 11% exactly",
  };
}

function scorePaymentMethod(parsed: ParsedReceipt): FieldConfidence {
  const method = parsed.paymentMethod;

  if (!method || method === "Not detected") {
    return {
      field: "paymentMethod",
      value: method,
      confidence: 0,
      reason: "Payment method not detected",
    };
  }

  const knownMethods = ["qris", "tunai", "cash", "kartu debit", "kartu kredit", "bca", "bni", "mandiri"];
  const isKnown = knownMethods.some((km) => method.toLowerCase().includes(km));

  if (isKnown) {
    return {
      field: "paymentMethod",
      value: method,
      confidence: 0.9,
      reason: "Recognized payment method",
    };
  }

  return {
    field: "paymentMethod",
    value: method,
    confidence: 0.5,
    reason: "Unrecognized payment method",
  };
}

function scoreItems(
  canonical: CanonicalReceipt,
  parsed: ParsedReceipt
): FieldConfidence {
  if (!parsed.items || parsed.items.length === 0) {
    return {
      field: "items",
      value: "none",
      confidence: 0,
      reason: "No items parsed",
    };
  }

  const itemCount = parsed.items.length;
  const validPrices = parsed.items.filter((i) => i.unitPrice > 0).length;
  const validQuantities = parsed.items.filter((i) => i.quantity > 0).length;
  const validTotals = parsed.items.filter(
    (i) => i.totalPrice === i.quantity * i.unitPrice
  ).length;

  const priceRatio = validPrices / itemCount;
  const quantityRatio = validQuantities / itemCount;
  const totalRatio = validTotals / itemCount;

  const confidence = Math.round(
    ((priceRatio + quantityRatio + totalRatio) / 3) * 100
  ) / 100;

  const reasons: string[] = [];
  if (confidence >= 0.9) {
    reasons.push("All items have valid prices and quantities");
  } else if (confidence >= 0.5) {
    reasons.push(`${validTotals}/${itemCount} items have valid totals`);
  } else {
    reasons.push("Multiple item validation issues");
  }

  return {
    field: "items",
    value: `${itemCount} items`,
    confidence,
    reason: reasons[0],
  };
}
