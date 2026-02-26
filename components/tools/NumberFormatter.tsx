"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

const LOCALES = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "de-DE", label: "German (DE)" },
  { value: "fr-FR", label: "French (FR)" },
  { value: "ja-JP", label: "Japanese (JP)" },
  { value: "ko-KR", label: "Korean (KR)" },
  { value: "zh-CN", label: "Chinese (CN)" },
  { value: "es-ES", label: "Spanish (ES)" },
  { value: "pt-BR", label: "Portuguese (BR)" },
  { value: "ru-RU", label: "Russian (RU)" },
  { value: "ar-SA", label: "Arabic (SA)" },
  { value: "hi-IN", label: "Hindi (IN)" },
];

const CURRENCIES = [
  "USD", "EUR", "GBP", "JPY", "KRW", "CNY", "CAD", "AUD",
  "CHF", "INR", "BRL", "MXN", "RUB", "SGD", "HKD",
];

export default function NumberFormatter() {
  const t = useTranslations("NumberFormatter");
  const [numberStr, setNumberStr] = useState("");
  const [format, setFormat] = useState("decimal");
  const [currency, setCurrency] = useState("USD");
  const [locale, setLocale] = useState("en-US");
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  const [result, setResult] = useState("");

  const formatNumber = (raw: string) => {
    const num = parseFloat(raw.replace(/,/g, ""));
    if (isNaN(num)) {
      setResult("");
      return;
    }
    try {
      let formatted = "";
      if (format === "decimal") {
        formatted = new Intl.NumberFormat(locale, {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(num);
      } else if (format === "currency") {
        formatted = new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(num);
      } else if (format === "percent") {
        formatted = new Intl.NumberFormat(locale, {
          style: "percent",
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(num / 100);
      } else if (format === "scientific") {
        formatted = num.toExponential(decimalPlaces);
      }
      setResult(formatted);
    } catch {
      setResult("");
    }
  };

  const handleNumberChange = (val: string) => {
    setNumberStr(val);
    formatNumber(val);
  };

  const handleFormatChange = (val: string) => {
    setFormat(val);
    // Re-run with current number
    const num = parseFloat(numberStr.replace(/,/g, ""));
    if (!isNaN(num)) {
      try {
        let formatted = "";
        if (val === "decimal") {
          formatted = new Intl.NumberFormat(locale, { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces }).format(num);
        } else if (val === "currency") {
          formatted = new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces }).format(num);
        } else if (val === "percent") {
          formatted = new Intl.NumberFormat(locale, { style: "percent", minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces }).format(num / 100);
        } else if (val === "scientific") {
          formatted = num.toExponential(decimalPlaces);
        }
        setResult(formatted);
      } catch { setResult(""); }
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Number input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("numberLabel")}</label>
          <input
            type="text"
            value={numberStr}
            onChange={(e) => handleNumberChange(e.target.value)}
            placeholder={t("numberPlaceholder")}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("formatLabel")}</label>
          <select
            value={format}
            onChange={(e) => handleFormatChange(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
          >
            <option value="decimal">{t("formatDecimal")}</option>
            <option value="currency">{t("formatCurrency")}</option>
            <option value="percent">{t("formatPercent")}</option>
            <option value="scientific">{t("formatScientific")}</option>
          </select>
        </div>

        {/* Locale */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("localeLabel")}</label>
          <select
            value={locale}
            onChange={(e) => { setLocale(e.target.value); formatNumber(numberStr); }}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
          >
            {LOCALES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Currency (show only when format=currency) */}
        {format === "currency" && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t("currencyLabel")}</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        {/* Decimal places */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("decimalPlacesLabel")}: {decimalPlaces}
          </label>
          <input
            type="range"
            min={0}
            max={6}
            value={decimalPlaces}
            onChange={(e) => setDecimalPlaces(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => formatNumber(numberStr)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {t("formatLabel")}
        </button>
        <button
          onClick={() => { setNumberStr(""); setResult(""); }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-5 py-4">
          <div className="text-sm text-gray-400 mb-1">{t("resultLabel")}</div>
          <div className="text-3xl font-mono font-semibold text-indigo-300 break-all">{result}</div>
        </div>
      )}
    </div>
  );
}
