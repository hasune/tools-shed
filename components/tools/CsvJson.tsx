"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const SAMPLE_CSV = `name,age,city
Alice,30,New York
Bob,25,London
Charlie,35,Tokyo`;

const SAMPLE_JSON = `[{"name":"Alice","age":30,"city":"New York"},{"name":"Bob","age":25,"city":"London"},{"name":"Charlie","age":35,"city":"Tokyo"}]`;

type Delimiter = "," | ";" | "\t";

function parseCsvToJson(csv: string, delimiter: Delimiter, firstRowHeader: boolean): object[] {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) return [];

  if (firstRowHeader) {
    const headers = lines[0].split(delimiter).map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(delimiter);
      const obj: Record<string, string> = {};
      headers.forEach((header, i) => {
        obj[header] = (values[i] ?? "").trim();
      });
      return obj;
    });
  } else {
    return lines.map((line) => {
      return line.split(delimiter).map((v) => v.trim());
    });
  }
}

function parseJsonToCsv(json: string): string {
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed) || parsed.length === 0) return "";
  const headers = Object.keys(parsed[0]);
  const rows = parsed.map((obj: Record<string, unknown>) =>
    headers.map((h) => {
      const val = obj[h];
      const str = val === null || val === undefined ? "" : String(val);
      return str.includes(",") || str.includes('"') || str.includes("\n")
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export default function CsvJson() {
  const t = useTranslations("CsvJson");
  const tc = useTranslations("Common");

  const [activeTab, setActiveTab] = useState<"csvToJson" | "jsonToCsv">("csvToJson");
  const [delimiter, setDelimiter] = useState<Delimiter>(",");
  const [firstRowHeader, setFirstRowHeader] = useState(true);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError("");
    setOutput("");
    if (!input.trim()) return;

    try {
      if (activeTab === "csvToJson") {
        const result = parseCsvToJson(input, delimiter, firstRowHeader);
        setOutput(JSON.stringify(result, null, 2));
      } else {
        const result = parseJsonToCsv(input);
        setOutput(result);
      }
    } catch {
      setError(activeTab === "csvToJson" ? t("invalidCsv") : t("invalidJson"));
    }
  };

  const handleLoadSample = () => {
    setError("");
    setOutput("");
    if (activeTab === "csvToJson") {
      setInput(SAMPLE_CSV);
    } else {
      setInput(SAMPLE_JSON);
    }
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
    setError("");
  };

  const handleTabChange = (tab: "csvToJson" | "jsonToCsv") => {
    setActiveTab(tab);
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => handleTabChange("csvToJson")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "csvToJson"
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {t("csvToJsonTab")}
        </button>
        <button
          onClick={() => handleTabChange("jsonToCsv")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "jsonToCsv"
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {t("jsonToCsvTab")}
        </button>
      </div>

      {/* Options (CSV → JSON only) */}
      {activeTab === "csvToJson" && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-wrap gap-6 items-center">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">{t("delimiterLabel")}</label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as Delimiter)}
              className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value=",">{t("comma")}</option>
              <option value=";">{t("semicolon")}</option>
              <option value={"\t"}>{t("tab")}</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input
              id="first-row-header"
              type="checkbox"
              checked={firstRowHeader}
              onChange={(e) => setFirstRowHeader(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900"
            />
            <label htmlFor="first-row-header" className="text-sm font-medium text-gray-300 cursor-pointer">
              {t("firstRowHeader")}
            </label>
          </div>
        </div>
      )}

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
          rows={12}
          spellCheck={false}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono resize-y"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleConvert}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {t("convertButton")}
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
          rows={12}
          spellCheck={false}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono resize-y"
        />
      </div>
    </div>
  );
}
