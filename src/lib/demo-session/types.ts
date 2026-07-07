import type { ProcessingOption, ProcessingResult, DatasetReceiptEntry } from "@/lib/receipt/types";

export type DemoSessionStatus =
  | "idle"
  | "option_selected"
  | "sample_selected"
  | "file_selected"
  | "ready"
  | "processing"
  | "completed"
  | "failed";

export type DemoInputMode = "none" | "sample" | "upload";

export interface DemoSession {
  option: ProcessingOption;
  status: DemoSessionStatus;
  inputMode: DemoInputMode;
  selectedSample: DatasetReceiptEntry | null;
  uploadedFile: File | null;
  uploadPreviewSrc: string | null;
  result: ProcessingResult | null;
  errorMessage: string;
  history: DemoSessionHistoryItem[];
}

export interface DemoSessionHistoryItem {
  id: string;
  timestamp: string;
  option: ProcessingOption;
  inputMode: DemoInputMode;
  inputLabel: string;
  status: DemoSessionStatus;
  result: ProcessingResult | null;
  errorMessage: string;
}

export type DemoSessionAction =
  | { type: "SELECT_OPTION"; option: ProcessingOption }
  | { type: "SELECT_SAMPLE"; sample: DatasetReceiptEntry }
  | { type: "SELECT_FILE"; file: File; previewSrc: string }
  | { type: "CLEAR_INPUT" }
  | { type: "START_PROCESSING" }
  | { type: "PROCESSING_SUCCESS"; result: ProcessingResult }
  | { type: "PROCESSING_FAILURE"; error: string }
  | { type: "RESET_SESSION" }
  | { type: "RETRY_PROCESSING" }
  | { type: "ADD_HISTORY_ITEM"; item: DemoSessionHistoryItem };

export interface DemoSessionDisplayState {
  isIdle: boolean;
  hasInput: boolean;
  isProcessing: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  isBusy: boolean;
  showPlaceholder: boolean;
  showResult: boolean;
  showError: boolean;
  canProcess: boolean;
}

export interface DemoSessionActions {
  selectOption: (option: ProcessingOption) => void;
  selectSample: (sample: DatasetReceiptEntry) => void;
  selectFile: (file: File) => void;
  clearInput: () => void;
  startProcessing: () => void;
  processingSuccess: (result: ProcessingResult) => void;
  processingFailure: (error: string) => void;
  resetSession: () => void;
  retryProcessing: () => void;
  addHistoryItem: () => void;
}
