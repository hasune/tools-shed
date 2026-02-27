"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface DrinkItem { id: number; name: string; volume: number; abv: number; qty: number; }

const PRESETS = [
  { name: "Beer (pint)", volume: 568, abv: 5 },
  { name: "Wine (glass)", volume: 175, abv: 13 },
  { name: "Spirits (shot)", volume: 25, abv: 40 },
  { name: "Cider (pint)", volume: 568, abv: 4.5 },
  { name: "Champagne (glass)", volume: 125, abv: 12 },
];

const WHO_LIMIT = 14; // units per week (same for men and women per latest WHO guidance)

// units = (volume_ml × abv%) / 1000
function calcUnits(volume: number, abv: number): number {
  return (volume * abv) / 1000;
}
// calories from alcohol ≈ units × 56 kcal (approximate)
function calcCalories(units: number): number {
  return Math.round(units * 56);
}

let nextId = 1;

export default function AlcoholUnitCalculator() {
  const t = useTranslations("AlcoholUnitCalculator");
  const [drinks, setDrinks] = useState<DrinkItem[]>([]);
  const [preset, setPreset] = useState(0);

  const addDrink = () => {
    const p = PRESETS[preset];
    setDrinks(prev => [...prev, { id: nextId++, name: p.name, volume: p.volume, abv: p.abv, qty: 1 }]);
  };

  const remove = (id: number) => setDrinks(prev => prev.filter(d => d.id !== id));

  const update = (id: number, field: keyof DrinkItem, val: string | number) =>
    setDrinks(prev => prev.map(d => d.id === id ? { ...d, [field]: field === "name" ? val : Number(val) } : d));

  const totalUnits = drinks.reduce((s, d) => s + calcUnits(d.volume, d.abv) * d.qty, 0);
  const totalCal = drinks.reduce((s, d) => s + calcCalories(calcUnits(d.volume, d.abv)) * d.qty, 0);
  const pctLimit = Math.min(100, (totalUnits / WHO_LIMIT) * 100);

  const barColor = pctLimit < 50 ? "bg-green-500" : pctLimit < 85 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <select value={preset} onChange={e => setPreset(Number(e.target.value))}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
          {PRESETS.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
        </select>
        <button onClick={addDrink} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          {t("addDrinkButton")}
        </button>
        <button onClick={() => setDrinks([])} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {drinks.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-xs">
                  <th className="px-3 py-2 text-left">{t("colDrink")}</th>
                  <th className="px-3 py-2 text-right">{t("colVolume")} (ml)</th>
                  <th className="px-3 py-2 text-right">{t("colAbv")} %</th>
                  <th className="px-3 py-2 text-right">{t("quantityLabel")}</th>
                  <th className="px-3 py-2 text-right">{t("colUnits")}</th>
                  <th className="px-3 py-2 text-right">{t("colCalories")}</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {drinks.map(d => {
                  const units = calcUnits(d.volume, d.abv) * d.qty;
                  const cal = calcCalories(calcUnits(d.volume, d.abv)) * d.qty;
                  return (
                    <tr key={d.id}>
                      <td className="px-3 py-2">
                        <input value={d.name} onChange={e => update(d.id, "name", e.target.value)}
                          className="w-full bg-transparent text-white focus:outline-none" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={d.volume} onChange={e => update(d.id, "volume", e.target.value)}
                          className="w-16 text-right bg-gray-700 rounded px-1 text-white focus:outline-none" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={d.abv} step="0.1" onChange={e => update(d.id, "abv", e.target.value)}
                          className="w-14 text-right bg-gray-700 rounded px-1 text-white focus:outline-none" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={d.qty} min="1" onChange={e => update(d.id, "qty", e.target.value)}
                          className="w-12 text-right bg-gray-700 rounded px-1 text-white focus:outline-none" />
                      </td>
                      <td className="px-3 py-2 text-right text-indigo-400">{units.toFixed(1)}</td>
                      <td className="px-3 py-2 text-right text-yellow-400">{cal}</td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => remove(d.id)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {drinks.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-indigo-400">{totalUnits.toFixed(1)}</div>
              <div className="text-xs text-gray-400 mt-1">{t("totalUnitsLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{totalCal}</div>
              <div className="text-xs text-gray-400 mt-1">{t("totalCaloriesLabel")} kcal</div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{t("whoLimitLabel")} ({WHO_LIMIT} units)</span>
              <span className="text-gray-400">{pctLimit.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className={`${barColor} h-3 rounded-full transition-all`} style={{ width: `${pctLimit}%` }} />
            </div>
          </div>
          <p className="text-xs text-gray-500">{t("disclaimer")}</p>
        </div>
      )}
    </div>
  );
}
