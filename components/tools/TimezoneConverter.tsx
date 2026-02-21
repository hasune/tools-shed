"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const POPULAR_TIMEZONES = [
  { label: "UTC", tz: "UTC" },
  { label: "New York (ET)", tz: "America/New_York" },
  { label: "Los Angeles (PT)", tz: "America/Los_Angeles" },
  { label: "Chicago (CT)", tz: "America/Chicago" },
  { label: "London (GMT/BST)", tz: "Europe/London" },
  { label: "Paris (CET)", tz: "Europe/Paris" },
  { label: "Berlin (CET)", tz: "Europe/Berlin" },
  { label: "Dubai (GST)", tz: "Asia/Dubai" },
  { label: "Mumbai (IST)", tz: "Asia/Kolkata" },
  { label: "Singapore (SGT)", tz: "Asia/Singapore" },
  { label: "Tokyo (JST)", tz: "Asia/Tokyo" },
  { label: "Sydney (AEST)", tz: "Australia/Sydney" },
  { label: "São Paulo (BRT)", tz: "America/Sao_Paulo" },
  { label: "Toronto (ET)", tz: "America/Toronto" },
  { label: "Vancouver (PT)", tz: "America/Vancouver" },
];

function formatInTz(date: Date, tz: string): string {
  try {
    return date.toLocaleString("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      weekday: "short",
    });
  } catch {
    return "Invalid timezone";
  }
}

function getTimezoneOffset(tz: string, date: Date): number {
  try {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone: tz }));
    return utcDate.getTime() - tzDate.getTime();
  } catch {
    return 0;
  }
}

export default function TimezoneConverter() {
  const t = useTranslations("TimezoneConverter");

  const [inputDate, setInputDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [sourceTimezone, setSourceTimezone] = useState("UTC");
  const [results, setResults] = useState<{ label: string; tz: string; time: string }[]>([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const convert = () => {
    const localDate = new Date(inputDate);
    const tzOffsetMs = getTimezoneOffset(sourceTimezone, localDate);
    const utcDate = new Date(localDate.getTime() - tzOffsetMs);

    const converted = POPULAR_TIMEZONES.map((tz) => ({
      ...tz,
      time: formatInTz(utcDate, tz.tz),
    }));
    setResults(converted);
  };

  const useCurrentTime = () => {
    const now = new Date();
    setInputDate(now.toISOString().slice(0, 16));
    setSourceTimezone("UTC");
  };

  return (
    <div className="space-y-5">
      {/* Current Time Display */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
        <div className="text-sm text-gray-500 mb-1">{t("currentTime")}</div>
        <div className="text-xl font-mono text-indigo-400">
          {now.toLocaleString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
        <div className="text-xs text-gray-500 mt-1">{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("dateTimeLabel")}</label>
          <input
            type="datetime-local"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("sourceTimezoneLabel")}</label>
          <select
            value={sourceTimezone}
            onChange={(e) => setSourceTimezone(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          >
            {POPULAR_TIMEZONES.map((tz) => (
              <option key={tz.tz} value={tz.tz}>{tz.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={convert}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {t("convertButton")}
        </button>
        <button
          onClick={useCurrentTime}
          className="px-4 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
        >
          {t("useNowButton")}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">{t("resultsLabel")}</h3>
          <div className="space-y-2">
            {results.map((r) => (
              <div key={r.tz} className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg px-4 py-3">
                <span className="text-sm text-gray-400">{r.label}</span>
                <span className="text-sm font-mono text-indigo-300">{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
