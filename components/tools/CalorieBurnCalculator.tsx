"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Activity {
  key: string;
  met: number;
}

const ACTIVITIES: Activity[] = [
  { key: "activityRunning", met: 8.0 },
  { key: "activityRunningFast", met: 11.5 },
  { key: "activityWalking", met: 3.5 },
  { key: "activityCycling", met: 6.0 },
  { key: "activitySwimming", met: 7.0 },
  { key: "activityWeightLifting", met: 3.5 },
  { key: "activityYoga", met: 2.5 },
  { key: "activityHiking", met: 5.3 },
  { key: "activityJumprope", met: 10.0 },
  { key: "activityDancing", met: 5.0 },
  { key: "activityBasketball", met: 6.5 },
  { key: "activitySoccer", met: 7.0 },
  { key: "activityRowingMachine", met: 7.0 },
  { key: "activityElliptical", met: 5.0 },
  { key: "activityPilates", met: 3.0 },
  { key: "activityZumba", met: 6.0 },
];

// Calories = MET × weight(kg) × time(hours)
function calcCalories(met: number, weightKg: number, durationMin: number): number {
  return met * weightKg * (durationMin / 60);
}

export default function CalorieBurnCalculator() {
  const t = useTranslations("CalorieBurnCalculator");

  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [weight, setWeight] = useState("");
  const [activityKey, setActivityKey] = useState("activityRunning");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [met, setMet] = useState<number | null>(null);

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    if (isNaN(w) || w <= 0 || isNaN(d) || d <= 0) return;
    const weightKg = unit === "lb" ? w * 0.453592 : w;
    const activity = ACTIVITIES.find((a) => a.key === activityKey)!;
    setResult(Math.round(calcCalories(activity.met, weightKg, d)));
    setMet(activity.met);
  };

  return (
    <div className="space-y-5">
      {/* Weight */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">{t("weightLabel")}</label>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "kg" ? "70" : "154"}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex rounded-lg overflow-hidden border border-gray-700">
            {(["kg", "lb"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  unit === u ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {t(`${u}Unit`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">{t("activityLabel")}</label>
        <select
          value={activityKey}
          onChange={(e) => setActivityKey(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
        >
          {ACTIVITIES.map((a) => (
            <option key={a.key} value={a.key}>
              {t(a.key as Parameters<typeof t>[0])} (MET {a.met})
            </option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">{t("durationLabel")}</label>
        <input
          type="number"
          min={1}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="30"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-medium transition-colors"
      >
        {t("calculateButton")}
      </button>

      {result !== null && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900 rounded-xl p-4 border border-indigo-800 text-center">
            <p className="text-xs text-gray-500 mb-1">{t("resultLabel")}</p>
            <p className="text-3xl font-bold text-indigo-400">{result.toLocaleString()}</p>
            <p className="text-xs text-gray-600 mt-1">kcal</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
            <p className="text-xs text-gray-500 mb-1">{t("metLabel")}</p>
            <p className="text-3xl font-bold text-white">{met}</p>
          </div>
        </div>
      )}
    </div>
  );
}
