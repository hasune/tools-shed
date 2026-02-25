"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Fields {
  V: string;
  I: string;
  R: string;
  P: string;
}

interface Results {
  V: number;
  I: number;
  R: number;
  P: number;
}

export default function OhmLawCalculator() {
  const t = useTranslations("OhmLawCalculator");
  const [fields, setFields] = useState<Fields>({ V: "", I: "", R: "", P: "" });
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState("");

  const handleChange = (key: keyof Fields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setResults(null);
    setError("");
  };

  const solve = (): Results | null => {
    const parsed: Partial<Record<keyof Fields, number>> = {};
    for (const k of ["V", "I", "R", "P"] as (keyof Fields)[]) {
      const v = parseFloat(fields[k]);
      if (!isNaN(v) && v >= 0 && fields[k].trim() !== "") {
        parsed[k] = v;
      }
    }

    const known = Object.keys(parsed) as (keyof Fields)[];
    if (known.length < 2) return null;

    let V = parsed.V,
      I = parsed.I,
      R = parsed.R,
      P = parsed.P;

    // Resolve with known pairs
    const has = (k: keyof Fields) => parsed[k] !== undefined;

    if (has("V") && has("I")) {
      R = R ?? V! / I!;
      P = P ?? V! * I!;
    } else if (has("V") && has("R")) {
      I = I ?? V! / R!;
      P = P ?? V! * V! / R!;
    } else if (has("V") && has("P")) {
      I = I ?? P! / V!;
      R = R ?? V! * V! / P!;
    } else if (has("I") && has("R")) {
      V = V ?? I! * R!;
      P = P ?? I! * I! * R!;
    } else if (has("I") && has("P")) {
      V = V ?? P! / I!;
      R = R ?? P! / (I! * I!);
    } else if (has("R") && has("P")) {
      I = I ?? Math.sqrt(P! / R!);
      V = V ?? Math.sqrt(P! * R!);
    } else {
      return null;
    }

    if (V === undefined || I === undefined || R === undefined || P === undefined) return null;
    if (V < 0 || I < 0 || R < 0 || P < 0) return null;

    return { V, I, R, P };
  };

  const calculate = () => {
    const filled = (["V", "I", "R", "P"] as (keyof Fields)[]).filter(
      (k) => fields[k].trim() !== "" && !isNaN(parseFloat(fields[k]))
    );
    if (filled.length < 2) {
      setError(t("inputHint"));
      return;
    }
    const res = solve();
    if (!res) {
      setError(t("unknownCombination"));
      return;
    }
    setError("");
    setResults(res);
  };

  const clear = () => {
    setFields({ V: "", I: "", R: "", P: "" });
    setResults(null);
    setError("");
  };

  const fmt = (n: number) => {
    if (Math.abs(n) >= 1e6 || (Math.abs(n) < 1e-3 && n !== 0)) {
      return n.toExponential(4);
    }
    return parseFloat(n.toFixed(6)).toString();
  };

  const fieldConfig: { key: keyof Fields; labelKey: string; unit: string; symbol: string }[] = [
    { key: "V", labelKey: "voltageLabel", unit: "V", symbol: "V" },
    { key: "I", labelKey: "currentLabel", unit: "A", symbol: "I" },
    { key: "R", labelKey: "resistanceLabel", unit: "Ω", symbol: "R" },
    { key: "P", labelKey: "powerLabel", unit: "W", symbol: "P" },
  ];

  const formulas = [
    "V = I × R",
    "P = V × I",
    "P = I² × R",
    "P = V² / R",
    "I = V / R = √(P / R)",
    "R = V / I = V² / P",
  ];

  return (
    <div className="space-y-6">
      {/* Input hint */}
      <p className="text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
        {t("inputHint")}
      </p>

      {/* Input fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fieldConfig.map(({ key, labelKey, unit, symbol }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              <span className="text-indigo-400 font-bold mr-1">{symbol}</span>
              {t(labelKey)}
              <span className="text-gray-500 ml-1 text-xs">({unit})</span>
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={fields[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              placeholder="—"
            />
          </div>
        ))}
      </div>

      {/* Error */}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {t("calculateButton")}
        </button>
        <button
          onClick={clear}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="grid grid-cols-2 gap-4">
          {fieldConfig.map(({ key, labelKey, unit, symbol }) => {
            const val = results[key];
            const wasInput =
              fields[key].trim() !== "" && !isNaN(parseFloat(fields[key]));
            return (
              <div
                key={key}
                className={`rounded-lg p-4 border ${
                  wasInput
                    ? "bg-gray-800 border-gray-600"
                    : "bg-gray-800 border-indigo-500/70"
                }`}
              >
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  <span className="text-indigo-400 font-bold mr-1">{symbol}</span>
                  {t(labelKey)}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    wasInput ? "text-gray-200" : "text-indigo-400"
                  }`}
                >
                  {fmt(val)}
                  <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Formulas reference */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">{t("formulasTitle")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {formulas.map((f) => (
            <p key={f} className="text-sm font-mono text-indigo-300 bg-gray-900 rounded px-3 py-1.5">
              {f}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
