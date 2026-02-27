"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

// Ring size data: [US, EU (ISO), UK letter, JP, diameter mm, circumference mm]
const RING_DATA: [string, number, string, number, number, number][] = [
  ["3",    44, "F½",  4,  13.97, 43.9],
  ["3.5",  45, "G½",  5,  14.36, 45.1],
  ["4",    46, "H",   6,  14.76, 46.3],
  ["4.5",  47, "I",   7,  15.09, 47.4],
  ["5",    49, "J½",  8,  15.70, 49.3],
  ["5.5",  50, "K½",  9,  16.10, 50.5],
  ["6",    51, "L",  10,  16.51, 51.9],
  ["6.5",  52, "L½", 11,  16.92, 53.1],
  ["7",    54, "M½", 12,  17.35, 54.5],
  ["7.5",  55, "N",  13,  17.75, 55.7],
  ["8",    56, "O",  14,  18.19, 57.2],
  ["8.5",  57, "O½", 15,  18.53, 58.2],
  ["9",    59, "P½", 16,  19.05, 59.8],
  ["9.5",  60, "Q",  17,  19.41, 61.0],
  ["10",   61, "R",  18,  19.84, 62.3],
  ["10.5", 62, "R½", 19,  20.20, 63.5],
  ["11",   63, "S½", 20,  20.68, 64.9],
  ["11.5", 65, "T",  21,  21.08, 66.2],
  ["12",   66, "U",  22,  21.49, 67.5],
  ["12.5", 67, "V",  23,  21.89, 68.7],
  ["13",   68, "W",  24,  22.33, 70.1],
];

type Mode = "us" | "eu" | "uk" | "jp" | "mm";

export default function RingSizeConverter() {
  const t = useTranslations("RingSizeConverter");
  const [mode, setMode] = useState<Mode>("us");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<typeof RING_DATA[number] | null>(null);
  const [notFound, setNotFound] = useState(false);

  const findRow = (v: string): typeof RING_DATA[number] | undefined => {
    if (mode === "us") return RING_DATA.find(r => r[0] === v);
    if (mode === "eu") return RING_DATA.find(r => r[1] === Number(v));
    if (mode === "uk") return RING_DATA.find(r => r[2].toLowerCase() === v.toLowerCase());
    if (mode === "jp") return RING_DATA.find(r => r[3] === Number(v));
    if (mode === "mm") {
      const n = parseFloat(v);
      return RING_DATA.reduce((prev, cur) =>
        Math.abs(cur[4] - n) < Math.abs(prev[4] - n) ? cur : prev
      );
    }
  };

  const convert = () => {
    const row = findRow(value.trim());
    if (!row) { setNotFound(true); setResult(null); return; }
    setNotFound(false);
    setResult(row);
  };

  const modeOptions: { key: Mode; label: string }[] = [
    { key: "us", label: t("inputUs") },
    { key: "eu", label: t("inputEu") },
    { key: "uk", label: t("inputUk") },
    { key: "jp", label: t("inputJp") },
    { key: "mm", label: t("inputDiameter") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t("inputModeLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {modeOptions.map(({ key, label }) => (
            <button key={key} onClick={() => { setMode(key); setValue(""); setResult(null); setNotFound(false); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === key ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {modeOptions.find(m => m.key === mode)?.label}
          </label>
          {mode === "uk" ? (
            <input type="text" value={value} onChange={e => setValue(e.target.value)} placeholder="e.g. L½"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
          ) : mode === "us" ? (
            <select value={value} onChange={e => setValue(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
              <option value="">—</option>
              {RING_DATA.map(r => <option key={r[0]} value={r[0]}>{r[0]}</option>)}
            </select>
          ) : (
            <input type="number" value={value} onChange={e => setValue(e.target.value)} step={mode === "mm" ? "0.1" : "1"}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
          )}
        </div>
        <div className="flex items-end gap-2">
          <button onClick={convert} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2 rounded-lg transition-colors">
            {t("convertButton")}
          </button>
          <button onClick={() => { setValue(""); setResult(null); setNotFound(false); }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
            {t("clearButton")}
          </button>
        </div>
      </div>

      {notFound && <p className="text-red-400 text-sm">Size not found. Please check your input.</p>}

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: t("usLabel"), value: result[0] },
            { label: t("euLabel"), value: String(result[1]) },
            { label: t("ukLabel"), value: result[2] },
            { label: t("jpLabel"), value: String(result[3]) },
            { label: t("diameterLabel"), value: `${result[4]} mm` },
          ].map(({ label, value: val }) => (
            <div key={label} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-indigo-400">{val}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <details className="bg-gray-800 border border-gray-700 rounded-lg">
        <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-300 hover:text-white">
          {t("chartTitle")}
        </summary>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="px-3 py-2 text-left">{t("usLabel")}</th>
                <th className="px-3 py-2 text-left">{t("euLabel")}</th>
                <th className="px-3 py-2 text-left">{t("ukLabel")}</th>
                <th className="px-3 py-2 text-left">{t("jpLabel")}</th>
                <th className="px-3 py-2 text-left">{t("colDiameter")}</th>
                <th className="px-3 py-2 text-left">{t("colCircumference")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {RING_DATA.map(r => (
                <tr key={r[0]} className={`hover:bg-gray-700/50 ${result && result[0] === r[0] ? "bg-indigo-900/30" : ""}`}>
                  <td className="px-3 py-1.5 text-white font-medium">{r[0]}</td>
                  <td className="px-3 py-1.5 text-gray-300">{r[1]}</td>
                  <td className="px-3 py-1.5 text-gray-300">{r[2]}</td>
                  <td className="px-3 py-1.5 text-gray-300">{r[3]}</td>
                  <td className="px-3 py-1.5 text-gray-300">{r[4]}</td>
                  <td className="px-3 py-1.5 text-gray-300">{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
