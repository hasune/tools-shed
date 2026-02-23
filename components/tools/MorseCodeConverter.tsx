"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

const MORSE: Record<string, string> = {
  A: "·−", B: "−···", C: "−·−·", D: "−··", E: "·", F: "··−·",
  G: "−−·", H: "····", I: "··", J: "·−−−", K: "−·−", L: "·−··",
  M: "−−", N: "−·", O: "−−−", P: "·−−·", Q: "−−·−", R: "·−·",
  S: "···", T: "−", U: "··−", V: "···−", W: "·−−", X: "−··−",
  Y: "−·−−", Z: "−−··",
  "0": "−−−−−", "1": "·−−−−", "2": "··−−−", "3": "···−−",
  "4": "····−", "5": "·····", "6": "−····", "7": "−−···",
  "8": "−−−··", "9": "−−−−·",
  ".": "·−·−·−", ",": "−−··−−", "?": "··−−··", "'": "·−−−−·",
  "!": "−·−·−−", "/": "−··−·", "(": "−·−−·", ")": "−·−−·−",
  "&": "·−···", ":": "−−−···", ";": "−·−·−·", "=": "−···−",
  "+": "·−·−·", "-": "−····−", "_": "··−−·−", '"': "·−··−·",
  "$": "···−··−", "@": "·−−·−·",
};

const TEXT_MORSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => {
      if (ch === " ") return "/";
      return MORSE[ch] ?? "?";
    })
    .join(" ");
}

function morseToText(morse: string): string {
  return morse
    .trim()
    .split(" / ")
    .map((word) =>
      word
        .trim()
        .split(" ")
        .map((code) => TEXT_MORSE[code] ?? "?")
        .join("")
    )
    .join(" ");
}

const REFERENCE = Object.entries(MORSE).slice(0, 36); // A-Z + 0-9

export default function MorseCodeConverter() {
  const t = useTranslations("MorseCodeConverter");

  const [mode, setMode] = useState<"textToMorse" | "morseToText">("textToMorse");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (mode === "textToMorse") {
      setOutput(textToMorse(input));
    } else {
      setOutput(morseToText(input));
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Mode tabs */}
      <div className="flex gap-2">
        {(["textToMorse", "morseToText"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setInput(""); setOutput(""); }}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {t(m)}
          </button>
        ))}
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">{t("inputLabel")}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "textToMorse" ? t("textPlaceholder") : t("morsePlaceholder")}
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none font-mono text-sm"
        />
      </div>

      <button
        onClick={handleConvert}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-medium transition-colors"
      >
        {t("convertButton")}
      </button>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">{t("outputLabel")}</label>
            <button
              onClick={handleCopy}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {copied ? t("copied") : t("copyButton")}
            </button>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-green-400 whitespace-pre-wrap break-all min-h-[4rem]">
            {output}
          </div>
        </div>
      )}

      {/* Reference table */}
      <div>
        <p className="text-sm text-gray-500 mb-2">{t("referenceLabel")}</p>
        <div className="grid grid-cols-6 sm:grid-cols-9 gap-1">
          {REFERENCE.map(([char, code]) => (
            <div key={char} className="bg-gray-900 rounded p-1 text-center border border-gray-800">
              <p className="text-white font-bold text-xs">{char}</p>
              <p className="text-gray-500 font-mono text-xs leading-tight">{code}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
