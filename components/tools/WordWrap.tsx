"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

function wrapText(text: string, width: number, mode: "word" | "char"): string {
  if (!text || width <= 0) return text;
  const lines = text.split("\n");
  const result: string[] = [];

  for (const line of lines) {
    if (line.length <= width) {
      result.push(line);
      continue;
    }

    if (mode === "char") {
      let remaining = line;
      while (remaining.length > width) {
        result.push(remaining.slice(0, width));
        remaining = remaining.slice(width);
      }
      result.push(remaining);
    } else {
      // Word break
      const words = line.split(" ");
      let currentLine = "";
      for (const word of words) {
        if (currentLine.length === 0) {
          if (word.length > width) {
            // Single word longer than width — force break
            let remaining = word;
            while (remaining.length > width) {
              result.push(remaining.slice(0, width));
              remaining = remaining.slice(width);
            }
            currentLine = remaining;
          } else {
            currentLine = word;
          }
        } else if (currentLine.length + 1 + word.length <= width) {
          currentLine += " " + word;
        } else {
          result.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) result.push(currentLine);
    }
  }

  return result.join("\n");
}

export default function WordWrap() {
  const t = useTranslations("WordWrap");
  const [input, setInput] = useState("");
  const [width, setWidth] = useState(80);
  const [mode, setMode] = useState<"word" | "char">("word");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleWrap = () => {
    setOutput(wrapText(input, width, mode));
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
          rows={8}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm font-mono focus:outline-none focus:border-indigo-500 resize-y"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("columnWidthLabel")}: {width}
          </label>
          <input
            type="range"
            min={20}
            max={200}
            step={1}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>20</span>
            <span>200</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("breakModeLabel")}</label>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("word")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "word"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {t("breakWord")}
            </button>
            <button
              onClick={() => setMode("char")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "char"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {t("breakChar")}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleWrap}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {t("wrapButton")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">{t("outputLabel")}</label>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            >
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={10}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm font-mono resize-y"
          />
        </div>
      )}
    </div>
  );
}
