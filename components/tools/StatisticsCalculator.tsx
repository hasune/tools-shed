"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function StatisticsCalculator() {
  const t = useTranslations("StatisticsCalculator");
  const tCommon = useTranslations("Common");
  const [input, setInput] = useState("");
  const [results, setResults] = useState<null | {
    count: number; sum: number; min: number; max: number; range: number;
    mean: number; median: number; mode: string; variance: number; stdDev: number;
    q1: number; q3: number; iqr: number; sorted: number[];
  }>(null);

  function parseNumbers(raw: string): number[] {
    return raw
      .split(/[\s,;]+/)
      .map(Number)
      .filter((n) => !isNaN(n));
  }

  function calcMedian(sorted: number[]): number {
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function quartile(sorted: number[], q: number): number {
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    return sorted[base + 1] !== undefined
      ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
      : sorted[base];
  }

  function calculate() {
    const nums = parseNumbers(input);
    if (nums.length === 0) return;
    const sorted = [...nums].sort((a, b) => a - b);
    const count = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;
    const mean = sum / count;
    const med = calcMedian(sorted);
    const freq: Record<number, number> = {};
    nums.forEach((n) => { freq[n] = (freq[n] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = maxFreq > 1 ? Object.keys(freq).filter((k) => freq[Number(k)] === maxFreq) : [];
    const modeStr = modes.length > 0 ? modes.join(", ") : t("noMode");
    const variance = nums.reduce((acc, n) => acc + (n - mean) ** 2, 0) / count;
    const stdDev = Math.sqrt(variance);
    const q1 = quartile(sorted, 0.25);
    const q3 = quartile(sorted, 0.75);
    const iqr = q3 - q1;
    setResults({ count, sum, min, max, range, mean, median: med, mode: modeStr, variance, stdDev, q1, q3, iqr, sorted });
  }

  const fmt = (n: number) => parseFloat(n.toPrecision(8)).toString();

  const stats = results
    ? [
        [t("count"), results.count],
        [t("sum"), fmt(results.sum)],
        [t("min"), fmt(results.min)],
        [t("max"), fmt(results.max)],
        [t("range"), fmt(results.range)],
        [t("mean"), fmt(results.mean)],
        [t("median"), fmt(results.median)],
        [t("mode"), results.mode],
        [t("variance"), fmt(results.variance)],
        [t("stdDev"), fmt(results.stdDev)],
        [t("q1"), fmt(results.q1)],
        [t("q3"), fmt(results.q3)],
        [t("iqr"), fmt(results.iqr)],
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{t("inputLabel")}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={4}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600 resize-none"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t("calculateButton")}
        </button>
        <button
          onClick={() => { setInput(""); setResults(null); }}
          className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 text-sm rounded-lg transition-colors"
        >
          {tCommon("clear")}
        </button>
      </div>
      {results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {stats.map(([label, value]) => (
              <div key={label as string} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{label}</div>
                <div className="text-white font-mono font-medium">{value}</div>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-400">{t("sortedData")}</div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white font-mono text-sm break-all">
              {results.sorted.join(", ")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
