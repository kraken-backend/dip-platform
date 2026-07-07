import type { DemoSession, DemoSessionDisplayState, DemoSessionHistoryItem, DemoSessionStatus } from "./types";

export function canProcess(session: DemoSession): boolean {
  if (session.status === "processing") return false;
  return session.inputMode === "sample" || session.inputMode === "upload";
}

export function getSessionDisplayState(session: DemoSession): DemoSessionDisplayState {
  const isIdle = session.status === "idle" || session.status === "option_selected";
  const hasInput = session.inputMode === "sample" || session.inputMode === "upload";
  const isProcessing = session.status === "processing";
  const isCompleted = session.status === "completed";
  const isFailed = session.status === "failed";
  const isBusy = isProcessing;
  const showPlaceholder = isIdle && !hasInput && !isCompleted;
  const showResult = isCompleted && session.result !== null;
  const showError = isFailed;

  return {
    isIdle,
    hasInput,
    isProcessing,
    isCompleted,
    isFailed,
    isBusy,
    showPlaceholder,
    showResult,
    showError,
    canProcess: canProcess(session),
  };
}

export function getSessionInputLabel(session: DemoSession): string {
  if (session.inputMode === "sample" && session.selectedSample) {
    return session.selectedSample.title;
  }
  if (session.inputMode === "upload" && session.uploadedFile) {
    return session.uploadedFile.name;
  }
  return "";
}

export function buildProcessFormData(session: DemoSession): FormData | null {
  if (!canProcess(session)) return null;

  const formData = new FormData();
  formData.append("option", session.option.toString());

  if (session.inputMode === "sample" && session.selectedSample) {
    formData.append("sampleReceiptId", session.selectedSample.id);
  } else if (session.inputMode === "upload" && session.uploadedFile) {
    formData.append("file", session.uploadedFile);
  }

  return formData;
}

export function createHistoryItem(session: DemoSession): DemoSessionHistoryItem {
  return {
    id: `run-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    option: session.option,
    inputMode: session.inputMode,
    inputLabel: getSessionInputLabel(session),
    status: session.status,
    result: session.result,
    errorMessage: session.errorMessage,
  };
}

export function getPreviewInfo(session: DemoSession): { src: string | null; fileName: string; fileSize?: number } {
  if (session.inputMode === "sample" && session.selectedSample) {
    return {
      src: session.selectedSample.imagePath,
      fileName: session.selectedSample.title,
    };
  }
  if (session.inputMode === "upload") {
    return {
      src: session.uploadPreviewSrc,
      fileName: session.uploadedFile?.name || "",
      fileSize: session.uploadedFile?.size,
    };
  }
  return { src: null, fileName: "" };
}

export function mapToProcessingStatus(
  status: DemoSessionStatus
): "idle" | "uploading" | "processing" | "complete" | "error" {
  switch (status) {
    case "processing":
      return "processing";
    case "completed":
      return "complete";
    case "failed":
      return "error";
    default:
      return "idle";
  }
}

export function getOptionInfo(option: number): { title: string; description: string } {
  const OPTION_INFO: Record<number, { title: string; description: string }> = {
    1: {
      title: "OCR Engine Only",
      description: "Extract text from receipt images and view structured data.",
    },
    2: {
      title: "OCR + Validation Engine",
      description: "Extract text, validate data against business rules, and identify issues.",
    },
    3: {
      title: "OCR + Fraud Detection",
      description: "Full extraction, validation, and fraud analysis with risk scoring.",
    },
    4: {
      title: "AI Receipt Intelligence Platform",
      description: "Complete platform with OCR, validation, fraud detection, analytics, and AI insights.",
    },
  };
  return OPTION_INFO[option] || OPTION_INFO[1];
}
