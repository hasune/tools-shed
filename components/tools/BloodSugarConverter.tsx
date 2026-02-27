"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

// mg/dL to mmol/L: divide by 18.0182
const FACTOR = 18.0182;

interface RangeRow {
  label: string;
  fastingMg: string;
  postMealMg: string;
  fastingMmol: string;
  postMealMmol: string;
}

export default function BloodSugarConverter() {
  const t = useTranslations("BloodSugarConverter");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<"mgdl" | "mmol">("mgdl");
  const [result, setResult] = useState<{ mgdl: number; mmol: number } | null>(null);
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    const n = parseFloat(value);
    if (isNaN(n) || n <= 0) { setError("Please enter a valid positive number."); return; }
    if (unit === "mgdl") {
      setResult({ mgdl: n, mmol: Math.round((n / FACTOR) * 100) / 100 });
    } else {
      setResult({ mgdl: Math.round(n * FACTOR * 10) / 10, mmol: n });
    }
  };

  const ranges: RangeRow[] = [
    { label: t("normalLabel"), fastingMg: "70–99", postMealMg: "< 140", fastingMmol: "3.9–5.5", postMealMmol: "< 7.8" },
    { label: t("preDiabetesLabel"), fastingMg: "100–125", postMealMg: "140–199", fastingMmol: "5.6–6.9", postMealMmol: "7.8–11.0" },
    { label: t("diabetesLabel"), fastingMg: "≥ 126", postMealMg: "≥ 200", fastingMmol: "≥ 7.0", postMealMmol: "≥ 11.1" },
  ];

  const getStatus = (mgdl: number): string => {
    if (mgdl < 100) return t("normalLabel");
    if (mgdl < 126) return t("preDiabetesLabel");
    return t("diabetesLabel");
  };

  const statusColors: Record<string, string> = {
    [t("normalLabel")]: "text-green-400",
    [t("preDiabetesLabel")]: "text-yellow-400",
    [t("diabetesLabel")]: "text-red-400",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("valueLabel")}</label>
          <input type="number" value={value} onChange={e => { setValue(e.target.value); setResult(null); }}
            onKeyDown={e => e.key === "Enter" && convert()}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("unitLabel")}</label>
          <div className="flex gap-2">
            {(["mgdl", "mmol"] as const).map(u => (
              <button key={u} onClick={() => { setUnit(u); setResult(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${unit === u ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                {u === "mgdl" ? t("mgdlLabel") : t("mmolLabel")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={convert} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">
          {t("convertButton")}
        </button>
        <button onClick={() => { setValue(""); setResult(null); setError(""); }}
          className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-400">{result.mgdl}</div>
              <div className="text-xs text-gray-400 mt-1">{t("mgdlLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-400">{result.mmol}</div>
              <div className="text-xs text-gray-400 mt-1">{t("mmolLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className={`text-lg font-bold ${statusColors[getStatus(result.mgdl)] ?? "text-white"}`}>
                {getStatus(result.mgdl)}
              </div>
              <div className="text-xs text-gray-400 mt-1">{t("statusLabel")} (fasting)</div>
            </div>
          </div>
        </div>
      )}

      {/* Reference table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-700 text-sm font-medium text-gray-300">{t("rangesTitle")}</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="px-3 py-2 text-left">{t("statusLabel")}</th>
                <th className="px-3 py-2 text-center" colSpan={2}>mg/dL</th>
                <th className="px-3 py-2 text-center" colSpan={2}>mmol/L</th>
              </tr>
              <tr className="border-b border-gray-700 text-gray-500">
                <th className="px-3 py-1"></th>
                <th className="px-3 py-1 text-center">{t("fastingLabel")}</th>
                <th className="px-3 py-1 text-center">{t("postMealLabel")}</th>
                <th className="px-3 py-1 text-center">{t("fastingLabel")}</th>
                <th className="px-3 py-1 text-center">{t("postMealLabel")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {ranges.map(r => (
                <tr key={r.label}>
                  <td className={`px-3 py-2 font-medium ${statusColors[r.label] ?? "text-white"}`}>{r.label}</td>
                  <td className="px-3 py-2 text-center text-gray-300">{r.fastingMg}</td>
                  <td className="px-3 py-2 text-center text-gray-300">{r.postMealMg}</td>
                  <td className="px-3 py-2 text-center text-gray-300">{r.fastingMmol}</td>
                  <td className="px-3 py-2 text-center text-gray-300">{r.postMealMmol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-4 py-2 text-xs text-gray-500">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
