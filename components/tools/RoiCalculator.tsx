"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Results {
  roi: number;
  annualizedRoi: number | null;
  totalProfit: number;
  totalReturn: number;
}

export default function RoiCalculator() {
  const t = useTranslations("RoiCalculator");

  const [initialInvestment, setInitialInvestment] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [results, setResults] = useState<Results | null>(null);

  const calculate = () => {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    if (!initial || !final || initial <= 0) return;

    const totalProfit = final - initial;
    const roi = (totalProfit / initial) * 100;

    let annualizedRoi: number | null = null;
    const years = parseFloat(timePeriod);
    if (!isNaN(years) && years > 0) {
      annualizedRoi = (Math.pow(final / initial, 1 / years) - 1) * 100;
    }

    setResults({ roi, annualizedRoi, totalProfit, totalReturn: final });
  };

  const handleClear = () => {
    setInitialInvestment("");
    setFinalValue("");
    setTimePeriod("");
    setResults(null);
  };

  const fmt = (val: number) =>
    val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const fmtPct = (val: number) => `${val >= 0 ? "+" : ""}${val.toFixed(2)}%`;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("initialInvestmentLabel")}</label>
          <input
            type="number"
            min={0}
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
            placeholder="e.g. 10000"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("finalValueLabel")}</label>
          <input
            type="number"
            min={0}
            value={finalValue}
            onChange={(e) => setFinalValue(e.target.value)}
            placeholder="e.g. 15000"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">
          {t("timePeriodLabel")}
          <span className="text-gray-500 font-normal ml-2 text-xs">(optional)</span>
        </label>
        <input
          type="number"
          min={0}
          step={0.5}
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          placeholder="e.g. 3"
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
        />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{t("roi")}</div>
            <div className={`text-2xl font-bold ${results.roi >= 0 ? "text-green-400" : "text-red-400"}`}>
              {fmtPct(results.roi)}
            </div>
          </div>

          {results.annualizedRoi !== null && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-center">
              <div className="text-xs text-gray-500 mb-1">{t("annualizedRoi")}</div>
              <div className={`text-2xl font-bold ${results.annualizedRoi >= 0 ? "text-green-400" : "text-red-400"}`}>
                {fmtPct(results.annualizedRoi)}
              </div>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{t("totalProfit")}</div>
            <div className={`text-xl font-bold ${results.totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
              {results.totalProfit >= 0 ? "+" : ""}${fmt(results.totalProfit)}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{t("totalReturn")}</div>
            <div className="text-xl font-bold text-white">${fmt(results.totalReturn)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
