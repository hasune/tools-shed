"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type FilingStatus = "single" | "marriedJoint" | "marriedSeparate" | "headOfHousehold";

interface Bracket { rate: number; min: number; max: number; }

const STANDARD_DEDUCTIONS: Record<FilingStatus, number> = {
  single: 14600,
  marriedJoint: 29200,
  marriedSeparate: 14600,
  headOfHousehold: 21900,
};

const BRACKETS_2024: Record<FilingStatus, Bracket[]> = {
  single: [
    { rate: 0.10, min: 0, max: 11600 },
    { rate: 0.12, min: 11600, max: 47150 },
    { rate: 0.22, min: 47150, max: 100525 },
    { rate: 0.24, min: 100525, max: 191950 },
    { rate: 0.32, min: 191950, max: 243725 },
    { rate: 0.35, min: 243725, max: 609350 },
    { rate: 0.37, min: 609350, max: Infinity },
  ],
  marriedJoint: [
    { rate: 0.10, min: 0, max: 23200 },
    { rate: 0.12, min: 23200, max: 94300 },
    { rate: 0.22, min: 94300, max: 201050 },
    { rate: 0.24, min: 201050, max: 383900 },
    { rate: 0.32, min: 383900, max: 487450 },
    { rate: 0.35, min: 487450, max: 731200 },
    { rate: 0.37, min: 731200, max: Infinity },
  ],
  marriedSeparate: [
    { rate: 0.10, min: 0, max: 11600 },
    { rate: 0.12, min: 11600, max: 47150 },
    { rate: 0.22, min: 47150, max: 100525 },
    { rate: 0.24, min: 100525, max: 191950 },
    { rate: 0.32, min: 191950, max: 243725 },
    { rate: 0.35, min: 243725, max: 365600 },
    { rate: 0.37, min: 365600, max: Infinity },
  ],
  headOfHousehold: [
    { rate: 0.10, min: 0, max: 16550 },
    { rate: 0.12, min: 16550, max: 63100 },
    { rate: 0.22, min: 63100, max: 100500 },
    { rate: 0.24, min: 100500, max: 191950 },
    { rate: 0.32, min: 191950, max: 243700 },
    { rate: 0.35, min: 243700, max: 609350 },
    { rate: 0.37, min: 609350, max: Infinity },
  ],
};

function calculateTax(taxableIncome: number, status: FilingStatus) {
  const brackets = BRACKETS_2024[status];
  let totalTax = 0;
  const breakdown: { rate: number; amount: number; on: number }[] = [];
  let marginalRate = 0;
  for (const b of brackets) {
    if (taxableIncome <= b.min) break;
    const taxable = Math.min(taxableIncome, b.max) - b.min;
    const tax = taxable * b.rate;
    totalTax += tax;
    breakdown.push({ rate: b.rate, amount: tax, on: taxable });
    marginalRate = b.rate;
  }
  return { totalTax, breakdown, marginalRate };
}

export default function TaxBracketCalculator() {
  const t = useTranslations("TaxBracketCalculator");
  const [income, setIncome] = useState("75000");
  const [status, setStatus] = useState<FilingStatus>("single");
  const [result, setResult] = useState<{
    totalTax: number;
    effectiveRate: number;
    marginalRate: number;
    afterTax: number;
    breakdown: { rate: number; amount: number; on: number }[];
  } | null>(null);

  const calculate = () => {
    const gross = parseFloat(income.replace(/,/g, ""));
    if (isNaN(gross) || gross < 0) return;
    const deduction = STANDARD_DEDUCTIONS[status];
    const taxableIncome = Math.max(0, gross - deduction);
    const { totalTax, breakdown, marginalRate } = calculateTax(taxableIncome, status);
    const effectiveRate = gross > 0 ? totalTax / gross : 0;
    setResult({ totalTax, effectiveRate, marginalRate, afterTax: gross - totalTax, breakdown });
  };

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pct = (n: number) => (n * 100).toFixed(1) + "%";

  const statuses: [FilingStatus, string][] = [
    ["single", t("single")],
    ["marriedJoint", t("marriedJoint")],
    ["marriedSeparate", t("marriedSeparate")],
    ["headOfHousehold", t("headOfHousehold")],
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("incomeLabel")}</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder={t("incomePlaceholder")}
          min="0"
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{t("filingStatusLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {statuses.map(([s, label]) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${status === s ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={calculate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">{t("calculateButton")}</button>
        <button onClick={() => { setIncome("75000"); setStatus("single"); setResult(null); }} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">{t("clearButton")}</button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {([
              [t("estimatedTaxLabel"), fmt(result.totalTax), "text-red-400"],
              [t("effectiveRateLabel"), pct(result.effectiveRate), "text-yellow-400"],
              [t("marginalRateLabel"), pct(result.marginalRate), "text-orange-400"],
              [t("afterTaxLabel"), fmt(result.afterTax), "text-green-400"],
            ] as [string, string, string][]).map(([label, value, color], i) => (
              <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className={`text-xl font-mono font-semibold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <p className="text-xs text-gray-500 px-4 py-2 border-b border-gray-700">{t("bracketBreakdown")}</p>
            <table className="w-full text-sm">
              <tbody>
                {result.breakdown.filter((b) => b.on > 0).map((b, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-800/30"}>
                    <td className="px-4 py-2 text-indigo-400 font-mono">{(b.rate * 100).toFixed(0)}%</td>
                    <td className="px-4 py-2 text-gray-400 text-xs">on {fmt(b.on)}</td>
                    <td className="px-4 py-2 text-white font-mono text-right">{fmt(b.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 italic">{t("disclaimer")}</p>
        </div>
      )}
    </div>
  );
}
