"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Row { period: number; invested: number; value: number; gain: number; }

function simulate(initial: number, periodic: number, periodsPerYear: number, periods: number, annualReturn: number): Row[] {
  const r = annualReturn / 100 / periodsPerYear;
  const rows: Row[] = [];
  let value = initial;
  let invested = initial;
  for (let p = 1; p <= periods; p++) {
    value = value * (1 + r) + periodic;
    invested += periodic;
    rows.push({ period: p, invested, value, gain: value - invested });
  }
  return rows;
}

export default function DcaCalculator() {
  const t = useTranslations("DcaCalculator");
  const [initial, setInitial] = useState("1000");
  const [periodic, setPeriodic] = useState("200");
  const [frequency, setFrequency] = useState<"monthly" | "weekly" | "yearly">("monthly");
  const [periods, setPeriods] = useState("120");
  const [returnRate, setReturnRate] = useState("8");
  const [currency, setCurrency] = useState("$");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [showAll, setShowAll] = useState(false);

  const freqMap: Record<string, number> = { monthly: 12, weekly: 52, yearly: 1 };

  const calculate = () => {
    const i = parseFloat(initial) || 0;
    const p = parseFloat(periodic) || 0;
    const per = parseInt(periods) || 12;
    const r = parseFloat(returnRate) || 0;
    setRows(simulate(i, p, freqMap[frequency], per, r));
    setShowAll(false);
  };

  const fmt = (n: number) => `${currency}${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const last = rows?.[rows.length - 1];
  const displayed = showAll ? rows : rows?.filter((_, i) => i % Math.max(1, Math.floor((rows?.length ?? 1) / 24)) === 0 || i === (rows?.length ?? 1) - 1).slice(0, 24);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("currencyLabel")}</label>
          <input value={currency} onChange={e => setCurrency(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("initialLabel")}</label>
          <input type="number" value={initial} onChange={e => setInitial(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("periodicLabel")}</label>
          <input type="number" value={periodic} onChange={e => setPeriodic(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("frequencyLabel")}</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value as "monthly"|"weekly"|"yearly")}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
            <option value="monthly">{t("freqMonthly")}</option>
            <option value="weekly">{t("freqWeekly")}</option>
            <option value="yearly">{t("freqYearly")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("periodsLabel")}</label>
          <input type="number" value={periods} onChange={e => setPeriods(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("returnRateLabel")}</label>
          <input type="number" value={returnRate} step="0.1" onChange={e => setReturnRate(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={() => setRows(null)} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {last && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-400">{fmt(last.value)}</div>
              <div className="text-xs text-gray-400 mt-1">{t("finalValueLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{fmt(last.invested)}</div>
              <div className="text-xs text-gray-400 mt-1">{t("totalInvestedLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{fmt(last.gain)}</div>
              <div className="text-xs text-gray-400 mt-1">{t("totalGainLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{((last.gain / last.invested) * 100).toFixed(1)}%</div>
              <div className="text-xs text-gray-400 mt-1">{t("returnPctLabel")}</div>
            </div>
          </div>

          <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-lg">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="px-3 py-2 text-left">{t("colPeriod")}</th>
                  <th className="px-3 py-2 text-right">{t("colInvested")}</th>
                  <th className="px-3 py-2 text-right">{t("colValue")}</th>
                  <th className="px-3 py-2 text-right">{t("colGain")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {displayed?.map(row => (
                  <tr key={row.period} className="hover:bg-gray-700/50">
                    <td className="px-3 py-1.5 text-gray-400">{row.period}</td>
                    <td className="px-3 py-1.5 text-right text-white">{fmt(row.invested)}</td>
                    <td className="px-3 py-1.5 text-right text-indigo-400">{fmt(row.value)}</td>
                    <td className="px-3 py-1.5 text-right text-green-400">{fmt(row.gain)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows && rows.length > 24 && (
            <button onClick={() => setShowAll(!showAll)} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              {showAll ? t("collapseButton") : t("showAllButton")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
