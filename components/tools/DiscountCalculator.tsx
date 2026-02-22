"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Results {
  salePrice: number;
  discountAmount: number;
  discountPercent: number;
}

export default function DiscountCalculator() {
  const t = useTranslations("DiscountCalculator");

  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [results, setResults] = useState<Results | null>(null);

  const calculate = () => {
    const price = parseFloat(originalPrice);
    const pct = parseFloat(discountPercent);
    if (isNaN(price) || isNaN(pct) || price <= 0 || pct < 0 || pct > 100) return;

    const discountAmount = price * (pct / 100);
    const salePrice = price - discountAmount;
    setResults({ salePrice, discountAmount, discountPercent: pct });
  };

  const handleClear = () => {
    setOriginalPrice("");
    setDiscountPercent("");
    setResults(null);
  };

  const fmt = (val: number) =>
    val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("originalPriceLabel")}</label>
          <input
            type="number"
            min={0}
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="e.g. 100.00"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("discountLabel")}</label>
          <input
            type="number"
            min={0}
            max={100}
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            placeholder="e.g. 20"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{t("salePrice")}</div>
            <div className="text-2xl font-bold text-green-400">${fmt(results.salePrice)}</div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{t("discountAmount")}</div>
            <div className="text-2xl font-bold text-red-400">-${fmt(results.discountAmount)}</div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{t("youSave")}</div>
            <div className="text-2xl font-bold text-indigo-400">{results.discountPercent}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
