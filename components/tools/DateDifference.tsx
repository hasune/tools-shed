"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Results {
  totalDays: number;
  workingDays: number;
  weeks: number;
  months: number;
  years: number;
}

function countWorkingDays(start: Date, end: Date): number {
  let count = 0;
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (cur <= last) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function calcDifference(startStr: string, endStr: string): Results | null {
  let start = new Date(startStr);
  let end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  if (start > end) [start, end] = [end, start];

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.round((end.getTime() - start.getTime()) / msPerDay);
  const workingDays = countWorkingDays(start, end);
  const weeks = Math.floor(totalDays / 7);

  // Approximate months
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months--;
  months = Math.max(0, months);

  const years = parseFloat((totalDays / 365.25).toFixed(2));

  return { totalDays, workingDays, weeks, months, years };
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export default function DateDifference() {
  const t = useTranslations("DateDifference");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [results, setResults] = useState<Results | null>(null);

  const calculate = () => {
    const res = calcDifference(startDate, endDate);
    setResults(res);
  };

  const handleClear = () => {
    setStartDate(""); setEndDate(""); setResults(null);
  };

  const resultCards: { labelKey: "totalDays" | "workingDays" | "weeks" | "months" | "years"; value: number | undefined }[] = results
    ? [
        { labelKey: "totalDays", value: results.totalDays },
        { labelKey: "workingDays", value: results.workingDays },
        { labelKey: "weeks", value: results.weeks },
        { labelKey: "months", value: results.months },
        { labelKey: "years", value: results.years },
      ]
    : [];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">{t("startDateLabel")}</label>
            <button
              onClick={() => setStartDate(todayStr())}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {t("useToday")}
            </button>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">{t("endDateLabel")}</label>
            <button
              onClick={() => setEndDate(todayStr())}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {t("useToday")}
            </button>
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {t("calculateButton")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {results && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {resultCards.map(({ labelKey, value }) => (
            <div key={labelKey} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-center">
              <div className="text-xs text-gray-500 mb-1">{t(labelKey)}</div>
              <div className="text-2xl font-bold text-indigo-400">
                {value?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
