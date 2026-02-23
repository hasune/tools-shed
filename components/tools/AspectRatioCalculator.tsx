"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function parseRatio(s: string): [number, number] | null {
  const parts = s.split(":").map((p) => parseFloat(p.trim()));
  if (parts.length === 2 && parts.every((p) => !isNaN(p) && p > 0)) {
    return [parts[0], parts[1]];
  }
  return null;
}

const COMMON_RATIOS = [
  { label: "16:9", ratio: [16, 9] },
  { label: "4:3", ratio: [4, 3] },
  { label: "1:1", ratio: [1, 1] },
  { label: "21:9", ratio: [21, 9] },
  { label: "3:2", ratio: [3, 2] },
  { label: "9:16", ratio: [9, 16] },
  { label: "2:3", ratio: [2, 3] },
];

export default function AspectRatioCalculator() {
  const t = useTranslations("AspectRatioCalculator");

  const [ratioInput, setRatioInput] = useState("16:9");
  const [knownValue, setKnownValue] = useState("");
  const [solveFor, setSolveFor] = useState<"width" | "height">("height");
  const [result, setResult] = useState<number | null>(null);
  const [simplifiedRatio, setSimplifiedRatio] = useState<string | null>(null);

  const handleCalculate = () => {
    const ratio = parseRatio(ratioInput);
    const val = parseFloat(knownValue);
    if (!ratio || isNaN(val) || val <= 0) return;

    const [rw, rh] = ratio;
    let res: number;
    if (solveFor === "height") {
      res = (val * rh) / rw;
    } else {
      res = (val * rw) / rh;
    }
    setResult(Math.round(res * 100) / 100);

    // Simplify ratio
    const g = gcd(Math.round(rw), Math.round(rh));
    setSimplifiedRatio(`${rw / g}:${rh / g}`);
  };

  const setCommonRatio = (w: number, h: number) => {
    setRatioInput(`${w}:${h}`);
    setResult(null);
  };

  return (
    <div className="space-y-5">
      {/* Common ratios */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">{t("commonRatiosLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {COMMON_RATIOS.map(({ label, ratio }) => (
            <button
              key={label}
              onClick={() => setCommonRatio(ratio[0], ratio[1])}
              className={`px-3 py-1 rounded-lg text-sm font-mono transition-colors ${
                ratioInput === label
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom ratio */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">{t("ratioLabel")}</label>
        <input
          type="text"
          value={ratioInput}
          onChange={(e) => { setRatioInput(e.target.value); setResult(null); }}
          placeholder={t("customRatioPlaceholder")}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Solve for + known value */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t("solveForLabel")}</label>
          <div className="flex rounded-lg overflow-hidden border border-gray-700">
            {(["width", "height"] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setSolveFor(s); setResult(null); }}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  solveFor === s ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {t(`solve${s.charAt(0).toUpperCase() + s.slice(1)}` as Parameters<typeof t>[0])}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            {solveFor === "height" ? t("widthLabel") : t("heightLabel")} (px)
          </label>
          <input
            type="number"
            min={1}
            value={knownValue}
            onChange={(e) => { setKnownValue(e.target.value); setResult(null); }}
            placeholder="1920"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-medium transition-colors"
      >
        {t("calculateButton")}
      </button>

      {result !== null && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900 rounded-xl p-4 border border-indigo-800 text-center">
            <p className="text-xs text-gray-500 mb-1">
              {solveFor === "height" ? t("heightLabel") : t("widthLabel")}
            </p>
            <p className="text-3xl font-mono font-bold text-indigo-400">{result}</p>
            <p className="text-xs text-gray-600 mt-1">px</p>
          </div>
          {simplifiedRatio && (
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
              <p className="text-xs text-gray-500 mb-1">{t("ratioLabel")}</p>
              <p className="text-3xl font-mono font-bold text-white">{simplifiedRatio}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
