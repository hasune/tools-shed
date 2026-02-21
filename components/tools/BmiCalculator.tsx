"use client";

import { useState } from "react";

function getBmiCategory(bmi: number): { label: string; color: string; description: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400", description: "BMI less than 18.5" };
  if (bmi < 25) return { label: "Normal weight", color: "text-green-400", description: "BMI 18.5 – 24.9" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-400", description: "BMI 25 – 29.9" };
  return { label: "Obese", color: "text-red-400", description: "BMI 30 or greater" };
}

export default function BmiCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculate = () => {
    let weightKg: number;
    let heightM: number;

    if (unit === "metric") {
      weightKg = parseFloat(weight);
      heightM = parseFloat(height) / 100;
    } else {
      weightKg = parseFloat(weight) * 0.453592;
      const totalInches = parseFloat(heightFt) * 12 + parseFloat(heightIn || "0");
      heightM = totalInches * 0.0254;
    }

    if (!weightKg || !heightM || heightM <= 0) return;
    setBmi(parseFloat((weightKg / (heightM * heightM)).toFixed(1)));
  };

  const clear = () => {
    setWeight(""); setHeight(""); setHeightFt(""); setHeightIn(""); setBmi(null);
  };

  const category = bmi ? getBmiCategory(bmi) : null;

  return (
    <div className="space-y-5">
      {/* Unit Toggle */}
      <div className="flex gap-1 p-1 bg-gray-900 rounded-lg w-fit">
        {(["metric", "imperial"] as const).map((u) => (
          <button
            key={u}
            onClick={() => { setUnit(u); setBmi(null); }}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              unit === u ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {u === "metric" ? "Metric (kg/cm)" : "Imperial (lb/ft)"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Weight */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">
            Weight ({unit === "metric" ? "kg" : "lbs"})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>

        {/* Height */}
        {unit === "metric" ? (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 175"
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Height (ft / in)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="ft"
                className="w-1/2 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              />
              <input
                type="number"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="in"
                className="w-1/2 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          Calculate BMI
        </button>
        <button
          onClick={clear}
          className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Result */}
      {bmi && category && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
          <div className="text-6xl font-bold text-white mb-2">{bmi}</div>
          <div className={`text-xl font-semibold mb-1 ${category.color}`}>{category.label}</div>
          <div className="text-gray-500 text-sm">{category.description}</div>
        </div>
      )}

      {/* BMI Chart */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">BMI Categories</h3>
        <div className="space-y-2">
          {[
            { label: "Underweight", range: "< 18.5", color: "bg-blue-500" },
            { label: "Normal weight", range: "18.5 – 24.9", color: "bg-green-500" },
            { label: "Overweight", range: "25 – 29.9", color: "bg-yellow-500" },
            { label: "Obese", range: "≥ 30", color: "bg-red-500" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3 text-sm">
              <div className={`w-3 h-3 rounded-full ${row.color} flex-shrink-0`} />
              <span className="text-gray-300 w-32">{row.label}</span>
              <span className="text-gray-500 font-mono">{row.range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
