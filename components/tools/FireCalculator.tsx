"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function FireCalculator() {
  const t = useTranslations("FireCalculator");

  const [annualExpenses, setAnnualExpenses] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [annualSavings, setAnnualSavings] = useState("");
  const [returnRate, setReturnRate] = useState("7");
  const [withdrawalRate, setWithdrawalRate] = useState("4");

  const [fireNumber, setFireNumber] = useState<number | null>(null);
  const [yearsToFire, setYearsToFire] = useState<number | null>(null);
  const [savingsRate, setSavingsRate] = useState<number | null>(null);
  const [alreadyFire, setAlreadyFire] = useState(false);

  const calculate = () => {
    const expenses = parseFloat(annualExpenses);
    const savings = parseFloat(currentSavings);
    const annSavings = parseFloat(annualSavings);
    const r = parseFloat(returnRate) / 100;
    const wr = parseFloat(withdrawalRate);

    if (isNaN(expenses) || isNaN(savings) || isNaN(annSavings) || isNaN(r) || isNaN(wr)) return;

    const fire = expenses / (wr / 100);
    setFireNumber(fire);

    const sr = annSavings / (annSavings + expenses) * 100;
    setSavingsRate(sr);

    if (savings >= fire) {
      setAlreadyFire(true);
      setYearsToFire(0);
      return;
    }

    setAlreadyFire(false);

    if (r === 0) {
      const remaining = fire - savings;
      setYearsToFire(annSavings > 0 ? Math.ceil(remaining / annSavings) : null);
      return;
    }

    let years = null;
    for (let n = 1; n <= 100; n++) {
      const growth = Math.pow(1 + r, n);
      const projected = savings * growth + annSavings * (growth - 1) / r;
      if (projected >= fire) {
        years = n;
        break;
      }
    }
    setYearsToFire(years);
  };

  const clear = () => {
    setAnnualExpenses("");
    setCurrentSavings("");
    setAnnualSavings("");
    setReturnRate("7");
    setWithdrawalRate("4");
    setFireNumber(null);
    setYearsToFire(null);
    setSavingsRate(null);
    setAlreadyFire(false);
  };

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("annualExpensesLabel")}
          </label>
          <input
            type="number"
            value={annualExpenses}
            onChange={(e) => setAnnualExpenses(e.target.value)}
            placeholder={t("annualExpensesPlaceholder")}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("currentSavingsLabel")}
          </label>
          <input
            type="number"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("annualSavingsLabel")}
          </label>
          <input
            type="number"
            value={annualSavings}
            onChange={(e) => setAnnualSavings(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("returnRateLabel")} (%)
          </label>
          <input
            type="number"
            value={returnRate}
            onChange={(e) => setReturnRate(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("withdrawalRateLabel")} (%)
          </label>
          <input
            type="number"
            value={withdrawalRate}
            onChange={(e) => setWithdrawalRate(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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

      {fireNumber !== null && (
        <div className="space-y-4">
          {alreadyFire && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg px-4 py-3 text-green-400 font-medium">
              {t("alreadyFire")}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">{t("fireNumberLabel")}</p>
              <p className="text-2xl font-bold text-indigo-400">${fmt(fireNumber)}</p>
              <p className="text-xs text-gray-500 mt-1">{t("fireNumberDesc")}</p>
            </div>

            {!alreadyFire && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">{t("yearsToFireLabel")}</p>
                <p className="text-2xl font-bold text-indigo-400">
                  {yearsToFire !== null ? yearsToFire : "100+"}
                </p>
              </div>
            )}

            {savingsRate !== null && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">{t("savingsRateLabel")}</p>
                <p className="text-2xl font-bold text-indigo-400">{savingsRate.toFixed(1)}%</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
