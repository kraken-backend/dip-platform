"use client";

import { useReducer, useCallback, useMemo } from "react";
import { sessionReducer, createInitialSession } from "@/lib/demo-session/session-reducer";
import {
  canProcess,
  getSessionDisplayState,
  getSessionInputLabel,
  buildProcessFormData,
  getPreviewInfo,
  getOptionInfo,
} from "@/lib/demo-session/session-helpers";
import type {
  DemoSessionActions,
  DemoSession,
  DemoSessionHistoryItem,
} from "@/lib/demo-session/types";
import type { ProcessingOption, ProcessingResult, DatasetReceiptEntry } from "@/lib/receipt/types";

export interface UseDemoSessionReturn {
  session: DemoSession;
  actions: DemoSessionActions;
  canProcess: boolean;
  displayState: ReturnType<typeof getSessionDisplayState>;
  inputLabel: string;
  previewInfo: ReturnType<typeof getPreviewInfo>;
  optionInfo: ReturnType<typeof getOptionInfo>;
  reset: () => void;
  retry: () => void;
  process: () => Promise<void>;
}

export function useDemoSession(initialOption: ProcessingOption): UseDemoSessionReturn {
  const [session, dispatch] = useReducer(
    sessionReducer,
    initialOption,
    createInitialSession
  );

  const actions: DemoSessionActions = useMemo(
    () => ({
      selectOption: (option: ProcessingOption) =>
        dispatch({ type: "SELECT_OPTION", option }),

      selectSample: (sample: DatasetReceiptEntry) =>
        dispatch({ type: "SELECT_SAMPLE", sample }),

      selectFile: (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewSrc = e.target?.result as string;
          dispatch({ type: "SELECT_FILE", file, previewSrc });
        };
        reader.readAsDataURL(file);
      },

      clearInput: () => dispatch({ type: "CLEAR_INPUT" }),

      startProcessing: () => dispatch({ type: "START_PROCESSING" }),

      processingSuccess: (result: ProcessingResult) => {
        dispatch({ type: "PROCESSING_SUCCESS", result });
      },

      processingFailure: (error: string) =>
        dispatch({ type: "PROCESSING_FAILURE", error }),

      resetSession: () => dispatch({ type: "RESET_SESSION" }),

      retryProcessing: () => dispatch({ type: "RETRY_PROCESSING" }),

      addHistoryItem: () => {
        const item: DemoSessionHistoryItem = {
          id: `run-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toISOString(),
          option: session.option,
          inputMode: session.inputMode,
          inputLabel: getSessionInputLabel(session),
          status: session.status,
          result: session.result,
          errorMessage: session.errorMessage,
        };
        dispatch({ type: "ADD_HISTORY_ITEM", item });
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session.option, session.inputMode, session.status, session.result, session.errorMessage]
  );

  const process = useCallback(async () => {
    if (!canProcess(session)) return;

    dispatch({ type: "START_PROCESSING" });

    try {
      const formData = buildProcessFormData(session);
      if (!formData) throw new Error("Cannot build form data");

      const response = await fetch("/api/process-receipt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Processing failed");
      }

      const result: ProcessingResult = await response.json();
      dispatch({ type: "PROCESSING_SUCCESS", result });
    } catch (err) {
      dispatch({
        type: "PROCESSING_FAILURE",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, [session]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET_SESSION" });
  }, []);

  const retry = useCallback(() => {
    dispatch({ type: "RETRY_PROCESSING" });
    process();
  }, [process]);

  const displayState = useMemo(() => getSessionDisplayState(session), [session]);
  const inputLabel = useMemo(() => getSessionInputLabel(session), [session]);
  const previewInfo = useMemo(() => getPreviewInfo(session), [session]);
  const optionInfo = useMemo(() => getOptionInfo(session.option), [session.option]);

  return {
    session,
    actions,
    canProcess: canProcess(session),
    displayState,
    inputLabel,
    previewInfo,
    optionInfo,
    reset,
    retry,
    process,
  };
}
