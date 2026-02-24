"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Reference rates against USD (mid-2025 approximate)
const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 157,
  CNY: 7.25,
  KRW: 1380,
  CAD: 1.36,
  AUD: 1.55,
  CHF: 0.89,
  HKD: 7.82,
  SGD: 1.35,
  MXN: 17.5,
  INR: 83.5,
  BRL: 5.1,
  SEK: 10.5,
  NOK: 10.7,
  DKK: 6.89,
  NZD: 1.63,
  ZAR: 18.5,
  TRY: 32.5,
};

const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar", EUR: "Euro", GBP: "British Pound", JPY: "Japanese Yen",
  CNY: "Chinese Yuan", KRW: "Korean Won", CAD: "Canadian Dollar", AUD: "Australian Dollar",
  CHF: "Swiss Franc", HKD: "Hong Kong Dollar", SGD: "Singapore Dollar", MXN: "Mexican Peso",
  INR: "Indian Rupee", BRL: "Brazilian Real", SEK: "Swedish Krona", NOK: "Norwegian Krone",
  DKK: "Danish Krone", NZD: "New Zealand Dollar", ZAR: "South African Rand", TRY: "Turkish Lira",
};

const CURRENCIES = Object.keys(RATES);

export default function CurrencyConverter() {
  const t = useTranslations("CurrencyConverter");
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [result, setResult] = useState<number | null>(null);

  const convert = () => {
    const num = parseFloat(amount);
    if (isNaN(num)) return;
    const usd = num / RATES[from];
    setResult(usd * RATES[to]);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
  };

  const selectClass = "w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("amountLabel")}</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1"
            min="0"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("fromLabel")}</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={selectClass}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c} – {CURRENCY_NAMES[c]}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("toLabel")}</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className={selectClass}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c} – {CURRENCY_NAMES[c]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={convert} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          {t("convertButton")}
        </button>
        <button onClick={swap} className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {t("swapButton")} ⇄
        </button>
      </div>

      {result !== null && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-2">
          <p className="text-xs text-gray-400">{t("resultLabel")}</p>
          <p className="text-2xl font-mono text-white">
            {result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {to}
          </p>
          <p className="text-xs text-gray-500">
            1 {from} = {(RATES[to] / RATES[from]).toPrecision(5)} {to}
          </p>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 space-y-1">
        <p className="text-xs text-yellow-400">⚠ {t("disclaimer")}</p>
        <p className="text-xs text-gray-500">{t("ratesDate")}</p>
      </div>
    </div>
  );
}
