"use client";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

const UNICODE_NAMES: Map<number, string> = new Map([
  [0x0020, "SPACE"],
  [0x0021, "EXCLAMATION MARK"],
  [0x0022, "QUOTATION MARK"],
  [0x0023, "NUMBER SIGN"],
  [0x0024, "DOLLAR SIGN"],
  [0x0025, "PERCENT SIGN"],
  [0x0026, "AMPERSAND"],
  [0x0027, "APOSTROPHE"],
  [0x0028, "LEFT PARENTHESIS"],
  [0x0029, "RIGHT PARENTHESIS"],
  [0x002A, "ASTERISK"],
  [0x002B, "PLUS SIGN"],
  [0x002C, "COMMA"],
  [0x002D, "HYPHEN-MINUS"],
  [0x002E, "FULL STOP"],
  [0x002F, "SOLIDUS"],
  [0x003A, "COLON"],
  [0x003B, "SEMICOLON"],
  [0x003C, "LESS-THAN SIGN"],
  [0x003D, "EQUALS SIGN"],
  [0x003E, "GREATER-THAN SIGN"],
  [0x003F, "QUESTION MARK"],
  [0x0040, "COMMERCIAL AT"],
  [0x005B, "LEFT SQUARE BRACKET"],
  [0x005C, "REVERSE SOLIDUS"],
  [0x005D, "RIGHT SQUARE BRACKET"],
  [0x005E, "CIRCUMFLEX ACCENT"],
  [0x005F, "LOW LINE"],
  [0x0060, "GRAVE ACCENT"],
  [0x007B, "LEFT CURLY BRACKET"],
  [0x007C, "VERTICAL LINE"],
  [0x007D, "RIGHT CURLY BRACKET"],
  [0x007E, "TILDE"],
  [0x00A9, "COPYRIGHT SIGN"],
  [0x00AE, "REGISTERED SIGN"],
  [0x00B0, "DEGREE SIGN"],
  [0x00B7, "MIDDLE DOT"],
  [0x2013, "EN DASH"],
  [0x2014, "EM DASH"],
  [0x2018, "LEFT SINGLE QUOTATION MARK"],
  [0x2019, "RIGHT SINGLE QUOTATION MARK"],
  [0x201C, "LEFT DOUBLE QUOTATION MARK"],
  [0x201D, "RIGHT DOUBLE QUOTATION MARK"],
  [0x2026, "HORIZONTAL ELLIPSIS"],
  [0x20AC, "EURO SIGN"],
  [0x00A3, "POUND SIGN"],
  [0x00A5, "YEN SIGN"],
  [0x2665, "BLACK HEART SUIT"],
  [0x2764, "HEAVY BLACK HEART"],
  [0x2603, "SNOWMAN"],
]);

function getUnicodeName(cp: number): string {
  if (UNICODE_NAMES.has(cp)) return UNICODE_NAMES.get(cp)!;
  if (cp >= 0x30 && cp <= 0x39) return `DIGIT ${String.fromCodePoint(cp)}`;
  if (cp >= 0x41 && cp <= 0x5A) return `LATIN CAPITAL LETTER ${String.fromCodePoint(cp)}`;
  if (cp >= 0x61 && cp <= 0x7A) return `LATIN SMALL LETTER ${String.fromCodePoint(cp).toUpperCase()}`;
  return `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`;
}

function getCategory(cp: number): string {
  if (cp < 0x20 || cp === 0x7F) return "Control";
  if (cp === 0x20 || cp === 0x09 || cp === 0x0A || cp === 0x0D || cp === 0xA0) return "Space";
  if (cp >= 0x30 && cp <= 0x39) return "Digit";
  if (
    (cp >= 0x41 && cp <= 0x5A) ||
    (cp >= 0x61 && cp <= 0x7A) ||
    cp >= 0x00C0
  ) {
    // Refine: emoji/symbol ranges should not be Letter
    if (cp >= 0x2600 && cp <= 0x27FF) return "Symbol";
    if (cp >= 0x1F000) return "Symbol";
    if (cp >= 0x00C0 && cp <= 0x024F) return "Letter";
    if (cp >= 0x41) return "Letter";
  }
  if (
    (cp >= 0x21 && cp <= 0x2F) ||
    (cp >= 0x3A && cp <= 0x40) ||
    (cp >= 0x5B && cp <= 0x60) ||
    (cp >= 0x7B && cp <= 0x7E) ||
    (cp >= 0x2010 && cp <= 0x205E)
  ) return "Punctuation";
  if (
    cp === 0x24 || cp === 0x2B || cp === 0x3C || cp === 0x3D || cp === 0x3E ||
    (cp >= 0x20A0 && cp <= 0x20CF) ||
    (cp >= 0x2100 && cp <= 0x214F) ||
    (cp >= 0x2600 && cp <= 0x27FF) ||
    cp >= 0x1F000
  ) return "Symbol";
  return "Other";
}

interface CharInfo {
  char: string;
  codePoint: string;
  name: string;
  category: string;
  htmlEntity: string;
}

function analyzeText(text: string): CharInfo[] {
  const results: CharInfo[] = [];
  for (const char of text) {
    const cp = char.codePointAt(0)!;
    const hex = cp.toString(16).toUpperCase().padStart(4, "0");
    results.push({
      char,
      codePoint: `U+${hex}`,
      name: getUnicodeName(cp),
      category: getCategory(cp),
      htmlEntity: `&#x${hex};`,
    });
  }
  return results;
}

const CATEGORY_COLORS: Record<string, string> = {
  Letter: "text-green-400",
  Digit: "text-blue-400",
  Punctuation: "text-yellow-400",
  Symbol: "text-pink-400",
  Space: "text-gray-400",
  Control: "text-red-400",
  Other: "text-gray-400",
};

export default function UnicodeInspector() {
  const t = useTranslations("UnicodeInspector");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const rows = input ? analyzeText(input) : [];

  const handleCopyAll = useCallback(async () => {
    if (!rows.length) return;
    const header = [t("columnChar"), t("columnCodePoint"), t("columnName"), t("columnCategory"), t("columnHtmlEntity")].join("\t");
    const body = rows
      .map((r) => [r.char, r.codePoint, r.name, r.category, r.htmlEntity].join("\t"))
      .join("\n");
    await navigator.clipboard.writeText(`${header}\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [rows, t]);

  const handleClear = () => {
    setInput("");
    setCopied(false);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("inputLabel")}
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCopyAll}
          disabled={!rows.length}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {copied ? "✓ Copied" : t("copyAll")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium rounded-lg transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {/* Table */}
      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="px-4 py-3 text-left text-gray-400 font-medium">{t("columnChar")}</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">{t("columnCodePoint")}</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">{t("columnName")}</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">{t("columnCategory")}</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">{t("columnHtmlEntity")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-700/50 last:border-0 hover:bg-gray-700/20 transition-colors"
                >
                  <td className="px-4 py-2.5 font-mono text-white text-base">
                    {row.category === "Space" || row.category === "Control"
                      ? <span className="text-gray-500 text-xs">[{row.category.toLowerCase()}]</span>
                      : row.char}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-indigo-400">{row.codePoint}</td>
                  <td className="px-4 py-2.5 text-gray-300 font-mono text-xs">{row.name}</td>
                  <td className={`px-4 py-2.5 text-xs font-medium ${CATEGORY_COLORS[row.category] ?? "text-gray-400"}`}>
                    {row.category}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-gray-400 text-xs">{row.htmlEntity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length === 0 && input === "" && (
        <p className="text-gray-500 text-sm text-center py-8">
          {t("inputPlaceholder")}
        </p>
      )}
    </div>
  );
}
