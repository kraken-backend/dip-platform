import type { ProviderType, RawOcrResult } from "../types/document-types";

export interface OcrInput {
  file: File;
  fileName: string;
  options?: Record<string, unknown>;
}

export interface OcrProvider {
  readonly name: ProviderType;
  readonly displayName: string;
  processDocument(input: OcrInput): Promise<RawOcrResult>;
}

const registry = new Map<ProviderType, OcrProvider>();

export function registerProvider(provider: OcrProvider): void {
  registry.set(provider.name, provider);
}

export function getProvider(name: ProviderType): OcrProvider | undefined {
  return registry.get(name);
}

export function listProviders(): OcrProvider[] {
  return Array.from(registry.values());
}

export function hasProvider(name: ProviderType): boolean {
  return registry.has(name);
}

export function clearProviders(): void {
  registry.clear();
}

export class DemoOcrProvider implements OcrProvider {
  readonly name: ProviderType = "demo";
  readonly displayName = "Demo OCR Provider";

  async processDocument(input: OcrInput): Promise<RawOcrResult> {
    const {
      findReceiptByFileName,
      getRandomReceipt,
    } = await import("@/lib/receipt/demo-dataset");

    const matched = findReceiptByFileName(input.fileName);

    if (matched) {
      await simulateDelay();
      return { ...matched.ocrResult };
    }

    const random = getRandomReceipt();
    await simulateDelay();
    return { ...random.ocrResult };
  }
}

async function simulateDelay(): Promise<void> {
  const delay = 800 + Math.random() * 1200;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

registerProvider(new DemoOcrProvider());

// Tesseract provider is registered lazily via getOrInitTesseractProvider() below.
// Use normal import to avoid ESLint require() restriction.
import { TesseractOcrProvider } from "./tesseract-provider";
registerProvider(new TesseractOcrProvider());
