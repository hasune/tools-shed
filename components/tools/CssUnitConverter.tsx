"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type CssUnit = "px" | "em" | "rem" | "vw" | "vh" | "pt" | "cm" | "mm" | "in";

const UNITS: CssUnit[] = ["px", "em", "rem", "vw", "vh", "pt", "cm", "mm", "in"];

function toPx(value: number, unit: CssUnit, baseFontSize: number, vpW: number, vpH: number): number {
  switch (unit) {
    case "px": return value;
    case "em":
    case "rem": return value * baseFontSize;
    case "vw": return (value / 100) * vpW;
    case "vh": return (value / 100) * vpH;
    case "pt": return value * 1.3333333;
    case "cm": return value * 37.7952756;
    case "mm": return value * 3.77952756;
    case "in": return value * 96;
  }
}

function fromPx(px: number, unit: CssUnit, baseFontSize: number, vpW: number, vpH: number): number {
  switch (unit) {
    case "px": return px;
    case "em":
    case "rem": return px / baseFontSize;
    case "vw": return (px / vpW) * 100;
    case "vh": return (px / vpH) * 100;
    case "pt": return px / 1.3333333;
    case "cm": return px / 37.7952756;
    case "mm": return px / 3.77952756;
    case "in": return px / 96;
  }
}

function fmt(n: number): string {
  if (!isFinite(n)) return "";
  return parseFloat(n.toPrecision(6)).toString();
}

export default function CssUnitConverter() {
  const t = useTranslations("CssUnitConverter");
  const [baseFontSize, setBaseFontSize] = useState("16");
  const [vpW, setVpW] = useState("1440");
  const [vpH, setVpH] = useState("900");
  const [values, setValues] = useState<Partial<Record<CssUnit, string>>>({});

  const bfs = parseFloat(baseFontSize) || 16;
  const vw = parseFloat(vpW) || 1440;
  const vh = parseFloat(vpH) || 900;

  const handleChange = (unit: CssUnit, raw: string) => {
    if (raw === "" || raw === "-") {
      setValues({ [unit]: raw });
      return;
    }
    const num = parseFloat(raw);
    if (isNaN(num)) {
      setValues((prev) => ({ ...prev, [unit]: raw }));
      return;
    }
    const px = toPx(num, unit, bfs, vw, vh);
    const newValues: Partial<Record<CssUnit, string>> = {};
    UNITS.forEach((u) => {
      newValues[u] = u === unit ? raw : fmt(fromPx(px, u, bfs, vw, vh));
    });
    setValues(newValues);
  };

  const recalc = () => {
    const firstFilled = UNITS.find((u) => values[u] && values[u] !== "");
    if (firstFilled && values[firstFilled]) {
      handleChange(firstFilled, values[firstFilled]!);
    }
  };

  const clear = () => setValues({});

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-400">{t("settingsTitle")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: t("baseFontSizeLabel"), value: baseFontSize, set: setBaseFontSize },
            { label: t("viewportWidthLabel"), value: vpW, set: setVpW },
            { label: t("viewportHeightLabel"), value: vpH, set: setVpH },
          ].map(({ label, value, set }) => (
            <div key={label} className="space-y-1">
              <label className="text-xs text-gray-400">{label}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => { set(e.target.value); recalc(); }}
                className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Clear */}
      <div className="flex justify-end">
        <button onClick={clear} className="text-sm px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {/* Conversions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {UNITS.map((unit) => (
          <div key={unit} className="space-y-1">
            <label className="text-sm font-medium text-gray-400">{unit}</label>
            <input
              type="number"
              value={values[unit] ?? ""}
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
