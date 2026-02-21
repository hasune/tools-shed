"use client";

import { useState, useCallback } from "react";

function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([generateUuidV4()]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = useCallback(() => {
    const newUuids = Array.from({ length: count }, () => {
      let uuid = generateUuidV4();
      if (!hyphens) uuid = uuid.replace(/-/g, "");
      if (uppercase) uuid = uuid.toUpperCase();
      return uuid;
    });
    setUuids(newUuids);
  }, [count, uppercase, hyphens]);

  const copyOne = (uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n")).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm">Count:</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            {[1, 5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4 rounded accent-indigo-500"
          />
          <span className="text-gray-400 text-sm">Uppercase</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hyphens}
            onChange={(e) => setHyphens(e.target.checked)}
            className="w-4 h-4 rounded accent-indigo-500"
          />
          <span className="text-gray-400 text-sm">Include hyphens</span>
        </label>
      </div>

      {/* Generate Button */}
      <button
        onClick={generate}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors text-lg"
      >
        Generate UUID{count > 1 ? "s" : ""}
      </button>

      {/* Results */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{uuids.length} UUID{uuids.length > 1 ? "s" : ""} generated</span>
          {uuids.length > 1 && (
            <button
              onClick={copyAll}
              className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {copiedAll ? "Copied all!" : "Copy all"}
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {uuids.map((uuid, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 group"
            >
              <code className="text-indigo-300 text-sm font-mono break-all">{uuid}</code>
              <button
                onClick={() => copyOne(uuid, i)}
                className="ml-3 text-xs px-2 py-1 bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white rounded transition-colors flex-shrink-0"
              >
                {copiedIndex === i ? "✓" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-gray-400">
        <p>UUIDs are generated using <code className="text-indigo-400">crypto.randomUUID()</code> (v4) — cryptographically random, generated entirely in your browser.</p>
      </div>
    </div>
  );
}
