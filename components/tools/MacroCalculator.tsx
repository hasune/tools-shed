"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type DietType = "balanced" | "lowCarb" | "highProtein" | "keto" | "custom";

const DIET_PRESETS: Record<Exclude<DietType, "custom">, [number, number, number]> = {
  balanced: [30, 40, 30],
  lowCarb: [40, 20, 40],
  highProtein: [40, 30, 30],
  keto: [25, 5, 70],
};

export default function MacroCalculator() {
  const t = useTranslations("MacroCalculator");
  const [calories, setCalories] = useState("2000");
  const [diet, setDiet] = useState<DietType>("balanced");
  const [proteinPct, setProteinPct] = useState(30);
  const [carbsPct, setCarbsPct] = useState(40);
  const [fatPct, setFatPct] = useState(30);
  const [result, setResult] = useState<{ protein: number; carbs: number; fat: number } | null>(null);

  const handleDietChange = (d: DietType) => {
    setDiet(d);
    if (d !== "custom") {
      const [p, c, f] = DIET_PRESETS[d as Exclude<DietType, "custom">];
      setProteinPct(p);
      setCarbsPct(c);
      setFatPct(f);
    }
  };

  const calculate = () => {
    const cal = parseFloat(calories);
    if (isNaN(cal) || cal <= 0) return;
    const total = proteinPct + carbsPct + fatPct;
    if (total === 0) return;
    const pP = proteinPct / total, pC = carbsPct / total, pF = fatPct / total;
    setResult({
      protein: Math.round((cal * pP) / 4),
      carbs: Math.round((cal * pC) / 4),
      fat: Math.round((cal * pF) / 9),
    });
  };

  const clear = () => { setCalories("2000"); handleDietChange("balanced"); setResult(null); };

  const diets: [DietType, string][] = [
    ["balanced", t("dietBalanced")],
    ["lowCarb", t("dietLowCarb")],
    ["highProtein", t("dietHighProtein")],
    ["keto", t("dietKeto")],
    ["custom", t("dietCustom")],
  ];

  const macros: [string, number, string, string][] = result
    ? [
        [t("proteinLabel"), result.protein, "text-blue-400", "border-blue-700 bg-blue-950/30"],
        [t("carbsLabel"), result.carbs, "text-yellow-400", "border-yellow-700 bg-yellow-950/30"],
        [t("fatLabel"), result.fat, "text-red-400", "border-red-700 bg-red-950/30"],
      ]
    : [];

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("caloriesLabel")}</label>
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder={t("caloriesPlaceholder")}
          min="0"
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{t("dietLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {diets.map(([d, label]) => (
            <button
              key={d}
              onClick={() => handleDietChange(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${diet === d ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {([
          ["proteinPctLabel", proteinPct, setProteinPct],
          ["carbsPctLabel", carbsPct, setCarbsPct],
          ["fatPctLabel", fatPct, setFatPct],
        ] as [string, number, (v: number) => void][]).map(([key, val, setter]) => (
          <div key={key} className="space-y-1">
            <label className="text-xs font-medium text-gray-400">{t(key as any)}</label>
            <input
              type="number"
              value={val}
              onChange={(e) => { setter(Number(e.target.value)); setDiet("custom"); }}
              min="0"
              max="100"
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={calculate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">{t("calculateButton")}</button>
        <button onClick={clear} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">{t("clearButton")}</button>
      </div>

      {result && (
        <div className="space-y-3">
          {macros.map(([label, grams, color, border]) => (
            <div key={label} className={`border rounded-xl p-4 flex items-center justify-between ${border}`}>
              <span className={`text-sm font-medium ${color}`}>{label}</span>
              <span className="text-2xl font-mono text-white">
                {grams}<span className="text-sm text-gray-400 ml-1">{t("gramsLabel")}</span>
              </span>
            </div>
          ))}
          <p className="text-xs text-gray-500">{t("calPerGramNote")}</p>
        </div>
      )}
    </div>
  );
}
