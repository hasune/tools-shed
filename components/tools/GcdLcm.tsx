"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function gcdMultiple(nums: number[]): number {
  return nums.reduce((a, b) => gcd(a, b));
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

function lcmMultiple(nums: number[]): number {
  return nums.reduce((a, b) => lcm(a, b));
}

function gcdSteps(a: number, b: number): string[] {
  const steps: string[] = [];
  let x = a;
  let y = b;
  while (y !== 0) {
    steps.push(`gcd(${x}, ${y}) = gcd(${y}, ${x} mod ${y} = ${x % y})`);
    const temp = x % y;
    x = y;
    y = temp;
  }
  steps.push(`gcd(${x}, 0) = ${x}`);
  return steps;
}

function buildPairwiseSteps(nums: number[]): { pair: string; steps: string[]; result: number }[] {
  const pairs: { pair: string; steps: string[]; result: number }[] = [];
  let current = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const next = nums[i];
    const steps = gcdSteps(current, next);
    const result = gcd(current, next);
    pairs.push({ pair: `gcd(${current}, ${next})`, steps, result });
    current = result;
  }
  return pairs;
}

interface Result {
  gcdValue: number;
  lcmValue: number;
  pairSteps: { pair: string; steps: string[]; result: number }[];
  numbers: number[];
}

export default function GcdLcm() {
  const t = useTranslations("GcdLcm");

  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = () => {
    setError("");
    setResult(null);

    const raw = input
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (raw.length < 2) {
      setError(t("errorAtLeastTwo"));
      return;
    }

    const numbers: number[] = [];
    for (const token of raw) {
      if (!/^-?\d+$/.test(token)) {
        setError(t("errorInvalidInput", { token }));
        return;
      }
      const n = parseInt(token, 10);
      if (n < 0) {
        setError(t("errorNegative"));
        return;
      }
      if (n === 0) {
        setError(t("errorZero"));
        return;
      }
      numbers.push(n);
    }

    const gcdValue = gcdMultiple(numbers);
    const lcmValue = lcmMultiple(numbers);
    const pairSteps = buildPairwiseSteps(numbers);

    setResult({ gcdValue, lcmValue, pairSteps, numbers });
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCalculate();
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("inputLabel")}</label>
          <p className="text-xs text-gray-500">{t("inputHint")}</p>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("inputPlaceholder")}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
        />

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleCalculate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {t("calculateButton")}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {t("clearButton")}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {/* Numbers used */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500">{t("numbersLabel")}:</span>
            {result.numbers.map((n, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 font-mono"
              >
                {n}
              </span>
            ))}
          </div>

          {/* GCD & LCM Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-indigo-500/40 rounded-xl p-6 text-center">
              <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest">{t("gcdLabel")}</div>
              <div className="text-4xl font-bold text-indigo-400 font-mono">{result.gcdValue}</div>
              <div className="text-xs text-gray-600 mt-2">{t("greatestCommonDivisor")}</div>
            </div>
            <div className="bg-gray-900 border border-emerald-500/40 rounded-xl p-6 text-center">
              <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest">{t("lcmLabel")}</div>
              <div className="text-4xl font-bold text-emerald-400 font-mono">{result.lcmValue}</div>
              <div className="text-xs text-gray-600 mt-2">{t("leastCommonMultiple")}</div>
            </div>
          </div>

          {/* Divisibility note */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-400">
            {t("divisibilityNote", { gcd: result.gcdValue, lcm: result.lcmValue })}
          </div>

          {/* Step-by-step for GCD */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
              {t("stepsTitle")}
            </h3>

            {result.pairSteps.map((pair, pi) => (
              <div key={pi} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-800/60 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-300 font-mono">{pair.pair}</span>
                </div>
                <div className="px-4 py-3 space-y-1.5">
                  {pair.steps.map((step, si) => (
                    <div key={si} className="flex items-start gap-2">
                      <span className="text-gray-600 text-xs mt-0.5 shrink-0">
                        {si === pair.steps.length - 1 ? "→" : si + 1 + "."}
                      </span>
                      <span
                        className={`text-xs font-mono ${
                          si === pair.steps.length - 1
                            ? "text-indigo-400 font-semibold"
                            : "text-gray-400"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 bg-indigo-950/30 border-t border-gray-800">
                  <span className="text-xs text-indigo-300 font-mono font-medium">
                    {t("resultLabel")}: {pair.result}
                  </span>
                </div>
              </div>
            ))}

            {/* LCM formula explanation */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-800/60 border-b border-gray-800">
                <span className="text-sm font-medium text-gray-300">{t("lcmFormulaTitle")}</span>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs text-gray-400 font-mono">
                  {t("lcmFormula")}
                </p>
                <p className="text-xs text-gray-400 font-mono mt-1.5">
                  {result.numbers.length === 2
                    ? `lcm(${result.numbers[0]}, ${result.numbers[1]}) = (${result.numbers[0]} × ${result.numbers[1]}) / gcd(${result.numbers[0]}, ${result.numbers[1]}) = ${result.numbers[0] * result.numbers[1]} / ${result.gcdValue} = ${result.lcmValue}`
                    : `lcm(${result.numbers.join(", ")}) = ${result.lcmValue}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info box when empty */}
      {!result && !error && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-medium text-gray-400">{t("infoTitle")}</h3>
          <ul className="space-y-1.5 text-xs text-gray-500 list-disc list-inside">
            <li>{t("infoGcd")}</li>
            <li>{t("infoLcm")}</li>
            <li>{t("infoAlgorithm")}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
