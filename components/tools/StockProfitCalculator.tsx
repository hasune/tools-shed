"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function StockProfitCalculator() {
  const t = useTranslations("StockProfitCalculator");
  const [buyPrice, setBuyPrice] = useState("100");
  const [sellPrice, setSellPrice] = useState("150");
  const [shares, setShares] = useState("100");
  const [buyComm, setBuyComm] = useState("0");
  const [sellComm, setSellComm] = useState("0");
  const [result, setResult] = useState<{
    totalCost: number;
    totalRevenue: number;
    profitLoss: number;
    roi: number;
    profitPerShare: number;
  } | null>(null);

  const calculate = () => {
    const bp = parseFloat(buyPrice), sp = parseFloat(sellPrice);
    const sh = parseFloat(shares);
    const bc = parseFloat(buyComm) || 0;
    const sc = parseFloat(sellComm) || 0;
    if (isNaN(bp) || isNaN(sp) || isNaN(sh) || sh <= 0) return;
    const totalCost = bp * sh + bc;
    const totalRevenue = sp * sh - sc;
    const profitLoss = totalRevenue - totalCost;
    const roi = totalCost > 0 ? profitLoss / totalCost : 0;
    const profitPerShare = sh > 0 ? profitLoss / sh : 0;
    setResult({ totalCost, totalRevenue, profitLoss, roi, profitPerShare });
  };

  const fmt = (n: number) =>
    "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const clear = () => {
    setBuyPrice("100"); setSellPrice("150"); setShares("100");
    setBuyComm("0"); setSellComm("0"); setResult(null);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("buyPriceLabel")}</label>
          <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder={t("buyPricePlaceholder")} min="0" step="0.01"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("sellPriceLabel")}</label>
          <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder={t("sellPricePlaceholder")} min="0" step="0.01"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("sharesLabel")}</label>
          <input type="number" value={shares} onChange={(e) => setShares(e.target.value)} placeholder={t("sharesPlaceholder")} min="0"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("buyCommissionLabel")}</label>
          <input type="number" value={buyComm} onChange={(e) => setBuyComm(e.target.value)} placeholder={t("commissionPlaceholder")} min="0" step="0.01"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("sellCommissionLabel")}</label>
          <input type="number" value={sellComm} onChange={(e) => setSellComm(e.target.value)} placeholder={t("commissionPlaceholder")} min="0" step="0.01"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={calculate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">{t("calculateButton")}</button>
        <button onClick={clear} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">{t("clearButton")}</button>
      </div>

      {result && (
        <div className="space-y-3">
          {([
            [t("totalCostLabel"), fmt(result.totalCost), "text-gray-300"],
            [t("totalRevenueLabel"), fmt(result.totalRevenue), "text-gray-300"],
            [t("profitPerShareLabel"), (result.profitLoss >= 0 ? "+" : "-") + fmt(result.profitPerShare), result.profitLoss >= 0 ? "text-green-400" : "text-red-400"],
          ] as [string, string, string][]).map(([label, value, color], i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-gray-400">{label}</span>
              <span className={`font-mono font-medium ${color}`}>{value}</span>
            </div>
          ))}
          <div className={`border rounded-xl p-5 text-center ${result.profitLoss >= 0 ? "bg-green-950/30 border-green-700" : "bg-red-950/30 border-red-700"}`}>
            <p className="text-sm text-gray-400 mb-1">{t("profitLossLabel")}</p>
            <p className={`text-3xl font-mono font-bold ${result.profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
              {result.profitLoss >= 0 ? "+" : "-"}{fmt(result.profitLoss)}
            </p>
            <p className={`text-sm mt-1 ${result.profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
              {t("roiLabel")}: {result.profitLoss >= 0 ? "+" : ""}{(result.roi * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
