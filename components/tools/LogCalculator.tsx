"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type BaseMode = "ln" | "log10" | "log2" | "custom";

export default function LogCalculator() {
  const t = useTranslations("LogCalculator");
  const [value, setValue] = useState("");
  const [baseMode, setBaseMode] = useState<BaseMode>("log10");
  const [customBase, setCustomBase] = useState("");
  const [result, setResult] = useState<{ label: string; value: number; formula: string } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    const x = parseFloat(value);
    if (isNaN(x) || x <= 0) { setError(t("invalidInput")); setResult(null); return; }

    let logVal: number;
    let label: string;
    let formula: string;

    if (baseMode === "ln") {
      logVal = Math.log(x);
      label = "ln(" + x + ")";
      formula = "ln(" + x + ") = log_e(" + x + ")";
    } else if (baseMode === "log10") {
      logVal = Math.log10(x);
      label = "log₁₀(" + x + ")";
      formula = "log₁₀(" + x + ") = log(" + x + ") / log(10)";
    } else if (baseMode === "log2") {
      logVal = Math.log2(x);
      label = "log₂(" + x + ")";
      formula = "log₂(" + x + ") = log(" + x + ") / log(2)";
    } else {
      const b = parseFloat(customBase);
      if (isNaN(b) || b <= 0 || b === 1) { setError(t("invalidBase")); setResult(null); return; }
      logVal = Math.log(x) / Math.log(b);
      label = "log_" + b + "(" + x + ")";
      formula = "log_" + b + "(" + x + ") = ln(" + x + ") / ln(" + b + ")";
    }

    setError("");
    setResult({ label, value: logVal, formula });
  };

  const clear = () => { setValue(""); setCustomBase(""); setResult(null); setError(""); };

  const allBases: Array<[string, string, number]> = result ? [
    ["ln", "Natural (base e)", Math.log(parseFloat(value))],
    ["log₁₀", "Common (base 10)", Math.log10(parseFloat(value))],
    ["log₂", "Binary (base 2)", Math.log2(parseFloat(value))],
  ] : [];

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("valueLabel")}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && calculate()}
          placeholder={t("valuePlaceholder")}
          min="0" step="any"
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{t("baseLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {([["ln", t("baseLn")], ["log10", t("base10")], ["log2", t("base2")], ["custom", t("baseCustom")]] as [BaseMode, string][]).map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => setBaseMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${baseMode === mode ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {baseMode === "custom" && (
          <input
            type="number"
            value={customBase}
            onChange={(e) => setCustomBase(e.target.value)}
            placeholder={t("customBasePlaceholder")}
            min="0" step="any"
            className="w-32 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        )}
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
        <div className="space-y-4">
          <div className="bg-indigo-950/40 border border-indigo-700 rounded-xl p-5">
            <p className="text-sm text-indigo-400 mb-1">{result.label}</p>
            <p className="text-3xl font-mono text-white">{result.value.toPrecision(10).replace(/\.?0+$/, "")}</p>
            <p className="text-xs text-gray-500 mt-2 font-mono">{result.formula}</p>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <p className="text-xs text-gray-500 px-4 py-2 border-b border-gray-700">{t("allBasesTitle")}</p>
            <table className="w-full text-sm">
              <tbody>
                {allBases.map(([label, desc, val], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-800/30"}>
                    <td className="px-4 py-2.5 font-mono text-indigo-400 w-12">{label}</td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs">{desc}</td>
                    <td className="px-4 py-2.5 font-mono text-white text-right">{isNaN(val) ? "—" : val.toPrecision(8).replace(/\.?0+$/, "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
