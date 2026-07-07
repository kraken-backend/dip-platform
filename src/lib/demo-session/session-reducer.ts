import type { DemoSession, DemoSessionAction } from "./types";
import type { ProcessingOption } from "@/lib/receipt/types";

export function createInitialSession(
  option: ProcessingOption = 1 as ProcessingOption
): DemoSession {
  return {
    option,
    status: "idle",
    inputMode: "none",
    selectedSample: null,
    uploadedFile: null,
    uploadPreviewSrc: null,
    result: null,
    errorMessage: "",
    history: [],
  };
}

export function sessionReducer(
  state: DemoSession,
  action: DemoSessionAction
): DemoSession {
  switch (action.type) {
    case "SELECT_OPTION": {
      return {
        ...state,
        option: action.option,
        status: state.status === "idle" ? "option_selected" : state.status,
      };
    }

    case "SELECT_SAMPLE": {
      return {
        ...state,
        inputMode: "sample",
        selectedSample: action.sample,
        uploadedFile: null,
        uploadPreviewSrc: null,
        result: null,
        errorMessage: "",
        status: "sample_selected",
      };
    }

    case "SELECT_FILE": {
      return {
        ...state,
        inputMode: "upload",
        selectedSample: null,
        uploadedFile: action.file,
        uploadPreviewSrc: action.previewSrc,
        result: null,
        errorMessage: "",
        status: "file_selected",
      };
    }

    case "CLEAR_INPUT": {
      return {
        ...state,
        inputMode: "none",
        selectedSample: null,
        uploadedFile: null,
        uploadPreviewSrc: null,
        result: null,
        errorMessage: "",
        status: "idle",
      };
    }

    case "START_PROCESSING": {
      return {
        ...state,
        status: "processing",
        result: null,
        errorMessage: "",
      };
    }

    case "PROCESSING_SUCCESS": {
      const nextStatus = "completed" as DemoSession["status"];
      return {
        ...state,
        status: nextStatus,
        result: action.result,
        errorMessage: "",
      };
    }

    case "PROCESSING_FAILURE": {
      return {
        ...state,
        status: "failed",
        errorMessage: action.error,
      };
    }

    case "RESET_SESSION": {
      return {
        ...state,
        status: "idle",
        inputMode: "none",
        selectedSample: null,
        uploadedFile: null,
        uploadPreviewSrc: null,
        result: null,
        errorMessage: "",
      };
    }

    case "RETRY_PROCESSING": {
      return {
        ...state,
        status: "processing",
        result: null,
        errorMessage: "",
      };
    }

    case "ADD_HISTORY_ITEM": {
      return {
        ...state,
        history: [...state.history, action.item],
      };
    }

    default:
      return state;
  }
}
