"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";

interface Lap { index: number; split: number; total: number; }

function formatTime(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");
  return h > 0
    ? `${pad(h)}:${pad(m)}:${pad(s)}.${pad(cs)}`
    : `${pad(m)}:${pad(s)}.${pad(cs)}`;
}

export default function Stopwatch() {
  const t = useTranslations("Stopwatch");
  const [display, setDisplay] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);

  // Use refs to avoid stale closures
  const startTimeRef = useRef<number>(0);   // performance.now() when started
  const accumulatedRef = useRef<number>(0); // ms accumulated before this run segment
  const rafRef = useRef<number>(0);

  const getElapsed = useCallback(() => {
    if (!running) return accumulatedRef.current;
    return accumulatedRef.current + (performance.now() - startTimeRef.current);
  }, [running]);

  useEffect(() => {
    if (!running) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = () => {
      setDisplay(accumulatedRef.current + (performance.now() - startTimeRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  const handleStart = () => {
    startTimeRef.current = performance.now();
    setRunning(true);
  };

  const handleStop = () => {
    accumulatedRef.current += performance.now() - startTimeRef.current;
    setRunning(false);
    setDisplay(accumulatedRef.current);
  };

  const handleLap = () => {
    const total = getElapsed();
    const lastTotal = laps[0]?.total ?? 0;
    setLaps(prev => [{ index: prev.length + 1, split: total - lastTotal, total }, ...prev]);
  };

  const handleReset = () => {
    cancelAnimationFrame(rafRef.current);
    setRunning(false);
    accumulatedRef.current = 0;
    setDisplay(0);
    setLaps([]);
  };

  const fastestLap = laps.length > 1 ? Math.min(...laps.map(l => l.split)) : null;
  const slowestLap = laps.length > 1 ? Math.max(...laps.map(l => l.split)) : null;

  return (
    <div className="space-y-6">
      {/* Main display */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
        <div className="text-6xl font-mono font-bold text-white tracking-tight">
          {formatTime(display)}
        </div>
        <p className="text-xs text-gray-500 mt-2">{t("backgroundNote")}</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {!running ? (
          <button onClick={handleStart}
            className="col-span-2 sm:col-span-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors text-lg">
            {t("startButton")}
          </button>
        ) : (
          <button onClick={handleStop}
            className="col-span-2 sm:col-span-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors text-lg">
            {t("stopButton")}
          </button>
        )}
        <button onClick={handleLap} disabled={!running}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors">
          {t("lapButton")}
        </button>
        <button onClick={handleReset} disabled={running}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors">
          {t("resetButton")}
        </button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-700 text-sm font-medium text-gray-300">{t("lapsTitle")}</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-xs">
                <th className="px-4 py-2 text-left">{t("colLap")}</th>
                <th className="px-4 py-2 text-right">{t("colSplit")}</th>
                <th className="px-4 py-2 text-right">{t("colTotal")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {laps.map(lap => {
                const isFastest = fastestLap !== null && lap.split === fastestLap;
                const isSlowest = slowestLap !== null && lap.split === slowestLap;
                return (
                  <tr key={lap.index} className="hover:bg-gray-700/50">
                    <td className="px-4 py-2 text-gray-400">#{lap.index}</td>
                    <td className={`px-4 py-2 text-right font-mono ${isFastest ? "text-green-400" : isSlowest ? "text-red-400" : "text-white"}`}>
                      {formatTime(lap.split)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-gray-400">{formatTime(lap.total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {laps.length === 0 && display === 0 && (
        <p className="text-center text-gray-500 text-sm">{t("noLaps")}</p>
      )}
    </div>
  );
}
