"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Goal = "maintain" | "endurance" | "muscle" | "strength" | "weightloss";
type Activity = "sedentary" | "light" | "moderate" | "very" | "extreme";

// Protein ranges in g/kg body weight: [min, max]
const PROTEIN_RANGES: Record<Goal, [number, number]> = {
  maintain: [0.8, 1.0],
  endurance: [1.2, 1.4],
  muscle: [1.6, 2.2],
  strength: [1.8, 2.5],
  weightloss: [1.2, 1.6],
};

// Activity multiplier (adds to the range)
const ACTIVITY_BONUS: Record<Activity, number> = {
  sedentary: 0,
  light: 0.1,
  moderate: 0.2,
  very: 0.3,
  extreme: 0.4,
};

export default function ProteinCalculator() {
  const t = useTranslations("ProteinCalculator");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [result, setResult] = useState<{ min: number; max: number; rec: number; perKg: string } | null>(null);

  const goals: Array<[Goal, string]> = [
    ["maintain", t("goalMaintain")],
    ["endurance", t("goalEndurance")],
    ["muscle", t("goalMuscle")],
    ["strength", t("goalStrength")],
    ["weightloss", t("goalWeightLoss")],
  ];

  const activities: Array<[Activity, string]> = [
    ["sedentary", t("activitySedentary")],
    ["light", t("activityLight")],
    ["moderate", t("activityModerate")],
    ["very", t("activityVery")],
    ["extreme", t("activityExtreme")],
  ];

  const calculate = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;
    const kg = unit === "lbs" ? w / 2.205 : w;
    const [baseMin, baseMax] = PROTEIN_RANGES[goal];
    const bonus = ACTIVITY_BONUS[activity];
    const min = Math.round((baseMin + bonus) * kg);
    const max = Math.round((baseMax + bonus) * kg);
    const rec = Math.round(((baseMin + baseMax) / 2 + bonus) * kg);
    setResult({ min, max, rec, perKg: ((baseMin + baseMax) / 2 + bonus).toFixed(1) });
  };

  const clear = () => { setWeight(""); setResult(null); };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("weightLabel")}</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              min="1"
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
            <div className="flex gap-1">
              {(["kg", "lbs"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${unit === u ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                >
                  {t(`weightUnit${u === "kg" ? "Kg" : "Lbs"}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("goalLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {goals.map(([g, label]) => (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${goal === g ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("activityLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {activities.map(([a, label]) => (
            <button
              key={a}
              onClick={() => setActivity(a)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${activity === a ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={calculate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={clear} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">{t("minLabel")}</p>
            <p className="text-2xl font-bold text-white">{result.min}</p>
            <p className="text-xs text-gray-500">{t("gramsPerDay")}</p>
          </div>
          <div className="bg-indigo-950 border border-indigo-700 rounded-xl p-4 text-center">
            <p className="text-xs text-indigo-400 mb-1">{t("recommendedLabel")}</p>
            <p className="text-2xl font-bold text-indigo-300">{result.rec}</p>
            <p className="text-xs text-indigo-400">{t("gramsPerDay")}</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">{t("maxLabel")}</p>
            <p className="text-2xl font-bold text-white">{result.max}</p>
            <p className="text-xs text-gray-500">{t("gramsPerDay")}</p>
          </div>
          <div className="col-span-3 bg-gray-900 border border-gray-700 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">{result.perKg} {t("perKgLabel")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
