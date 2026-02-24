"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Mode = "add" | "remove";

const PRESETS = [5, 7, 10, 12, 15, 19, 20, 21, 23, 25];

export default function VatCalculator() {
  const t = useTranslations("VatCalculator");
  const [price, setPrice] = useState("");
  const [vatRate, setVatRate] = useState("20");
  const [mode, setMode] = useState<Mode>("add");
  const [result, setResult] = useState<{ net: number; tax: number; gross: number } | null>(null);

  const calculate = () => {
    const p = parseFloat(price);
    const r = parseFloat(vatRate);
    if (isNaN(p) || isNaN(r) || p < 0 || r < 0) return;
    if (mode === "add") {
      const tax = p * (r / 100);
      setResult({ net: p, tax, gross: p + tax });
    } else {
      const net = p / (1 + r / 100);
      const tax = p - net;
      setResult({ net, tax, gross: p });
    }
  };

  const clear = () => {
    setPrice("");
    setResult(null);
  };

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      {/* Mode */}
      <div className="flex gap-2">
        {(["add", "remove"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {t(m === "add" ? "modeAdd" : "modeRemove")}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("priceLabel")}</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            min="0"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("vatRateLabel")}</label>
          <input
            type="number"
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
            placeholder="20"
            min="0"
            step="0.1"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
      </div>

      {/* Preset rates */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500">{t("presetLabel")}:</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((r) => (
            <button
              key={r}
              onClick={() => setVatRate(String(r))}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                vatRate === String(r)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {r}%
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={calculate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={clear} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: t("netPrice"), value: fmt(result.net) },
            { label: t("taxAmount"), value: fmt(result.tax) },
            { label: t("grossPrice"), value: fmt(result.gross) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-xl font-mono text-white">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
