"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Mode = "sss" | "sas" | "asa" | "aas";

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}
function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}
function fmt(n: number, decimals = 4) {
  return parseFloat(n.toFixed(decimals));
}

interface TriangleResult {
  a: number;
  b: number;
  c: number;
  A: number;
  B: number;
  C: number;
  area: number;
  perimeter: number;
}

function solveSAS(b: number, C_deg: number, a: number): TriangleResult | null {
  const C = toRad(C_deg);
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C));
  if (!isFinite(c) || c <= 0) return null;
  const A = toDeg(Math.acos((b * b + c * c - a * a) / (2 * b * c)));
  const B = 180 - A - C_deg;
  if (A <= 0 || B <= 0 || C_deg <= 0) return null;
  const area = 0.5 * a * b * Math.sin(C);
  return { a, b, c, A, B, C: C_deg, area, perimeter: a + b + c };
}

function solve(mode: Mode, inputs: Record<string, string>): TriangleResult | null {
  const p = (key: string) => parseFloat(inputs[key]);
  try {
    if (mode === "sss") {
      const a = p("a"), b = p("b"), c = p("c");
      if ([a, b, c].some((v) => isNaN(v) || v <= 0)) return null;
      if (a + b <= c || a + c <= b || b + c <= a) return null;
      const A = toDeg(Math.acos((b * b + c * c - a * a) / (2 * b * c)));
      const B = toDeg(Math.acos((a * a + c * c - b * b) / (2 * a * c)));
      const C = 180 - A - B;
      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      return { a, b, c, A, B, C, area, perimeter: a + b + c };
    }
    if (mode === "sas") {
      const a = p("a"), C_deg = p("C"), b = p("b");
      if ([a, C_deg, b].some((v) => isNaN(v) || v <= 0)) return null;
      if (C_deg >= 180) return null;
      return solveSAS(b, C_deg, a);
    }
    if (mode === "asa") {
      const A = p("A"), c = p("c"), B = p("B");
      if ([A, c, B].some((v) => isNaN(v) || v <= 0)) return null;
      const C = 180 - A - B;
      if (C <= 0) return null;
      const a = (c * Math.sin(toRad(A))) / Math.sin(toRad(C));
      const b = (c * Math.sin(toRad(B))) / Math.sin(toRad(C));
      const area = 0.5 * a * b * Math.sin(toRad(C));
      return { a, b, c, A, B, C, area, perimeter: a + b + c };
    }
    if (mode === "aas") {
      const A = p("A"), B = p("B"), a = p("a");
      if ([A, B, a].some((v) => isNaN(v) || v <= 0)) return null;
      const C = 180 - A - B;
      if (C <= 0) return null;
      const b = (a * Math.sin(toRad(B))) / Math.sin(toRad(A));
      const c = (a * Math.sin(toRad(C))) / Math.sin(toRad(A));
      const area = 0.5 * a * b * Math.sin(toRad(C));
      return { a, b, c, A, B, C, area, perimeter: a + b + c };
    }
  } catch {
    return null;
  }
  return null;
}

const MODES: { key: Mode; labelKey: string; fields: { key: string; labelKey: string }[] }[] = [
  {
    key: "sss",
    labelKey: "modeSss",
    fields: [
      { key: "a", labelKey: "sideA" },
      { key: "b", labelKey: "sideB" },
      { key: "c", labelKey: "sideC" },
    ],
  },
  {
    key: "sas",
    labelKey: "modeSas",
    fields: [
      { key: "a", labelKey: "sideA" },
      { key: "C", labelKey: "angleC" },
      { key: "b", labelKey: "sideB" },
    ],
  },
  {
    key: "asa",
    labelKey: "modeAsa",
    fields: [
      { key: "A", labelKey: "angleA" },
      { key: "c", labelKey: "sideC" },
      { key: "B", labelKey: "angleB" },
    ],
  },
  {
    key: "aas",
    labelKey: "modeAas",
    fields: [
      { key: "A", labelKey: "angleA" },
      { key: "B", labelKey: "angleB" },
      { key: "a", labelKey: "sideA" },
    ],
  },
];

export default function TriangleCalculator() {
  const t = useTranslations("TriangleCalculator");
  const [mode, setMode] = useState<Mode>("sss");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<TriangleResult | null>(null);
  const [error, setError] = useState(false);

  const currentMode = MODES.find((m) => m.key === mode)!;

  const handleModeChange = (m: Mode) => {
    setMode(m);
    setInputs({});
    setResult(null);
    setError(false);
  };

  const handleCalculate = () => {
    const res = solve(mode, inputs);
    if (res) {
      setResult(res);
      setError(false);
    } else {
      setResult(null);
      setError(true);
    }
  };

  const handleClear = () => {
    setInputs({});
    setResult(null);
    setError(false);
  };

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => handleModeChange(m.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m.key
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {t(m.labelKey)}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {currentMode.fields.map(({ key, labelKey }) => (
          <div key={key} className="space-y-1">
            <label className="text-sm font-medium text-gray-400">{t(labelKey)}</label>
            <input
              type="number"
              value={inputs[key] ?? ""}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, [key]: e.target.value }))
              }
              placeholder="0"
              min="0"
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCalculate}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {t("calculateButton")}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm">{t("errorInvalid")}</p>
      )}

      {/* Results */}
      {result && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
          <h3 className="text-white font-semibold">{t("resultsTitle")}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: t("sideA"), value: fmt(result.a) },
              { label: t("sideB"), value: fmt(result.b) },
              { label: t("sideC"), value: fmt(result.c) },
              { label: t("angleA"), value: `${fmt(result.A)}°` },
              { label: t("angleB"), value: `${fmt(result.B)}°` },
              { label: t("angleC"), value: `${fmt(result.C)}°` },
              { label: t("area"), value: fmt(result.area) },
              { label: t("perimeter"), value: fmt(result.perimeter) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-white font-mono font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
