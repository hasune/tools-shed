"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

const ONES = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const ORDINAL_ONES = [
  "", "first", "second", "third", "fourth", "fifth", "sixth", "seventh",
  "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth",
  "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth",
];
const ORDINAL_TENS = [
  "", "", "twentieth", "thirtieth", "fortieth", "fiftieth",
  "sixtieth", "seventieth", "eightieth", "ninetieth",
];

function chunkToWords(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : "");
  return ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + chunkToWords(n % 100) : "");
}

function numberToWords(n: number): string {
  if (n === 0) return "zero";
  const isNeg = n < 0;
  n = Math.abs(n);
  const scales = ["", " thousand", " million", " billion", " trillion"];
  const chunks: number[] = [];
  while (n > 0) { chunks.push(n % 1000); n = Math.floor(n / 1000); }
  const parts = chunks
    .map((chunk, i) => (chunk ? chunkToWords(chunk) + scales[i] : ""))
    .filter(Boolean)
    .reverse();
  return (isNeg ? "negative " : "") + parts.join(", ");
}

function toOrdinal(words: string): string {
  // Find last word token
  const tokens = words.split(/\s|-/);
  const last = tokens[tokens.length - 1];
  const onesIdx = ONES.indexOf(last);
  const tensIdx = TENS.indexOf(last);
  if (onesIdx > 0) return words.slice(0, words.length - last.length) + ORDINAL_ONES[onesIdx];
  if (tensIdx >= 2) return words.slice(0, words.length - last.length) + ORDINAL_TENS[tensIdx];
  const suffixes: Record<string, string> = {
    zero: "zeroth", hundred: "hundredth", thousand: "thousandth",
    million: "millionth", billion: "billionth", trillion: "trillionth",
  };
  return suffixes[last] ? words.slice(0, words.length - last.length) + suffixes[last] : words + "th";
}

export default function NumberToWords() {
  const t = useTranslations("NumberToWords");
  const [input, setInput] = useState("");
  const [showOrdinal, setShowOrdinal] = useState(false);
  const [copied, setCopied] = useState(false);

  const num = parseFloat(input.replace(/,/g, ""));
  const isValid = !isNaN(num) && Number.isInteger(num) && Math.abs(num) <= 999_999_999_999_999;
  const words = input && isValid ? numberToWords(num) : "";
  const ordinal = words && showOrdinal ? toOrdinal(words) : "";

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{t("inputLabel")}</label>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
        />
        {input && !isValid && <p className="text-red-400 text-xs">{t("invalidNumber")}</p>}
      </div>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={showOrdinal}
          onChange={(e) => setShowOrdinal(e.target.checked)}
          className="accent-indigo-500"
        />
        <span className="text-sm text-gray-400">{t("ordinalToggle")}</span>
      </label>
      {words && (
        <div className="space-y-3">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">{t("result")}</div>
            <div className="text-white text-lg capitalize break-words">{words}</div>
          </div>
          {showOrdinal && ordinal && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">{t("ordinal")}</div>
              <div className="text-indigo-400 text-lg capitalize break-words">{ordinal}</div>
            </div>
          )}
          <button
            onClick={() => copy(showOrdinal && ordinal ? ordinal : words)}
            className="text-sm px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
