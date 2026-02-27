"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

function countBusinessDays(start: Date, end: Date): { business: number; total: number; weekends: number } {
  let business = 0;
  let total = 0;
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);

  while (cur <= endDate) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) business++;
    total++;
    cur.setDate(cur.getDate() + 1);
  }
  return { business, total, weekends: total - business };
}

export default function BusinessDaysCalculator() {
  const t = useTranslations("BusinessDaysCalculator");
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [result, setResult] = useState<{ business: number; total: number; weekends: number } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    if (!startDate || !endDate) return;
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (e < s) { setError(t("invalidRange")); return; }
    setResult(countBusinessDays(s, e));
  };

  const clear = () => { setStartDate(today); setEndDate(today); setResult(null); setError(""); };

  const swap = () => { const tmp = startDate; setStartDate(endDate); setEndDate(tmp); setResult(null); };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("startDateLabel")}</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("endDateLabel")}</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={swap} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("swapButton")}
        </button>
        <button onClick={clear} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-400 mb-1">{t("resultLabel")}</div>
            <div className="text-5xl font-bold text-indigo-400">{result.business}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{result.total}</div>
              <div className="text-sm text-gray-400 mt-1">{t("totalDaysLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{result.weekends}</div>
              <div className="text-sm text-gray-400 mt-1">{t("weekendsLabel")}</div>
            </div>
          </div>
          <p className="text-xs text-gray-500">{t("note")}</p>
        </div>
      )}
    </div>
  );
}
