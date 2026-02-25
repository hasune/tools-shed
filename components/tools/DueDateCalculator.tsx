"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function DueDateCalculator() {
  const t = useTranslations("DueDateCalculator");
  const [lmp, setLmp] = useState("");
  const [result, setResult] = useState<{
    dueDate: Date;
    gestWeeks: number;
    gestDays: number;
    trimester: number;
    milestones: { label: string; date: Date }[];
  } | null>(null);

  const addDays = (date: Date, days: number): Date => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  const formatDate = (date: Date): string =>
    date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const calculate = () => {
    if (!lmp) return;
    const lmpDate = new Date(lmp + "T00:00:00");
    const dueDate = addDays(lmpDate, 280);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffMs = today.getTime() - lmpDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const gestWeeks = Math.floor(totalDays / 7);
    const gestDays = totalDays % 7;
    let trimester = 1;
    if (gestWeeks >= 28) trimester = 3;
    else if (gestWeeks >= 13) trimester = 2;
    const milestones = [
      { label: t("milestone8w"), date: addDays(lmpDate, 56) },
      { label: t("milestone12w"), date: addDays(lmpDate, 84) },
      { label: t("milestone20w"), date: addDays(lmpDate, 140) },
      { label: t("milestone28w"), date: addDays(lmpDate, 196) },
      { label: t("milestone37w"), date: addDays(lmpDate, 259) },
      { label: t("milestone40w"), date: addDays(lmpDate, 280) },
    ];
    setResult({ dueDate, gestWeeks, gestDays, trimester, milestones });
  };

  const clear = () => {
    setLmp("");
    setResult(null);
  };

  const trimesterLabel = result
    ? result.trimester === 1
      ? t("first")
      : result.trimester === 2
      ? t("second")
      : t("third")
    : "";

  const gestAgeStr = result
    ? result.gestDays === 0
      ? t("weeks", { weeks: result.gestWeeks })
      : t("weeksAndDays", { weeks: result.gestWeeks, days: result.gestDays })
    : "";

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t("lmpLabel")}
          </label>
          <input
            type="date"
            value={lmp}
            onChange={(e) => setLmp(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={calculate}
            disabled={!lmp}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t("calculateButton")}
          </button>
          <button
            onClick={clear}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t("clearButton")}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-900 border border-indigo-500/40 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{t("dueDateLabel")}</p>
              <p className="text-lg font-bold text-indigo-400">{formatDate(result.dueDate)}</p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{t("gestationalAgeLabel")}</p>
              <p className="text-lg font-bold text-white">{gestAgeStr}</p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{t("trimesterLabel")}</p>
              <p className="text-lg font-bold text-white">{trimesterLabel}</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">{t("milestonesTitle")}</h3>
            <div className="space-y-2">
              {result.milestones.map((m, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0"
                >
                  <span className="text-sm text-gray-400">{m.label}</span>
                  <span className="text-sm font-medium text-white">{formatDate(m.date)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
