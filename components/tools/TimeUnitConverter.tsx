"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type TimeUnit = "nanosecond" | "microsecond" | "millisecond" | "second" | "minute" | "hour" | "day" | "week" | "month" | "year";

// All values relative to 1 second
const TO_SECONDS: Record<TimeUnit, number> = {
  nanosecond: 1e-9,
  microsecond: 1e-6,
  millisecond: 1e-3,
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2592000,   // 30 days
  year: 31536000,   // 365 days
};

const UNITS: TimeUnit[] = ["nanosecond", "microsecond", "millisecond", "second", "minute", "hour", "day", "week", "month", "year"];

export default function TimeUnitConverter() {
  const t = useTranslations("TimeUnitConverter");
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState<TimeUnit>("hour");
  const [to, setTo] = useState<TimeUnit>("minute");
  const [result, setResult] = useState<string | null>(null);

  const unitLabel = (u: TimeUnit) => t(u as any);

  const convert = () => {
    const val = parseFloat(amount);
    if (isNaN(val)) return;
    const seconds = val * TO_SECONDS[from];
    const out = seconds / TO_SECONDS[to];
    // Format nicely
    if (Math.abs(out) >= 1e12 || (Math.abs(out) < 1e-6 && out !== 0)) {
      setResult(out.toExponential(6));
    } else {
      setResult(parseFloat(out.toPrecision(10)).toLocaleString("en-US", { maximumSignificantDigits: 10 }));
    }
  };

  const clear = () => { setAmount("1"); setFrom("hour"); setTo("minute"); setResult(null); };

  const UnitSelect = ({ value, onChange }: { value: TimeUnit; onChange: (u: TimeUnit) => void }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TimeUnit)}
      className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
    >
      {UNITS.map((u) => <option key={u} value={u}>{unitLabel(u)}</option>)}
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
        <button onClick={convert} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          {t("convertButton")}
        </button>
        <button onClick={clear} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="bg-indigo-950/40 border border-indigo-700 rounded-xl p-5 text-center">
          <p className="text-sm text-indigo-400 mb-1">{t("resultLabel")}</p>
          <p className="text-2xl font-mono text-white">{amount} {unitLabel(from)} = <span className="text-indigo-300">{result} {unitLabel(to)}</span></p>
        </div>
      )}
    </div>
  );
}
