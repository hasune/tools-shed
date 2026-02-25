"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

type Shape =
  | "circle"
  | "rectangle"
  | "triangle"
  | "square"
  | "trapezoid"
  | "ellipse"
  | "sphere"
  | "cylinder"
  | "cone";

interface Results {
  area?: number;
  perimeter?: number;
  circumference?: number;
  volume?: number;
  surfaceArea?: number;
}

export default function GeometryCalculator() {
  const t = useTranslations("GeometryCalculator");
  const [shape, setShape] = useState<Shape>("circle");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState("");

  const shapes: Shape[] = [
    "circle", "rectangle", "triangle", "square",
    "trapezoid", "ellipse", "sphere", "cylinder", "cone",
  ];

  const shapeFields: Record<Shape, string[]> = {
    circle: ["radius"],
    rectangle: ["width", "height"],
    triangle: ["side1", "side2", "side3"],
    square: ["side"],
    trapezoid: ["parallelSide1", "parallelSide2", "height"],
    ellipse: ["semiMajor", "semiMinor"],
    sphere: ["radius"],
    cylinder: ["radius", "height"],
    cone: ["radius", "height", "slantHeight"],
  };

  const fieldLabelKeys: Record<string, string> = {
    radius: "radiusLabel",
    width: "widthLabel",
    height: "heightLabel",
    side: "sideLabel",
    side1: "side1Label",
    side2: "side2Label",
    side3: "side3Label",
    parallelSide1: "parallelSide1",
    parallelSide2: "parallelSide2",
    semiMajor: "semiMajorLabel",
    semiMinor: "semiMinorLabel",
    slantHeight: "slantHeightLabel",
  };

  const handleShapeChange = (s: Shape) => {
    setShape(s);
    setInputs({});
    setResults(null);
    setError("");
  };

  const handleInput = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    setResults(null);
    setError("");
  };

  const calculate = () => {
    const fields = shapeFields[shape];
    const vals: Record<string, number> = {};
    for (const f of fields) {
      const v = parseFloat(inputs[f] || "");
      if (isNaN(v) || v <= 0) {
        setError(`Invalid value for ${f}`);
        return;
      }
      vals[f] = v;
    }
    setError("");

    const res: Results = {};
    const PI = Math.PI;

    switch (shape) {
      case "circle":
        res.area = PI * vals.radius ** 2;
        res.circumference = 2 * PI * vals.radius;
        break;
      case "rectangle":
        res.area = vals.width * vals.height;
        res.perimeter = 2 * (vals.width + vals.height);
        break;
      case "triangle": {
        const { side1: a, side2: b, side3: c } = vals;
        const s = (a + b + c) / 2;
        const areaVal = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        if (isNaN(areaVal) || areaVal <= 0) {
          setError("Invalid triangle sides");
          return;
        }
        res.area = areaVal;
        res.perimeter = a + b + c;
        break;
      }
      case "square":
        res.area = vals.side ** 2;
        res.perimeter = 4 * vals.side;
        break;
      case "trapezoid": {
        const { parallelSide1: a, parallelSide2: b, height: h } = vals;
        res.area = ((a + b) / 2) * h;
        break;
      }
      case "ellipse": {
        const { semiMajor: a, semiMinor: b } = vals;
        res.area = PI * a * b;
        res.perimeter = PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
        break;
      }
      case "sphere":
        res.volume = (4 / 3) * PI * vals.radius ** 3;
        res.surfaceArea = 4 * PI * vals.radius ** 2;
        break;
      case "cylinder":
        res.volume = PI * vals.radius ** 2 * vals.height;
        res.surfaceArea = 2 * PI * vals.radius * (vals.radius + vals.height);
        break;
      case "cone":
        res.volume = (1 / 3) * PI * vals.radius ** 2 * vals.height;
        res.surfaceArea = PI * vals.radius * (vals.radius + vals.slantHeight);
        break;
    }

    setResults(res);
  };

  const clear = () => {
    setInputs({});
    setResults(null);
    setError("");
  };

  const fmt = (n: number) =>
    n % 1 === 0 ? n.toString() : parseFloat(n.toFixed(6)).toString();

  const resultItems: { key: keyof Results; labelKey: string }[] = [
    { key: "area", labelKey: "areaLabel" },
    { key: "perimeter", labelKey: "perimeterLabel" },
    { key: "circumference", labelKey: "perimeterLabel" },
    { key: "volume", labelKey: "volumeLabel" },
    { key: "surfaceArea", labelKey: "surfaceAreaLabel" },
  ];

  return (
    <div className="space-y-6">
      {/* Shape selector */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("shapeLabel")}
        </label>
        <select
          value={shape}
          onChange={(e) => handleShapeChange(e.target.value as Shape)}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500"
        >
          {shapes.map((s) => (
            <option key={s} value={s}>
              {t(s)}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shapeFields[shape].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t(fieldLabelKeys[field])}
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={inputs[field] || ""}
              onChange={(e) => handleInput(field, e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              placeholder="0"
            />
          </div>
        ))}
      </div>

      {/* Error */}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {t("calculateButton")}
        </button>
        <button
          onClick={clear}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resultItems.map(({ key, labelKey }) => {
            const val = results[key];
            if (val === undefined) return null;
            const label =
              key === "circumference" ? t("perimeterLabel") : t(labelKey);
            return (
              <div
                key={key}
                className="bg-gray-800 border border-indigo-500/50 rounded-lg p-4"
              >
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  {key === "circumference" ? "Circumference" : label}
                </p>
                <p className="text-2xl font-bold text-indigo-400">{fmt(val)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
