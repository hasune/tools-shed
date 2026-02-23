"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total };
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / 1000 / 60 / 60) % 24);
  const days = Math.floor(total / 1000 / 60 / 60 / 24);
  return { days, hours, minutes, seconds, total };
}

function toLocalDateTimeInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CountdownTimer() {
  const t = useTranslations("CountdownTimer");

  const defaultTarget = new Date();
  defaultTarget.setDate(defaultTarget.getDate() + 7);
  defaultTarget.setHours(0, 0, 0, 0);

  const [targetInput, setTargetInput] = useState(toLocalDateTimeInput(defaultTarget));
  const [eventName, setEventName] = useState("");
  const [target, setTarget] = useState<Date>(defaultTarget);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(defaultTarget));

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [target]);

  const handleSet = () => {
    const d = new Date(targetInput);
    if (!isNaN(d.getTime())) {
      setTarget(d);
      setTimeLeft(getTimeLeft(d));
    }
  };

  const handleReset = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(0, 0, 0, 0);
    setTargetInput(toLocalDateTimeInput(d));
    setTarget(d);
    setEventName("");
  };

  const isExpired = timeLeft.total <= 0;

  const units = [
    { label: t("daysLabel"), value: timeLeft.days },
    { label: t("hoursLabel"), value: timeLeft.hours },
    { label: t("minutesLabel"), value: timeLeft.minutes },
    { label: t("secondsLabel"), value: timeLeft.seconds },
  ];

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 space-y-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t("eventNameLabel")}</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder={t("eventNamePlaceholder")}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t("targetDateLabel")}</label>
          <input
            type="datetime-local"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSet}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 font-medium transition-colors"
          >
            {t("setTimerButton")}
          </button>
          <button
            onClick={handleReset}
            className="px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
          >
            {t("resetButton")}
          </button>
        </div>
      </div>

      {/* Countdown display */}
      {eventName && (
        <p className="text-center text-indigo-300 font-medium text-lg">{eventName}</p>
      )}

      {isExpired ? (
        <div className="text-center py-8">
          <p className="text-4xl font-bold text-indigo-400">{t("expiredMessage")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {units.map(({ label, value }) => (
            <div
              key={label}
              className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center"
            >
              <p className="text-3xl sm:text-4xl font-mono font-bold text-white">
                {String(value).padStart(2, "0")}
              </p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Target date display */}
      <p className="text-center text-sm text-gray-600">
        {target.toLocaleString()}
      </p>
    </div>
  );
}
