"use client";

import { useCallback, useRef, useState } from "react";

  interface FileUploadProps {
    onExtracted: (text: string, fileName: string) => void;
  disabled?: boolean;
}

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"];

export default function FileUpload({ onExtracted, disabled }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "parsing" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const isAccepted = (name: string) =>
    ACCEPTED_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext));

  const handleFile = useCallback(
    async (file: File) => {
      if (!isAccepted(file.name)) {
        setError("Please upload a PDF, DOCX, or TXT file.");
        setStatus("error");
        return;
}
      if (file.size > 8 * 1024 * 1024) {
        setError("File is too large. Max size is 8MB.");
        setStatus("error");
        return;
}

      setFileName(file.name);
      setStatus("parsing");
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
});

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Could not read that file.");
}

        onExtracted(data.text as string, file.name);
        setStatus("done");
} catch (err) {
        const message = err instanceof Error ? err.message : "Could not read that file.";
        setError(message);
        setStatus("error");
}
},
    [onExtracted]
  );

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    setDragActive(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
        <div
          onDragOver={(e) => {
            e.preventDefault();
        if (!disabled) setDragActive(true);
}}
      onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => !disabled && inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition ${
                dragActive
                  ? "border-brand-500 bg-brand-50"
                  : "border-slate-300 bg-white hover:border-brand-300 hover:bg-brand-50/40"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <input
                ref={inputRef}
        type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                disabled={disabled}
        onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                  e.target.value = "";
                  }}
              />

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
      </div>

        {status === "parsing" && (
                <p className="text-sm font-medium text-brand-600">Reading {fileName}...</p>
              )}
        {status !== "parsing" && (
                <>
                  <p className="text-sm font-semibold text-slate-700">
                    Drag & drop your resume, or <span className="text-brand-600">browse files</span>
          </p>
          <p className="text-xs text-slate-400">PDF, DOCX, or TXT - up to 8MB</p>
                </>
              )}
        {status === "done" && fileName && (
                <p className="mt-1 text-xs font-medium text-emerald-600">Uploaded: {fileName}</p>
              )}
{status === "error" && error && (
          <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>
        )}
      </div>
    );
}
