"use client";

import { useState, useCallback } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input]);

  const copy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const loadSample = () => {
    setInput(JSON.stringify({
      name: "ToolsShed",
      version: "1.0",
      tools: ["JSON Formatter", "UUID Generator", "Base64"],
      settings: { theme: "dark", indent: 2 },
    }));
    setError("");
    setOutput("");
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm">Indent:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 space</option>
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={loadSample}
            className="text-sm px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
          >
            Sample
          </button>
          <button
            onClick={clear}
            className="text-sm px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here...\n\n{"key": "value"}'
            className="w-full h-72 bg-gray-900 border border-gray-600 text-gray-100 text-sm font-mono rounded-lg p-3 resize-none focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Output</label>
            {output && (
              <button
                onClick={copy}
                className="text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <div className="relative h-72">
            {error ? (
              <div className="h-full bg-red-950/30 border border-red-800 rounded-lg p-3 overflow-auto">
                <p className="text-red-400 text-sm font-mono">{error}</p>
              </div>
            ) : (
              <pre className="h-full bg-gray-900 border border-gray-600 rounded-lg p-3 overflow-auto text-sm font-mono text-gray-100">
                {output || <span className="text-gray-600">Formatted JSON will appear here...</span>}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={format}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          Format / Validate
        </button>
        <button
          onClick={minify}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          Minify
        </button>
      </div>

      {/* Validation Status */}
      {input && !error && output && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Valid JSON
        </div>
      )}
    </div>
  );
}
