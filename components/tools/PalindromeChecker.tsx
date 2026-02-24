"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function PalindromeChecker() {
  const t = useTranslations("PalindromeChecker");
  const [input, setInput] = useState("");
  const [ignoreSpaces, setIgnoreSpaces] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const clear = () => setInput("");

  function normalize(s: string): string {
    let result = s;
    if (ignoreSpaces) result = result.replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, "");
    if (!caseSensitive) result = result.toLowerCase();
    return result;
  }

  const trimmed = input.trim();
  const normalized = normalize(trimmed);
  const reversed = normalized.split("").reverse().join("");
  const isPalindrome = normalized.length > 0 && normalized === reversed;
  const hasResult = trimmed.length > 0;

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("inputLabel")}</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={ignoreSpaces}
            onChange={(e) => setIgnoreSpaces(e.target.checked)}
            className="w-4 h-4 accent-indigo-500"
          />
          <span className="text-sm text-gray-300">{t("ignoreSpaces")}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4 accent-indigo-500"
          />
          <span className="text-sm text-gray-300">{t("caseSensitive")}</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button onClick={clear} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {hasResult && (
        <div className={`border rounded-xl p-5 space-y-3 ${isPalindrome ? "bg-green-950/40 border-green-700" : "bg-red-950/40 border-red-800"}`}>
          <p className={`text-base font-semibold ${isPalindrome ? "text-green-400" : "text-red-400"}`}>
            {isPalindrome
              ? t("isPalindrome", { text: trimmed })
              : t("notPalindrome", { text: trimmed })}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">{t("normalizedLabel")}</p>
              <p className="font-mono text-sm text-gray-300 bg-gray-900 rounded-lg px-3 py-2 break-all">{normalized}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{t("reversedLabel")}</p>
              <p className={`font-mono text-sm rounded-lg px-3 py-2 break-all ${isPalindrome ? "text-green-300 bg-green-900/30" : "text-red-300 bg-red-900/30"}`}>{reversed}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
