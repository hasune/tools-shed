"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Unit = "metric" | "imperial";
type Gender = "male" | "female";

interface Category {
  labelKey: "essentialFat" | "athletes" | "fitness" | "acceptable" | "obese";
  color: string;
}

function getCategory(pct: number, gender: Gender): Category {
  if (gender === "male") {
    if (pct < 6) return { labelKey: "essentialFat", color: "text-blue-400" };
    if (pct < 14) return { labelKey: "athletes", color: "text-green-400" };
    if (pct < 18) return { labelKey: "fitness", color: "text-teal-400" };
    if (pct < 25) return { labelKey: "acceptable", color: "text-yellow-400" };
    return { labelKey: "obese", color: "text-red-400" };
  } else {
    if (pct < 14) return { labelKey: "essentialFat", color: "text-blue-400" };
    if (pct < 21) return { labelKey: "athletes", color: "text-green-400" };
    if (pct < 25) return { labelKey: "fitness", color: "text-teal-400" };
    if (pct < 32) return { labelKey: "acceptable", color: "text-yellow-400" };
    return { labelKey: "obese", color: "text-red-400" };
  }
}

export default function BodyFat() {
  const t = useTranslations("BodyFat");

  const [unit, setUnit] = useState<Unit>("metric");
  const [gender, setGender] = useState<Gender>("male");
  const [height, setHeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const w = parseFloat(waist);
    const hp = parseFloat(hip);

    if (!h || !n || !w || h <= 0 || n <= 0 || w <= 0) return;
    if (gender === "female" && !hp) return;

    let pct: number;

    if (gender === "male") {
      // U.S. Navy formula (same for metric cm and imperial in)
      const log1 = Math.log10(w - n);
      const log2 = Math.log10(h);
      pct = 495 / (1.0324 - 0.19077 * log1 + 0.15456 * log2) - 450;
    } else {
      const log1 = Math.log10(w + hp - n);
      const log2 = Math.log10(h);
      pct = 495 / (1.29579 - 0.35004 * log1 + 0.221 * log2) - 450;
    }

    if (isNaN(pct) || !isFinite(pct)) return;
    setResult(parseFloat(pct.toFixed(1)));
  };

  const handleClear = () => {
    setHeight(""); setNeck(""); setWaist(""); setHip(""); setResult(null);
  };

  const unitLabel = unit === "metric" ? "cm" : "in";
  const category = result !== null ? getCategory(result, gender) : null;

  return (
    <div className="space-y-5">
      {/* Unit Toggle */}
      <div className="flex gap-1 p-1 bg-gray-900 rounded-lg w-fit border border-gray-700">
        {(["metric", "imperial"] as const).map((u) => (
          <button
            key={u}
            onClick={() => { setUnit(u); setResult(null); }}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              unit === u ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {t(u === "metric" ? "metricTab" : "imperialTab")}
          </button>
        ))}
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{t("genderLabel")}</label>
        <div className="flex gap-2">
          {(["male", "female"] as const).map((g) => (
            <button
              key={g}
              onClick={() => { setGender(g); setResult(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                gender === g
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {t(g === "male" ? "male" : "female")}
            </button>
          ))}
        </div>
      </div>

      {/* Measurements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("heightLabel")} ({unitLabel})</label>
          <input
            type="number"
            min={0}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === "metric" ? "e.g. 175" : "e.g. 69"}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("neckLabel")} ({unitLabel})</label>
          <input
            type="number"
            min={0}
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
            placeholder={unit === "metric" ? "e.g. 37" : "e.g. 14.5"}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("waistLabel")} ({unitLabel})</label>
          <input
            type="number"
            min={0}
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            placeholder={unit === "metric" ? "e.g. 85" : "e.g. 33"}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
        {gender === "female" && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              {t("hipLabel")} ({unitLabel})
              <span className="text-gray-500 text-xs font-normal ml-1">{t("hipNote")}</span>
            </label>
            <input
              type="number"
              min={0}
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              placeholder={unit === "metric" ? "e.g. 95" : "e.g. 37"}
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {t("calculateButton")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {result !== null && category && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider">{t("bodyFatPercent")}</div>
          <div className="text-6xl font-bold text-white">{result}%</div>
          <div className={`text-lg font-semibold ${category.color}`}>{t(category.labelKey)}</div>
          <div className="text-xs text-gray-600 mt-2">{t("methodNote")}</div>
        </div>
      )}
    </div>
  );
}
