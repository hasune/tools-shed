"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function SavingsGoalCalculator() {
  const t = useTranslations("SavingsGoalCalculator");

  const [goal, setGoal] = useState("");
  const [current, setCurrent] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<{
    monthly: number;
    contributions: number;
    interest: number;
    final: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const G = parseFloat(goal);
    const C = parseFloat(current) || 0;
    const r = parseFloat(rate) / 100;
    const n = parseFloat(years);

    if (!G || !n || G <= 0 || n <= 0) {
      setError("Please enter valid goal amount and time period.");
      return;
    }

    const months = n * 12;
    const monthlyRate = r / 12;

    let monthly: number;
    if (monthlyRate === 0) {
      monthly = (G - C) / months;
    } else {
      // FV of current savings
      const fvCurrent = C * Math.pow(1 + monthlyRate, months);
      // Required FV from monthly contributions
      const fvNeeded = G - fvCurrent;
      // PMT formula
      monthly = fvNeeded * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
    }

    if (monthly < 0) {
      monthly = 0;
    }

    const contributions = C + monthly * months;
    const interest = G - contributions;

    setResult({
      monthly: Math.max(0, monthly),
      contributions,
      interest: Math.max(0, interest),
      final: G,
    });
  }

  function clear() {
    setGoal("");
    setCurrent("");
    setRate("");
    setYears("");
    setResult(null);
    setError("");
  }

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("goalLabel")}
          </label>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder={t("goalPlaceholder")}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("currentLabel")}
          </label>
          <input
            type="number"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder={t("currentPlaceholder")}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
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
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("yearsLabel")}
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder={t("yearsPlaceholder")}
            min="1"
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
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-indigo-900/30 border border-indigo-500/40 rounded-xl p-4 text-center">
            <p className="text-sm text-indigo-300 mb-1">{t("monthlySavings")}</p>
            <p className="text-4xl font-bold text-indigo-400">${fmt(result.monthly)}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">{t("totalContributions")}</p>
            <p className="text-xl font-semibold text-white">${fmt(result.contributions)}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">{t("interestEarned")}</p>
            <p className="text-xl font-semibold text-green-400">${fmt(result.interest)}</p>
          </div>
          <div className="col-span-2 bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">{t("finalAmount")}</p>
            <p className="text-2xl font-bold text-white">${fmt(result.final)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
