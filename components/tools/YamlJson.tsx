"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import yaml from "js-yaml";

const SAMPLE_YAML = `name: Alice
age: 30
address:
  city: New York
  country: USA
hobbies:
  - reading
  - coding`;

const SAMPLE_JSON = `{
  "name": "Alice",
  "age": 30,
  "address": {
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "coding"]
}`;

type IndentSize = 2 | 4;

export default function YamlJson() {
  const t = useTranslations("YamlJson");
  const tc = useTranslations("Common");

  const [activeTab, setActiveTab] = useState<"yamlToJson" | "jsonToYaml">("yamlToJson");
  const [indent, setIndent] = useState<IndentSize>(2);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError("");
    setOutput("");
    if (!input.trim()) return;

    try {
      if (activeTab === "yamlToJson") {
        const parsed = yaml.load(input);
        setOutput(JSON.stringify(parsed, null, indent));
      } else {
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed));
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(
          activeTab === "yamlToJson"
            ? `${t("invalidYaml")}: ${err.message}`
            : `${t("invalidJson")}: ${err.message}`
        );
      } else {
        setError(activeTab === "yamlToJson" ? t("invalidYaml") : t("invalidJson"));
      }
    }
  };

  const handleLoadSample = () => {
    setError("");
    setOutput("");
    setInput(activeTab === "yamlToJson" ? SAMPLE_YAML : SAMPLE_JSON);
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

  const handleTabChange = (tab: "yamlToJson" | "jsonToYaml") => {
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
          onClick={() => handleTabChange("yamlToJson")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "yamlToJson"
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {t("yamlToJsonTab")}
        </button>
        <button
          onClick={() => handleTabChange("jsonToYaml")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "jsonToYaml"
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {t("jsonToYamlTab")}
        </button>
      </div>

      {/* Indent selector (YAML → JSON only) */}
      {activeTab === "yamlToJson" && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-300 shrink-0">{t("indentLabel")}</label>
          <div className="flex gap-2">
            {([2, 4] as IndentSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setIndent(size)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  indent === size
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
              >
                {size === 2 ? t("twoSpaces") : t("fourSpaces")}
              </button>
            ))}
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
          rows={14}
          spellCheck={false}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono resize-y"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2 font-mono">
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
          rows={14}
          spellCheck={false}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono resize-y"
        />
      </div>
    </div>
  );
}
