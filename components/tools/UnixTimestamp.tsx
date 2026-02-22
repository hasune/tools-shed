"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function UnixTimestamp() {
  const t = useTranslations("UnixTimestamp");
  const tCommon = useTranslations("Common");

  const [timestamp, setTimestamp] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [result, setResult] = useState<{
    local: string;
    utc: string;
    iso: string;
    relative: string;
  } | null>(null);
  const [tsFromDate, setTsFromDate] = useState<{ sec: string; ms: string } | null>(null);
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const getRelative = (ms: number): string => {
    const diffSec = Math.floor((now.getTime() - ms) / 1000);
    const abs = Math.abs(diffSec);
    if (abs < 60) return t("justNow");
    if (abs < 3600) return `${Math.floor(abs / 60)} ${t("minutesAgo")}`;
    if (abs < 86400) return `${Math.floor(abs / 3600)} ${t("hoursAgo")}`;
    return `${Math.floor(abs / 86400)} ${t("daysAgo")}`;
  };

  const convertTimestamp = (val: string) => {
    setTimestamp(val);
    setError("");
    if (!val.trim()) { setResult(null); return; }
    const num = parseInt(val);
    if (isNaN(num)) { setResult(null); return; }
    // auto-detect ms vs seconds
    const ms = num > 1e12 ? num : num * 1000;
    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      setError(t("invalidTimestamp"));
      setResult(null);
      return;
    }
    setResult({
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      iso: date.toISOString(),
      relative: getRelative(ms),
    });
  };

  const convertDate = (val: string) => {
    setDateInput(val);
    if (!val) { setTsFromDate(null); return; }
    const date = new Date(val);
    if (isNaN(date.getTime())) { setTsFromDate(null); return; }
    setTsFromDate({
      sec: Math.floor(date.getTime() / 1000).toString(),
      ms: date.getTime().toString(),
    });
  };

  const useNow = () => {
    const ts = Math.floor(now.getTime() / 1000).toString();
    setTimestamp(ts);
    convertTimestamp(ts);
  };

  return (
    <div className="space-y-6">
      {/* Current timestamp ticker */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
        <div className="text-xs text-gray-500 mb-1">{t("currentTimestamp")}</div>
        <div className="text-3xl font-mono text-indigo-400">{Math.floor(now.getTime() / 1000)}</div>
        <div className="text-xs text-gray-500 mt-1">{t("secondsSince")}</div>
      </div>

      {/* Timestamp → Date */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">{t("tsToDate")}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={timestamp}
            onChange={(e) => convertTimestamp(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-600 text-white font-mono text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            placeholder={t("timestampPlaceholder")}
          />
          <button
            onClick={useNow}
            className="px-4 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
          >
            {t("useNow")}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {result && (
          <div className="space-y-2">
            {[
              { label: t("localTime"), value: result.local, key: "local" },
              { label: t("utcTime"), value: result.utc, key: "utc" },
              { label: "ISO 8601", value: result.iso, key: "iso" },
              { label: t("relative"), value: result.relative, key: "rel" },
            ].map(({ label, value, key }) => (
              <div
                key={key}
                className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
              >
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                  <div className="text-sm font-mono text-indigo-300">{value}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(value, key)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 ml-3 transition-colors shrink-0"
                >
                  {copied === key ? tCommon("copied") : tCommon("copy")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Date → Timestamp */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">{t("dateToTs")}</h3>
        <input
          type="datetime-local"
          value={dateInput}
          onChange={(e) => convertDate(e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
        />
        {tsFromDate && (
          <div className="space-y-2">
            {[
              { label: t("seconds"), value: tsFromDate.sec, key: "ts_sec" },
              { label: t("milliseconds"), value: tsFromDate.ms, key: "ts_ms" },
            ].map(({ label, value, key }) => (
              <div
                key={key}
                className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
              >
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                  <div className="text-sm font-mono text-indigo-300">{value}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(value, key)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 ml-3 transition-colors shrink-0"
                >
                  {copied === key ? tCommon("copied") : tCommon("copy")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
