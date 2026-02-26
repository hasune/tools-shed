"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function BreakEvenCalculator() {
  const t = useTranslations("BreakEvenCalculator");

  const [fixedCosts, setFixedCosts] = useState("");
  const [variableCost, setVariableCost] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [result, setResult] = useState<{
    units: number;
    revenue: number;
    margin: number;
    marginRatio: number;
  } | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    const fc = parseFloat(fixedCosts);
    const vc = parseFloat(variableCost);
    const sp = parseFloat(sellingPrice);

    if (!fc || !vc || !sp || fc < 0 || vc < 0 || sp <= 0) {
      setError("Please enter valid positive values.");
      return;
    }
    if (sp <= vc) {
      setError(t("errorSamePrice"));
      return;
    }

    const margin = sp - vc;
    const marginRatio = (margin / sp) * 100;
    const units = fc / margin;
    const revenue = units * sp;

    setResult({ units, revenue, margin, marginRatio });
  }

  function clear() {
    setFixedCosts("");
    setVariableCost("");
    setSellingPrice("");
    setResult(null);
    setError("");
  }

  const fmt = (n: number, decimals = 2) =>
    n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("fixedCostsLabel")}
          </label>
          <input
            type="number"
            value={fixedCosts}
            onChange={(e) => setFixedCosts(e.target.value)}
            placeholder={t("fixedCostsPlaceholder")}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("variableCostLabel")}
          </label>
          <input
            type="number"
            value={variableCost}
            onChange={(e) => setVariableCost(e.target.value)}
            placeholder={t("variableCostPlaceholder")}
            step="0.01"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("sellingPriceLabel")}
          </label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            placeholder={t("sellingPricePlaceholder")}
            step="0.01"
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
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-xl p-4 text-center">
              <p className="text-sm text-indigo-300 mb-1">{t("breakEvenUnits")}</p>
              <p className="text-4xl font-bold text-indigo-400">{fmt(result.units, 0)}</p>
              <p className="text-xs text-gray-500 mt-1">units</p>
            </div>
            <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-xl p-4 text-center">
              <p className="text-sm text-indigo-300 mb-1">{t("breakEvenRevenue")}</p>
              <p className="text-4xl font-bold text-indigo-400">${fmt(result.revenue, 0)}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-3 h-3 rounded-sm bg-red-500/60 inline-block" />
                {t("chartFixedCosts")}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-3 h-3 rounded-sm bg-indigo-500/60 inline-block" />
                {t("chartRevenue")}
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{t("contributionMargin")}</span>
                  <span>${fmt(result.margin)}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, result.marginRatio)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{t("contributionMarginRatio")}</span>
                  <span>{fmt(result.marginRatio)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
