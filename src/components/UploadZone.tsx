"use client";

import { useState, useRef, useCallback } from "react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFile = useCallback((file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/tiff"];
    return validTypes.includes(file.type);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const triggerSelectAnimation = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file && isValidFile(file)) {
        setSelectedFile(file);
        triggerSelectAnimation();
        onFileSelect(file);
      }
    },
    [disabled, onFileSelect, isValidFile, triggerSelectAnimation]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && isValidFile(file)) {
        setSelectedFile(file);
        triggerSelectAnimation();
        onFileSelect(file);
      }
    },
    [onFileSelect, isValidFile, triggerSelectAnimation]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`
        relative rounded-xl border-2 border-dashed
        transition-all duration-300 cursor-pointer
        ${isAnimating ? "scale-[1.02] border-emerald-500" : ""}
        ${isDragging
          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-lg shadow-blue-500/10"
          : selectedFile
            ? "border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10"
            : "border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 hover:shadow-sm bg-white dark:bg-gray-900/30"}
        ${disabled ? "opacity-40 pointer-events-none" : ""}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload document image"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/tiff"
        className="hidden"
        onChange={handleFileInput}
        disabled={disabled}
      />

      <div className="p-6 flex flex-col items-center justify-center gap-3 text-center">
        {selectedFile ? (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/45 flex items-center justify-center shadow-inner">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{selectedFile.name}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{formatFileSize(selectedFile.size)}</p>
            </div>
            <p className="text-[9px] text-gray-400 dark:text-gray-500">Drag or click to replace document</p>
          </>
        ) : (
          <>
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center shadow-sm
              transition-all duration-300
              ${isDragging ? "bg-blue-100 dark:bg-blue-900/40 scale-110" : "bg-gray-100 dark:bg-gray-800/80"}
            `}>
              <svg className={`w-6 h-6 transition-colors duration-300 ${isDragging ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 dark:text-white">
                {isDragging ? "Drop Document Image" : "Upload Ingestion Image"}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                Drag & drop image or browse files
              </p>
            </div>
            <p className="text-[9px] text-gray-400 dark:text-gray-500">Supports JPG, PNG, WebP, TIFF</p>
          </>
        )}
      </div>
    </div>
  );
}
