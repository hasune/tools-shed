"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

const TIMEZONES = [
  { label: "UTC", tz: "UTC" },
  { label: "New York (ET)", tz: "America/New_York" },
  { label: "Los Angeles (PT)", tz: "America/Los_Angeles" },
  { label: "Chicago (CT)", tz: "America/Chicago" },
  { label: "São Paulo (BRT)", tz: "America/Sao_Paulo" },
  { label: "London (GMT/BST)", tz: "Europe/London" },
  { label: "Paris (CET/CEST)", tz: "Europe/Paris" },
  { label: "Berlin (CET/CEST)", tz: "Europe/Berlin" },
  { label: "Moscow (MSK)", tz: "Europe/Moscow" },
  { label: "Dubai (GST)", tz: "Asia/Dubai" },
  { label: "Mumbai (IST)", tz: "Asia/Kolkata" },
  { label: "Bangkok (ICT)", tz: "Asia/Bangkok" },
  { label: "Singapore (SGT)", tz: "Asia/Singapore" },
  { label: "Shanghai (CST)", tz: "Asia/Shanghai" },
  { label: "Seoul (KST)", tz: "Asia/Seoul" },
  { label: "Tokyo (JST)", tz: "Asia/Tokyo" },
  { label: "Sydney (AEST)", tz: "Australia/Sydney" },
  { label: "Auckland (NZST)", tz: "Pacific/Auckland" },
];

function getLocalTz(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

function formatTime(date: Date, tz: string): string {
  return date.toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date, tz: string): string {
  return date.toLocaleDateString("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getHour(date: Date, tz: string): number {
  const h = parseInt(
    date.toLocaleString("en-US", { timeZone: tz, hour: "numeric", hour12: false })
  );
  return isNaN(h) ? 0 : h % 24;
}

function isWorkingHour(hour: number): boolean {
  return hour >= 9 && hour < 18;
}

export default function MeetingPlanner() {
  const t = useTranslations("MeetingPlanner");

  const localTz = getLocalTz();
  const defaultTz = TIMEZONES.find((z) => z.tz === localTz)?.tz ?? "UTC";

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("09:00");
  const [zones, setZones] = useState<string[]>([
    defaultTz,
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
  ]);

  function addZone() {
    const available = TIMEZONES.find((z) => !zones.includes(z.tz));
    if (available) setZones([...zones, available.tz]);
  }

  function removeZone(idx: number) {
    if (zones.length <= 2) return;
    setZones(zones.filter((_, i) => i !== idx));
  }

  function updateZone(idx: number, tz: string) {
    setZones(zones.map((z, i) => (i === idx ? tz : z)));
  }

  const baseDate = new Date(`${date}T${time}:00`);

  const HOURS = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("dateLabel")}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("timeLabel")}</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        {zones.map((tz, idx) => {
          const hour = getHour(baseDate, tz);
          const working = isWorkingHour(hour);
          const tzLabel = TIMEZONES.find((z) => z.tz === tz)?.label ?? tz;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                working
                  ? "border-green-500/30 bg-green-900/10"
                  : "border-gray-700 bg-gray-900"
              }`}
            >
              <div className="flex-1 min-w-0">
                <select
                  value={tz}
                  onChange={(e) => updateZone(idx, e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-300 focus:outline-none cursor-pointer"
                >
                  {TIMEZONES.map((z) => (
                    <option key={z.tz} value={z.tz} className="bg-gray-900">
                      {z.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(baseDate, tz)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-semibold text-white">{formatTime(baseDate, tz)}</p>
                <p className={`text-xs ${working ? "text-green-400" : "text-gray-500"}`}>
                  {working ? t("workingHours") : t("outsideHours")}
                </p>
              </div>
              {zones.length > 2 && (
                <button
                  onClick={() => removeZone(idx)}
                  className="text-gray-600 hover:text-red-400 text-lg leading-none shrink-0 transition-colors"
                  aria-label={t("removeTimezone")}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      {zones.length < 8 && (
        <button
          onClick={addZone}
          className="w-full py-2 border border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors text-sm"
        >
          + {t("addTimezone")}
        </button>
      )}

      {/* 24h heatmap */}
      <div>
        <p className="text-xs text-gray-500 mb-2">{t("workingHours")}</p>
        <div className="grid grid-cols-24 gap-0.5" style={{ gridTemplateColumns: "repeat(24, 1fr)" }}>
          {HOURS.map((h) => (
            <div
              key={h}
              className={`h-6 rounded-sm text-center text-[9px] leading-6 ${
                h === 0 || h === 12 ? "text-gray-500" : "text-transparent"
              } ${isWorkingHour(h) ? "bg-green-600/40" : "bg-gray-800"}`}
              title={`${h}:00`}
            >
              {h === 0 ? t("midnight") : h === 12 ? t("noon") : ""}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-gray-600 mt-0.5">
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>12 AM</span>
        </div>
      </div>
    </div>
  );
}
