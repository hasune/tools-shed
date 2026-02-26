"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

const CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "KRW", name: "Korean Won" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "INR", name: "Indian Rupee" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "DKK", name: "Danish Krone" },
  { code: "PLN", name: "Polish Złoty" },
  { code: "CZK", name: "Czech Koruna" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "THB", name: "Thai Baht" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "ZAR", name: "South African Rand" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
];

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
  { value: "id-ID", label: "Indonesian (ID)" },
];

export default function CurrencyFormatter() {
  const t = useTranslations("CurrencyFormatter");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [locale, setLocale] = useState("en-US");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const format = (raw: string, cur: string, loc: string) => {
    const num = parseFloat(raw.replace(/,/g, ""));
    if (isNaN(num)) { setResult(""); return; }
    try {
      const formatted = new Intl.NumberFormat(loc, {
        style: "currency",
        currency: cur,
      }).format(num);
      setResult(formatted);
    } catch {
      setResult("");
    }
  };

  const handleAmountChange = (val: string) => {
    setAmount(val);
    format(val, currency, locale);
  };

  const handleCurrencyChange = (val: string) => {
    setCurrency(val);
    format(amount, val, locale);
  };

  const handleLocaleChange = (val: string) => {
    setLocale(val);
    format(amount, currency, val);
  };

  const handleClear = () => {
    setAmount("");
    setResult("");
    setCopied(false);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("numberLabel")}</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder={t("numberPlaceholder")}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("currencyLabel")}</label>
          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("localeLabel")}</label>
          <select
            value={locale}
            onChange={(e) => handleLocaleChange(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
          >
            {LOCALES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 px-5 py-4">
          <div className="text-sm text-gray-400 mb-2">{t("resultLabel")}</div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-3xl font-semibold text-indigo-300 break-all">{result}</div>
            <button
              onClick={handleCopy}
              className="shrink-0 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            >
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
