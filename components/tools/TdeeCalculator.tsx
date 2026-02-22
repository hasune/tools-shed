"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Gender = "male" | "female";
type Unit = "metric" | "imperial";
type ActivityKey = "sedentary" | "lightlyActive" | "moderatelyActive" | "veryActive" | "extraActive";

const ACTIVITY_MULTIPLIERS: Record<ActivityKey, number> = {
  sedentary: 1.2,
  lightlyActive: 1.375,
  moderatelyActive: 1.55,
  veryActive: 1.725,
  extraActive: 1.9,
};

const ACTIVITY_KEYS: ActivityKey[] = [
  "sedentary",
  "lightlyActive",
  "moderatelyActive",
  "veryActive",
  "extraActive",
];

interface Results {
  bmr: number;
  tdee: number;
  weightLoss: number;
  maintenance: number;
  weightGain: number;
}

export default function TdeeCalculator() {
  const t = useTranslations("TdeeCalculator");

  const [unit, setUnit] = useState<Unit>("metric");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [activity, setActivity] = useState<ActivityKey>("moderatelyActive");
  const [results, setResults] = useState<Results | null>(null);

  const calculate = () => {
    const ageNum = parseFloat(age);
    let weightKg: number;
    let heightCmVal: number;

    if (unit === "metric") {
      weightKg = parseFloat(weight);
      heightCmVal = parseFloat(heightCm);
    } else {
      weightKg = parseFloat(weight) * 0.453592;
      const totalInches = parseFloat(heightFt) * 12 + parseFloat(heightIn || "0");
      heightCmVal = totalInches * 2.54;
    }

    if (!ageNum || !weightKg || !heightCmVal || ageNum <= 0 || weightKg <= 0 || heightCmVal <= 0) return;

    const bmr =
      gender === "male"
        ? 10 * weightKg + 6.25 * heightCmVal - 5 * ageNum + 5
        : 10 * weightKg + 6.25 * heightCmVal - 5 * ageNum - 161;

    const tdee = bmr * ACTIVITY_MULTIPLIERS[activity];

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightLoss: Math.round(tdee - 500),
      maintenance: Math.round(tdee),
      weightGain: Math.round(tdee + 500),
    });
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Age */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("ageLabel")}</label>
          <input
            type="number"
            min={1}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 30"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
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

        {/* Weight */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">
            {t("weightLabel")} ({unit === "metric" ? "kg" : "lbs"})
          </label>
          <input
            type="number"
            min={0}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>

        {/* Height */}
        {unit === "metric" ? (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">{t("heightLabel")} (cm)</label>
            <input
              type="number"
              min={0}
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="e.g. 175"
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">{t("heightLabel")} (ft / in)</label>
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
          </div>
        )}
      </div>

      {/* Activity Level */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{t("activityLabel")}</label>
        <div className="space-y-1.5">
          {ACTIVITY_KEYS.map((key) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="activity"
                checked={activity === key}
                onChange={() => setActivity(key)}
                className="accent-indigo-500 w-4 h-4"
              />
              <span className={`text-sm transition-colors ${activity === key ? "text-white" : "text-gray-400 group-hover:text-gray-300"}`}>
                {t(key)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        {t("calculateButton")}
      </button>

      {results && (
        <div className="space-y-3">
          {/* TDEE prominent */}
          <div className="bg-gray-900 border border-indigo-500/30 rounded-xl p-6 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("tdee")}</div>
            <div className="text-5xl font-bold text-indigo-400 mb-1">
              {results.tdee.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">{t("caloriesPerDay")}</div>
          </div>

          {/* BMR */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-gray-400">{t("bmr")}</span>
            <span className="text-white font-semibold">{results.bmr.toLocaleString()} kcal</span>
          </div>

          {/* Calorie targets */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-3 text-center">
              <div className="text-xs text-red-400 mb-1">{t("weightLoss")}</div>
              <div className="text-lg font-bold text-white">{results.weightLoss.toLocaleString()}</div>
              <div className="text-xs text-gray-600">{t("caloriesPerDay")}</div>
            </div>
            <div className="bg-gray-900 border border-indigo-500/30 rounded-lg px-3 py-3 text-center">
              <div className="text-xs text-indigo-400 mb-1">{t("maintenance")}</div>
              <div className="text-lg font-bold text-white">{results.maintenance.toLocaleString()}</div>
              <div className="text-xs text-gray-600">{t("caloriesPerDay")}</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-3 text-center">
              <div className="text-xs text-green-400 mb-1">{t("weightGain")}</div>
              <div className="text-lg font-bold text-white">{results.weightGain.toLocaleString()}</div>
              <div className="text-xs text-gray-600">{t("caloriesPerDay")}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
