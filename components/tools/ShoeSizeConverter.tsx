"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Shoe size data: [US Men, US Women, EU, UK, JP(cm)]
const SIZES: [number, number, number, number, number][] = [
  [3, 5, 35, 2.5, 21.5],
  [3.5, 5.5, 35.5, 3, 22],
  [4, 6, 36, 3.5, 22.5],
  [4.5, 6.5, 37, 4, 23],
  [5, 7, 37.5, 4.5, 23.5],
  [5.5, 7.5, 38, 5, 24],
  [6, 8, 38.5, 5.5, 24],
  [6.5, 8.5, 39, 6, 24.5],
  [7, 9, 40, 6.5, 25],
  [7.5, 9.5, 40.5, 7, 25.5],
  [8, 10, 41, 7.5, 26],
  [8.5, 10.5, 42, 8, 26.5],
  [9, 11, 42.5, 8.5, 27],
  [9.5, 11.5, 43, 9, 27.5],
  [10, 12, 44, 9.5, 28],
  [10.5, 12.5, 44.5, 10, 28.5],
  [11, 13, 45, 10.5, 29],
  [11.5, 13.5, 45.5, 11, 29.5],
  [12, 14, 46, 11.5, 30],
  [13, 15, 47, 12.5, 31],
];

type SizeKey = "usMen" | "usWomen" | "eu" | "uk" | "jp";
const KEYS: SizeKey[] = ["usMen", "usWomen", "eu", "uk", "jp"];
const IDX: Record<SizeKey, number> = { usMen: 0, usWomen: 1, eu: 2, uk: 3, jp: 4 };

export default function ShoeSizeConverter() {
  const t = useTranslations("ShoeSizeConverter");
  const [selected, setSelected] = useState<[number, number, number, number, number] | null>(null);
  const [inputKey, setInputKey] = useState<SizeKey>("eu");
  const [inputVal, setInputVal] = useState("");

  const lookup = () => {
    const val = parseFloat(inputVal);
    if (isNaN(val)) { setSelected(null); return; }
    const col = IDX[inputKey];
    const row = SIZES.find((r) => r[col] === val);
    setSelected(row ?? null);
  };

  const labelKey: Record<SizeKey, string> = {
    usMen: t("usMenLabel"),
    usWomen: t("usWomenLabel"),
    eu: t("euLabel"),
    uk: t("ukLabel"),
    jp: t("jpLabel"),
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("genderLabel")}</label>
          <select
            value={inputKey}
            onChange={(e) => { setInputKey(e.target.value as SizeKey); setSelected(null); setInputVal(""); }}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          >
            {KEYS.map((k) => <option key={k} value={k}>{labelKey[k]}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{labelKey[inputKey]}</label>
          <input
            type="number" step="0.5" value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-end gap-2">
          <button onClick={lookup} className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">{t("convertButton")}</button>
          <button onClick={() => { setSelected(null); setInputVal(""); }} className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">{t("clearButton")}</button>
        </div>
      </div>

      {selected && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {KEYS.map((k) => (
            <div key={k} className={`bg-gray-900 border rounded-lg p-3 text-center ${k === inputKey ? "border-indigo-500" : "border-gray-700"}`}>
              <p className="text-xs text-gray-500 mb-1">{labelKey[k]}</p>
              <p className="text-xl font-bold text-white">{selected[IDX[k]]}</p>
            </div>
          ))}
        </div>
      )}

      {selected === null && inputVal && (
        <p className="text-red-400 text-sm">{t("notFoundMessage")}</p>
      )}

      <div className="space-y-2">
        <p className="text-xs text-yellow-400 bg-yellow-950/40 border border-yellow-700 rounded-lg px-3 py-2">{t("note")}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800">
              {KEYS.map((k) => <th key={k} className="text-center py-2 px-3 font-medium">{labelKey[k]}</th>)}
            </tr>
          </thead>
          <tbody>
            {SIZES.map((row, i) => (
              <tr key={i} onClick={() => setSelected(row)} className={`border-b border-gray-800/50 cursor-pointer hover:bg-gray-800/50 ${selected === row ? "bg-indigo-950/40" : ""}`}>
                {row.map((v, j) => <td key={j} className="text-center py-1.5 px-3 text-gray-300 font-mono">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
