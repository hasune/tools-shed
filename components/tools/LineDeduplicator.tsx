"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function LineDeduplicator() {
  const t = useTranslations("LineDeduplicator");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<{ original: number; unique: number; removed: number } | null>(null);
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [sortResult, setSortResult] = useState(false);
  const [copied, setCopied] = useState(false);

  function process() {
    let lines = input.split("\n");
    const original = lines.length;
    if (trimLines) lines = lines.map((l) => l.trim());
    if (removeEmpty) lines = lines.filter((l) => l.length > 0);
    const seen = new Set<string>();
    const unique = lines.filter((line) => {
      const key = caseInsensitive ? line.toLowerCase() : line;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (sortResult) {
      unique.sort((a, b) =>
        caseInsensitive ? a.toLowerCase().localeCompare(b.toLowerCase()) : a.localeCompare(b)
      );
    }
    setOutput(unique.join("\n"));
    setStats({ original, unique: unique.length, removed: original - unique.length });
  }

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const textareaCls =
    "w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600 resize-none font-mono";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {([
          [caseInsensitive, setCaseInsensitive, t("optionCaseInsensitive")],
          [trimLines, setTrimLines, t("optionTrimLines")],
          [removeEmpty, setRemoveEmpty, t("optionRemoveEmpty")],
          [sortResult, setSortResult, t("optionSort")],
        ] as [boolean, (v: boolean) => void, string][]).map(([checked, setter, label]) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setter(e.target.checked)}
              className="accent-indigo-500"
            />
            <span className="text-sm text-gray-400">{label}</span>
          </label>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">{t("inputLabel")}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            rows={10}
            className={textareaCls}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">{t("outputLabel")}</label>
            {output && (
              <button
                onClick={copy}
                className="text-xs px-2 py-1 text-gray-400 hover:text-white border border-gray-600 rounded-lg transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <textarea value={output} readOnly rows={10} className={`${textareaCls} cursor-default`} />
        </div>
      </div>
      <button
        onClick={process}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {t("processButton")}
      </button>
      {stats && (
        <div className="flex flex-wrap gap-3">
          {([
            [t("originalLines"), stats.original],
            [t("uniqueLines"), stats.unique],
            [t("removedLines"), stats.removed],
          ] as [string, number][]).map(([label, value]) => (
            <div key={label} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm">
              <span className="text-gray-400">{label}: </span>
              <span className="text-white font-medium">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
