"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type WeightUnit = "kg" | "lb";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "veryActive";
type Climate = "temperate" | "hot";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.0,
  light: 1.1,
  moderate: 1.2,
  active: 1.3,
  veryActive: 1.4,
};

const ACTIVITY_KEYS: ActivityLevel[] = ["sedentary", "light", "moderate", "active", "veryActive"];
const GLASS_ML = 250;

interface Results {
  ml: number;
  liters: number;
  glasses: number;
}

export default function WaterIntake() {
  const t = useTranslations("WaterIntake");

  const [weightInput, setWeightInput] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [climate, setClimate] = useState<Climate>("temperate");
  const [results, setResults] = useState<Results | null>(null);

  const calculate = () => {
    const rawWeight = parseFloat(weightInput);
    if (!rawWeight || rawWeight <= 0) return;

    const weightKg = weightUnit === "kg" ? rawWeight : rawWeight * 0.453592;
    const base = weightKg * 35;
    let intake = base * ACTIVITY_MULTIPLIERS[activity];
    if (climate === "hot") intake += 500;

    // clamp between 1500 and 5000
    const ml = Math.round(Math.min(5000, Math.max(1500, intake)));

    setResults({
      ml,
      liters: parseFloat((ml / 1000).toFixed(2)),
      glasses: Math.ceil(ml / GLASS_ML),
    });
  };

  const clear = () => {
    setWeightInput("");
    setActivity("moderate");
    setClimate("temperate");
    setResults(null);
  };

  const fillPercent = results
    ? Math.min(100, Math.round(((results.ml - 1500) / (5000 - 1500)) * 100))
    : 0;

  const hydrationColor =
    results && results.ml < 2000
      ? "bg-yellow-500"
      : results && results.ml < 3000
      ? "bg-blue-400"
      : "bg-indigo-500";

  return (
    <div className="space-y-5">
      {/* Weight */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-300">{t("weightLabel")}</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              min={1}
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder={weightUnit === "kg" ? "e.g. 70" : "e.g. 154"}
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
          <div className="flex gap-1 p-1 bg-gray-900 rounded-lg border border-gray-700 shrink-0">
            {(["kg", "lb"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setWeightUnit(u)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  weightUnit === u ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Level */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{t("activityLabel")}</label>
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value as ActivityLevel)}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
        >
          {ACTIVITY_KEYS.map((key) => (
            <option key={key} value={key}>
              {t(key)} ({ACTIVITY_MULTIPLIERS[key]}x)
            </option>
          ))}
        </select>
      </div>

      {/* Climate */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{t("climateLabel")}</label>
        <div className="flex gap-2">
          {(["temperate", "hot"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setClimate(c)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                climate === c
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {c === "temperate" ? t("climateTemperate") : t("climateHot")}
            </button>
          ))}
        </div>
        {climate === "hot" && (
          <p className="text-xs text-amber-400">+500 mL {t("hotClimateNote")}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={calculate}
          disabled={!weightInput || parseFloat(weightInput) <= 0}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t("calculateButton")}
        </button>
        <button
          onClick={clear}
          className="text-sm px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          {/* Main results */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-900 border border-indigo-500/30 rounded-xl p-4 text-center col-span-1">
              <div className="text-xs text-gray-500 mb-1">{t("mlLabel")}</div>
              <div className="text-2xl font-bold text-indigo-400">{results.ml.toLocaleString()}</div>
              <div className="text-xs text-gray-600 mt-1">mL</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center col-span-1">
              <div className="text-xs text-gray-500 mb-1">{t("litersLabel")}</div>
              <div className="text-2xl font-bold text-white">{results.liters}</div>
              <div className="text-xs text-gray-600 mt-1">L</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center col-span-1">
              <div className="text-xs text-gray-500 mb-1">{t("glassesLabel")}</div>
              <div className="text-2xl font-bold text-white">{results.glasses}</div>
              <div className="text-xs text-gray-600 mt-1">× 250 mL</div>
            </div>
          </div>

          {/* Visual hydration bar */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">{t("hydrationBar")}</span>
              <span className="text-sm font-semibold text-indigo-400">{fillPercent}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-700 ${hydrationColor}`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>1,500 mL</span>
              <span>5,000 mL</span>
            </div>
            <p className="text-xs text-gray-500">{t("hydrationNote")}</p>
          </div>

          {/* Glass visualization */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-2">
            <div className="text-sm font-medium text-gray-300 mb-3">
              {t("glassVisualizationLabel")} ({results.glasses} {t("glassUnit")})
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: Math.min(results.glasses, 20) }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-10 rounded-b-lg border-2 border-indigo-500/60 bg-indigo-500/20 flex items-end overflow-hidden"
                >
                  <div className="w-full bg-indigo-500/50 h-3/4 rounded-b" />
                </div>
              ))}
              {results.glasses > 20 && (
                <div className="flex items-center text-xs text-gray-500">
                  +{results.glasses - 20} {t("more")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
