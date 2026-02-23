"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function InflationCalculator() {
  const t = useTranslations("InflationCalculator");

  const currentYear = new Date().getFullYear();
  const [amount, setAmount] = useState("");
  const [startYear, setStartYear] = useState(String(currentYear - 10));
  const [endYear, setEndYear] = useState(String(currentYear));
  const [rate, setRate] = useState("3");
  const [result, setResult] = useState<{
    adjusted: number;
    lost: number;
    totalInflation: number;
    startYear: number;
    endYear: number;
    original: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const A = parseFloat(amount);
    const r = parseFloat(rate) / 100;
    const sy = parseInt(startYear);
    const ey = parseInt(endYear);

    if (!A || A <= 0) { setError("Please enter a valid amount."); return; }
    if (!r || r < 0) { setError("Please enter a valid inflation rate."); return; }
    if (sy >= ey) { setError("End year must be greater than start year."); return; }

    const years = ey - sy;
    const adjusted = A * Math.pow(1 + r, years);
    const lost = ((adjusted - A) / adjusted) * 100;
    const totalInflation = ((adjusted - A) / A) * 100;

    setResult({ adjusted, lost, totalInflation, startYear: sy, endYear: ey, original: A });
  }

  function clear() {
    setAmount("");
    setStartYear(String(currentYear - 10));
    setEndYear(String(currentYear));
    setRate("3");
    setResult(null);
    setError("");
  }

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const years = Array.from({ length: 100 }, (_, i) => currentYear - 80 + i + 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("amountLabel")}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t("amountPlaceholder")}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("startYearLabel")}
          </label>
          <select
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("endYearLabel")}
          </label>
          <select
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("rateLabel")}
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder={t("ratePlaceholder")}
            step="0.1"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t("calculateButton")}
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-xl p-4 text-center">
            <p className="text-sm text-indigo-300 mb-1">{t("adjustedValue")}</p>
            <p className="text-4xl font-bold text-indigo-400">${fmt(result.adjusted)}</p>
            <p className="text-sm text-gray-400 mt-2">
              {t("equivalentToday", {
                year: result.startYear,
                amount: fmt(result.original),
                adjusted: fmt(result.adjusted),
              })}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{t("totalInflation")}</p>
              <p className="text-xl font-semibold text-red-400">+{fmt(result.totalInflation)}%</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{t("purchasingPowerLost")}</p>
              <p className="text-xl font-semibold text-orange-400">{fmt(result.lost)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
