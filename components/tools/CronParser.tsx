"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface CronField {
  name: string;
  value: string;
  meaning: string;
  range: string;
}

interface ParseResult {
  fields: CronField[];
  nextRuns: Date[];
  error: string | null;
}

const PRESETS = [
  { label: "Every 5 minutes", expression: "*/5 * * * *" },
  { label: "Weekdays at 9am", expression: "0 9 * * 1-5" },
  { label: "1st of month midnight", expression: "0 0 1 * *" },
  { label: "Sundays at 6:30am", expression: "30 6 * * 0" },
];

const FIELD_META = [
  { name: "Minute", range: "0-59" },
  { name: "Hour", range: "0-23" },
  { name: "Day of Month", range: "1-31" },
  { name: "Month", range: "1-12" },
  { name: "Day of Week", range: "0-6 (Sun-Sat)" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseField(expr: string, min: number, max: number): number[] | null {
  const values: number[] = [];

  const parts = expr.split(",");
  for (const part of parts) {
    const trimmed = part.trim();

    if (trimmed === "*") {
      for (let i = min; i <= max; i++) values.push(i);
    } else if (trimmed.startsWith("*/")) {
      const step = parseInt(trimmed.slice(2), 10);
      if (isNaN(step) || step <= 0) return null;
      for (let i = min; i <= max; i += step) values.push(i);
    } else if (trimmed.includes("/")) {
      const [rangePart, stepStr] = trimmed.split("/");
      const step = parseInt(stepStr, 10);
      if (isNaN(step) || step <= 0) return null;
      let rangeMin = min;
      let rangeMax = max;
      if (rangePart !== "*") {
        const [rMin, rMax] = rangePart.split("-").map(Number);
        if (isNaN(rMin) || isNaN(rMax)) return null;
        rangeMin = rMin;
        rangeMax = rMax;
      }
      for (let i = rangeMin; i <= rangeMax; i += step) values.push(i);
    } else if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) return null;
      for (let i = start; i <= end; i++) values.push(i);
    } else {
      const val = parseInt(trimmed, 10);
      if (isNaN(val) || val < min || val > max) return null;
      values.push(val);
    }
  }

  return [...new Set(values)].sort((a, b) => a - b);
}

function describeMeaning(expr: string, fieldIndex: number): string {
  const fieldName = FIELD_META[fieldIndex].name.toLowerCase();

  if (expr === "*") return `Every ${fieldName}`;

  if (expr.startsWith("*/")) {
    const step = expr.slice(2);
    return `Every ${step} ${fieldName}s`;
  }

  if (expr.includes("-") && !expr.includes(",")) {
    const [start, end] = expr.split("-").map(Number);
    if (fieldIndex === 4) return `${DAY_NAMES[start]} through ${DAY_NAMES[end]}`;
    if (fieldIndex === 2) return `Day ${start} through day ${end}`;
    if (fieldIndex === 3) return `${MONTH_NAMES[start - 1]} through ${MONTH_NAMES[end - 1]}`;
    return `${fieldName} ${start} through ${end}`;
  }

  if (expr.includes(",")) {
    const vals = expr.split(",").map(Number);
    if (fieldIndex === 4) return vals.map((v) => DAY_NAMES[v]).join(", ");
    if (fieldIndex === 3) return vals.map((v) => MONTH_NAMES[v - 1]).join(", ");
    return `At ${fieldName}s: ${expr}`;
  }

  const val = parseInt(expr, 10);
  if (!isNaN(val)) {
    if (fieldIndex === 4) return `On ${DAY_NAMES[val]}`;
    if (fieldIndex === 3) return `In ${MONTH_NAMES[val - 1]}`;
    if (fieldIndex === 1) {
      const h = val % 12 || 12;
      const ampm = val < 12 ? "AM" : "PM";
      return `At ${h}:00 ${ampm}`;
    }
    if (fieldIndex === 0) return `At minute ${val}`;
    return `On ${fieldName} ${val}`;
  }

  return expr;
}

function getNextRuns(
  minuteVals: number[],
  hourVals: number[],
  domVals: number[],
  monthVals: number[],
  dowVals: number[],
  count: number
): Date[] {
  const results: Date[] = [];
  const now = new Date();
  const current = new Date(now);

  current.setSeconds(0);
  current.setMilliseconds(0);
  current.setMinutes(current.getMinutes() + 1);

  const limit = new Date(current);
  limit.setFullYear(limit.getFullYear() + 1);

  while (results.length < count && current < limit) {
    const m = current.getMonth() + 1;
    const dom = current.getDate();
    const dow = current.getDay();
    const h = current.getHours();
    const min = current.getMinutes();

    if (
      monthVals.includes(m) &&
      domVals.includes(dom) &&
      dowVals.includes(dow) &&
      hourVals.includes(h) &&
      minuteVals.includes(min)
    ) {
      results.push(new Date(current));
    }

    current.setMinutes(current.getMinutes() + 1);
  }

  return results;
}

function parseCron(expression: string): ParseResult {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return {
      fields: [],
      nextRuns: [],
      error: "Cron expression must have exactly 5 fields: minute hour day-of-month month day-of-week",
    };
  }

  const ranges: [number, number][] = [
    [0, 59],
    [0, 23],
    [1, 31],
    [1, 12],
    [0, 6],
  ];

  const parsedVals: number[][] = [];
  const fields: CronField[] = [];

  for (let i = 0; i < 5; i++) {
    const vals = parseField(parts[i], ranges[i][0], ranges[i][1]);
    if (!vals) {
      return {
        fields: [],
        nextRuns: [],
        error: `Invalid value "${parts[i]}" for field "${FIELD_META[i].name}" (range: ${FIELD_META[i].range})`,
      };
    }
    parsedVals.push(vals);
    fields.push({
      name: FIELD_META[i].name,
      value: parts[i],
      meaning: describeMeaning(parts[i], i),
      range: FIELD_META[i].range,
    });
  }

  const nextRuns = getNextRuns(
    parsedVals[0],
    parsedVals[1],
    parsedVals[2],
    parsedVals[3],
    parsedVals[4],
    5
  );

  return { fields, nextRuns, error: null };
}

function formatDate(d: Date): string {
  return d.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function CronParser() {
  const t = useTranslations("CronParser");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);

  const handleParse = () => {
    if (!expression.trim()) return;
    const parsed = parseCron(expression);
    setResult(parsed);
  };

  const handleClear = () => {
    setExpression("");
    setResult(null);
  };

  const handlePreset = (expr: string) => {
    setExpression(expr);
    setResult(parseCron(expr));
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <p className="text-sm text-gray-400 mb-2">{t("presets")}</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.expression}
              onClick={() => handlePreset(preset.expression)}
              className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
            >
              <span className="font-mono text-indigo-400">{preset.expression}</span>
              <span className="ml-2 text-gray-500">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">{t("expression")}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleParse()}
            placeholder="* * * * *"
            className="flex-1 bg-gray-900 border border-gray-600 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleParse}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {t("parse")}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            {t("clear")}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">{t("hint")}</p>
      </div>

      {/* Error */}
      {result?.error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg px-4 py-3">
          <p className="text-red-400 text-sm">{result.error}</p>
        </div>
      )}

      {/* Field Breakdown */}
      {result && !result.error && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">{t("fieldBreakdown")}</h3>
            <div className="overflow-hidden rounded-lg border border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-800 border-b border-gray-700">
                    <th className="text-left px-4 py-2.5 text-gray-400 font-medium w-1/4">{t("field")}</th>
                    <th className="text-left px-4 py-2.5 text-gray-400 font-medium w-1/5">{t("value")}</th>
                    <th className="text-left px-4 py-2.5 text-gray-400 font-medium w-1/5">{t("range")}</th>
                    <th className="text-left px-4 py-2.5 text-gray-400 font-medium">{t("meaning")}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.fields.map((f, i) => (
                    <tr key={i} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-2.5 text-gray-300 font-medium">{f.name}</td>
                      <td className="px-4 py-2.5 font-mono text-indigo-400">{f.value}</td>
                      <td className="px-4 py-2.5 text-gray-500 font-mono text-xs">{f.range}</td>
                      <td className="px-4 py-2.5 text-gray-300">{f.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Next Runs */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">{t("nextRuns")}</h3>
            {result.nextRuns.length === 0 ? (
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg px-4 py-3">
                <p className="text-yellow-400 text-sm">{t("noRuns")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {result.nextRuns.map((run, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-2.5 border border-gray-700"
                  >
                    <span className="text-xs font-mono text-indigo-400 w-4">#{i + 1}</span>
                    <span className="text-gray-300 text-sm font-mono">{formatDate(run)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
