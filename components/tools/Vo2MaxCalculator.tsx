"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

type TestMethod = "cooper" | "rockport";
type Sex = "male" | "female";

function getCategory(vo2: number, age: number, sex: Sex): string {
  // Simplified ACSM norms
  if (sex === "male") {
    if (age < 30) return vo2 < 38 ? "poor" : vo2 < 42 ? "fair" : vo2 < 52 ? "good" : vo2 < 60 ? "excellent" : "superior";
    if (age < 40) return vo2 < 34 ? "poor" : vo2 < 38 ? "fair" : vo2 < 48 ? "good" : vo2 < 56 ? "excellent" : "superior";
    if (age < 50) return vo2 < 30 ? "poor" : vo2 < 35 ? "fair" : vo2 < 45 ? "good" : vo2 < 52 ? "excellent" : "superior";
    if (age < 60) return vo2 < 26 ? "poor" : vo2 < 31 ? "fair" : vo2 < 41 ? "good" : vo2 < 48 ? "excellent" : "superior";
    return vo2 < 22 ? "poor" : vo2 < 26 ? "fair" : vo2 < 36 ? "good" : vo2 < 44 ? "excellent" : "superior";
  } else {
    if (age < 30) return vo2 < 28 ? "poor" : vo2 < 34 ? "fair" : vo2 < 42 ? "good" : vo2 < 50 ? "excellent" : "superior";
    if (age < 40) return vo2 < 24 ? "poor" : vo2 < 30 ? "fair" : vo2 < 38 ? "good" : vo2 < 46 ? "excellent" : "superior";
    if (age < 50) return vo2 < 20 ? "poor" : vo2 < 26 ? "fair" : vo2 < 35 ? "good" : vo2 < 42 ? "excellent" : "superior";
    if (age < 60) return vo2 < 17 ? "poor" : vo2 < 22 ? "fair" : vo2 < 30 ? "good" : vo2 < 38 ? "excellent" : "superior";
    return vo2 < 15 ? "poor" : vo2 < 20 ? "fair" : vo2 < 28 ? "good" : vo2 < 34 ? "excellent" : "superior";
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  poor: "text-red-400", fair: "text-orange-400", good: "text-yellow-400",
  excellent: "text-green-400", superior: "text-indigo-400",
};

export default function Vo2MaxCalculator() {
  const t = useTranslations("Vo2MaxCalculator");
  const [method, setMethod] = useState<TestMethod>("cooper");
  const [distance, setDistance] = useState("");
  const [walkTime, setWalkTime] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [result, setResult] = useState<{ vo2: number; category: string } | null>(null);

  const calculate = () => {
    const ageNum = parseFloat(age);
    let vo2 = 0;

    if (method === "cooper") {
      const dist = parseFloat(distance);
      if (!dist || dist <= 0) return;
      vo2 = (dist - 504.9) / 44.73;
    } else {
      const wt = parseFloat(weight);
      const hr = parseFloat(heartRate);
      const time = parseFloat(walkTime);
      if (!wt || !hr || !time || wt <= 0 || hr <= 0 || time <= 0) return;
      const weightKg = weightUnit === "lb" ? wt * 0.453592 : wt;
      const sexVal = sex === "male" ? 1 : 0;
      // Rockport formula
      vo2 = 132.853 - (0.0769 * weightKg * 2.2046) - (0.3877 * ageNum) + (6.315 * sexVal) - (3.2649 * time) - (0.1565 * hr);
    }

    if (!ageNum || ageNum <= 0 || isNaN(vo2)) return;
    const category = getCategory(vo2, ageNum, sex);
    setResult({ vo2: Math.max(0, vo2), category });
  };

  const clear = () => { setDistance(""); setWalkTime(""); setHeartRate(""); setWeight(""); setAge(""); setResult(null); };

  const categoryLabels: Record<string, string> = {
    poor: t("categoryPoor"), fair: t("categoryFair"), good: t("categoryGood"),
    excellent: t("categoryExcellent"), superior: t("categorySuperior"),
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("testLabel")}</label>
          <select value={method} onChange={(e) => { setMethod(e.target.value as TestMethod); setResult(null); }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
            <option value="cooper">{t("testCooper")}</option>
            <option value="rockport">{t("testRockport")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("sexLabel")}</label>
          <select value={sex} onChange={(e) => setSex(e.target.value as Sex)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
            <option value="male">{t("sexMale")}</option>
            <option value="female">{t("sexFemale")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("ageLabel")}</label>
          <input type="number" min="10" max="100" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>

        {method === "cooper" ? (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">{t("distanceLabel")}</label>
            <input type="number" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="2400"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t("unitLabel")}</label>
              <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value as "kg" | "lb")}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t("weightLabel")} ({weightUnit})</label>
              <input type="number" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t("walkTimeLabel")}</label>
              <input type="number" min="0" step="0.1" value={walkTime} onChange={(e) => setWalkTime(e.target.value)} placeholder="15"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t("heartRateLabel")}</label>
              <input type="number" min="0" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} placeholder="140"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={clear} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
          <div className="text-sm text-gray-400 mb-1">{t("vo2maxLabel")}</div>
          <div className="text-4xl font-bold text-white mb-1">{result.vo2.toFixed(1)}</div>
          <div className="text-sm text-gray-400 mb-3">{t("unitMlKgMin")}</div>
          <div className={`text-lg font-semibold ${CATEGORY_COLORS[result.category] ?? "text-gray-300"}`}>
            {t("categoryLabel")}: {categoryLabels[result.category]}
          </div>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h3 className="font-semibold text-white mb-1">{t("aboutTitle")}</h3>
        <p className="text-sm text-gray-400">{t("aboutDesc")}</p>
      </div>
    </div>
  );
}
