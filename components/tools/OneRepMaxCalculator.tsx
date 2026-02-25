"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

type WeightUnit = "kg" | "lbs";

interface Results {
  epley: number;
  brzycki: number;
  lander: number;
  lombardi: number;
  average: number;
}

const PERCENTAGES = [50, 60, 70, 75, 80, 85, 90, 95, 100];

export default function OneRepMaxCalculator() {
  const t = useTranslations("OneRepMaxCalculator");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [unit, setUnit] = useState<WeightUnit>("kg");
  const [results, setResults] = useState<Results | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (!w || !r || r < 1 || r > 30) return;

    const epley = r === 1 ? w : w * (1 + r / 30);
    const brzycki = r === 1 ? w : w * (36 / (37 - r));
    const lander = (100 * w) / (101.3 - 2.67123 * r);
    const lombardi = w * Math.pow(r, 0.1);
    const average = (epley + brzycki + lander + lombardi) / 4;

    setResults({
      epley: Math.round(epley * 10) / 10,
      brzycki: Math.round(brzycki * 10) / 10,
      lander: Math.round(lander * 10) / 10,
      lombardi: Math.round(lombardi * 10) / 10,
      average: Math.round(average * 10) / 10,
    });
  };

  const clear = () => {
    setWeight("");
    setReps("");
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t("weightLabel")} ({unit})
            </label>
            <input
              type="number"
              value={weight}
              min="0"
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 100"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t("repsLabel")} (1–30)
            </label>
            <input
              type="number"
              value={reps}
              min="1"
              max="30"
              onChange={(e) => setReps(e.target.value)}
              placeholder="e.g. 5"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("weightUnitLabel")}
          </label>
          <div className="flex gap-2">
            {(["kg", "lbs"] as WeightUnit[]).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  unit === u
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={calculate}
            disabled={!weight || !reps}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t("calculateButton")}
          </button>
          <button
            onClick={clear}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t("clearButton")}
          </button>
        </div>
      </div>

      {results && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">{t("resultsTitle")}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: t("epley"), value: results.epley },
                { label: t("brzycki"), value: results.brzycki },
                { label: t("lander"), value: results.lander },
                { label: t("lombardi"), value: results.lombardi },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center"
                >
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className="text-base font-bold text-white">
                    {item.value} {unit}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-lg p-4 text-center">
              <p className="text-xs text-indigo-300 mb-1">Average Estimate</p>
              <p className="text-2xl font-bold text-indigo-400">
                {results.average} {unit}
              </p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-1">{t("percentageTitle")}</h3>
            <p className="text-xs text-gray-500 mb-4">{t("percentageDesc")}</p>
            <div className="space-y-2">
              {PERCENTAGES.map((pct) => {
                const val = Math.round((results.average * pct) / 100 * 10) / 10;
                return (
                  <div
                    key={pct}
                    className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                      pct === 100
                        ? "bg-indigo-900/30 border border-indigo-500/40"
                        : "bg-gray-800"
                    }`}
                  >
                    <span className={`text-sm font-medium ${pct === 100 ? "text-indigo-300" : "text-gray-400"}`}>
                      {pct}%
                    </span>
                    <span className={`text-sm font-bold ${pct === 100 ? "text-indigo-400" : "text-white"}`}>
                      {val} {unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
