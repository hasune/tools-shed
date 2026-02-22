"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type SeparatorMode = "newline" | "space" | "none" | "custom";

export default function TextRepeater() {
  const t = useTranslations("TextRepeater");
  const tCommon = useTranslations("Common");

  const [input, setInput] = useState("");
  const [count, setCount] = useState(3);
  const [separatorMode, setSeparatorMode] = useState<SeparatorMode>("newline");
  const [customSeparator, setCustomSeparator] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const getSeparator = (): string => {
    switch (separatorMode) {
      case "newline": return "\n";
      case "space": return " ";
      case "none": return "";
      case "custom": return customSeparator;
    }
  };

  const handleRepeat = () => {
    if (!input || count < 1) return;
    const sep = getSeparator();
    setOutput(Array(count).fill(input).join(sep));
  };

  const handleClear = () => {
    setInput("");
    setCount(3);
    setSeparatorMode("newline");
    setCustomSeparator("");
    setOutput("");
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const separatorOptions: { key: SeparatorMode; labelKey: "newline" | "space" | "none" | "custom" }[] = [
    { key: "newline", labelKey: "newline" },
    { key: "space", labelKey: "space" },
    { key: "none", labelKey: "none" },
    { key: "custom", labelKey: "custom" },
  ];

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">{t("inputLabel")}</label>
        <textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600 resize-y"
        />
      </div>

      {/* Count */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">{t("countLabel")}</label>
        <input
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Separator */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{t("separatorLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {separatorOptions.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setSeparatorMode(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                separatorMode === key
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
        {separatorMode === "custom" && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">{t("customSeparatorLabel")}</label>
            <input
              type="text"
              value={customSeparator}
              onChange={(e) => setCustomSeparator(e.target.value)}
              placeholder=", "
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleRepeat}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {t("repeatButton")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          {tCommon("clear")}
        </button>
      </div>

      {/* Output */}
      {output && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">{t("outputLabel")}</label>
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1 bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white rounded transition-colors"
            >
              {copied ? tCommon("copied") : tCommon("copy")}
            </button>
          </div>
          <textarea
            rows={8}
            value={output}
            readOnly
            className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none resize-y"
          />
        </div>
      )}
    </div>
  );
}
