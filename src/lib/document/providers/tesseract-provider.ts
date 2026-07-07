import type { OcrProvider, OcrInput } from "./provider-registry";
import type { RawOcrResult, RawOcrLine } from "../types/document-types";

const SAMPLE_TO_IMAGE: Record<string, string> = {
  receipt01: "receipt01.jpg",
  receipt02: "receipt02.jpg",
  receipt03: "receipt03.png",
  receipt04: "receipt04.jpg",
};

export class TesseractOcrProvider implements OcrProvider {
  readonly name = "tesseract" as const;
  readonly displayName = "Tesseract.js OCR";

  async processDocument(input: OcrInput): Promise<RawOcrResult> {
    const t0 = performance.now();

    let image: Buffer | File;
    if (input.file && input.file.size > 0) {
      image = input.file;
    } else {
      const buf = await this.readSampleImage(input.fileName);
      if (!buf) {
        const { getRandomReceipt } = await import("@/lib/receipt/demo-dataset");
        return { ...getRandomReceipt().ocrResult };
      }
      image = buf;
    }

    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("eng");
    const { data } = await worker.recognize(image);
    await worker.terminate();

    const lines: RawOcrLine[] = [];
    for (const block of data.blocks ?? []) {
      for (const para of block.paragraphs ?? []) {
        for (const line of para.lines ?? []) {
          if (!line.text?.trim()) continue;
          lines.push({
            text: line.text,
            confidence: Math.round(line.confidence) / 100,
            boundingBox: line.bbox ? {
              x: line.bbox.x0, y: line.bbox.y0,
              width: line.bbox.x1 - line.bbox.x0,
              height: line.bbox.y1 - line.bbox.y0,
            } : undefined,
          });
        }
      }
    }

    if (lines.length === 0) {
      for (const raw of data.text.split("\n").filter((l: string) => l.trim())) {
        lines.push({ text: raw, confidence: Math.round(data.confidence) / 100 });
      }
    }

    return {
      rawText: data.text,
      lines,
      confidence: Math.round(data.confidence) / 100,
      processingTimeMs: Math.round(performance.now() - t0),
      language: "eng",
    };
  }

  private async readSampleImage(fileName: string): Promise<Buffer | null> {
    const fs = await import("fs");
    const path = await import("path");
    const receiptsDir = path.join(process.cwd(), "public", "receipts");

    for (const sampleId of Object.keys(SAMPLE_TO_IMAGE)) {
      if (fileName.includes(sampleId) || fileName.includes(SAMPLE_TO_IMAGE[sampleId])) {
        const fp = path.join(receiptsDir, SAMPLE_TO_IMAGE[sampleId]);
        if (fs.existsSync(fp)) return fs.readFileSync(fp);
      }
    }

    const direct = path.join(receiptsDir, fileName);
    if (fs.existsSync(direct)) return fs.readFileSync(direct);

    return null;
  }
}
