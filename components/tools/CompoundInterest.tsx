"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function CompoundInterest() {
  const t = useTranslations("CompoundInterest");

  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [compound, setCompound] = useState("12");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [result, setResult] = useState<{
    finalAmount: number;
    interestEarned: number;
    totalContributions: number;
  } | null>(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t2 = parseFloat(years);
    const n = parseFloat(compound);
    const pmt = parseFloat(monthlyContribution || "0");

    if (!P || !r || !t2 || !n) return;

    const mainAmount = P * Math.pow(1 + r / n, n * t2);
    const contributionAmount = pmt > 0
      ? pmt * (Math.pow(1 + r / n, n * t2) - 1) / (r / n)
      : 0;
    const finalAmount = mainAmount + contributionAmount;
    const totalContributions = P + pmt * t2 * 12;
    const interestEarned = finalAmount - totalContributions;

    setResult({ finalAmount, interestEarned, totalContributions });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("principalLabel")}</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)}
            placeholder="e.g. 10000"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("rateLabel")}</label>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)}
            placeholder="e.g. 7"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("yearsLabel")}</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)}
            placeholder="e.g. 10"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("compoundFrequencyLabel")}</label>
          <select value={compound} onChange={(e) => setCompound(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500">
            <option value="365">{t("daily")}</option>
            <option value="12">{t("monthly")}</option>
            <option value="4">{t("quarterly")}</option>
            <option value="2">{t("semiAnnually")}</option>
            <option value="1">{t("annually")}</option>
          </select>
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-sm font-medium text-gray-300">
            {t("monthlyContributionLabel")} <span className="text-gray-500">{t("monthlyContributionOptional")}</span>
          </label>
          <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)}
            placeholder="e.g. 200"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
        </div>
      </div>

      <button onClick={calculate}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors">
        {t("calculateButton")}
      </button>

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-indigo-500/30 rounded-xl p-5 text-center">
            <div className="text-xs text-gray-500 mb-1">{t("finalAmount")}</div>
            <div className="text-2xl font-bold text-indigo-400">{fmt(result.finalAmount)}</div>
          </div>
          <div className="bg-gray-900 border border-green-500/30 rounded-xl p-5 text-center">
            <div className="text-xs text-gray-500 mb-1">{t("interestEarned")}</div>
            <div className="text-2xl font-bold text-green-400">{fmt(result.interestEarned)}</div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 text-center">
            <div className="text-xs text-gray-500 mb-1">{t("totalInvested")}</div>
            <div className="text-2xl font-bold text-gray-300">{fmt(result.totalContributions)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
