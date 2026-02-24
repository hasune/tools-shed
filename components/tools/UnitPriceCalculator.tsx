"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Item {
  id: number;
  name: string;
  price: string;
  quantity: string;
  unit: string;
}

let nextId = 1;

function makeItem(): Item {
  return { id: nextId++, name: "", price: "", quantity: "", unit: "g" };
}

const UNITS = ["g", "kg", "oz", "lb", "ml", "L", "fl oz", "pc", "pack", "sheet"];

export default function UnitPriceCalculator() {
  const t = useTranslations("UnitPriceCalculator");
  const [items, setItems] = useState<Item[]>([makeItem(), makeItem()]);
  const [results, setResults] = useState<Array<{ id: number; unitPrice: number; unit: string; best: boolean } | null> | null>(null);

  const updateItem = (id: number, field: keyof Item, val: string) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: val } : item));
    setResults(null);
  };

  const removeItem = (id: number) => {
    if (items.length <= 2) return;
    setItems(items.filter((item) => item.id !== id));
    setResults(null);
  };

  const calculate = () => {
    const calculated = items.map((item) => {
      const price = parseFloat(item.price);
      const qty = parseFloat(item.quantity);
      if (isNaN(price) || isNaN(qty) || qty <= 0) return null;
      return { id: item.id, unitPrice: price / qty, unit: item.unit, best: false };
    });

    const valid = calculated.filter(Boolean) as Array<{ id: number; unitPrice: number; unit: string; best: boolean }>;
    if (valid.length === 0) return;

    const minPrice = Math.min(...valid.map((v) => v.unitPrice));
    const withBest = calculated.map((r) => r ? { ...r, best: Math.abs(r.unitPrice - minPrice) < 1e-10 } : null);
    setResults(withBest);
  };

  const clear = () => {
    setItems([makeItem(), makeItem()]);
    setResults(null);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {items.map((item, idx) => {
          const res = results ? results.find((r) => r?.id === item.id) : null;
          return (
            <div key={item.id} className={`bg-gray-900 border rounded-xl p-4 space-y-3 ${res?.best ? "border-green-600" : "border-gray-700"}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">Item {idx + 1}</span>
                {items.length > 2 && (
                  <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-400 text-sm transition-colors">{t("removeButton")}</button>
                )}
              </div>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                placeholder={t("namePlaceholder")}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              />
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">{t("priceLabel")}</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, "price", e.target.value)}
                    placeholder={t("pricePlaceholder")}
                    min="0" step="0.01"
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">{t("quantityLabel")}</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                    placeholder={t("quantityPlaceholder")}
                    min="0" step="any"
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">{t("unitLabel")}</label>
                  <select
                    value={item.unit}
                    onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  >
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              {res && (
                <div className={`flex items-center justify-between rounded-lg px-3 py-2 ${res.best ? "bg-green-900/40" : "bg-gray-800"}`}>
                  <span className="text-sm text-gray-400">{t("unitPriceLabel")}</span>
                  <span className={`font-mono font-medium text-sm ${res.best ? "text-green-400" : "text-white"}`}>
                    ${res.unitPrice.toFixed(4)} / {res.unit}
                    {res.best && <span className="ml-2 text-xs text-green-400">✓ {t("bestDealLabel")}</span>}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => { setItems([...items, makeItem()]); setResults(null); }}
        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
      >+ {t("addItemButton")}</button>

      <div className="flex gap-3">
        <button onClick={calculate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={clear} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>
    </div>
  );
}
