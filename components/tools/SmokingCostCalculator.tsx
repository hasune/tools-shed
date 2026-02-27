"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function SmokingCostCalculator() {
  const t = useTranslations("SmokingCostCalculator");
  const [cigarettes, setCigarettes] = useState("");
  const [price, setPrice] = useState("");
  const [perPack, setPerPack] = useState("20");
  const [currency, setCurrency] = useState("$");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<{
    daily: number; monthly: number; yearly: number; total: number; packsPerDay: number;
  } | null>(null);

  const calculate = () => {
    const cigs = parseFloat(cigarettes);
    const packPrice = parseFloat(price);
    const cigPerPack = parseFloat(perPack) || 20;
    const yrs = parseFloat(years) || 1;
    if (!cigs || !packPrice || cigs <= 0 || packPrice <= 0) return;
    const costPerCig = packPrice / cigPerPack;
    const daily = cigs * costPerCig;
    const monthly = daily * 30.44;
    const yearly = daily * 365;
    const total = daily * 365 * yrs;
    const packsPerDay = cigs / cigPerPack;
    setResult({ daily, monthly, yearly, total, packsPerDay });
  };

  const clear = () => { setCigarettes(""); setPrice(""); setPerPack("20"); setYears(""); setResult(null); };
  const fmt = (n: number) => `${currency}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("cigarettesLabel")}</label>
          <input type="number" min="0" value={cigarettes} onChange={(e) => setCigarettes(e.target.value)} placeholder="10"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("priceLabel")}</label>
          <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="8.00"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("cigarettesPerPackLabel")}</label>
          <input type="number" min="1" value={perPack} onChange={(e) => setPerPack(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("currencyLabel")}</label>
          <input type="text" maxLength={3} value={currency} onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("yearsLabel")}</label>
          <input type="number" min="0" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} placeholder="5"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={clear} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t("packsPerDayLabel"), value: result.packsPerDay.toFixed(2) },
              { label: t("dailyCostLabel"), value: fmt(result.daily) },
              { label: t("monthlyCostLabel"), value: fmt(result.monthly) },
              { label: t("yearlyCostLabel"), value: fmt(result.yearly) },
            ].map((item) => (
              <div key={item.label} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-indigo-400">{item.value}</div>
                <div className="text-xs text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-400 mb-1">{t("totalSpentLabel")}</div>
            <div className="text-2xl font-bold text-red-400">{fmt(result.total)}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3">{t("ifQuitTitle")}</h3>
            <div className="space-y-2">
              {[
                { label: t("savingsIn1Year"), value: fmt(result.yearly) },
                { label: t("savingsIn5Years"), value: fmt(result.yearly * 5) },
                { label: t("savingsIn10Years"), value: fmt(result.yearly * 10) },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="font-semibold text-green-400">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500">{t("healthNote")}</p>
        </div>
      )}
    </div>
  );
}
