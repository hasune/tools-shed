"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

const SAMPLE_DATA = "45, 67, 72, 55, 89, 91, 38, 77, 60, 83, 50, 95, 42, 68, 74, 56, 88, 61, 79, 52";

function parseData(raw: string): number[] {
  return raw
    .split(/[\s,;\n]+/)
    .map(s => parseFloat(s.trim()))
    .filter(n => !isNaN(n));
}

function mean(data: number[]): number {
  return data.reduce((a, b) => a + b, 0) / data.length;
}

function stddev(data: number[], m: number): number {
  return Math.sqrt(data.reduce((s, x) => s + (x - m) ** 2, 0) / data.length);
}

// Percentile rank of value in dataset (linear interpolation)
function percentileRank(sorted: number[], value: number): number {
  const below = sorted.filter(x => x < value).length;
  const equal = sorted.filter(x => x === value).length;
  return ((below + 0.5 * equal) / sorted.length) * 100;
}

// Normal CDF approximation (Abramowitz & Stegun)
function normalCDF(z: number): number {
  const sign = z >= 0 ? 1 : -1;
  z = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * z);
  const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const pdf = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  return 0.5 + sign * (0.5 - pdf * poly);
}

export default function PercentileCalculator() {
  const t = useTranslations("PercentileCalculator");
  const [dataInput, setDataInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [result, setResult] = useState<{
    percentile: number; zscore: number; mean: number; stddev: number;
    count: number; min: number; max: number; prob: number;
  } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    const data = parseData(dataInput);
    if (data.length < 2) { setError("Please enter at least 2 numbers."); return; }
    const val = parseFloat(valueInput);
    if (isNaN(val)) { setError("Please enter a valid value to look up."); return; }
    const sorted = [...data].sort((a, b) => a - b);
    const m = mean(data);
    const sd = stddev(data, m);
    const z = sd === 0 ? 0 : (val - m) / sd;
    const pr = percentileRank(sorted, val);
    const prob = normalCDF(z);
    setResult({ percentile: pr, zscore: z, mean: m, stddev: sd, count: data.length, min: sorted[0], max: sorted[sorted.length - 1], prob });
  };

  const loadSample = () => { setDataInput(SAMPLE_DATA); setValueInput("72"); };
  const clear = () => { setDataInput(""); setValueInput(""); setResult(null); setError(""); };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{t("datasetLabel")}</label>
        <textarea value={dataInput} onChange={e => setDataInput(e.target.value)} rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 resize-y" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{t("valueLabel")}</label>
        <input type="number" value={valueInput} onChange={e => setValueInput(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={loadSample} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("sampleButton")}
        </button>
        <button onClick={clear} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-indigo-400">{result.percentile.toFixed(1)}%</div>
              <div className="text-xs text-gray-400 mt-1">{t("percentileLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{result.zscore.toFixed(3)}</div>
              <div className="text-xs text-gray-400 mt-1">{t("zscoreLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{(result.prob * 100).toFixed(1)}%</div>
              <div className="text-xs text-gray-400 mt-1">{t("probabilityLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{result.count}</div>
              <div className="text-xs text-gray-400 mt-1">{t("countLabel")}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">{result.mean.toFixed(2)}</div>
              <div className="text-xs text-gray-400">{t("meanLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">{result.stddev.toFixed(2)}</div>
              <div className="text-xs text-gray-400">{t("stddevLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">{result.min} – {result.max}</div>
              <div className="text-xs text-gray-400">{t("minLabel")} – {t("maxLabel")}</div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-400 space-y-1">
            <p className="font-medium text-gray-300">{t("aboutTitle")}</p>
            <p>{t("aboutDesc")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
