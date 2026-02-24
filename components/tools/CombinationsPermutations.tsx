"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Use log-factorial to avoid overflow, then compute exact integer for display
function logFactorial(n: number): number {
  let sum = 0;
  for (let i = 2; i <= n; i++) sum += Math.log(i);
  return sum;
}

function nCr(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  if (r === 0 || r === n) return 1;
  // Use smaller r
  const k = Math.min(r, n - r);
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

function nPr(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= (n - i);
  }
  return result;
}

function formatNum(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "∞";
  if (n > 1e15) return n.toExponential(4);
  return n.toLocaleString("en-US");
}

function factorialDisplay(n: number): string {
  if (n > 20) return `${n}!`;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return `${n}! = ${r.toLocaleString("en-US")}`;
}

export default function CombinationsPermutations() {
  const t = useTranslations("CombinationsPermutations");
  const [n, setN] = useState("");
  const [r, setR] = useState("");
  const [result, setResult] = useState<{ comb: number; perm: number } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    const nv = parseInt(n), rv = parseInt(r);
    if (isNaN(nv) || isNaN(rv) || nv < 0 || rv < 0 || rv > nv || nv > 170) {
      setError(t("invalidInput"));
      setResult(null);
      return;
    }
    setError("");
    setResult({ comb: nCr(nv, rv), perm: nPr(nv, rv) });
  };

  const clear = () => { setN(""); setR(""); setResult(null); setError(""); };

  const nv = parseInt(n) || 0;
  const rv = parseInt(r) || 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("nLabel")}</label>
          <input
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
            placeholder="10"
            min="0"
            max="170"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("rLabel")}</label>
          <input
            type="number"
            value={r}
            onChange={(e) => setR(e.target.value)}
            placeholder="3"
            min="0"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={calculate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={clear} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
            <p className="text-sm text-gray-400 mb-1">{t("combinationsTitle")}</p>
            <p className="text-2xl font-mono text-white mb-2">{formatNum(result.comb)}</p>
            <p className="font-mono text-xs text-gray-500">C({nv},{rv}) = {nv}! / ({rv}! × {nv - rv}!)</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
            <p className="text-sm text-gray-400 mb-1">{t("permutationsTitle")}</p>
            <p className="text-2xl font-mono text-white mb-2">{formatNum(result.perm)}</p>
            <p className="font-mono text-xs text-gray-500">P({nv},{rv}) = {nv}! / {nv - rv}!</p>
          </div>
        </div>
      )}
    </div>
  );
}
