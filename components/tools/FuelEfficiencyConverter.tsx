"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Unit = "km/L" | "mpg-us" | "mpg-uk" | "L/100km";

const UNITS: { key: Unit; label: string }[] = [
  { key: "km/L", label: "km/L" },
  { key: "mpg-us", label: "MPG (US)" },
  { key: "mpg-uk", label: "MPG (UK / Imperial)" },
  { key: "L/100km", label: "L/100km" },
];

// Convert any value to km/L (base unit)
function toKmPerL(value: number, unit: Unit): number {
  switch (unit) {
    case "km/L":
      return value;
    case "mpg-us":
      return value * 0.425144;
    case "mpg-uk":
      return value * 0.354006;
    case "L/100km":
      return value === 0 ? Infinity : 100 / value;
  }
}

// Convert from km/L to target unit
function fromKmPerL(kmpl: number, unit: Unit): number {
  switch (unit) {
    case "km/L":
      return kmpl;
    case "mpg-us":
      return kmpl / 0.425144;
    case "mpg-uk":
      return kmpl / 0.354006;
    case "L/100km":
      return kmpl === 0 ? Infinity : 100 / kmpl;
  }
}

function fmt(n: number): string {
  if (!isFinite(n)) return "";
  const fixed = parseFloat(n.toPrecision(6));
  return String(fixed);
}

export default function FuelEfficiencyConverter() {
  const t = useTranslations("FuelEfficiencyConverter");
  const [values, setValues] = useState<Partial<Record<Unit, string>>>({});

  const handleChange = (changedUnit: Unit, raw: string) => {
    if (raw === "" || raw === "-") {
      setValues({ [changedUnit]: raw });
      return;
    }
    const num = parseFloat(raw);
    if (isNaN(num)) {
      setValues((prev) => ({ ...prev, [changedUnit]: raw }));
      return;
    }
    const base = toKmPerL(num, changedUnit);
    const newValues: Partial<Record<Unit, string>> = {};
    UNITS.forEach(({ key }) => {
      if (key === changedUnit) {
        newValues[key] = raw;
      } else {
        newValues[key] = fmt(fromKmPerL(base, key));
      }
    });
    setValues(newValues);
  };

  const clear = () => setValues({});

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={clear}
          className="text-sm px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>
      <p className="text-xs text-gray-500">{t("note")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {UNITS.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <label className="text-sm font-medium text-gray-400">{label}</label>
            <input
              type="number"
              value={values[key] ?? ""}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder="0"
              min="0"
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
