"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function BudgetCalculator() {
  const t = useTranslations("BudgetCalculator");
  const [income, setIncome] = useState("");
  const [currency, setCurrency] = useState("$");
  const [result, setResult] = useState<{ needs: number; wants: number; savings: number } | null>(null);

  const calculate = () => {
    const val = parseFloat(income);
    if (!val || val <= 0) return;
    setResult({ needs: val * 0.5, wants: val * 0.3, savings: val * 0.2 });
  };

  const clear = () => { setIncome(""); setResult(null); };

  const fmt = (n: number) => `${currency}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const categories = result
    ? [
        { label: t("needsLabel"), amount: result.needs, yearly: result.needs * 12, desc: t("needsDesc"), color: "indigo" },
        { label: t("wantsLabel"), amount: result.wants, yearly: result.wants * 12, desc: t("wantsDesc"), color: "purple" },
        { label: t("savingsLabel"), amount: result.savings, yearly: result.savings * 12, desc: t("savingsDesc"), color: "green" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("incomeLabel")}</label>
          <input
            type="number"
            min="0"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="3000"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("currencyLabel")}</label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            maxLength={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          {t("calculateButton")}
        </button>
        <button
          onClick={clear}
          className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.label} className={`bg-gray-800 border border-gray-700 rounded-lg p-4`}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-white">{cat.label}</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-indigo-400">{fmt(cat.amount)} <span className="text-sm text-gray-400">/ {t("monthlyLabel")}</span></div>
                  <div className="text-sm text-gray-400">{fmt(cat.yearly)} / {t("yearlyLabel")}</div>
                </div>
              </div>
              <p className="text-sm text-gray-400">{cat.desc}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h3 className="font-semibold text-white mb-1">{t("ruleTitle")}</h3>
        <p className="text-sm text-gray-400">{t("ruleDesc")}</p>
      </div>
    </div>
  );
}
