"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function addDuration(
  date: Date,
  op: "add" | "subtract",
  years: number,
  months: number,
  weeks: number,
  days: number
): Date {
  const sign = op === "add" ? 1 : -1;
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + sign * years);
  result.setMonth(result.getMonth() + sign * months);
  result.setDate(result.getDate() + sign * (weeks * 7 + days));
  return result;
}

export default function DateCalculator() {
  const t = useTranslations("DateCalculator");
  const today = new Date().toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(today);
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [weeks, setWeeks] = useState(0);
  const [days, setDays] = useState(0);
  const [result, setResult] = useState<Date | null>(null);

  const handleCalculate = () => {
    const base = new Date(startDate + "T00:00:00");
    if (isNaN(base.getTime())) return;
    setResult(addDuration(base, operation, years, months, weeks, days));
  };

  const handleClear = () => {
    setStartDate(today);
    setOperation("add");
    setYears(0);
    setMonths(0);
    setWeeks(0);
    setDays(0);
    setResult(null);
  };

  const diffFromToday = result
    ? Math.round((result.getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000)
    : null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("startDateLabel")}</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("operationLabel")}</label>
          <div className="flex gap-2">
            <button
              onClick={() => setOperation("add")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                operation === "add"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {t("operationAdd")}
            </button>
            <button
              onClick={() => setOperation("subtract")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                operation === "subtract"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {t("operationSubtract")}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["years", "months", "weeks", "days"] as const).map((unit) => (
          <div key={unit}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t(`${unit}Label`)}
            </label>
            <input
              type="number"
              min={0}
              value={unit === "years" ? years : unit === "months" ? months : unit === "weeks" ? weeks : days}
              onChange={(e) => {
                const v = Math.max(0, parseInt(e.target.value) || 0);
                if (unit === "years") setYears(v);
                else if (unit === "months") setMonths(v);
                else if (unit === "weeks") setWeeks(v);
                else setDays(v);
              }}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCalculate}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {t("calculateButton")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-5 py-4 space-y-3">
          <div>
            <div className="text-sm text-gray-400 mb-1">{t("resultLabel")}</div>
            <div className="text-3xl font-semibold text-indigo-300">
              {result.toLocaleDateString("en-CA")} {/* YYYY-MM-DD */}
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-gray-500">{t("dayOfWeekLabel")}: </span>
              <span className="text-gray-200">{DAY_NAMES[result.getDay()]}</span>
            </div>
            {diffFromToday !== null && (
              <div>
                <span className="text-gray-500">{t("daysFromTodayLabel")}: </span>
                <span className="text-gray-200">
                  {diffFromToday > 0 ? `+${diffFromToday}` : diffFromToday}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
