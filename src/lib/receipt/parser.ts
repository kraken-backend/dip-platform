import type { RawOcrResult, ParsedReceipt, ReceiptItem } from "./types";

export function parseReceipt(ocrResult: RawOcrResult): ParsedReceipt {
  const lines = ocrResult.rawText.split("\n");

  const storeName = extractStoreName(lines);
  const storeAddress = extractStoreAddress(lines);
  const storePhone = extractStorePhone(lines);
  const date = extractDate(lines);
  const time = extractTime(lines);
  const receiptNumber = extractReceiptNumber(lines);
  const items = extractItems(lines);
  const subtotal = extractSubtotal(lines);
  const discount = extractDiscount(lines);
  const tax = extractTax(lines);
  const total = extractTotal(lines);
  const paymentMethod = extractPaymentMethod(lines);
  const cashier = extractCashier(lines);

  return {
    storeName,
    storeAddress,
    storePhone,
    date,
    time,
    receiptNumber,
    items,
    subtotal,
    tax,
    discount,
    total,
    paymentMethod,
    cashier,
  };
}

function extractStoreName(lines: string[]): string {
  const line = lines.find(
    (l) =>
      l.includes("SUMMARECON") ||
      l.includes("ELECTRONIC") ||
      l.includes("FASHION") ||
      l.includes("TOKO")
  );
  return line?.trim() || "Unknown Store";
}

function extractStoreAddress(lines: string[]): string {
  const addrLines = lines.filter(
    (l) =>
      (l.includes("Jl.") || l.includes("Unit")) &&
      !l.includes("Telp") &&
      !l.includes("Nota")
  );
  return addrLines.join(", ") || "Address not detected";
}

function extractStorePhone(lines: string[]): string {
  const line = lines.find((l) => l.includes("Telp"));
  return line?.split(":").slice(1).join(":").trim() || "Phone not detected";
}

function extractDate(lines: string[]): string {
  const line = lines.find((l) => l.toLowerCase().includes("tanggal"));
  if (!line) return "Date not detected";
  const match = line.match(/(\d{2}\/\d{2}\/\d{4})/);
  return match?.[1] || "Date not detected";
}

function extractTime(lines: string[]): string {
  const line = lines.find((l) => l.toLowerCase().includes("tanggal"));
  if (!line) return "Time not detected";
  const match = line.match(/(\d{2}:\d{2})/);
  return match?.[1] || "Time not detected";
}

function extractReceiptNumber(lines: string[]): string {
  const line = lines.find(
    (l) =>
      l.includes("No.") || l.includes("Nota") || l.includes("INV") || l.includes("FK") || l.includes("FH")
  );
  if (!line) return "Not detected";
  const parts = line.split(":");
  return parts.length > 1 ? parts[1].trim() : line.trim();
}

function extractItems(lines: string[]): ReceiptItem[] {
  const items: ReceiptItem[] = [];
  let inItemsSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "Item:" || trimmed === "Item:") {
      inItemsSection = true;
      continue;
    }

    if (inItemsSection) {
      if (trimmed.startsWith("=") || trimmed.startsWith("Subtotal")) {
        break;
      }

      const itemMatch = trimmed.match(
        /(\d+)x\s+(.+?)\s+Rp\s+([\d.]+)/
      );

      if (itemMatch) {
        const quantity = parseInt(itemMatch[1], 10);
        const name = itemMatch[2].trim();
        const totalPrice = parseRupiah(itemMatch[3]);
        const unitPrice = quantity > 0 ? Math.round(totalPrice / quantity) : totalPrice;

        items.push({
          name,
          quantity,
          unitPrice,
          totalPrice,
        });
      }
    }
  }

  return items;
}

function extractSubtotal(lines: string[]): number {
  const line = lines.find((l) => l.toLowerCase().includes("subtotal"));
  if (!line) return 0;
  const match = line.match(/Rp\s+([\d.]+)/);
  return match ? parseRupiah(match[1]) : 0;
}

function extractDiscount(lines: string[]): number {
  const line = lines.find((l) => l.toLowerCase().includes("diskon"));
  if (!line) return 0;
  const match = line.match(/Rp\s+\(?([\d.]+)\)?/);
  return match ? parseRupiah(match[1]) : 0;
}

function extractTax(lines: string[]): number {
  const line = lines.find((l) => l.includes("PPN"));
  if (!line) return 0;
  const match = line.match(/Rp\s+([\d.]+)/);
  return match ? parseRupiah(match[1]) : 0;
}

function extractTotal(lines: string[]): number {
  const line = lines.find((l) => l.startsWith("TOTAL:"));
  if (!line) {
    const altLine = lines.find(
      (l) => l.includes("TOTAL") && !l.includes("Subtotal")
    );
    if (!altLine) return 0;
    const match = altLine.match(/Rp\s+([\d.]+)/);
    return match ? parseRupiah(match[1]) : 0;
  }
  const match = line.match(/Rp\s+([\d.]+)/);
  return match ? parseRupiah(match[1]) : 0;
}

function extractPaymentMethod(lines: string[]): string {
  const line = lines.find(
    (l) =>
      l.includes("Pembayaran") ||
      l.includes("Pembayaran:")
  );
  if (!line) return "Not detected";
  const parts = line.split(":");
  return parts.length > 1 ? parts[1].trim() : "Not detected";
}

function extractCashier(lines: string[]): string {
  const line = lines.find((l) => l.includes("Kasir"));
  if (!line) return "Not detected";
  const parts = line.split(":");
  return parts.length > 1 ? parts[1].trim() : "Not detected";
}

function parseRupiah(value: string): number {
  return parseInt(value.replace(/\./g, ""), 10);
}
