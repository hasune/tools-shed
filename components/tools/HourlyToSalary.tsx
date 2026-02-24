"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Mode = "hourlyToSalary" | "salaryToHourly";

export default function HourlyToSalary() {
  const t = useTranslations("HourlyToSalary");
  const [mode, setMode] = useState<Mode>("hourlyToSalary");
  const [hourlyRate, setHourlyRate] = useState("");
  const [annualSalary, setAnnualSalary] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("52");
  const [result, setResult] = useState<{
    annual: number; monthly: number; biweekly: number; weekly: number; daily: number; hourly: number;
  } | null>(null);

  const calculate = () => {
    const hpw = parseFloat(hoursPerWeek) || 40;
    const wpy = parseFloat(weeksPerYear) || 52;
    const totalHoursPerYear = hpw * wpy;

    if (mode === "hourlyToSalary") {
      const hr = parseFloat(hourlyRate);
      if (isNaN(hr) || hr <= 0) return;
      const annual = hr * totalHoursPerYear;
      setResult({
        annual,
        monthly: annual / 12,
        biweekly: hr * hpw * 2,
        weekly: hr * hpw,
        daily: hr * 8,
        hourly: hr,
      });
    } else {
      const annual = parseFloat(annualSalary);
      if (isNaN(annual) || annual <= 0) return;
      const hr = annual / totalHoursPerYear;
      setResult({
        annual,
        monthly: annual / 12,
        biweekly: annual / (wpy / 2),
        weekly: annual / wpy,
        daily: hr * 8,
        hourly: hr,
      });
    }
  };

  const clear = () => {
    setHourlyRate("");
    setAnnualSalary("");
    setHoursPerWeek("40");
    setWeeksPerYear("52");
    setResult(null);
  };

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

  const rows: Array<[string, number]> = result ? [
    [t("annualLabel"), result.annual],
    [t("monthlyLabel"), result.monthly],
    [t("biweeklyLabel"), result.biweekly],
    [t("weeklyLabel"), result.weekly],
    [t("dailyLabel"), result.daily],
    [t("hourlyLabel"), result.hourly],
  ] : [];

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(["hourlyToSalary", "salaryToHourly"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          >
            {t(m === "hourlyToSalary" ? "modeHourlyToSalary" : "modeSalaryToHourly")}
          </button>
        ))}
      </div>

      {mode === "hourlyToSalary" ? (
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("hourlyRateLabel")}</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder={t("placeholderHourly")}
            min="0"
            step="0.01"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
      ) : (
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("salaryLabel")}</label>
          <input
            type="number"
            value={annualSalary}
            onChange={(e) => setAnnualSalary(e.target.value)}
            placeholder={t("placeholderSalary")}
            min="0"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("hoursPerWeekLabel")}</label>
          <input
            type="number"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            min="1" max="168"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("weeksPerYearLabel")}</label>
          <input
            type="number"
            value={weeksPerYear}
            onChange={(e) => setWeeksPerYear(e.target.value)}
            min="1" max="52"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={calculate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={clear} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {rows.map(([label, value], i) => (
                <tr key={i} className={`border-t border-gray-800 first:border-t-0 ${i === 0 ? "bg-indigo-950/30" : i % 2 === 0 ? "bg-gray-900" : "bg-gray-800/30"}`}>
                  <td className="px-4 py-3 text-gray-400">{label}</td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-white">{fmt(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
