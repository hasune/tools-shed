"use client";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";

interface Row {
  id: number;
  start: string;
  end: string;
  breakMin: number;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToHHMM(mins: number): string {
  const h = Math.floor(Math.abs(mins) / 60);
  const m = Math.abs(mins) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

let nextId = 1;

export default function WorkingHoursCalculator() {
  const t = useTranslations("WorkingHoursCalculator");

  const [rows, setRows] = useState<Row[]>([
    { id: nextId++, start: "09:00", end: "18:00", breakMin: 60 },
    { id: nextId++, start: "09:00", end: "18:00", breakMin: 60 },
    { id: nextId++, start: "09:00", end: "18:00", breakMin: 60 },
    { id: nextId++, start: "09:00", end: "18:00", breakMin: 60 },
    { id: nextId++, start: "09:00", end: "18:00", breakMin: 60 },
  ]);

  const addRow = () =>
    setRows((r) => [...r, { id: nextId++, start: "09:00", end: "18:00", breakMin: 60 }]);

  const removeRow = (id: number) =>
    setRows((r) => r.filter((row) => row.id !== id));

  const update = (id: number, field: keyof Row, value: string | number) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, [field]: value } : row)));

  const results = useMemo(() => {
    return rows.map((row) => {
      if (!row.start || !row.end) return null;
      const start = timeToMinutes(row.start);
      let end = timeToMinutes(row.end);
      if (end <= start) end += 24 * 60; // overnight shift
      const worked = end - start - row.breakMin;
      return Math.max(0, worked);
    });
  }, [rows]);

  const totalMinutes = results.reduce((s: number, v) => s + (v ?? 0), 0);
  const overtimeMinutes = results.reduce(
    (s: number, v) => s + Math.max(0, (v ?? 0) - 8 * 60),
    0
  );

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-left">
              <th className="pb-2 pr-3 font-medium w-8">#</th>
              <th className="pb-2 pr-3 font-medium">{t("startTimeLabel")}</th>
              <th className="pb-2 pr-3 font-medium">{t("endTimeLabel")}</th>
              <th className="pb-2 pr-3 font-medium">{t("breakLabel")}</th>
              <th className="pb-2 pr-3 font-medium">{t("hoursLabel")}</th>
              <th className="pb-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const mins = results[i];
              return (
                <tr key={row.id} className="border-t border-gray-800">
                  <td className="py-2 pr-3 text-gray-500">{i + 1}</td>
                  <td className="py-2 pr-3">
                    <input
                      type="time"
                      value={row.start}
                      onChange={(e) => update(row.id, "start", e.target.value)}
                      className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="time"
                      value={row.end}
                      onChange={(e) => update(row.id, "end", e.target.value)}
                      className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="number"
                      min={0}
                      max={480}
                      value={row.breakMin}
                      onChange={(e) =>
                        update(row.id, "breakMin", Math.max(0, Number(e.target.value)))
                      }
                      className="w-20 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    {mins !== null ? (
                      <span
                        className={`font-mono font-medium ${
                          mins > 8 * 60
                            ? "text-orange-400"
                            : mins > 0
                            ? "text-green-400"
                            : "text-gray-500"
                        }`}
                      >
                        {minutesToHHMM(mins)}
                      </span>
                    ) : (
                      <span className="text-gray-600">--:--</span>
                    )}
                  </td>
                  <td className="py-2">
                    {rows.length > 1 && (
                      <button
                        onClick={() => removeRow(row.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors text-lg leading-none"
                        aria-label={t("removeButton")}
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        + {t("addRowButton")}
      </button>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-xs text-gray-500 mb-1">{t("weeklyTotalLabel")}</p>
          <p className="text-2xl font-mono font-bold text-white">
            {minutesToHHMM(totalMinutes)}
          </p>
        </div>
        <div
          className={`bg-gray-900 rounded-xl p-4 border text-center ${
            overtimeMinutes > 0 ? "border-orange-700" : "border-gray-700"
          }`}
        >
          <p className="text-xs text-gray-500 mb-1">{t("overtimeLabel")}</p>
          <p
            className={`text-2xl font-mono font-bold ${
              overtimeMinutes > 0 ? "text-orange-400" : "text-gray-600"
            }`}
          >
            {minutesToHHMM(overtimeMinutes)}
          </p>
        </div>
      </div>
    </div>
  );
}
