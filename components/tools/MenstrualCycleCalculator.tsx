"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysFrom(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export default function MenstrualCycleCalculator() {
  const t = useTranslations("MenstrualCycleCalculator");
  const todayStr = new Date().toISOString().split("T")[0];
  const [lastPeriod, setLastPeriod] = useState(todayStr);
  const [cycleLength, setCycleLength] = useState("28");
  const [periodDuration, setPeriodDuration] = useState("5");
  const [result, setResult] = useState<{
    ovulation: Date;
    fertileStart: Date;
    fertileEnd: Date;
    nextPeriod: Date;
    following: Date[];
  } | null>(null);

  const calculate = () => {
    const start = new Date(lastPeriod);
    const cycle = parseInt(cycleLength) || 28;
    const ovulation = addDays(start, cycle - 14);
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = addDays(ovulation, 1);
    const nextPeriod = addDays(start, cycle);
    const following = [1, 2, 3].map((i) => addDays(start, cycle * (i + 1)));
    setResult({ ovulation, fertileStart, fertileEnd, nextPeriod, following });
  };

  const clear = () => {
    setLastPeriod(todayStr);
    setCycleLength("28");
    setPeriodDuration("5");
    setResult(null);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("lastPeriodLabel")}</label>
          <input
            type="date"
            value={lastPeriod}
            onChange={(e) => setLastPeriod(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("cycleLengthLabel")}</label>
          <input
            type="number"
            value={cycleLength}
            onChange={(e) => setCycleLength(e.target.value)}
            min="21"
            max="35"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("periodDurationLabel")}</label>
          <input
            type="number"
            value={periodDuration}
            onChange={(e) => setPeriodDuration(e.target.value)}
            min="1"
            max="10"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={calculate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">{t("calculateButton")}</button>
        <button onClick={clear} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">{t("clearButton")}</button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: t("nextPeriodLabel"), date: result.nextPeriod, border: "border-indigo-700 bg-indigo-950/40", range: null },
              { label: t("ovulationLabel"), date: result.ovulation, border: "border-pink-700 bg-pink-950/30", range: null },
              { label: t("fertileWindowLabel"), date: null, border: "border-purple-700 bg-purple-950/30", range: [result.fertileStart, result.fertileEnd] },
            ].map((item, i) => {
              const days = item.date ? daysFrom(item.date) : null;
              return (
                <div key={i} className={`border rounded-xl p-4 ${item.border}`}>
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  {item.date ? (
                    <>
                      <p className="text-lg font-semibold text-white">{formatDate(item.date)}</p>
                      {days !== null && days >= 0 && (
                        <p className="text-xs text-gray-400 mt-1">{t("daysUntil", { days })}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-white">
                      {formatDate(item.range![0])} – {formatDate(item.range![1])}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <p className="text-xs text-gray-500 px-4 py-2 border-b border-gray-700">{t("followingPeriods")}</p>
            <div className="divide-y divide-gray-800">
              {result.following.map((d, i) => (
                <div key={i} className="px-4 py-2.5 flex justify-between">
                  <span className="text-sm text-gray-300">{formatDate(d)}</span>
                  <span className="text-xs text-gray-500">{t("daysUntil", { days: daysFrom(d) })}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500 italic">{t("disclaimer")}</p>
        </div>
      )}
    </div>
  );
}
