"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface BPCategory {
  key: string;
  systolicMin: number;
  systolicMax: number;
  diastolicMin: number;
  diastolicMax: number;
  color: string;
  tipKey: string;
}

const CATEGORIES: BPCategory[] = [
  { key: "catNormal",  systolicMin: 0,   systolicMax: 120, diastolicMin: 0,  diastolicMax: 80, color: "text-green-400 border-green-700 bg-green-950/40", tipKey: "tipNormal" },
  { key: "catElevated", systolicMin: 120, systolicMax: 130, diastolicMin: 0,  diastolicMax: 80, color: "text-yellow-400 border-yellow-700 bg-yellow-950/40", tipKey: "tipElevated" },
  { key: "catHigh1",   systolicMin: 130, systolicMax: 140, diastolicMin: 80, diastolicMax: 90, color: "text-orange-400 border-orange-700 bg-orange-950/40", tipKey: "tipHigh1" },
  { key: "catHigh2",   systolicMin: 140, systolicMax: 180, diastolicMin: 90, diastolicMax: 120, color: "text-red-400 border-red-700 bg-red-950/40", tipKey: "tipHigh2" },
  { key: "catCrisis",  systolicMin: 180, systolicMax: 999, diastolicMin: 120, diastolicMax: 999, color: "text-red-300 border-red-500 bg-red-900/50", tipKey: "tipCrisis" },
];

function getCategory(sys: number, dia: number): BPCategory {
  if (sys >= 180 || dia >= 120) return CATEGORIES[4];
  if (sys >= 140 || dia >= 90) return CATEGORIES[3];
  if (sys >= 130 && dia < 90) return CATEGORIES[2];
  if (sys >= 120 && sys < 130 && dia < 80) return CATEGORIES[1];
  return CATEGORIES[0];
}

export default function BloodPressureChecker() {
  const t = useTranslations("BloodPressureChecker");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [result, setResult] = useState<BPCategory | null>(null);
  const [error, setError] = useState("");

  const check = () => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    if (isNaN(sys) || isNaN(dia) || sys < 70 || sys > 250 || dia < 40 || dia > 150) {
      setError(t("invalidInput"));
      setResult(null);
      return;
    }
    setError("");
    setResult(getCategory(sys, dia));
  };

  const clear = () => { setSystolic(""); setDiastolic(""); setResult(null); setError(""); };

  const catRows: Array<[string, string, string]> = [
    [t("catNormal"), "< 120", "< 80"],
    [t("catElevated"), "120–129", "< 80"],
    [t("catHigh1"), "130–139", "80–89"],
    [t("catHigh2"), "140–179", "90–119"],
    [t("catCrisis"), "≥ 180", "≥ 120"],
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("systolicLabel")}</label>
          <input
            type="number"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            placeholder={t("systolicPlaceholder")}
            min="70" max="250"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("diastolicLabel")}</label>
          <input
            type="number"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            placeholder={t("diastolicPlaceholder")}
            min="40" max="150"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={check} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          {t("checkButton")}
        </button>
        <button onClick={clear} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className={`border rounded-xl p-5 space-y-2 ${result.color}`}>
          <p className="text-lg font-semibold">{t(result.key as any)}</p>
          <p className="text-sm text-gray-300">{t(result.tipKey as any)}</p>
          <p className="text-xs text-gray-500 mt-2">{t("disclaimer")}</p>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 text-gray-400">
              <th className="px-3 py-2 text-left">{t("categoryLabel")}</th>
              <th className="px-3 py-2 text-center">Systolic</th>
              <th className="px-3 py-2 text-center">Diastolic</th>
            </tr>
          </thead>
          <tbody>
            {catRows.map(([cat, sys, dia], i) => (
              <tr key={i} className={`border-t border-gray-800 ${result && t(CATEGORIES[i].key as any) === cat ? "bg-indigo-900/30" : ""}`}>
                <td className="px-3 py-2 text-gray-300">{cat}</td>
                <td className="px-3 py-2 text-center text-gray-300 font-mono">{sys}</td>
                <td className="px-3 py-2 text-center text-gray-300 font-mono">{dia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
