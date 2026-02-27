"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Schedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function calcPI(principal: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
}

function buildSchedule(
  principal: number,
  monthlyRate: number,
  months: number,
  type: "pi" | "principal"
): Schedule[] {
  const schedule: Schedule[] = [];
  let balance = principal;
  const fixedPrincipal = principal / months;

  for (let m = 1; m <= months; m++) {
    const interest = balance * monthlyRate;
    const princ = type === "pi" ? calcPI(principal, monthlyRate, months) - interest : fixedPrincipal;
    const payment = princ + interest;
    balance -= princ;
    schedule.push({ month: m, payment, principal: princ, interest, balance: Math.max(0, balance) });
  }
  return schedule;
}

export default function MortgageCalculator() {
  const t = useTranslations("MortgageCalculator");
  const [price, setPrice] = useState("400000");
  const [downPct, setDownPct] = useState("20");
  const [downAmt, setDownAmt] = useState("80000");
  const [term, setTerm] = useState("30");
  const [rate, setRate] = useState("6.5");
  const [repayType, setRepayType] = useState<"pi" | "principal">("pi");
  const [currency, setCurrency] = useState("$");
  const [schedule, setSchedule] = useState<Schedule[] | null>(null);
  const [showAll, setShowAll] = useState(false);

  const syncDown = (priceVal: string, pctVal: string) => {
    const p = parseFloat(priceVal) || 0;
    const pct = parseFloat(pctVal) || 0;
    setDownAmt(String(Math.round(p * pct / 100)));
  };

  const fmt = (n: number) => `${currency}${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const calculate = () => {
    const priceN = parseFloat(price);
    const downN = parseFloat(downAmt);
    const termN = parseInt(term);
    const rateN = parseFloat(rate);
    if (!priceN || !termN || isNaN(rateN) || rateN < 0) return;
    const principal = priceN - downN;
    const months = termN * 12;
    const monthlyRate = rateN / 100 / 12;
    setSchedule(buildSchedule(principal, monthlyRate, months, repayType));
    setShowAll(false);
  };

  const firstPayment = schedule?.[0]?.payment ?? 0;
  const totalPaid = schedule ? schedule.reduce((s, r) => s + r.payment, 0) : 0;
  const totalInterest = schedule ? schedule.reduce((s, r) => s + r.interest, 0) : 0;
  const loanAmt = (parseFloat(price) || 0) - (parseFloat(downAmt) || 0);
  const ltv = price ? ((loanAmt / parseFloat(price)) * 100).toFixed(1) : "0";
  const displayed = showAll ? schedule : schedule?.slice(0, 24);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("currencyLabel")}</label>
          <input value={currency} onChange={e => setCurrency(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("priceLabel")}</label>
          <input type="number" value={price} onChange={e => { setPrice(e.target.value); syncDown(e.target.value, downPct); }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("downPaymentLabel")} <span className="text-gray-500 text-xs">{t("downPaymentPct")}</span></label>
          <div className="flex gap-2">
            <input type="number" value={downPct} min="0" max="100"
              onChange={e => { setDownPct(e.target.value); syncDown(price, e.target.value); }}
              className="w-24 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
            <input type="number" value={downAmt}
              onChange={e => { setDownAmt(e.target.value); const p = parseFloat(price)||0; setDownPct(p ? String(Math.round(parseFloat(e.target.value)/p*100)) : "0"); }}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("interestRateLabel")}</label>
          <input type="number" value={rate} step="0.1" onChange={e => setRate(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("loanTermLabel")}</label>
          <select value={term} onChange={e => setTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
            {[5,10,15,20,25,30].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("repaymentTypeLabel")}</label>
          <select value={repayType} onChange={e => setRepayType(e.target.value as "pi" | "principal")}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
            <option value="pi">{t("typePI")}</option>
            <option value="principal">{t("typePrincipal")}</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={() => { setSchedule(null); }} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {schedule && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-400">{fmt(firstPayment)}</div>
              <div className="text-xs text-gray-400 mt-1">{t("monthlyPaymentLabel")}{repayType === "principal" ? ` ${t("firstMonthLabel")}` : ""}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{fmt(loanAmt)}</div>
              <div className="text-xs text-gray-400 mt-1">{t("loanAmountLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{fmt(totalInterest)}</div>
              <div className="text-xs text-gray-400 mt-1">{t("totalInterestLabel")}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{ltv}%</div>
              <div className="text-xs text-gray-400 mt-1">{t("ltvLabel")}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">{t("scheduleTitle")}</h3>
            <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-lg">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-400">
                    <th className="px-3 py-2 text-left">{t("colMonth")}</th>
                    <th className="px-3 py-2 text-right">{t("colPayment")}</th>
                    <th className="px-3 py-2 text-right">{t("colPrincipal")}</th>
                    <th className="px-3 py-2 text-right">{t("colInterest")}</th>
                    <th className="px-3 py-2 text-right">{t("colBalance")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {displayed?.map(row => (
                    <tr key={row.month} className="hover:bg-gray-700/50">
                      <td className="px-3 py-1.5 text-gray-400">{row.month}</td>
                      <td className="px-3 py-1.5 text-right text-white">{fmt(row.payment)}</td>
                      <td className="px-3 py-1.5 text-right text-green-400">{fmt(row.principal)}</td>
                      <td className="px-3 py-1.5 text-right text-red-400">{fmt(row.interest)}</td>
                      <td className="px-3 py-1.5 text-right text-gray-300">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {schedule.length > 24 && (
              <button onClick={() => setShowAll(!showAll)}
                className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                {showAll ? t("collapseButton") : t("showAllButton")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
