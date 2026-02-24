"use client";
import { useTranslations } from "next-intl";
import { useState, useRef } from "react";

export default function ImageBase64() {
  const t = useTranslations("ImageBase64");

  const inputRef = useRef<HTMLInputElement>(null);
  const [dataUrl, setDataUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [imgInfo, setImgInfo] = useState({ width: 0, height: 0, type: "" });
  const [copied, setCopied] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function processFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    setFileSize(file.size);
    setImgInfo({ width: 0, height: 0, type: file.type });

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setDataUrl(url);
      const img = new Image();
      img.onload = () => setImgInfo({ width: img.width, height: img.height, type: file.type });
      img.src = url;
    };
    reader.readAsDataURL(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  const fmtSize = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`;
  const encodedSize = dataUrl.length;
  const htmlSnippet = dataUrl ? `<img src="${dataUrl}" alt="${fileName}" />` : "";
  const cssSnippet = dataUrl ? `background-image: url('${dataUrl}');` : "";

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragging ? "border-indigo-400 bg-indigo-900/20" : "border-gray-600 hover:border-indigo-500/60"}`}
      >
        <p className="text-gray-400 text-sm">{t("dropLabel")}</p>
        <p className="text-gray-600 text-xs mt-1">{t("supportedFormats")}</p>
        <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
      </div>

      {dataUrl && (
        <>
          {/* Image info */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-900 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">{t("fileSizeLabel")}</p>
              <p className="text-sm font-medium text-white">{fmtSize(fileSize)}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">{t("encodedSizeLabel")}</p>
              <p className="text-sm font-medium text-white">{fmtSize(encodedSize)}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">{t("imageInfoLabel")}</p>
              <p className="text-sm font-medium text-white">{imgInfo.width}×{imgInfo.height}</p>
            </div>
          </div>

          {/* Preview */}
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt={fileName} className="max-h-48 rounded-lg border border-gray-700 object-contain" />
          </div>

          {/* Data URL */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-300">{t("outputLabel")}</label>
              <button onClick={() => copy(dataUrl, "dataurl")}
                className="text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
                {copied === "dataurl" ? "Copied!" : t("copyButton")}
              </button>
            </div>
            <textarea
              readOnly value={dataUrl}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-gray-400 font-mono h-24 resize-none focus:outline-none"
            />
          </div>

          {/* HTML snippet */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-300">{t("htmlSnippetLabel")}</label>
              <button onClick={() => copy(htmlSnippet, "html")}
                className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                {copied === "html" ? "Copied!" : t("copyButton")}
              </button>
            </div>
            <pre className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap break-all">
              {htmlSnippet}
            </pre>
          </div>

          {/* CSS snippet */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-300">{t("cssSnippetLabel")}</label>
              <button onClick={() => copy(cssSnippet, "css")}
                className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                {copied === "css" ? "Copied!" : t("copyButton")}
              </button>
            </div>
            <pre className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre-wrap break-all">
              {cssSnippet}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
