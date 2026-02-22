"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface Match {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexTester() {
  const t = useTranslations("RegexTester");

  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [error, setError] = useState("");

  const { matches, highlighted } = useMemo<{ matches: Match[]; highlighted: string }>(() => {
    if (!pattern || !testString) {
      return { matches: [], highlighted: escapeHtml(testString) };
    }
    try {
      const safeFlags = flags.includes("g") ? flags : flags + "g";
      const regex = new RegExp(pattern, safeFlags);
      const allMatches = [...testString.matchAll(regex)];

      const matchList: Match[] = allMatches.map((m) => ({
        match: m[0],
        index: m.index ?? 0,
        groups: m.slice(1),
      }));

      // Build highlighted string
      let result = "";
      let lastIndex = 0;
      for (const m of allMatches) {
        const start = m.index ?? 0;
        const end = start + m[0].length;
        result += escapeHtml(testString.slice(lastIndex, start));
        result += `<mark class="bg-indigo-500/40 text-indigo-200 rounded px-0.5">${escapeHtml(m[0])}</mark>`;
        lastIndex = end;
      }
      result += escapeHtml(testString.slice(lastIndex));

      setError("");
      return { matches: matchList, highlighted: result };
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid regex");
      return { matches: [], highlighted: escapeHtml(testString) };
    }
  }, [pattern, flags, testString]);

  const toggleFlag = (f: string) => {
    setFlags((prev) => (prev.includes(f) ? prev.replace(f, "") : prev + f));
  };

  const FLAG_OPTIONS = [
    { flag: "g", label: t("flagGlobal") },
    { flag: "i", label: t("flagCaseInsensitive") },
    { flag: "m", label: t("flagMultiline") },
    { flag: "s", label: t("flagDotAll") },
  ];

  return (
    <div className="space-y-4">
      {/* Pattern input */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">{t("patternLabel")}</label>
        <div className="flex items-center bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 gap-1 focus-within:border-indigo-500 transition-colors">
          <span className="text-gray-500 font-mono text-sm select-none">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="flex-1 bg-transparent text-white font-mono text-sm focus:outline-none"
            placeholder={t("patternPlaceholder")}
            spellCheck={false}
          />
          <span className="text-gray-500 font-mono text-sm select-none">/{flags || " "}</span>
        </div>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-2">
        {FLAG_OPTIONS.map(({ flag, label }) => (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              flags.includes(flag)
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <span className="font-mono">{flag}</span>
            <span className="text-gray-300 ml-1">— {label}</span>
          </button>
        ))}
      </div>

      {/* Test string */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">{t("testStringLabel")}</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 text-white font-mono text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 resize-none"
          placeholder={t("testStringPlaceholder")}
          rows={5}
          spellCheck={false}
        />
      </div>

      {/* Highlighted result */}
      {testString && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">{t("matchesLabel")}</label>
            {pattern && !error && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  matches.length > 0
                    ? "bg-green-900/50 text-green-400"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {matches.length} {matches.length === 1 ? t("matchSingular") : t("matchPlural")}
              </span>
            )}
          </div>
          <div
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-300 whitespace-pre-wrap break-all min-h-16"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      )}

      {/* Match details */}
      {matches.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">{t("matchDetailsLabel")}</label>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {matches.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-xs"
              >
                <span className="text-gray-500 shrink-0">#{i + 1}</span>
                <span className="font-mono text-indigo-300 flex-1 truncate">
                  {m.match || t("emptyMatch")}
                </span>
                <span className="text-gray-500 shrink-0">
                  {t("index")}: {m.index}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
