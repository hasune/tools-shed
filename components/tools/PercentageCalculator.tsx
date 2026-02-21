"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Mode = "percent-of" | "percent-change" | "what-percent" | "tip";

export default function PercentageCalculator() {
  const t = useTranslations("PercentageCalculator");

  const [mode, setMode] = useState<Mode>("percent-of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");

  const round2 = (n: number) => Math.round(n * 100) / 100;

  const results: Record<Mode, string> = {
    "percent-of": (() => {
      const pct = parseFloat(a), total = parseFloat(b);
      if (!isNaN(pct) && !isNaN(total)) return `${pct}% of ${total} = ${round2(pct / 100 * total)}`;
      return "";
    })(),
    "percent-change": (() => {
      const from = parseFloat(a), to = parseFloat(b);
      if (!isNaN(from) && !isNaN(to) && from !== 0) {
        const change = ((to - from) / Math.abs(from)) * 100;
        const dir = change >= 0 ? "increase" : "decrease";
        return `${round2(Math.abs(change))}% ${dir} (from ${from} to ${to})`;
      }
      return "";
    })(),
    "what-percent": (() => {
      const part = parseFloat(a), total = parseFloat(b);
      if (!isNaN(part) && !isNaN(total) && total !== 0) return `${part} is ${round2(part / total * 100)}% of ${total}`;
      return "";
    })(),
    "tip": (() => {
      const bill = parseFloat(a), tipPct = parseFloat(b || "15"), people = parseFloat(c || "1");
      if (!isNaN(bill)) {
        const tip = bill * tipPct / 100;
        const total = bill + tip;
        const perPerson = total / (people || 1);
        return `Tip: $${round2(tip)} | Total: $${round2(total)}${people > 1 ? ` | Per person: $${round2(perPerson)}` : ""}`;
      }
      return "";
    })(),
  };

  const modes: { id: Mode; labelKey: "percentOf" | "percentChange" | "whatPercent" | "tipCalculator" }[] = [
    { id: "percent-of", labelKey: "percentOf" },
    { id: "percent-change", labelKey: "percentChange" },
    { id: "what-percent", labelKey: "whatPercent" },
    { id: "tip", labelKey: "tipCalculator" },
  ];

  return (
    <div className="space-y-5">
      {/* Mode Tabs */}
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setA(""); setB(""); setC(""); }}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              mode === m.id ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {t(m.labelKey)}
          </button>
        ))}
      </div>

      {/* Inputs based on mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mode === "percent-of" && (
          <>
            <div className="space-y-1">
              <label className="text-sm text-gray-300">{t("percentageLabel")}</label>
              <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. 15"
                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-300">{t("numberLabel")}</label>
              <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g. 200"
                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
            </div>
          </>
        )}
        {mode === "percent-change" && (
          <>
            <div className="space-y-1">
              <label className="text-sm text-gray-300">{t("originalValueLabel")}</label>
              <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. 100"
                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-300">{t("newValueLabel")}</label>
              <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g. 120"
                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
            </div>
          </>
        )}
        {mode === "what-percent" && (
          <>
            <div className="space-y-1">
              <label className="text-sm text-gray-300">{t("partLabel")}</label>
              <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. 30"
                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-300">{t("wholeLabel")}</label>
              <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g. 200"
                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
            </div>
          </>
        )}
        {mode === "tip" && (
          <>
            <div className="space-y-1">
              <label className="text-sm text-gray-300">{t("billAmountLabel")}</label>
              <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. 50"
                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-300">{t("tipPercentLabel")}</label>
              <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="15"
                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm text-gray-300">{t("numberOfPeopleLabel")}</label>
              <input type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="1"
                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
            </div>
          </>
        )}
      </div>

      {/* Result */}
      {results[mode] && (
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-5 text-center">
          <p className="text-indigo-300 text-lg font-semibold">{results[mode]}</p>
        </div>
      )}
    </div>
  );
}
