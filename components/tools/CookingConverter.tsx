"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type VolumeUnit = "cup" | "tbsp" | "tsp" | "ml" | "liter" | "floz";
type WeightUnit = "gram" | "kg" | "oz" | "lb";
type AnyUnit = VolumeUnit | WeightUnit;

// Convert all volume to ml
const TO_ML: Record<VolumeUnit, number> = {
  cup: 236.588,
  tbsp: 14.7868,
  tsp: 4.92892,
  ml: 1,
  liter: 1000,
  floz: 29.5735,
};

// Convert all weight to grams
const TO_GRAM: Record<WeightUnit, number> = {
  gram: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
};

const VOLUME_UNITS: VolumeUnit[] = ["cup", "tbsp", "tsp", "ml", "liter", "floz"];
const WEIGHT_UNITS: WeightUnit[] = ["gram", "kg", "oz", "lb"];

function isVolume(u: AnyUnit): u is VolumeUnit {
  return VOLUME_UNITS.includes(u as VolumeUnit);
}
function isWeight(u: AnyUnit): u is WeightUnit {
  return WEIGHT_UNITS.includes(u as WeightUnit);
}

export default function CookingConverter() {
  const t = useTranslations("CookingConverter");
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState<AnyUnit>("cup");
  const [to, setTo] = useState<AnyUnit>("ml");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const allUnits: AnyUnit[] = [...VOLUME_UNITS, ...WEIGHT_UNITS];

  const unitLabel = (u: AnyUnit) => t(u as any);

  const convert = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) { setError("Invalid amount."); setResult(null); return; }

    if (isVolume(from) && isVolume(to)) {
      const ml = val * TO_ML[from];
      const out = ml / TO_ML[to];
      setResult(`${parseFloat(out.toFixed(4))} ${unitLabel(to)}`);
      setError("");
    } else if (isWeight(from) && isWeight(to)) {
      const g = val * TO_GRAM[from];
      const out = g / TO_GRAM[to];
      setResult(`${parseFloat(out.toFixed(4))} ${unitLabel(to)}`);
      setError("");
    } else {
      setResult(null);
      setError(t("incompatible"));
    }
  };

  const clear = () => { setAmount("1"); setFrom("cup"); setTo("ml"); setResult(null); setError(""); };

  const UnitSelect = ({ value, onChange }: { value: AnyUnit; onChange: (u: AnyUnit) => void }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as AnyUnit)}
      className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
    >
      <optgroup label="Volume">
        {VOLUME_UNITS.map((u) => <option key={u} value={u}>{unitLabel(u)}</option>)}
      </optgroup>
      <optgroup label="Weight">
        {WEIGHT_UNITS.map((u) => <option key={u} value={u}>{unitLabel(u)}</option>)}
      </optgroup>
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
          min="0" step="any"
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

      {error && <p className="text-yellow-400 text-sm">{error}</p>}

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
          <p className="text-2xl font-mono text-white">{amount} {unitLabel(from)} = <span className="text-indigo-300">{result}</span></p>
        </div>
      )}
    </div>
  );
}
