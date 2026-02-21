"use client";

import { useState } from "react";

interface Unit {
  label: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

const UNIT_SETS: Record<string, Unit[]> = {
  length: [
    { label: "Kilometer (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Meter (m)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Centimeter (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { label: "Millimeter (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Mile (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { label: "Yard (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { label: "Foot (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { label: "Inch (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { label: "Nautical Mile (nmi)", toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
  ],
  weight: [
    { label: "Metric Ton (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Kilogram (kg)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Gram (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Milligram (mg)", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { label: "Pound (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { label: "Ounce (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { label: "Stone (st)", toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
    { label: "US Ton (short ton)", toBase: (v) => v * 907.185, fromBase: (v) => v / 907.185 },
  ],
};

interface UnitConverterProps {
  type: "length" | "weight";
  precision?: number;
}

export default function UnitConverter({ type, precision = 6 }: UnitConverterProps) {
  const units = UNIT_SETS[type];
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (changedUnit: Unit, rawValue: string) => {
    const num = parseFloat(rawValue);
    if (rawValue === "" || rawValue === "-") {
      setValues({ [changedUnit.label]: rawValue });
      return;
    }
    if (isNaN(num)) {
      setValues((prev) => ({ ...prev, [changedUnit.label]: rawValue }));
      return;
    }
    const base = changedUnit.toBase(num);
    const newValues: Record<string, string> = {};
    units.forEach((u) => {
      if (u.label === changedUnit.label) {
        newValues[u.label] = rawValue;
      } else {
        const converted = u.fromBase(base);
        const fixed = parseFloat(converted.toPrecision(precision));
        newValues[u.label] = isFinite(fixed) ? String(fixed) : "";
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
          Clear
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {units.map((unit) => (
          <div key={unit.label} className="space-y-1">
            <label className="text-sm font-medium text-gray-400">{unit.label}</label>
            <input
              type="number"
              value={values[unit.label] ?? ""}
              onChange={(e) => handleChange(unit, e.target.value)}
              placeholder="0"
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
