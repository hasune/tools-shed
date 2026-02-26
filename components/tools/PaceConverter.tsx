"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

type PaceUnit = "minPerKm" | "minPerMile" | "kmPerHour" | "milesPerHour";

// Convert any pace/speed to km/h as common base
function toKmh(value: number, unit: PaceUnit): number {
  if (unit === "kmPerHour") return value;
  if (unit === "milesPerHour") return value * 1.60934;
  if (unit === "minPerKm") return 60 / value; // value in minutes
  if (unit === "minPerMile") return 96.5604 / value; // 60 / (value / 1.60934)
  return 0;
}

function fromKmh(kmh: number, unit: PaceUnit): number {
  if (unit === "kmPerHour") return kmh;
  if (unit === "milesPerHour") return kmh / 1.60934;
  if (unit === "minPerKm") return 60 / kmh;
  if (unit === "minPerMile") return 96.5604 / kmh;
  return 0;
}

function formatPace(value: number, unit: PaceUnit): string {
  if (unit === "kmPerHour" || unit === "milesPerHour") {
    return value.toFixed(2);
  }
  // min/km or min/mile — format as MM:SS
  const totalSec = value * 60;
  const mins = Math.floor(totalSec / 60);
  const secs = Math.round(totalSec % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function PaceConverter() {
  const t = useTranslations("PaceConverter");
  const [inputValue, setInputValue] = useState("");
  const [inputUnit, setInputUnit] = useState<PaceUnit>("minPerKm");
  const [results, setResults] = useState<Record<PaceUnit, string> | null>(null);
  const [error, setError] = useState("");

  const units: PaceUnit[] = ["minPerKm", "minPerMile", "kmPerHour", "milesPerHour"];

  const unitLabels: Record<PaceUnit, string> = {
    minPerKm: t("minPerKm"),
    minPerMile: t("minPerMile"),
    kmPerHour: t("kmPerHour"),
    milesPerHour: t("milesPerHour"),
  };

  const parseInput = (raw: string, unit: PaceUnit): number | null => {
    if (unit === "minPerKm" || unit === "minPerMile") {
      // Accept "5:30" or "5.5" formats
      const colonMatch = raw.match(/^(\d+):(\d{1,2})$/);
      if (colonMatch) {
        return parseInt(colonMatch[1]) + parseInt(colonMatch[2]) / 60;
      }
      const num = parseFloat(raw);
      return isNaN(num) ? null : num;
    }
    const num = parseFloat(raw);
    return isNaN(num) ? null : num;
  };

  const handleConvert = () => {
    setError("");
    const parsed = parseInput(inputValue, inputUnit);
    if (parsed === null || parsed <= 0) {
      setError(t("invalidInput"));
      setResults(null);
      return;
    }
    const kmh = toKmh(parsed, inputUnit);
    if (kmh <= 0 || !isFinite(kmh)) {
      setError(t("invalidInput"));
      setResults(null);
      return;
    }
    const res: Record<PaceUnit, string> = {} as Record<PaceUnit, string>;
    for (const unit of units) {
      const val = fromKmh(kmh, unit);
      res[unit] = formatPace(val, unit);
    }
    setResults(res);
  };

  const handleClear = () => {
    setInputValue("");
    setResults(null);
    setError("");
  };

  const getPlaceholder = (unit: PaceUnit) => {
    if (unit === "minPerKm") return "5:30";
    if (unit === "minPerMile") return "8:51";
    if (unit === "kmPerHour") return "10.9";
    return "6.8";
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("inputLabel")}</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConvert()}
            placeholder={getPlaceholder(inputUnit)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("inputUnitLabel")}</label>
          <select
            value={inputUnit}
            onChange={(e) => { setInputUnit(e.target.value as PaceUnit); setResults(null); }}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
          >
            {units.map((u) => (
              <option key={u} value={u}>{unitLabels[u]}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {t("convertButton")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {results && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">{t("resultsTitle")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {units.map((unit) => (
              <div
                key={unit}
                className={`rounded-lg border px-4 py-3 ${
                  unit === inputUnit
                    ? "border-indigo-500/50 bg-indigo-500/10"
                    : "border-gray-700 bg-gray-800/50"
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">{unitLabels[unit]}</div>
                <div className="text-2xl font-mono font-semibold text-gray-100">
                  {results[unit]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
