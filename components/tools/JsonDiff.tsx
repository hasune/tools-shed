"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

type DiffType = "added" | "removed" | "changed";

interface DiffEntry {
  type: DiffType;
  key: string;
  oldValue?: unknown;
  newValue?: unknown;
}

function flattenObject(obj: unknown, prefix = ""): Record<string, unknown> {
  if (typeof obj !== "object" || obj === null) return { [prefix]: obj };
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      Object.assign(result, flattenObject(v, key));
    } else {
      result[key] = v;
    }
  }
  return result;
}

function diffObjects(a: unknown, b: unknown): DiffEntry[] {
  const flatA = flattenObject(a);
  const flatB = flattenObject(b);
  const allKeys = new Set([...Object.keys(flatA), ...Object.keys(flatB)]);
  const diffs: DiffEntry[] = [];

  for (const key of allKeys) {
    const inA = key in flatA;
    const inB = key in flatB;
    if (inA && !inB) {
      diffs.push({ type: "removed", key, oldValue: flatA[key] });
    } else if (!inA && inB) {
      diffs.push({ type: "added", key, newValue: flatB[key] });
    } else if (JSON.stringify(flatA[key]) !== JSON.stringify(flatB[key])) {
      diffs.push({ type: "changed", key, oldValue: flatA[key], newValue: flatB[key] });
    }
  }

  return diffs.sort((a, b) => a.key.localeCompare(b.key));
}

function formatValue(val: unknown): string {
  if (val === undefined) return "";
  if (val === null) return "null";
  if (typeof val === "string") return `"${val}"`;
  return JSON.stringify(val);
}

export default function JsonDiff() {
  const t = useTranslations("JsonDiff");
  const [leftJson, setLeftJson] = useState("");
  const [rightJson, setRightJson] = useState("");
  const [diffs, setDiffs] = useState<DiffEntry[] | null>(null);
  const [error, setError] = useState("");

  const handleCompare = () => {
    setError("");
    setDiffs(null);
    let a: unknown, b: unknown;
    try {
      a = JSON.parse(leftJson);
    } catch {
      setError(t("invalidJsonA"));
      return;
    }
    try {
      b = JSON.parse(rightJson);
    } catch {
      setError(t("invalidJsonB"));
      return;
    }
    setDiffs(diffObjects(a, b));
  };

  const handleClear = () => {
    setLeftJson("");
    setRightJson("");
    setDiffs(null);
    setError("");
  };

  const typeColors: Record<DiffType, string> = {
    added: "text-green-400",
    removed: "text-red-400",
    changed: "text-yellow-400",
  };

  const typeBg: Record<DiffType, string> = {
    added: "bg-green-500/10 border-green-500/30",
    removed: "bg-red-500/10 border-red-500/30",
    changed: "bg-yellow-500/10 border-yellow-500/30",
  };

  const typeLabel = (type: DiffType) => {
    if (type === "added") return t("addedLabel");
    if (type === "removed") return t("removedLabel");
    return t("changedLabel");
  };

  const addedCount = diffs?.filter((d) => d.type === "added").length ?? 0;
  const removedCount = diffs?.filter((d) => d.type === "removed").length ?? 0;
  const changedCount = diffs?.filter((d) => d.type === "changed").length ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("leftLabel")}</label>
          <textarea
            value={leftJson}
            onChange={(e) => setLeftJson(e.target.value)}
            placeholder={t("leftPlaceholder")}
            rows={12}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm font-mono focus:outline-none focus:border-indigo-500 resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("rightLabel")}</label>
          <textarea
            value={rightJson}
            onChange={(e) => setRightJson(e.target.value)}
            placeholder={t("rightPlaceholder")}
            rows={12}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm font-mono focus:outline-none focus:border-indigo-500 resize-y"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleCompare}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {t("compareButton")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {diffs !== null && (
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h3 className="font-medium text-gray-200">{t("resultsTitle")}</h3>
            {diffs.length > 0 && (
              <div className="flex gap-3 text-sm">
                {addedCount > 0 && <span className="text-green-400">+{addedCount} {t("addedLabel")}</span>}
                {removedCount > 0 && <span className="text-red-400">−{removedCount} {t("removedLabel")}</span>}
                {changedCount > 0 && <span className="text-yellow-400">~{changedCount} {t("changedLabel")}</span>}
              </div>
            )}
          </div>

          {diffs.length === 0 ? (
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-6 text-center text-gray-400">
              {t("noChanges")}
            </div>
          ) : (
            <div className="space-y-2">
              {diffs.map((diff, i) => (
                <div
                  key={i}
                  className={`rounded-lg border px-4 py-3 text-sm font-mono ${typeBg[diff.type]}`}
                >
                  <div className="flex items-start gap-3 flex-wrap">
                    <span className={`font-semibold shrink-0 ${typeColors[diff.type]}`}>
                      [{typeLabel(diff.type)}]
                    </span>
                    <span className="text-gray-300 break-all">{diff.key}</span>
                  </div>
                  {diff.type === "changed" && (
                    <div className="mt-1 space-y-0.5 pl-4">
                      <div className="text-red-400">− {formatValue(diff.oldValue)}</div>
                      <div className="text-green-400">+ {formatValue(diff.newValue)}</div>
                    </div>
                  )}
                  {diff.type === "removed" && (
                    <div className="mt-1 pl-4 text-red-300">{formatValue(diff.oldValue)}</div>
                  )}
                  {diff.type === "added" && (
                    <div className="mt-1 pl-4 text-green-300">{formatValue(diff.newValue)}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
