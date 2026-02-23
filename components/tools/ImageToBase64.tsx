"use client";
import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";

interface FileInfo {
  name: string;
  size: string;
  mime: string;
  dataUrl: string;
  base64: string;
  width?: number;
  height?: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageToBase64() {
  const t = useTranslations("ImageToBase64");
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [copiedField, setCopiedField] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function processFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(",")[1];
      const info: FileInfo = {
        name: file.name,
        size: formatBytes(file.size),
        mime: file.type || "unknown",
        dataUrl,
        base64,
      };
      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.onload = () => {
          setFileInfo({ ...info, width: img.naturalWidth, height: img.naturalHeight });
        };
        img.src = dataUrl;
      } else {
        setFileInfo(info);
      }
    };
    reader.readAsDataURL(file);
  }

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) processFile(files[0]);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function copy(text: string, field: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 1500);
    });
  }

  const truncate = (s: string) => (s.length > 80 ? s.slice(0, 80) + "..." : s);

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging ? "border-indigo-500 bg-indigo-500/10" : "border-gray-600 hover:border-gray-500"
        }`}
      >
        <div className="text-4xl mb-3">🖼</div>
        <p className="text-gray-300 text-sm">{t("dropZoneLabel")}</p>
        <p className="text-gray-500 text-xs mt-1">{t("dropZoneHint")}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {fileInfo && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-400">{t("previewLabel")}</div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fileInfo.dataUrl} alt={fileInfo.name} className="max-h-48 max-w-full rounded-lg object-contain" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              [t("fileName"), fileInfo.name],
              [t("fileSize"), fileInfo.size],
              [t("mimeType"), fileInfo.mime],
              ...(fileInfo.width ? [[t("dimensions"), `${fileInfo.width}×${fileInfo.height}`]] : []),
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{label}</div>
                <div className="text-white text-sm font-mono truncate">{value}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-400">{t("dataUrl")}</label>
              <button
                onClick={() => copy(fileInfo.dataUrl, "dataUrl")}
                className="text-xs px-2 py-1 text-gray-400 hover:text-white border border-gray-600 rounded-lg transition-colors"
              >
                {copiedField === "dataUrl" ? "Copied!" : t("copyDataUrl")}
              </button>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-xs font-mono text-gray-400 break-all">
              {truncate(fileInfo.dataUrl)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-400">{t("base64Only")}</label>
              <button
                onClick={() => copy(fileInfo.base64, "base64")}
                className="text-xs px-2 py-1 text-gray-400 hover:text-white border border-gray-600 rounded-lg transition-colors"
              >
                {copiedField === "base64" ? "Copied!" : t("copyBase64")}
              </button>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-xs font-mono text-gray-400 break-all">
              {truncate(fileInfo.base64)}
            </div>
          </div>

          <button
            onClick={() => setFileInfo(null)}
            className="text-sm px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
          >
            {t("clearButton")}
          </button>
        </div>
      )}
    </div>
  );
}
