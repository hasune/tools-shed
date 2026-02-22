"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Mode = "add" | "subtract";

function parseHMS(timeStr: string): { h: number; m: number; s: number } | null {
  const parts = timeStr.split(":").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return { h: parts[0], m: parts[1], s: parts[2] };
}

function toTotalSeconds(h: number, m: number, s: number): number {
  return h * 3600 + m * 60 + s;
}

function fromTotalSeconds(totalSecs: number): { h: number; m: number; s: number } {
  const abs = Math.max(0, totalSecs);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  return { h, m, s };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function TimeDuration() {
  const t = useTranslations("TimeDuration");

  const [mode, setMode] = useState<Mode>("add");
  const [baseTime, setBaseTime] = useState("00:00:00");
  const [durationH, setDurationH] = useState("0");
  const [durationM, setDurationM] = useState("0");
  const [durationS, setDurationS] = useState("0");
  const [result, setResult] = useState<{ display: string; totalSeconds: number } | null>(null);

  const calculate = () => {
    const base = parseHMS(baseTime);
    if (!base) return;

    const h = parseInt(durationH) || 0;
    const m = parseInt(durationM) || 0;
    const s = parseInt(durationS) || 0;

    const baseSecs = toTotalSeconds(base.h, base.m, base.s);
    const durSecs = toTotalSeconds(h, m, s);

    const totalSecs = mode === "add" ? baseSecs + durSecs : baseSecs - durSecs;
    const clamped = Math.max(0, totalSecs);
    const { h: rh, m: rm, s: rs } = fromTotalSeconds(clamped);

    setResult({ display: `${pad(rh)}:${pad(rm)}:${pad(rs)}`, totalSeconds: clamped });
  };

  const handleClear = () => {
    setBaseTime("00:00:00");
    setDurationH("0");
    setDurationM("0");
    setDurationS("0");
    setResult(null);
  };

  return (
    <div className="space-y-5">
      {/* Mode Toggle */}
      <div className="flex gap-1 p-1 bg-gray-900 rounded-lg w-fit border border-gray-700">
        {(["add", "subtract"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(null); }}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === m ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {t(m === "add" ? "addTab" : "subtractTab")}
          </button>
        ))}
      </div>

      {/* Base Time */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">{t("baseTimeLabel")}</label>
        <input
          type="text"
          value={baseTime}
          onChange={(e) => setBaseTime(e.target.value)}
          placeholder="HH:MM:SS"
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600 font-mono"
        />
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{t("durationLabel")}</label>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">{t("hoursLabel")}</label>
            <input
              type="number"
              min={0}
              value={durationH}
              onChange={(e) => setDurationH(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">{t("minutesLabel")}</label>
            <input
              type="number"
              min={0}
              max={59}
              value={durationM}
              onChange={(e) => setDurationM(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">{t("secondsLabel")}</label>
            <input
              type="number"
              min={0}
              max={59}
              value={durationS}
              onChange={(e) => setDurationS(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {t("calculateButton")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center space-y-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider">{t("resultLabel")}</div>
          <div className="text-6xl font-bold text-indigo-400 font-mono tracking-wider">
            {result.display}
          </div>
          <div className="text-sm text-gray-500">
            {t("totalSeconds")}: <span className="text-gray-300 font-mono">{result.totalSeconds.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
