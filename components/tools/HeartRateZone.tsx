"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Zone {
  zone: string;
  desc: string;
  min: number;
  max: number;
  color: string;
}

export default function HeartRateZone() {
  const t = useTranslations("HeartRateZone");

  const [age, setAge] = useState("");
  const [restingHr, setRestingHr] = useState("");
  const [formula, setFormula] = useState<"basic" | "karvonen">("basic");
  const [zones, setZones] = useState<Zone[] | null>(null);
  const [maxHr, setMaxHr] = useState<number | null>(null);

  const ZONE_PERCENTS = [
    [0.5, 0.6],
    [0.6, 0.7],
    [0.7, 0.8],
    [0.8, 0.9],
    [0.9, 1.0],
  ];

  const ZONE_COLORS = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-red-500",
  ];

  const handleCalculate = () => {
    const a = parseFloat(age);
    if (isNaN(a) || a < 10 || a > 120) return;
    const mhr = 220 - a;
    setMaxHr(mhr);

    const rhr = parseFloat(restingHr);
    const useKarvonen = formula === "karvonen" && !isNaN(rhr) && rhr > 0;

    const zoneData: Zone[] = ZONE_PERCENTS.map(([lo, hi], i) => {
      let zoneMin: number, zoneMax: number;
      if (useKarvonen) {
        zoneMin = Math.round(lo * (mhr - rhr) + rhr);
        zoneMax = Math.round(hi * (mhr - rhr) + rhr);
      } else {
        zoneMin = Math.round(lo * mhr);
        zoneMax = Math.round(hi * mhr);
      }
      return {
        zone: t(`zone${i + 1}` as Parameters<typeof t>[0]),
        desc: t(`zone${i + 1}Desc` as Parameters<typeof t>[0]),
        min: zoneMin,
        max: zoneMax,
        color: ZONE_COLORS[i],
      };
    });

    setZones(zoneData);
  };

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t("ageLabel")}</label>
          <input
            type="number"
            min={10}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="30"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t("restingHrLabel")}</label>
          <input
            type="number"
            min={30}
            max={120}
            value={restingHr}
            onChange={(e) => setRestingHr(e.target.value)}
            placeholder={t("restingHrPlaceholder")}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Formula selector */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">{t("formulaLabel")}</label>
        <div className="flex gap-2">
          {(["basic", "karvonen"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormula(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                formula === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {t(`formula${f.charAt(0).toUpperCase() + f.slice(1)}` as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-medium transition-colors"
      >
        {t("calculateButton")}
      </button>

      {zones && maxHr && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{t("maxHrLabel")}:</span>
            <span className="text-lg font-bold text-red-400">{maxHr} bpm</span>
          </div>
          <div className="space-y-2">
            {zones.map((z, i) => {
              const widthPct = 60 + i * 10;
              return (
                <div key={i} className="bg-gray-900 rounded-xl p-3 border border-gray-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{z.zone}</span>
                    <span className="text-sm font-mono text-gray-300">
                      {z.min} – {z.max} bpm
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full mb-1">
                    <div
                      className={`h-full rounded-full ${z.color}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{z.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
