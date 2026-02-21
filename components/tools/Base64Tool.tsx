"use client";

import { useState } from "react";

export default function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const process = () => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      if (mode === "encode") {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
        setError("");
      } else {
        const decoded = decodeURIComponent(escape(atob(input.trim())));
        setOutput(decoded);
        setError("");
      }
    } catch {
      setError(mode === "decode" ? "Invalid Base64 string." : "Encoding failed.");
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

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-1 p-1 bg-gray-900 rounded-lg w-fit">
        {(["encode", "decode"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(""); setError(""); }}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              mode === m
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          {mode === "encode" ? "Text to encode" : "Base64 to decode"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
          className="w-full h-36 bg-gray-900 border border-gray-600 text-gray-100 text-sm font-mono rounded-lg p-3 resize-none focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          spellCheck={false}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={process}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors capitalize"
        >
          {mode}
        </button>
        {output && (
          <button
            onClick={swap}
            className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            title="Swap input/output and switch mode"
          >
            ⇄
          </button>
        )}
        <button
          onClick={clear}
          className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {(output || error) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Result</label>
            {output && (
              <button
                onClick={copy}
                className="text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          {error ? (
            <div className="bg-red-950/30 border border-red-800 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 min-h-20">
              <pre className="text-sm font-mono text-gray-100 whitespace-pre-wrap break-all">{output}</pre>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-gray-400">
        <p>Supports Unicode text. Encoding/decoding happens entirely in your browser — no data is sent to any server.</p>
      </div>
    </div>
  );
}
