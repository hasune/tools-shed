"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type DiffLine =
  | { type: "added"; line: string; lineNum: number }
  | { type: "removed"; line: string; lineNum: number }
  | { type: "unchanged"; line: string; lineNum: number };

function computeDiff(original: string, modified: string): DiffLine[] {
  const origLines = original.split(/\r?\n/);
  const modLines = modified.split(/\r?\n/);

  // LCS-based diff using dynamic programming
  const m = origLines.length;
  const n = modLines.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (origLines[i - 1] === modLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  const result: DiffLine[] = [];
  let i = m;
  let j = n;
  let origLineNum = m;
  let modLineNum = n;

  const pending: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
      pending.unshift({ type: "unchanged", line: origLines[i - 1], lineNum: origLineNum });
      i--;
      j--;
      origLineNum--;
      modLineNum--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      pending.unshift({ type: "added", line: modLines[j - 1], lineNum: modLineNum });
      j--;
      modLineNum--;
    } else {
      pending.unshift({ type: "removed", line: origLines[i - 1], lineNum: origLineNum });
      i--;
      origLineNum--;
    }
  }

  result.push(...pending);
  return result;
}

export default function DiffChecker() {
  const t = useTranslations("DiffChecker");

  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diffResult, setDiffResult] = useState<DiffLine[] | null>(null);

  const handleCompare = () => {
    setDiffResult(computeDiff(original, modified));
  };

  const handleClear = () => {
    setOriginal("");
    setModified("");
    setDiffResult(null);
  };

  const addedCount = diffResult?.filter((l) => l.type === "added").length ?? 0;
  const removedCount = diffResult?.filter((l) => l.type === "removed").length ?? 0;
  const hasChanges = addedCount > 0 || removedCount > 0;

  return (
    <div className="space-y-6">
      {/* Two textareas side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">{t("originalLabel")}</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            rows={10}
            spellCheck={false}
            placeholder={t("originalLabel")}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono resize-y"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">{t("modifiedLabel")}</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            rows={10}
            spellCheck={false}
            placeholder={t("modifiedLabel")}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono resize-y"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCompare}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {t("compareButton")}
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg px-4 py-2 transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {/* Diff Result */}
      {diffResult !== null && (
        <div className="space-y-3">
          {/* Summary */}
          <div className="flex items-center gap-4 text-sm">
            {!hasChanges ? (
              <span className="text-gray-400">{t("noChanges")}</span>
            ) : (
              <>
                <span className="text-green-400">
                  +{addedCount} {t("addedLabel")}
                </span>
                <span className="text-red-400">
                  -{removedCount} {t("removedLabel")}
                </span>
              </>
            )}
          </div>

          {/* Diff lines */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-auto">
            <div className="font-mono text-sm">
              {diffResult.map((line, idx) => {
                const isAdded = line.type === "added";
                const isRemoved = line.type === "removed";

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 px-4 py-0.5 ${
                      isAdded
                        ? "bg-green-900/40"
                        : isRemoved
                        ? "bg-red-900/40"
                        : ""
                    }`}
                  >
                    <span
                      className={`select-none w-4 shrink-0 ${
                        isAdded
                          ? "text-green-400"
                          : isRemoved
                          ? "text-red-400"
                          : "text-gray-600"
                      }`}
                    >
                      {isAdded ? "+" : isRemoved ? "−" : " "}
                    </span>
                    <span
                      className={`break-all whitespace-pre-wrap ${
                        isAdded
                          ? "text-green-300"
                          : isRemoved
                          ? "text-red-300"
                          : "text-gray-400"
                      }`}
                    >
                      {line.line || " "}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
