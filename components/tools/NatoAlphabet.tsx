"use client";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

const NATO_MAP: Record<string, string> = {
  A: "Alpha", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo",
  F: "Foxtrot", G: "Golf", H: "Hotel", I: "India", J: "Juliet",
  K: "Kilo", L: "Lima", M: "Mike", N: "November", O: "Oscar",
  P: "Papa", Q: "Quebec", R: "Romeo", S: "Sierra", T: "Tango",
  U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee",
  Z: "Zulu",
  "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
  "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Niner",
};

const ALPHABET_ROWS = Object.entries(NATO_MAP).slice(0, 26);
const DIGIT_ROWS = Object.entries(NATO_MAP).slice(26);

function convertToNato(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((char) => {
      if (char === " ") return "(space)";
      return NATO_MAP[char] ?? char;
    })
    .join(" – ");
}

export default function NatoAlphabet() {
  const t = useTranslations("NatoAlphabet");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = input ? convertToNato(input) : "";

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = () => {
    setInput("");
    setCopied(false);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("inputLabel")}
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Output */}
      {output && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("outputLabel")}
          </label>
          <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-indigo-300 font-mono text-sm leading-relaxed min-h-[80px] break-words">
            {output}
          </div>
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {copied ? "✓ Copied" : t("copyButton")}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium rounded-lg transition-colors"
            >
              {t("clearButton")}
            </button>
          </div>
        </div>
      )}

      {!output && input === "" && (
        <div className="flex justify-end">
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            {t("clearButton")}
          </button>
        </div>
      )}

      {/* Reference Table */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">{t("referenceTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Letters */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2">
              {ALPHABET_ROWS.map(([letter, word]) => (
                <div
                  key={letter}
                  className="flex items-center gap-3 px-4 py-2 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <span className="text-indigo-400 font-bold w-5 text-center">{letter}</span>
                  <span className="text-gray-300 text-sm">{word}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Digits */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden self-start">
            {DIGIT_ROWS.map(([digit, word]) => (
              <div
                key={digit}
                className="flex items-center gap-3 px-4 py-2 border-b border-gray-700/50 last:border-0 hover:bg-gray-700/30 transition-colors"
              >
                <span className="text-indigo-400 font-bold w-5 text-center">{digit}</span>
                <span className="text-gray-300 text-sm">{word}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
