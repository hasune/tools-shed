"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Gender = "male" | "female";
type Unit = "metric" | "imperial";

interface FormulaResult {
  labelKey: "robinson" | "miller" | "devine" | "hamwi" | "healthyBmi";
  kg: string;
  lbs: string;
}

function calcIdealWeights(heightCm: number, gender: Gender): FormulaResult[] {
  const heightIn = heightCm / 2.54;
  const over60 = heightIn - 60;

  const robinson =
    gender === "male" ? 52 + 1.9 * over60 : 49 + 1.7 * over60;
  const miller =
    gender === "male" ? 56.2 + 1.41 * over60 : 53.1 + 1.36 * over60;
  const devine =
    gender === "male" ? 50 + 2.3 * over60 : 45.5 + 2.3 * over60;
  const hamwi =
    gender === "male" ? 48 + 2.7 * over60 : 45.4 + 2.2 * over60;

  const heightM = heightCm / 100;
  const bmiLow = 18.5 * heightM * heightM;
  const bmiHigh = 24.9 * heightM * heightM;

  const fmt = (kg: number) => `${kg.toFixed(1)} kg`;
  const fmtLbs = (kg: number) => `${(kg * 2.20462).toFixed(1)} lbs`;
  const fmtRange = (lo: number, hi: number) =>
    `${lo.toFixed(1)} – ${hi.toFixed(1)} kg`;
  const fmtRangeLbs = (lo: number, hi: number) =>
    `${(lo * 2.20462).toFixed(1)} – ${(hi * 2.20462).toFixed(1)} lbs`;

  return [
    { labelKey: "robinson", kg: fmt(robinson), lbs: fmtLbs(robinson) },
    { labelKey: "miller", kg: fmt(miller), lbs: fmtLbs(miller) },
    { labelKey: "devine", kg: fmt(devine), lbs: fmtLbs(devine) },
    { labelKey: "hamwi", kg: fmt(hamwi), lbs: fmtLbs(hamwi) },
    { labelKey: "healthyBmi", kg: fmtRange(bmiLow, bmiHigh), lbs: fmtRangeLbs(bmiLow, bmiHigh) },
  ];
}

export default function IdealWeight() {
  const t = useTranslations("IdealWeight");

  const [unit, setUnit] = useState<Unit>("metric");
  const [gender, setGender] = useState<Gender>("male");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [results, setResults] = useState<FormulaResult[] | null>(null);

  const calculate = () => {
    let cm: number;
    if (unit === "metric") {
      cm = parseFloat(heightCm);
    } else {
      const totalInches = parseFloat(heightFt) * 12 + parseFloat(heightIn || "0");
      cm = totalInches * 2.54;
    }
    if (!cm || cm <= 0) return;
    setResults(calcIdealWeights(cm, gender));
  };

  const handleClear = () => {
    setHeightCm(""); setHeightFt(""); setHeightIn(""); setResults(null);
  };

  return (
    <div className="space-y-5">
      {/* Unit Toggle */}
      <div className="flex gap-1 p-1 bg-gray-900 rounded-lg w-fit border border-gray-700">
        {(["metric", "imperial"] as const).map((u) => (
          <button
            key={u}
            onClick={() => { setUnit(u); setResults(null); }}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              unit === u ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {t(u === "metric" ? "metricTab" : "imperialTab")}
          </button>
        ))}
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{t("genderLabel")}</label>
        <div className="flex gap-2">
          {(["male", "female"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                gender === g
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {t(g === "male" ? "male" : "female")}
            </button>
          ))}
        </div>
      </div>

      {/* Height */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">
          {t("heightLabel")} {unit === "metric" ? "(cm)" : "(ft / in)"}
        </label>
        {unit === "metric" ? (
          <input
            type="number"
            min={0}
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            placeholder="e.g. 175"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        ) : (
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)}
              placeholder="ft"
              className="w-1/2 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
            <input
              type="number"
              min={0}
              max={11}
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)}
              placeholder="in"
              className="w-1/2 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {t("calculateButton")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {results && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-300">{t("resultsTitle")}</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800 text-gray-400 text-xs">
                  <th className="px-4 py-2 text-left">{t("formulaHeader")}</th>
                  <th className="px-4 py-2 text-right">kg</th>
                  <th className="px-4 py-2 text-right">lbs</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={row.labelKey} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-2.5 text-gray-300">{t(row.labelKey)}</td>
                    <td className="px-4 py-2.5 text-right text-indigo-400 font-mono">{row.kg}</td>
                    <td className="px-4 py-2.5 text-right text-gray-400 font-mono">{row.lbs}</td>
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
