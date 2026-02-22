"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type TabId = "json" | "javascript" | "html";

// ─── JSON ──────────────────────────────────────────────────────────────────────

function escapeJson(input: string): string {
  let out = "";
  for (const ch of input) {
    switch (ch) {
      case "\\":  out += "\\\\"; break;
      case '"':   out += '\\"';  break;
      case "\n":  out += "\\n";  break;
      case "\t":  out += "\\t";  break;
      case "\r":  out += "\\r";  break;
      case "\b":  out += "\\b";  break;
      case "\f":  out += "\\f";  break;
      default:    out += ch;     break;
    }
  }
  return out;
}

function unescapeJson(input: string): { result: string; error: string | null } {
  let out = "";
  let i = 0;
  while (i < input.length) {
    if (input[i] === "\\" && i + 1 < input.length) {
      const next = input[i + 1];
      switch (next) {
        case "\\":  out += "\\"; i += 2; break;
        case '"':   out += '"';  i += 2; break;
        case "n":   out += "\n"; i += 2; break;
        case "t":   out += "\t"; i += 2; break;
        case "r":   out += "\r"; i += 2; break;
        case "b":   out += "\b"; i += 2; break;
        case "f":   out += "\f"; i += 2; break;
        case "u": {
          const hex = input.slice(i + 2, i + 6);
          if (/^[0-9a-fA-F]{4}$/.test(hex)) {
            out += String.fromCharCode(parseInt(hex, 16));
            i += 6;
          } else {
            return { result: "", error: `Invalid Unicode escape at position ${i}: \\u${hex}` };
          }
          break;
        }
        default:
          return { result: "", error: `Unknown escape sequence at position ${i}: \\${next}` };
      }
    } else {
      out += input[i];
      i++;
    }
  }
  return { result: out, error: null };
}

// ─── JAVASCRIPT ────────────────────────────────────────────────────────────────

function escapeJavaScript(input: string): string {
  let out = "";
  for (const ch of input) {
    switch (ch) {
      case "\\":  out += "\\\\"; break;
      case '"':   out += '\\"';  break;
      case "'":   out += "\\'";  break;
      case "`":   out += "\\`";  break;
      case "\n":  out += "\\n";  break;
      case "\t":  out += "\\t";  break;
      case "\r":  out += "\\r";  break;
      case "\b":  out += "\\b";  break;
      case "\f":  out += "\\f";  break;
      default:    out += ch;     break;
    }
  }
  return out;
}

function unescapeJavaScript(input: string): { result: string; error: string | null } {
  let out = "";
  let i = 0;
  while (i < input.length) {
    if (input[i] === "\\" && i + 1 < input.length) {
      const next = input[i + 1];
      switch (next) {
        case "\\":  out += "\\"; i += 2; break;
        case '"':   out += '"';  i += 2; break;
        case "'":   out += "'";  i += 2; break;
        case "`":   out += "`";  i += 2; break;
        case "n":   out += "\n"; i += 2; break;
        case "t":   out += "\t"; i += 2; break;
        case "r":   out += "\r"; i += 2; break;
        case "b":   out += "\b"; i += 2; break;
        case "f":   out += "\f"; i += 2; break;
        case "u": {
          // Handle \u{XXXX} and \uXXXX
          if (input[i + 2] === "{") {
            const end = input.indexOf("}", i + 3);
            if (end === -1) return { result: "", error: `Unclosed \\u{ at position ${i}` };
            const hex = input.slice(i + 3, end);
            if (!/^[0-9a-fA-F]+$/.test(hex)) return { result: "", error: `Invalid hex in \\u{} at position ${i}` };
            out += String.fromCodePoint(parseInt(hex, 16));
            i = end + 1;
          } else {
            const hex = input.slice(i + 2, i + 6);
            if (/^[0-9a-fA-F]{4}$/.test(hex)) {
              out += String.fromCharCode(parseInt(hex, 16));
              i += 6;
            } else {
              return { result: "", error: `Invalid Unicode escape at position ${i}: \\u${hex}` };
            }
          }
          break;
        }
        case "x": {
          const hex = input.slice(i + 2, i + 4);
          if (/^[0-9a-fA-F]{2}$/.test(hex)) {
            out += String.fromCharCode(parseInt(hex, 16));
            i += 4;
          } else {
            return { result: "", error: `Invalid hex escape at position ${i}: \\x${hex}` };
          }
          break;
        }
        default:
          out += next;
          i += 2;
          break;
      }
    } else {
      out += input[i];
      i++;
    }
  }
  return { result: out, error: null };
}

// ─── HTML ──────────────────────────────────────────────────────────────────────

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function unescapeHtml(input: string): { result: string; error: string | null } {
  const result = input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&nbsp;/g, "\u00A0")
    .replace(/&[a-zA-Z]+;/g, (entity) => {
      // Leave unknown named entities as-is
      return entity;
    });
  return { result, error: null };
}

// ─── Component ─────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string }[] = [
  { id: "json", label: "JSON" },
  { id: "javascript", label: "JavaScript" },
  { id: "html", label: "HTML" },
];

export default function StringEscape() {
  const t = useTranslations("StringEscape");
  const [activeTab, setActiveTab] = useState<TabId>("json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEscape = () => {
    setError(null);
    if (activeTab === "json") {
      setOutput(escapeJson(input));
    } else if (activeTab === "javascript") {
      setOutput(escapeJavaScript(input));
    } else {
      setOutput(escapeHtml(input));
    }
  };

  const handleUnescape = () => {
    setError(null);
    let result: { result: string; error: string | null };
    if (activeTab === "json") {
      result = unescapeJson(input);
    } else if (activeTab === "javascript") {
      result = unescapeJavaScript(input);
    } else {
      result = unescapeHtml(input);
    }
    if (result.error) {
      setError(result.error);
      setOutput("");
    } else {
      setOutput(result.result);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setOutput("");
    setError(null);
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800 rounded-lg p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab description */}
      <div className="text-sm text-gray-500">
        {activeTab === "json" && t("jsonDesc")}
        {activeTab === "javascript" && t("jsDesc")}
        {activeTab === "html" && t("htmlDesc")}
      </div>

      {/* Textareas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-400">{t("input")}</label>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            rows={14}
            className="w-full bg-gray-900 border border-gray-600 text-white text-xs font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 resize-y"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-400">{t("output")}</label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="text-sm px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={14}
            placeholder={t("outputPlaceholder")}
            className="w-full bg-gray-900 border border-gray-700 text-white text-xs font-mono rounded-lg px-3 py-2.5 focus:outline-none resize-y text-gray-300"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg px-4 py-3">
          <p className="text-red-400 text-sm font-mono">{error}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleEscape}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t("escape")}
        </button>
        <button
          onClick={handleUnescape}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t("unescape")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium rounded-lg transition-colors"
        >
          {t("clear")}
        </button>
      </div>

      {/* Escape rules cheatsheet */}
      <div className="bg-gray-800/50 rounded-lg px-4 py-4 border border-gray-700">
        <p className="text-xs font-medium text-gray-400 mb-3">{t("cheatsheet")}</p>
        {activeTab === "json" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5">
            {[
              ["\\", "\\\\"],
              ['"', '\\"'],
              ["newline", "\\n"],
              ["tab", "\\t"],
              ["carriage return", "\\r"],
              ["backspace", "\\b"],
              ["form feed", "\\f"],
            ].map(([from, to]) => (
              <div key={from} className="flex items-center gap-2 text-xs">
                <code className="text-indigo-400 font-mono">{from}</code>
                <span className="text-gray-600">→</span>
                <code className="text-gray-300 font-mono">{to}</code>
              </div>
            ))}
          </div>
        )}
        {activeTab === "javascript" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5">
            {[
              ["\\", "\\\\"],
              ['"', '\\"'],
              ["'", "\\'"],
              ["`", "\\`"],
              ["newline", "\\n"],
              ["tab", "\\t"],
              ["carriage return", "\\r"],
              ["backspace", "\\b"],
              ["form feed", "\\f"],
            ].map(([from, to]) => (
              <div key={from} className="flex items-center gap-2 text-xs">
                <code className="text-indigo-400 font-mono">{from}</code>
                <span className="text-gray-600">→</span>
                <code className="text-gray-300 font-mono">{to}</code>
              </div>
            ))}
          </div>
        )}
        {activeTab === "html" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5">
            {[
              ["&", "&amp;"],
              ["<", "&lt;"],
              [">", "&gt;"],
              ['"', "&quot;"],
              ["'", "&#39;"],
            ].map(([from, to]) => (
              <div key={from} className="flex items-center gap-2 text-xs">
                <code className="text-indigo-400 font-mono">{from}</code>
                <span className="text-gray-600">→</span>
                <code className="text-gray-300 font-mono">{to}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
