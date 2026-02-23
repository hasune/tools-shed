"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

const ROMAN_MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

const REFERENCE = [
  ["I", "1"], ["V", "5"], ["X", "10"], ["L", "50"],
  ["C", "100"], ["D", "500"], ["M", "1000"],
];

function toRoman(n: number): string {
  if (n < 1 || n > 3999) return "";
  let result = "";
  for (const [val, sym] of ROMAN_MAP) {
    while (n >= val) { result += sym; n -= val; }
  }
  return result;
}

function fromRoman(s: string): number {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const upper = s.toUpperCase().trim();
  if (!upper || !/^[IVXLCDM]+$/.test(upper)) return -1;
  let result = 0;
  for (let i = 0; i < upper.length; i++) {
    const cur = map[upper[i]];
    const next = map[upper[i + 1]] || 0;
    result += cur < next ? -cur : cur;
  }
  return result;
}

export default function RomanNumeralConverter() {
  const t = useTranslations("RomanNumeralConverter");
  const [arabic, setArabic] = useState("");
  const [roman, setRoman] = useState("");
  const [arabicError, setArabicError] = useState("");
  const [romanError, setRomanError] = useState("");

  function handleArabicChange(val: string) {
    setArabic(val);
    const n = parseInt(val);
    if (!val) { setRoman(""); setArabicError(""); return; }
    if (isNaN(n) || n < 1 || n > 3999) { setArabicError(t("invalidArabic")); setRoman(""); return; }
    setArabicError("");
    setRoman(toRoman(n));
  }

  function handleRomanChange(val: string) {
    setRoman(val);
    if (!val) { setArabic(""); setRomanError(""); return; }
    const n = fromRoman(val);
    if (n <= 0) { setRomanError(t("invalidRoman")); setArabic(""); return; }
    setRomanError("");
    setArabic(String(n));
  }

  const inputCls =
    "w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">{t("arabicLabel")}</label>
          <input
            type="number"
            value={arabic}
            onChange={(e) => handleArabicChange(e.target.value)}
            placeholder={t("arabicPlaceholder")}
            className={inputCls}
          />
          {arabicError && <p className="text-red-400 text-xs">{arabicError}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">{t("romanLabel")}</label>
          <input
            type="text"
            value={roman}
            onChange={(e) => handleRomanChange(e.target.value)}
            placeholder={t("romanPlaceholder")}
            className={`${inputCls} uppercase`}
          />
          {romanError && <p className="text-red-400 text-xs">{romanError}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-400">{t("referenceTitle")}</div>
        <div className="flex flex-wrap gap-2">
          {REFERENCE.map(([sym, val]) => (
            <div key={sym} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
              <span className="text-indigo-400 font-mono font-bold">{sym}</span>
              <span className="text-gray-400 ml-2">= {val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
