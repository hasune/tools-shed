"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Unit =
  | "bitsPerSec"
  | "kilobitsPerSec"
  | "megabitsPerSec"
  | "gigabitsPerSec"
  | "terabitsPerSec"
  | "bytesPerSec"
  | "kilobytesPerSec"
  | "megabytesPerSec"
  | "gigabytesPerSec";

// All values relative to bits/second
const TO_BITS: Record<Unit, number> = {
  bitsPerSec: 1,
  kilobitsPerSec: 1_000,
  megabitsPerSec: 1_000_000,
  gigabitsPerSec: 1_000_000_000,
  terabitsPerSec: 1_000_000_000_000,
  bytesPerSec: 8,
  kilobytesPerSec: 8_000,
  megabytesPerSec: 8_000_000,
  gigabytesPerSec: 8_000_000_000,
};

const UNITS: Unit[] = [
  "bitsPerSec",
  "kilobitsPerSec",
  "megabitsPerSec",
  "gigabitsPerSec",
  "terabitsPerSec",
  "bytesPerSec",
  "kilobytesPerSec",
  "megabytesPerSec",
  "gigabytesPerSec",
];

const UNIT_LABELS: Record<Unit, string> = {
  bitsPerSec: "bit/s",
  kilobitsPerSec: "Kbps",
  megabitsPerSec: "Mbps",
  gigabitsPerSec: "Gbps",
  terabitsPerSec: "Tbps",
  bytesPerSec: "B/s",
  kilobytesPerSec: "KB/s",
  megabytesPerSec: "MB/s",
  gigabytesPerSec: "GB/s",
};

function formatResult(val: number): string {
  if (val === 0) return "0";
  if (val >= 1e12) return (val / 1e12).toPrecision(6).replace(/\.?0+$/, "") + " T";
  if (val >= 1e9) return (val / 1e9).toPrecision(6).replace(/\.?0+$/, "");
  if (val >= 1e6) return (val / 1e6).toPrecision(6).replace(/\.?0+$/, "");
  if (val >= 1e3) return (val / 1e3).toPrecision(6).replace(/\.?0+$/, "");
  return val.toPrecision(6).replace(/\.?0+$/, "");
}

export default function DataTransferSpeed() {
  const t = useTranslations("DataTransferSpeed");
  const [inputValue, setInputValue] = useState("");
  const [inputUnit, setInputUnit] = useState<Unit>("megabitsPerSec");
  const [results, setResults] = useState<Record<Unit, string> | null>(null);
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    const num = parseFloat(inputValue);
    if (isNaN(num) || num < 0) {
      setError(t("invalidInput"));
      setResults(null);
      return;
    }
    const bits = num * TO_BITS[inputUnit];
    const res = {} as Record<Unit, string>;
    for (const unit of UNITS) {
      res[unit] = formatResult(bits / TO_BITS[unit]);
    }
    setResults(res);
  };

  const handleClear = () => {
    setInputValue("");
    setResults(null);
    setError("");
  };

  const GROUPS = [
    { label: "Bits", units: ["bitsPerSec", "kilobitsPerSec", "megabitsPerSec", "gigabitsPerSec", "terabitsPerSec"] as Unit[] },
    { label: "Bytes", units: ["bytesPerSec", "kilobytesPerSec", "megabytesPerSec", "gigabytesPerSec"] as Unit[] },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("inputLabel")}</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConvert()}
            placeholder="e.g. 100"
            min="0"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("inputUnitLabel")}</label>
          <select
            value={inputUnit}
            onChange={(e) => { setInputUnit(e.target.value as Unit); setResults(null); }}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>{UNIT_LABELS[u]}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={handleConvert} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
          {t("convertButton")}
        </button>
        <button onClick={handleClear} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          {GROUPS.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">{group.label}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {group.units.map((unit) => (
                  <div
                    key={unit}
                    className={`rounded-lg border px-4 py-3 ${unit === inputUnit ? "border-indigo-500/50 bg-indigo-500/10" : "border-gray-700 bg-gray-800/50"}`}
                  >
                    <div className="text-xs text-gray-500 mb-1">{UNIT_LABELS[unit]}</div>
                    <div className="text-lg font-mono font-semibold text-gray-100 break-all">{results[unit]}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
