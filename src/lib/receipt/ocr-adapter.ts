import type { RawOcrResult } from "./types";
import { findReceiptByFileName, getRandomReceipt } from "./demo-dataset";
import { getProvider, listProviders } from "@/lib/document/providers/provider-registry";
import type { ProviderType } from "@/lib/document/types";
import { getReceiptById, loadGroundTruth } from "./dataset-loader";

export interface OcrAdapterConfig {
  provider?: ProviderType;
  sampleReceiptId?: string;
  credentials?: Record<string, string>;
}

const SAMPLE_ID_TO_DEMO_ID: Record<string, string> = {
  receipt01: "summarecon-mall-receipt-001.jpg",
  receipt02: "summarecon-mall-receipt-002.png",
  receipt03: "summarecon-mall-receipt-003.jpg",
  receipt04: "suspicious-receipt-001.jpg",
};

export class OcrAdapter {
  private config: OcrAdapterConfig;

  constructor(config: OcrAdapterConfig = {}) {
    this.config = {
      provider: config.provider || "demo",
      ...config,
    };
  }

  async processReceipt(file: File): Promise<RawOcrResult> {
    const provider = getProvider(this.config.provider || "demo");

    if (provider) {
      const result = await provider.processDocument({
        file,
        fileName: file.name,
      });
      return result;
    }

    const fileName = file.name;

    const matched = findReceiptByFileName(fileName);

    if (matched) {
      await this.simulateProcessingDelay();
      return { ...matched.ocrResult };
    }

    const random = getRandomReceipt();
    await this.simulateProcessingDelay();
    return { ...random.ocrResult };
  }

  async processReceiptFromText(fileName: string): Promise<RawOcrResult> {
    const matched = findReceiptByFileName(fileName);

    if (matched) {
      await this.simulateProcessingDelay();
      return { ...matched.ocrResult };
    }

    const random = getRandomReceipt();
    await this.simulateProcessingDelay();
    return { ...random.ocrResult };
  }

  async processBySampleId(sampleReceiptId: string): Promise<RawOcrResult | null> {
    const entry = getReceiptById(sampleReceiptId);
    if (!entry) return null;

    const demoFileName = SAMPLE_ID_TO_DEMO_ID[sampleReceiptId];
    if (!demoFileName) {
      const groundTruth = loadGroundTruth(sampleReceiptId);
      if (!groundTruth) return null;
    }

    const matched = findReceiptByFileName(demoFileName || "");
    if (matched) {
      await this.simulateProcessingDelay();
      return { ...matched.ocrResult };
    }

    return null;
  }

  getAvailableProviders(): string[] {
    return listProviders().map((p) => p.name);
  }

  private async simulateProcessingDelay(): Promise<void> {
    const delay = 800 + Math.random() * 1200;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
