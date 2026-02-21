"use client";

import { useState } from "react";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split("T")[0]);
  const [result, setResult] = useState<{
    years: number; months: number; days: number;
    totalDays: number; totalMonths: number;
    nextBirthday: string; daysUntilBirthday: number;
  } | null>(null);

  const calculate = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    if (birth > target) return;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;

    // Next birthday
    const nextBD = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBD <= target) nextBD.setFullYear(nextBD.getFullYear() + 1);
    const daysUntilBirthday = Math.floor((nextBD.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      years, months, days, totalDays, totalMonths,
      nextBirthday: nextBD.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      daysUntilBirthday,
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Date of Birth</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={targetDate}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Age at date</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        Calculate Age
      </button>

      {result && (
        <div className="space-y-4">
          {/* Main Result */}
          <div className="bg-gray-900 border border-indigo-500/30 rounded-xl p-6 text-center">
            <div className="text-5xl font-bold text-white mb-1">{result.years}</div>
            <div className="text-gray-400 text-lg">years old</div>
            <div className="mt-2 text-indigo-400 text-lg">
              {result.months > 0 || result.days > 0
                ? `${result.months > 0 ? `${result.months} month${result.months !== 1 ? "s" : ""}` : ""} ${result.days > 0 ? `${result.days} day${result.days !== 1 ? "s" : ""}` : ""}`.trim()
                : "Exactly!"}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Total days", value: result.totalDays.toLocaleString() },
              { label: "Total months", value: result.totalMonths.toLocaleString() },
              { label: "Days until birthday", value: result.daysUntilBirthday === 0 ? "🎂 Today!" : result.daysUntilBirthday.toString() },
            ].map((item) => (
              <div key={item.label} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-indigo-400">{item.value}</div>
                <div className="text-xs text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-gray-400">
            Next birthday: <span className="text-indigo-400">{result.nextBirthday}</span>
          </div>
        </div>
      )}
    </div>
  );
}
