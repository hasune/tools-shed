"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function UrlEncoderDecoder() {
  const t = useTranslations("UrlEncoderDecoder");
  const tCommon = useTranslations("Common");

  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [encodeType, setEncodeType] = useState<"component" | "full">("component");

  const process = () => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      if (mode === "encode") {
        const result =
          encodeType === "component"
            ? encodeURIComponent(input)
            : encodeURI(input);
        setOutput(result);
        setError("");
      } else {
        const result = decodeURIComponent(input.replace(/\+/g, " "));
        setOutput(result);
        setError("");
      }
    } catch {
      setError("Invalid URL encoding.");
      setOutput("");
    }
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setError("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const loadSample = () => {
    if (mode === "encode") {
      setInput("Hello World! This has special chars: &, =, ?, #, /");
    } else {
      setInput("Hello%20World%21%20This%20has%20special%20chars%3A%20%26%2C%20%3D%2C%20%3F%2C%20%23%2C%20%2F");
    }
    setOutput("");
    setError("");
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-1 p-1 bg-gray-900 rounded-lg">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(""); setError(""); }}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                mode === m ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {m === "encode" ? t("encodeTab") : t("decodeTab")}
            </button>
          ))}
        </div>

        {mode === "encode" && (
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">{t("typeLabel")}</label>
            <select
              value={encodeType}
              onChange={(e) => setEncodeType(e.target.value as "component" | "full")}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="component">encodeURIComponent (recommended)</option>
              <option value="full">encodeURI (full URL)</option>
            </select>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            {mode === "encode" ? t("encodeInputLabel") : t("decodeInputLabel")}
          </label>
          <button
            onClick={loadSample}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {t("loadSample")}
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? t("encodePlaceholder") : t("decodePlaceholder")}
          className="w-full h-32 bg-gray-900 border border-gray-600 text-gray-100 text-sm font-mono rounded-lg p-3 resize-none focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          spellCheck={false}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={process}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors capitalize"
        >
          {mode === "encode" ? t("encodeButton") : t("decodeButton")}
        </button>
        {output && (
          <button onClick={swap} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors" title={t("swapTitle")}>
            ⇄
          </button>
        )}
        <button onClick={clear} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {tCommon("clear")}
        </button>
      </div>

      {/* Output */}
      {(output || error) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">{t("resultLabel")}</label>
            {output && (
              <button
                onClick={copy}
                className="text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
              >
                {copied ? tCommon("copied") : tCommon("copy")}
              </button>
            )}
          </div>
          {error ? (
            <div className="bg-red-950/30 border border-red-800 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 min-h-16">
              <pre className="text-sm font-mono text-gray-100 whitespace-pre-wrap break-all">{output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
