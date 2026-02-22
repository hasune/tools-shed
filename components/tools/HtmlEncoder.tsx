"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const SAMPLE_ENCODE = `<div class="hello">Hello & World!</div>`;
const SAMPLE_DECODE = `&lt;div class=&quot;hello&quot;&gt;Hello &amp; World!&lt;/div&gt;`;

// Encode: replace special chars with HTML entities
function encodeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;");
}

// Comprehensive entity map for decoding
const ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&#39;": "'",
  "&#x27;": "'",
  "&#x2F;": "/",
  "&#47;": "/",
  "&#x60;": "`",
  "&#96;": "`",
  "&nbsp;": "\u00A0",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
  "&mdash;": "—",
  "&ndash;": "–",
  "&laquo;": "«",
  "&raquo;": "»",
  "&hellip;": "…",
  "&euro;": "€",
  "&pound;": "£",
  "&yen;": "¥",
  "&cent;": "¢",
  "&deg;": "°",
  "&plusmn;": "±",
  "&times;": "×",
  "&divide;": "÷",
  "&frac12;": "½",
  "&frac14;": "¼",
  "&frac34;": "¾",
  "&alpha;": "α",
  "&beta;": "β",
  "&gamma;": "γ",
  "&delta;": "δ",
  "&epsilon;": "ε",
  "&pi;": "π",
  "&sigma;": "σ",
  "&omega;": "ω",
  "&lArr;": "⇐",
  "&rArr;": "⇒",
  "&uArr;": "⇑",
  "&dArr;": "⇓",
  "&larr;": "←",
  "&rarr;": "→",
  "&uarr;": "↑",
  "&darr;": "↓",
};

function decodeHtml(input: string): string {
  // First handle named entities from map
  let result = input;
  for (const [entity, char] of Object.entries(ENTITY_MAP)) {
    result = result.split(entity).join(char);
  }
  // Handle decimal numeric entities: &#NNN;
  result = result.replace(/&#(\d+);/g, (_, num) =>
    String.fromCodePoint(parseInt(num, 10))
  );
  // Handle hex numeric entities: &#xHHH;
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  );
  return result;
}

export default function HtmlEncoder() {
  const t = useTranslations("HtmlEncoder");
  const tc = useTranslations("Common");

  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (!input.trim()) return;
    if (activeTab === "encode") {
      setOutput(encodeHtml(input));
    } else {
      setOutput(decodeHtml(input));
    }
  };

  const handleLoadSample = () => {
    setOutput("");
    setInput(activeTab === "encode" ? SAMPLE_ENCODE : SAMPLE_DECODE);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleTabChange = (tab: "encode" | "decode") => {
    setActiveTab(tab);
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => handleTabChange("encode")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "encode"
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {t("encodeTab")}
        </button>
        <button
          onClick={() => handleTabChange("decode")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "decode"
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {t("decodeTab")}
        </button>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">{t("inputLabel")}</label>
          <button
            onClick={handleLoadSample}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg px-4 py-2 transition-colors"
          >
            {t("loadSample")}
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
          spellCheck={false}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono resize-y"
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleConvert}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {activeTab === "encode" ? t("encodeButton") : t("decodeButton")}
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg px-4 py-2 transition-colors"
        >
          {tc("clear")}
        </button>
      </div>

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">{t("outputLabel")}</label>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-lg px-4 py-2 transition-colors"
          >
            {copied ? tc("copied") : tc("copy")}
          </button>
        </div>
        <textarea
          value={output}
          readOnly
          rows={10}
          spellCheck={false}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono resize-y"
        />
      </div>
    </div>
  );
}
