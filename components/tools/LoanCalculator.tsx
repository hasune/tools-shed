"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface AmortizationRow {
  month: number;
  principal: number;
  interest: number;
  balance: number;
}

interface Results {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

export default function LoanCalculator() {
  const t = useTranslations("LoanCalculator");

  const [loanAmount, setLoanAmount] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [termUnit, setTermUnit] = useState<"years" | "months">("years");
  const [results, setResults] = useState<Results | null>(null);

  const calculate = () => {
    const P = parseFloat(loanAmount);
    const annualPct = parseFloat(annualRate);
    const term = parseFloat(loanTerm);
    if (!P || !annualPct || !term || P <= 0 || term <= 0) return;

    const r = annualPct / 12 / 100;
    const n = termUnit === "years" ? term * 12 : term;

    let monthlyPayment: number;
    if (r === 0) {
      monthlyPayment = P / n;
    } else {
      monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - P;

    const schedule: AmortizationRow[] = [];
    let balance = P;
    const displayMonths = Math.min(12, n);
    for (let m = 1; m <= displayMonths; m++) {
      const interestPaid = balance * r;
      const principalPaid = monthlyPayment - interestPaid;
      balance = Math.max(0, balance - principalPaid);
      schedule.push({
        month: m,
        principal: principalPaid,
        interest: interestPaid,
        balance,
      });
    }

    setResults({ monthlyPayment, totalPayment, totalInterest, schedule });
  };

  const fmt = (val: number) =>
    val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("loanAmountLabel")}</label>
          <input
            type="number"
            min={0}
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="e.g. 200000"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("annualRateLabel")}</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
            placeholder="e.g. 5.5"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{t("loanTermLabel")}</label>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            placeholder={termUnit === "years" ? "e.g. 30" : "e.g. 360"}
            className="flex-1 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
          <div className="flex gap-1 p-1 bg-gray-900 rounded-lg border border-gray-700">
            {(["years", "months"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setTermUnit(u)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  termUnit === u ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {t(u)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        {t("calculateButton")}
      </button>

      {results && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-center">
              <div className="text-xs text-gray-500 mb-1">{t("monthlyPayment")}</div>
              <div className="text-2xl font-bold text-indigo-400">${fmt(results.monthlyPayment)}</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-center">
              <div className="text-xs text-gray-500 mb-1">{t("totalPayment")}</div>
              <div className="text-xl font-bold text-white">${fmt(results.totalPayment)}</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-center">
              <div className="text-xs text-gray-500 mb-1">{t("totalInterest")}</div>
              <div className="text-xl font-bold text-red-400">${fmt(results.totalInterest)}</div>
            </div>
          </div>

          {/* Amortization table */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-300">{t("amortizationTitle")}</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800 text-gray-400 text-xs">
                    <th className="px-4 py-2 text-left">{t("month")}</th>
                    <th className="px-4 py-2 text-right">{t("principal")}</th>
                    <th className="px-4 py-2 text-right">{t("interest")}</th>
                    <th className="px-4 py-2 text-right">{t("balance")}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.schedule.map((row) => (
                    <tr key={row.month} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-4 py-2 text-gray-400">{row.month}</td>
                      <td className="px-4 py-2 text-right text-green-400">${fmt(row.principal)}</td>
                      <td className="px-4 py-2 text-right text-red-400">${fmt(row.interest)}</td>
                      <td className="px-4 py-2 text-right text-white">${fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
