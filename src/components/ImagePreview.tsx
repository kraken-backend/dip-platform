// Path: src/components/ImagePreview.tsx
"use client";

import { useState } from "react";

interface ImagePreviewProps {
  src: string;
  fileName: string;
  fileSize?: number;
  onClear?: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImagePreview({ src, fileName, fileSize, onClear }: ImagePreviewProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="glass-panel rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-700">
      <div className="aspect-[3/4] bg-gray-50 dark:bg-gray-950/80 relative flex items-center justify-center p-2 border-b border-gray-100 dark:border-gray-850">
        {!loaded && (
          <div className="absolute inset-0 shimmer-effect" aria-hidden="true" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={fileName}
          onLoad={() => setLoaded(true)}
          className={`max-w-full max-h-full object-contain rounded shadow-sm transition-opacity duration-500 ${
            loaded ? "opacity-100 image-reveal" : "opacity-0"
          }`}
        />
      </div>
      <div className="p-3 flex items-center justify-between bg-white/50 dark:bg-gray-900/30">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-gray-900 dark:text-white truncate" title={fileName}>{fileName}</p>
          {fileSize !== undefined && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
              {formatFileSize(fileSize)} • Portrait preview mode
            </p>
          )}
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="ml-3 p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
            title="Clear Ingest Selection"
            aria-label="Clear selected document"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
