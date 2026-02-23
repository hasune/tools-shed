"use client";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect, useCallback } from "react";
import QRCode from "qrcode";

export default function QrCodeGenerator() {
  const t = useTranslations("QrCodeGenerator");

  const [input, setInput] = useState("https://tools-shed.com");
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(async () => {
    if (!canvasRef.current || !input.trim()) return;
    try {
      await QRCode.toCanvas(canvasRef.current, input.trim(), {
        width: size,
        errorCorrectionLevel: errorLevel,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
    } catch {
      // invalid input
    }
  }, [input, size, errorLevel]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // fallback: do nothing
      }
    });
  };

  return (
    <div className="space-y-5">
      {/* Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">{t("inputLabel")}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none font-mono text-sm"
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t("sizeLabel")}</label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            {[128, 192, 256, 320, 512].map((s) => (
              <option key={s} value={s}>{s}×{s}px</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t("errorCorrectionLabel")}</label>
          <select
            value={errorLevel}
            onChange={(e) => setErrorLevel(e.target.value as "L" | "M" | "Q" | "H")}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="L">L — 7%</option>
            <option value="M">M — 15%</option>
            <option value="Q">Q — 25%</option>
            <option value="H">H — 30%</option>
          </select>
        </div>
      </div>

      {/* QR Canvas */}
      <div className="flex flex-col items-center gap-4">
        <div className="bg-white p-3 rounded-xl inline-block">
          <canvas ref={canvasRef} />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {t("downloadButton")}
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors"
          >
            {copied ? t("copied") : t("copyButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
