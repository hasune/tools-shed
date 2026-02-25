"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function DividendCalculator() {
  const t = useTranslations("DividendCalculator");

  const [sharePrice, setSharePrice] = useState("");
  const [annualDividend, setAnnualDividend] = useState("");
  const [shares, setShares] = useState("");

  const [results, setResults] = useState<{
    dividendYield: number;
    annualIncome: number;
    monthlyIncome: number;
    quarterlyIncome: number;
    totalInvestment: number;
  } | null>(null);

  const calculate = () => {
    const price = parseFloat(sharePrice);
    const dividend = parseFloat(annualDividend);
    const numShares = parseFloat(shares);

    if (isNaN(price) || isNaN(dividend) || isNaN(numShares) || price <= 0) return;

    const annualIncome = dividend * numShares;
    setResults({
      dividendYield: (dividend / price) * 100,
      annualIncome,
      monthlyIncome: annualIncome / 12,
      quarterlyIncome: annualIncome / 4,
      totalInvestment: price * numShares,
    });
  };

  const clear = () => {
    setSharePrice("");
    setAnnualDividend("");
    setShares("");
    setResults(null);
  };

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("sharePriceLabel")} ($)
          </label>
          <input
            type="number"
            value={sharePrice}
            onChange={(e) => setSharePrice(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("annualDividendLabel")} ($)
          </label>
          <input
            type="number"
            value={annualDividend}
            onChange={(e) => setAnnualDividend(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("sharesLabel")}
          </label>
          <input
            type="number"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
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

      {results && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">{t("dividendYieldLabel")}</p>
            <p className="text-2xl font-bold text-indigo-400">{results.dividendYield.toFixed(2)}%</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">{t("totalInvestmentLabel")}</p>
            <p className="text-2xl font-bold text-indigo-400">${fmt(results.totalInvestment)}</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">{t("annualIncomeLabel")}</p>
            <p className="text-2xl font-bold text-indigo-400">${fmt(results.annualIncome)}</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">{t("quarterlyIncomeLabel")}</p>
            <p className="text-2xl font-bold text-indigo-400">${fmt(results.quarterlyIncome)}</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:col-span-2">
            <p className="text-sm text-gray-400 mb-1">{t("monthlyIncomeLabel")}</p>
            <p className="text-2xl font-bold text-indigo-400">${fmt(results.monthlyIncome)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
