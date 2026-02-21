"use client";

import { useState } from "react";

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

function toSnakeCase(str: string): string {
  return str
    .replace(/\s+/g, "_")
    .replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`)
    .replace(/^_/, "")
    .toLowerCase();
}

function toKebabCase(str: string): string {
  return str
    .replace(/\s+/g, "-")
    .replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`)
    .replace(/^-/, "")
    .toLowerCase();
}

const CASES = [
  { label: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
  { label: "lowercase", fn: (s: string) => s.toLowerCase() },
  { label: "Title Case", fn: toTitleCase },
  { label: "Sentence case", fn: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
  { label: "camelCase", fn: toCamelCase },
  { label: "snake_case", fn: toSnakeCase },
  { label: "kebab-case", fn: toKebabCase },
  { label: "aLtErNaTiNg", fn: (s: string) => s.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("") },
];

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Input text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to convert..."
          className="w-full h-28 bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-lg p-3 resize-none focus:outline-none focus:border-indigo-500 placeholder-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CASES.map(({ label, fn }) => {
          const result = input ? fn(input) : "";
          return (
            <div key={label} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-400">{label}</span>
                {result && (
                  <button
                    onClick={() => copy(result, label)}
                    className="text-xs px-2 py-0.5 bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white rounded transition-colors"
                  >
                    {copied === label ? "✓" : "Copy"}
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-300 font-mono break-words min-h-5">
                {result || <span className="text-gray-600">Result will appear here...</span>}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
