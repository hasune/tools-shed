"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Item {
  id: number;
  name: string;
  value: string;
}

let nextId = 1;

function makeItem(): Item {
  return { id: nextId++, name: "", value: "" };
}

export default function NetWorthCalculator() {
  const t = useTranslations("NetWorthCalculator");
  const [assets, setAssets] = useState<Item[]>([makeItem()]);
  const [liabilities, setLiabilities] = useState<Item[]>([makeItem()]);
  const [result, setResult] = useState<{ totalAssets: number; totalLiabilities: number; netWorth: number } | null>(null);

  const updateItem = (list: Item[], setList: (l: Item[]) => void, id: number, field: "name" | "value", val: string) => {
    setList(list.map((item) => item.id === id ? { ...item, [field]: val } : item));
    setResult(null);
  };

  const removeItem = (list: Item[], setList: (l: Item[]) => void, id: number) => {
    if (list.length === 1) return;
    setList(list.filter((item) => item.id !== id));
    setResult(null);
  };

  const calculate = () => {
    const totalAssets = assets.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
    setResult({ totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities });
  };

  const clear = () => {
    setAssets([makeItem()]);
    setLiabilities([makeItem()]);
    setResult(null);
  };

  const formatCurrency = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const ItemList = ({ items, setItems, title }: { items: Item[]; setItems: (l: Item[]) => void; title: string }) => (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-300">{title}</h3>
      {items.map((item) => (
        <div key={item.id} className="flex gap-2">
          <input
            type="text"
            value={item.name}
            onChange={(e) => updateItem(items, setItems, item.id, "name", e.target.value)}
            placeholder={t("namePlaceholder")}
            className="flex-1 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
          <input
            type="number"
            value={item.value}
            onChange={(e) => updateItem(items, setItems, item.id, "value", e.target.value)}
            placeholder={t("valuePlaceholder")}
            min="0"
            className="w-32 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
          {items.length > 1 && (
            <button
              onClick={() => removeItem(items, setItems, item.id)}
              className="px-2 py-2 text-gray-500 hover:text-red-400 transition-colors"
            >✕</button>
          )}
        </div>
      ))}
      <button
        onClick={() => { setItems([...items, makeItem()]); setResult(null); }}
        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
      >+ {title === t("assetsTitle") ? t("addAssetButton") : t("addLiabilityButton")}</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <ItemList items={assets} setItems={setAssets} title={t("assetsTitle")} />
      <ItemList items={liabilities} setItems={setLiabilities} title={t("liabilitiesTitle")} />

      <div className="flex gap-3">
        <button onClick={calculate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={clear} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{t("totalAssetsLabel")}</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(result.totalAssets)}</p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{t("totalLiabilitiesLabel")}</p>
              <p className="text-xl font-bold text-red-400">{formatCurrency(result.totalLiabilities)}</p>
            </div>
          </div>
          <div className={`border rounded-xl p-5 text-center ${result.netWorth >= 0 ? "bg-indigo-950/40 border-indigo-700" : "bg-red-950/40 border-red-700"}`}>
            <p className="text-sm text-gray-400 mb-1">{t("netWorthLabel")}</p>
            <p className={`text-3xl font-bold ${result.netWorth >= 0 ? "text-indigo-300" : "text-red-400"}`}>{formatCurrency(result.netWorth)}</p>
            <p className="text-xs text-gray-500 mt-2">{result.netWorth >= 0 ? t("positiveNote") : t("negativeNote")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
