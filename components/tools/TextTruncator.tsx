"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function TextTruncator() {
  const t = useTranslations("TextTruncator");
  const [input, setInput] = useState("");
  const [limit, setLimit] = useState(100);
  const [mode, setMode] = useState<"chars" | "words">("chars");
  const [ellipsis, setEllipsis] = useState("...");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const origChars = input.length;
  const origWords = input.trim() ? input.trim().split(/\s+/).length : 0;
  const truncChars = output.length;
  const truncWords = output.trim() ? output.trim().split(/\s+/).length : 0;

  const handleTruncate = () => {
    if (mode === "chars") {
      if (input.length <= limit) {
        setOutput(input);
      } else {
        setOutput(input.slice(0, limit - ellipsis.length) + ellipsis);
      }
    } else {
      const words = input.trim().split(/\s+/);
      if (words.length <= limit) {
        setOutput(input);
      } else {
        setOutput(words.slice(0, limit).join(" ") + ellipsis);
      }
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t("inputLabel")}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={6}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-indigo-500 resize-y"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("modeLabel")}</label>
          <div className="flex gap-2">
            {(["chars", "words"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                {t(m === "chars" ? "modeChars" : "modeWords")}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("limitLabel")}: {limit}
          </label>
          <input
            type="number"
            value={limit}
            min={1}
            onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("ellipsisLabel")}</label>
          <input
            type="text"
            value={ellipsis}
            onChange={(e) => setEllipsis(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleTruncate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
          {t("truncateButton")}
        </button>
        <button onClick={handleClear} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">{t("outputLabel")}</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                {t("statsOriginal")}: {origChars} {t("chars")} / {origWords} {t("words")}
                {" → "}
                {t("statsTruncated")}: {truncChars} {t("chars")} / {truncWords} {t("words")}
              </span>
              <button onClick={handleCopy} className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded">
                {copied ? t("copiedButton") : t("copyButton")}
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            rows={6}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm resize-y"
          />
        </div>
      )}
    </div>
  );
}
