"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type TorqueUnit =
  | "newtonMeter"
  | "newtonCentimeter"
  | "kilonewtonMeter"
  | "footPound"
  | "inchPound"
  | "inchOunce"
  | "kgfMeter"
  | "kgfCentimeter"
  | "dyneCentimeter";

const TO_NM: Record<TorqueUnit, number> = {
  newtonMeter: 1,
  newtonCentimeter: 0.01,
  kilonewtonMeter: 1000,
  footPound: 1.3558179,
  inchPound: 0.1129848,
  inchOunce: 0.0070616,
  kgfMeter: 9.80665,
  kgfCentimeter: 0.0980665,
  dyneCentimeter: 1e-7,
};

const UNITS: TorqueUnit[] = [
  "newtonMeter", "newtonCentimeter", "kilonewtonMeter",
  "footPound", "inchPound", "inchOunce",
  "kgfMeter", "kgfCentimeter", "dyneCentimeter",
];

export default function TorqueConverter() {
  const t = useTranslations("TorqueConverter");
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState<TorqueUnit>("newtonMeter");
  const [to, setTo] = useState<TorqueUnit>("footPound");
  const [result, setResult] = useState<string | null>(null);

  const convert = () => {
    const val = parseFloat(amount);
    if (isNaN(val)) return;
    const nm = val * TO_NM[from];
    const out = nm / TO_NM[to];
    if (Math.abs(out) >= 1e12 || (Math.abs(out) < 1e-6 && out !== 0)) {
      setResult(out.toExponential(6));
    } else {
      setResult(
        parseFloat(out.toPrecision(10)).toLocaleString("en-US", { maximumSignificantDigits: 10 })
      );
    }
  };

  const clear = () => { setAmount("1"); setFrom("newtonMeter"); setTo("footPound"); setResult(null); };

  const UnitSelect = ({ value, onChange }: { value: TorqueUnit; onChange: (u: TorqueUnit) => void }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TorqueUnit)}
      className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
    >
      {UNITS.map((u) => <option key={u} value={u}>{t(u as any)}</option>)}
    </select>
  );

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("amountLabel")}</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={t("amountPlaceholder")}
          step="any"
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("fromLabel")}</label>
          <UnitSelect value={from} onChange={(u) => { setFrom(u); setResult(null); }} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("toLabel")}</label>
          <UnitSelect value={to} onChange={(u) => { setTo(u); setResult(null); }} />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={convert} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">{t("convertButton")}</button>
        <button onClick={clear} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">{t("clearButton")}</button>
      </div>
      {result && (
        <div className="bg-indigo-950/40 border border-indigo-700 rounded-xl p-5 text-center">
          <p className="text-sm text-indigo-400 mb-1">{t("resultLabel")}</p>
          <p className="text-2xl font-mono text-white">
            {amount} {t(from as any)} = <span className="text-indigo-300">{result} {t(to as any)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
