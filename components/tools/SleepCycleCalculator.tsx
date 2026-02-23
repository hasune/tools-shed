"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

const CYCLE_MINUTES = 90;
const FALL_ASLEEP_MINUTES = 14;
const CYCLES = [5, 6, 4, 3]; // ordered by preference

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function toHM(minutes: number): { h: number; m: number } {
  return { h: Math.floor(minutes / 60), m: minutes % 60 };
}

interface SleepResult {
  cycles: number;
  time: Date;
  recommended: boolean;
}

export default function SleepCycleCalculator() {
  const t = useTranslations("SleepCycleCalculator");

  const [mode, setMode] = useState<"wakeUp" | "bedtime">("wakeUp");
  const [timeInput, setTimeInput] = useState("07:00");
  const [results, setResults] = useState<SleepResult[]>([]);

  const handleCalculate = () => {
    const [h, m] = timeInput.split(":").map(Number);
    const base = new Date();
    base.setHours(h, m, 0, 0);

    const res: SleepResult[] = [];

    if (mode === "wakeUp") {
      // calculate bedtimes (subtract sleep cycles + fall asleep time)
      for (let c = 6; c >= 3; c--) {
        const totalMin = c * CYCLE_MINUTES + FALL_ASLEEP_MINUTES;
        const bedtime = new Date(base.getTime() - totalMin * 60000);
        res.push({ cycles: c, time: bedtime, recommended: c === 5 || c === 6 });
      }
    } else {
      // calculate wake-up times (add sleep cycles, skip fall asleep time start)
      for (let c = 3; c <= 6; c++) {
        const totalMin = c * CYCLE_MINUTES + FALL_ASLEEP_MINUTES;
        const wakeUp = new Date(base.getTime() + totalMin * 60000);
        res.push({ cycles: c, time: wakeUp, recommended: c === 5 || c === 6 });
      }
    }

    setResults(res);
  };

  return (
    <div className="space-y-5">
      {/* Mode selector */}
      <div className="flex gap-2">
        {(["wakeUp", "bedtime"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setResults([]); }}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {t(`mode${m.charAt(0).toUpperCase() + m.slice(1)}` as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>

      {/* Time input */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          {mode === "wakeUp" ? t("wakeUpLabel") : t("bedtimeLabel")}
        </label>
        <input
          type="time"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-medium transition-colors"
      >
        {t("calculateButton")}
      </button>

      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">
            {mode === "wakeUp" ? t("resultsBedtimeLabel") : t("resultsWakeUpLabel")}
          </p>
          {results.map((r) => {
            const { h, m } = toHM(r.cycles * CYCLE_MINUTES);
            return (
              <div
                key={r.cycles}
                className={`flex items-center justify-between rounded-xl p-3 border ${
                  r.recommended
                    ? "bg-indigo-950 border-indigo-700"
                    : "bg-gray-900 border-gray-700"
                }`}
              >
                <div>
                  <span className="text-2xl font-mono font-bold text-white">
                    {formatTime(r.time)}
                  </span>
                  {r.recommended && (
                    <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                      {t("recommendedLabel")}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-400 text-right">
                  {t("cyclesLabel", { n: r.cycles, h, m })}
                </span>
              </div>
            );
          })}
          <p className="text-xs text-gray-600 pt-1">* {t("fallAsleepNote")}</p>
          <p className="text-xs text-indigo-400/70">{t("tipLabel")}</p>
        </div>
      )}
    </div>
  );
}
