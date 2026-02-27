"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Item { id: number; name: string; caffeine: number; qty: number; }

const PRESETS = [
  { name: "Espresso (1 shot)", caffeine: 63 },
  { name: "Drip coffee (240ml)", caffeine: 95 },
  { name: "Black tea (240ml)", caffeine: 47 },
  { name: "Green tea (240ml)", caffeine: 29 },
  { name: "Cola (355ml)", caffeine: 34 },
  { name: "Energy drink (250ml)", caffeine: 80 },
  { name: "Dark chocolate (30g)", caffeine: 20 },
  { name: "Matcha latte (240ml)", caffeine: 70 },
];

const DAILY_LIMIT = 400; // FDA recommended max for healthy adults

let nextId = 1;

export default function CaffeineCalculator() {
  const t = useTranslations("CaffeineCalculator");
  const [items, setItems] = useState<Item[]>([]);
  const [preset, setPreset] = useState(0);

  const addItem = () => {
    const p = PRESETS[preset];
    setItems(prev => [...prev, { id: nextId++, name: p.name, caffeine: p.caffeine, qty: 1 }]);
  };

  const remove = (id: number) => setItems(prev => prev.filter(i => i.id !== id));
  const update = (id: number, field: keyof Item, val: string | number) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: field === "name" ? val : Number(val) } : i));

  const total = items.reduce((s, i) => s + i.caffeine * i.qty, 0);
  const pct = Math.min(100, (total / DAILY_LIMIT) * 100);
  const barColor = pct < 50 ? "bg-green-500" : pct < 85 ? "bg-yellow-500" : "bg-red-500";
  const statusKey = pct < 75 ? t("statusSafe") : pct < 100 ? t("statusCaution") : t("statusOver");
  const statusColor = pct < 75 ? "text-green-400" : pct < 100 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <select value={preset} onChange={e => setPreset(Number(e.target.value))}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
          {PRESETS.map((p, i) => <option key={i} value={i}>{p.name} — {p.caffeine}mg</option>)}
        </select>
        <button onClick={addItem} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          {t("addItemButton")}
        </button>
        <button onClick={() => setItems([])} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {items.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-xs">
                <th className="px-3 py-2 text-left">{t("colItem")}</th>
                <th className="px-3 py-2 text-right">{t("colCaffeine")}</th>
                <th className="px-3 py-2 text-right">{t("colQty")}</th>
                <th className="px-3 py-2 text-right">{t("colTotal")}</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {items.map(item => (
                <tr key={item.id}>
                  <td className="px-3 py-2">
                    <input value={item.name} onChange={e => update(item.id, "name", e.target.value)}
                      className="w-full bg-transparent text-white focus:outline-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" value={item.caffeine} onChange={e => update(item.id, "caffeine", e.target.value)}
                      className="w-16 text-right bg-gray-700 rounded px-1 text-white focus:outline-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" value={item.qty} min="1" onChange={e => update(item.id, "qty", e.target.value)}
                      className="w-12 text-right bg-gray-700 rounded px-1 text-white focus:outline-none" />
                  </td>
                  <td className="px-3 py-2 text-right text-indigo-400 font-medium">{item.caffeine * item.qty}mg</td>
                  <td className="px-3 py-2 text-right">
                    <button onClick={() => remove(item.id)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-indigo-400">{total}mg</div>
              <div className="text-xs text-gray-400 mt-1">{t("totalLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className={`text-xl font-bold ${statusColor}`}>{statusKey}</div>
              <div className="text-xs text-gray-400 mt-1">{t("limitLabel")}: {t("limitValue")}</div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{t("percentLabel")}</span>
              <span className="text-gray-400">{pct.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className={`${barColor} h-3 rounded-full transition-all`} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <p className="text-xs text-gray-500">{t("disclaimer")}</p>
        </div>
      )}
    </div>
  );
}
