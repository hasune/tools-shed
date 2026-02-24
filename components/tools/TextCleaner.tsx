"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function TextCleaner() {
  const t = useTranslations("TextCleaner");
  const [input, setInput] = useState("");
  const [opts, setOpts] = useState({
    removeExtraSpaces: true,
    removeEmptyLines: true,
    trimLines: true,
    removeHtml: false,
    removeSpecialChars: false,
    lowercaseAll: false,
  });
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const toggle = (key: keyof typeof opts) => setOpts((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleClean = () => {
    let text = input;
    if (opts.removeHtml) text = text.replace(/<[^>]*>/g, "");
    if (opts.trimLines) text = text.split("\n").map((l) => l.trim()).join("\n");
    if (opts.removeExtraSpaces) text = text.replace(/[ \t]+/g, " ");
    if (opts.removeEmptyLines) text = text.split("\n").filter((l) => l.trim() !== "").join("\n");
    if (opts.removeSpecialChars) text = text.replace(/[^\w\s.,!?;:()\-'"]/g, "");
    if (opts.lowercaseAll) text = text.toLowerCase();
    setOutput(text);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const OPTIONS = [
    { key: "removeExtraSpaces", label: t("removeExtraSpaces") },
    { key: "removeEmptyLines", label: t("removeEmptyLines") },
    { key: "trimLines", label: t("trimLines") },
    { key: "removeHtml", label: t("removeHtml") },
    { key: "removeSpecialChars", label: t("removeSpecialChars") },
    { key: "lowercaseAll", label: t("lowercaseAll") },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("inputLabel")}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={6}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600 resize-y"
        />
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {OPTIONS.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
            <input
              type="checkbox"
              checked={opts[key]}
              onChange={() => toggle(key)}
              className="w-4 h-4 accent-indigo-500"
            />
            {label}
          </label>
        ))}
      </div>

      <button
        onClick={handleClean}
        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {t("cleanButton")}
      </button>

      {output !== "" && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">{t("outputLabel")}</label>
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              {copied ? "Copied!" : t("copyButton")}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={6}
            className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2.5 resize-y"
          />
        </div>
      )}
    </div>
  );
}
