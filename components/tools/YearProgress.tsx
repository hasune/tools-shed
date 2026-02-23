"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

function getProgress(start: Date, end: Date, now: Date) {
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function getDaysInYear(year: number): number {
  return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
}

function getWeekNumber(d: Date): number {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  );
}

interface ProgressBarProps {
  percent: number;
  color: string;
}

function ProgressBar({ percent, color }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
      <div
        className={`h-4 rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export default function YearProgress() {
  const t = useTranslations("YearProgress");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const year = now.getFullYear();
  const month = now.getMonth();

  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year + 1, 0, 1);
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);
  const dayStart = new Date(year, month, now.getDate());
  const dayEnd = new Date(year, month, now.getDate() + 1);

  const yearPct = getProgress(yearStart, yearEnd, now);
  const monthPct = getProgress(monthStart, monthEnd, now);
  const dayPct = getProgress(dayStart, dayEnd, now);

  const dayOfYear = getDayOfYear(now);
  const totalDays = getDaysInYear(year);
  const daysRemaining = totalDays - dayOfYear;
  const weekNum = getWeekNumber(now);
  const weeksRemaining = 52 - weekNum;

  const monthName = now.toLocaleString("en-US", { month: "long" });

  return (
    <div className="space-y-6">
      <p className="text-xs text-gray-500 text-right">{t("liveUpdate")}</p>

      {/* Year */}
      <div className="bg-gray-900 rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-baseline">
          <h2 className="text-lg font-semibold text-white">{t("yearProgress")} — {year}</h2>
          <span className="text-2xl font-bold text-indigo-400">{yearPct.toFixed(4)}%</span>
        </div>
        <ProgressBar percent={yearPct} color="bg-indigo-500" />
        <div className="flex justify-between text-sm text-gray-400">
          <span>{t("daysElapsed", { days: dayOfYear })}</span>
          <span>{t("daysRemaining", { days: daysRemaining })}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{t("currentDay", { day: dayOfYear, total: totalDays })}</span>
          <span>{t("currentWeek", { week: weekNum })}</span>
        </div>
        <div className="text-xs text-gray-500 text-right">
          {t("weeksRemaining", { weeks: weeksRemaining })}
        </div>
      </div>

      {/* Month */}
      <div className="bg-gray-900 rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-baseline">
          <h2 className="text-lg font-semibold text-white">{t("monthProgress")} — {monthName}</h2>
          <span className="text-2xl font-bold text-emerald-400">{monthPct.toFixed(4)}%</span>
        </div>
        <ProgressBar percent={monthPct} color="bg-emerald-500" />
        <div className="flex justify-between text-sm text-gray-400">
          <span>{t("elapsed")}: {now.getDate() - 1}d {now.getHours()}h</span>
          <span>
            {t("remaining")}: {new Date(monthEnd.getTime() - now.getTime()).getDate() - 1}d
          </span>
        </div>
      </div>

      {/* Day */}
      <div className="bg-gray-900 rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-baseline">
          <h2 className="text-lg font-semibold text-white">
            {t("dayProgress")} — {now.toLocaleDateString("en-US", { weekday: "long" })}
          </h2>
          <span className="text-2xl font-bold text-amber-400">{dayPct.toFixed(4)}%</span>
        </div>
        <ProgressBar percent={dayPct} color="bg-amber-500" />
        <div className="flex justify-between text-sm text-gray-400">
          <span>
            {t("elapsed")}: {now.getHours()}h {now.getMinutes()}m {now.getSeconds()}s
          </span>
          <span>
            {t("remaining")}: {23 - now.getHours()}h {59 - now.getMinutes()}m{" "}
            {59 - now.getSeconds()}s
          </span>
        </div>
      </div>

      {/* Current time */}
      <div className="text-center text-gray-500 text-sm">
        {now.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>
    </div>
  );
}
