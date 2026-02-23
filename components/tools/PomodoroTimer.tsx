"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef, useCallback } from "react";

type Mode = "focus" | "shortBreak" | "longBreak";

const DEFAULT_DURATIONS: Record<Mode, number> = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
};

export default function PomodoroTimer() {
  const t = useTranslations("PomodoroTimer");

  const [mode, setMode] = useState<Mode>("focus");
  const [durations, setDurations] = useState(DEFAULT_DURATIONS);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_DURATIONS.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const switchMode = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      setSecondsLeft(durations[newMode] * 60);
      setIsRunning(false);
      setStatusMsg("");
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [durations]
  );

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          if (mode === "focus") {
            setSessions((s) => s + 1);
            setStatusMsg(t("sessionCompleteLabel"));
          } else {
            setStatusMsg(t("breakCompleteLabel"));
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, mode, t]);

  const totalSeconds = durations[mode] * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const modeColors: Record<Mode, string> = {
    focus: "text-red-400",
    shortBreak: "text-green-400",
    longBreak: "text-blue-400",
  };

  const progressColors: Record<Mode, string> = {
    focus: "#f87171",
    shortBreak: "#4ade80",
    longBreak: "#60a5fa",
  };

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex gap-2 justify-center">
        {(["focus", "shortBreak", "longBreak"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {t(`${m}Label`)}
          </button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#1f2937" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={progressColors[mode]}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <span
            className={`absolute inset-0 flex items-center justify-center text-3xl font-mono font-bold ${modeColors[mode]}`}
          >
            {display}
          </span>
        </div>

        {statusMsg && (
          <p className="text-sm text-indigo-300 animate-pulse">{statusMsg}</p>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsRunning((r) => !r)}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
          >
            {isRunning ? t("pauseButton") : t("startButton")}
          </button>
          <button
            onClick={() => switchMode(mode)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
          >
            {t("resetButton")}
          </button>
        </div>

        {/* Session counter */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">{t("sessionsLabel")}:</span>
          <div className="flex gap-1">
            {Array.from({ length: Math.max(sessions, 4) }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${i < sessions ? "bg-indigo-500" : "bg-gray-700"}`}
              />
            ))}
          </div>
          <span className="text-gray-300 text-sm font-medium">{sessions}</span>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-medium text-gray-400 mb-3">{t("settingsLabel")}</h3>
        <div className="grid grid-cols-3 gap-3">
          {(["focus", "shortBreak", "longBreak"] as Mode[]).map((m) => (
            <div key={m}>
              <label className="block text-xs text-gray-500 mb-1">
                {t(`${m}DurationLabel`)}
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={durations[m]}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(60, Number(e.target.value)));
                  setDurations((d) => ({ ...d, [m]: val }));
                  if (mode === m) setSecondsLeft(val * 60);
                }}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
