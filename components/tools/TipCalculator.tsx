"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const PRESET_TIPS = [10, 15, 18, 20, 25];

export default function TipCalculator() {
  const t = useTranslations("TipCalculator");

  const [billAmount, setBillAmount] = useState("");
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [customTip, setCustomTip] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [people, setPeople] = useState(1);

  const bill = parseFloat(billAmount) || 0;
  const effectiveTip = isCustom ? parseFloat(customTip) || 0 : tipPercent;
  const tipAmount = bill * (effectiveTip / 100);
  const total = bill + tipAmount;
  const perPerson = people > 0 ? total / people : 0;
  const tipPerPerson = people > 0 ? tipAmount / people : 0;

  const hasResult = bill > 0;

  const handlePreset = (pct: number) => {
    setTipPercent(pct);
    setIsCustom(false);
    setCustomTip("");
  };

  const handleCustom = () => {
    setIsCustom(true);
  };

  const fmt = (val: number) =>
    val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      {/* Bill amount */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-300">{t("billLabel")}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
      </div>

      {/* Tip percentage */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{t("tipLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_TIPS.map((pct) => (
            <button
              key={pct}
              onClick={() => handlePreset(pct)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isCustom && tipPercent === pct
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {pct}%
            </button>
          ))}
          <button
            onClick={handleCustom}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isCustom
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
            }`}
          >
            {t("customLabel")}
          </button>
        </div>
        {isCustom && (
          <div className="relative w-40 mt-2">
            <input
              type="number"
              min={0}
              max={100}
              step="0.5"
              value={customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              placeholder="0"
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              autoFocus
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
        )}
      </div>

      {/* Number of people */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-300">{t("peopleLabel")}</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPeople((p) => Math.max(1, p - 1))}
            className="w-9 h-9 flex items-center justify-center bg-gray-800 border border-gray-700 text-white rounded-lg hover:border-gray-500 transition-colors text-lg font-bold"
          >
            −
          </button>
          <span className="text-white text-lg font-semibold w-8 text-center">{people}</span>
          <button
            onClick={() => setPeople((p) => p + 1)}
            className="w-9 h-9 flex items-center justify-center bg-gray-800 border border-gray-700 text-white rounded-lg hover:border-gray-500 transition-colors text-lg font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Results */}
      <div
        className={`bg-gray-900 border rounded-xl p-5 space-y-4 transition-opacity ${
          hasResult ? "border-indigo-500/30 opacity-100" : "border-gray-700 opacity-60"
        }`}
      >
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          {t("resultsTitle")}
        </h3>

        {/* Main figures */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 rounded-lg px-4 py-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{t("tipAmount")}</div>
            <div className="text-2xl font-bold text-indigo-400">${fmt(tipAmount)}</div>
            <div className="text-xs text-gray-600 mt-1">{effectiveTip}%</div>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{t("totalAmount")}</div>
            <div className="text-2xl font-bold text-white">${fmt(total)}</div>
            <div className="text-xs text-gray-600 mt-1">{t("billPlusTip")}</div>
          </div>
        </div>

        {/* Per person */}
        {people > 1 && (
          <div className="border-t border-gray-700 pt-4 grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg px-4 py-3 text-center">
              <div className="text-xs text-gray-500 mb-1">{t("tipPerPerson")}</div>
              <div className="text-xl font-bold text-indigo-300">${fmt(tipPerPerson)}</div>
            </div>
            <div className="bg-gray-800 rounded-lg px-4 py-3 text-center">
              <div className="text-xs text-gray-500 mb-1">{t("totalPerPerson")}</div>
              <div className="text-xl font-bold text-white">${fmt(perPerson)}</div>
            </div>
          </div>
        )}

        {/* Bill breakdown */}
        <div className="border-t border-gray-700 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t("billSubtotal")}</span>
            <span className="text-gray-300">${fmt(bill)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t("tipRow")} ({effectiveTip}%)</span>
            <span className="text-gray-300">${fmt(tipAmount)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold pt-1 border-t border-gray-700">
            <span className="text-gray-300">{t("totalRow")}</span>
            <span className="text-white">${fmt(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
