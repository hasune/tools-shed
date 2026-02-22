"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface SolutionResult {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  nature: "two-real" | "one-real" | "two-complex";
  // Two real roots
  x1Real?: number;
  x2Real?: number;
  // Complex roots: alpha ± beta*i
  alpha?: number;
  beta?: number;
  // Vertex
  vertexX: number;
  vertexY: number;
}

function fmt(n: number, digits = 6): string {
  // Trim trailing zeros for clean display
  return parseFloat(n.toPrecision(digits)).toString();
}

function solve(a: number, b: number, c: number): SolutionResult {
  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = -discriminant / (4 * a);

  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant);
    return {
      a, b, c,
      discriminant,
      nature: "two-real",
      x1Real: (-b + sqrtD) / (2 * a),
      x2Real: (-b - sqrtD) / (2 * a),
      vertexX,
      vertexY,
    };
  } else if (discriminant === 0) {
    return {
      a, b, c,
      discriminant,
      nature: "one-real",
      x1Real: -b / (2 * a),
      vertexX,
      vertexY,
    };
  } else {
    return {
      a, b, c,
      discriminant,
      nature: "two-complex",
      alpha: -b / (2 * a),
      beta: Math.sqrt(-discriminant) / (2 * a),
      vertexX,
      vertexY,
    };
  }
}

function formatCoefficient(val: string, variable: string, isFirst: boolean): string {
  const n = parseFloat(val);
  if (isNaN(n) || val === "" || val === "-") {
    const placeholder = isFirst ? `${val || "a"}${variable}` : ` + ${val || "b"}${variable}`;
    return isFirst ? `${val || "a"}${variable}` : placeholder;
  }
  if (n === 0) return "";
  if (isFirst) {
    if (n === 1) return variable;
    if (n === -1) return `-${variable}`;
    return `${n}${variable}`;
  }
  if (n > 0) {
    if (n === 1) return ` + ${variable}`;
    return ` + ${n}${variable}`;
  } else {
    if (n === -1) return ` − ${variable}`;
    return ` − ${Math.abs(n)}${variable}`;
  }
}

function buildEquationDisplay(aVal: string, bVal: string, cVal: string): string {
  const aParsed = parseFloat(aVal);
  const bParsed = parseFloat(bVal);
  const cParsed = parseFloat(cVal);

  let eq = "";

  // ax² part
  const aIsEmpty = aVal === "" || aVal === "-";
  if (aIsEmpty) {
    eq += `${aVal || "a"}x²`;
  } else if (aParsed !== 0) {
    if (aParsed === 1) eq += "x²";
    else if (aParsed === -1) eq += "-x²";
    else eq += `${aParsed}x²`;
  }

  // bx part
  const bIsEmpty = bVal === "" || bVal === "-";
  if (bIsEmpty) {
    eq += eq ? ` + ${bVal || "b"}x` : `${bVal || "b"}x`;
  } else if (!isNaN(bParsed) && bParsed !== 0) {
    if (eq === "") {
      if (bParsed === 1) eq += "x";
      else if (bParsed === -1) eq += "-x";
      else eq += `${bParsed}x`;
    } else {
      if (bParsed > 0) eq += bParsed === 1 ? " + x" : ` + ${bParsed}x`;
      else eq += Math.abs(bParsed) === 1 ? " − x" : ` − ${Math.abs(bParsed)}x`;
    }
  }

  // c part
  const cIsEmpty = cVal === "" || cVal === "-";
  if (cIsEmpty) {
    eq += eq ? ` + ${cVal || "c"}` : `${cVal || "c"}`;
  } else if (!isNaN(cParsed) && cParsed !== 0) {
    if (eq === "") {
      eq += `${cParsed}`;
    } else {
      if (cParsed > 0) eq += ` + ${cParsed}`;
      else eq += ` − ${Math.abs(cParsed)}`;
    }
  }

  return (eq || "0") + " = 0";
}

export default function QuadraticSolver() {
  const t = useTranslations("QuadraticSolver");

  const [aVal, setAVal] = useState<string>("");
  const [bVal, setBVal] = useState<string>("");
  const [cVal, setCVal] = useState<string>("");
  const [result, setResult] = useState<SolutionResult | null>(null);
  const [error, setError] = useState<string>("");

  const equationDisplay = buildEquationDisplay(aVal, bVal, cVal);

  const handleSolve = () => {
    setError("");
    setResult(null);

    const a = parseFloat(aVal);
    const b = parseFloat(bVal);
    const c = parseFloat(cVal);

    if (isNaN(a) || aVal === "" || aVal === "-") {
      setError(t("errorEnterA"));
      return;
    }
    if (a === 0) {
      setError(t("errorAZero"));
      return;
    }
    if (isNaN(b) || bVal === "" || bVal === "-") {
      setError(t("errorEnterB"));
      return;
    }
    if (isNaN(c) || cVal === "" || cVal === "-") {
      setError(t("errorEnterC"));
      return;
    }

    setResult(solve(a, b, c));
  };

  const handleClear = () => {
    setAVal("");
    setBVal("");
    setCVal("");
    setResult(null);
    setError("");
  };

  const inputClass =
    "w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600 text-center font-mono text-lg";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSolve();
  };

  return (
    <div className="space-y-6">
      {/* Live Equation Display */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-center">
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">{t("equationLabel")}</p>
        <p className="text-2xl font-mono text-white tracking-wide">{equationDisplay}</p>
      </div>

      {/* Coefficient Inputs */}
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1 text-center">
            <label className="text-xs font-medium text-gray-400 block">
              <span className="font-mono text-indigo-400">a</span> {t("coefficientOf")} x²
            </label>
            <input
              type="number"
              value={aVal}
              onChange={(e) => setAVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="a"
              className={inputClass}
            />
          </div>
          <div className="space-y-1 text-center">
            <label className="text-xs font-medium text-gray-400 block">
              <span className="font-mono text-indigo-400">b</span> {t("coefficientOf")} x
            </label>
            <input
              type="number"
              value={bVal}
              onChange={(e) => setBVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="b"
              className={inputClass}
            />
          </div>
          <div className="space-y-1 text-center">
            <label className="text-xs font-medium text-gray-400 block">
              <span className="font-mono text-indigo-400">c</span> {t("constant")}
            </label>
            <input
              type="number"
              value={cVal}
              onChange={(e) => setCVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="c"
              className={inputClass}
            />
          </div>
        </div>

        {/* Formula reminder */}
        <p className="text-center text-xs text-gray-600 font-mono">
          x = (−b ± √(b² − 4ac)) / 2a
        </p>
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSolve}
          className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t("solveButton")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Discriminant */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-800/60 border-b border-gray-700">
              <span className="text-sm font-semibold text-gray-300">{t("discriminantTitle")}</span>
            </div>
            <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="font-mono text-lg text-white">
                Δ = b² − 4ac = ({result.b})² − 4({result.a})({result.c}) ={" "}
                <span
                  className={`font-bold ${
                    result.discriminant > 0
                      ? "text-green-400"
                      : result.discriminant === 0
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {fmt(result.discriminant)}
                </span>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  result.discriminant > 0
                    ? "bg-green-900/40 text-green-400 border border-green-700/40"
                    : result.discriminant === 0
                    ? "bg-yellow-900/40 text-yellow-400 border border-yellow-700/40"
                    : "bg-red-900/40 text-red-400 border border-red-700/40"
                }`}
              >
                {result.discriminant > 0
                  ? t("twoRealRoots")
                  : result.discriminant === 0
                  ? t("oneRepeatedRoot")
                  : t("twoComplexRoots")}
              </span>
            </div>
          </div>

          {/* Roots */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-800/60 border-b border-gray-700">
              <span className="text-sm font-semibold text-gray-300">{t("rootsTitle")}</span>
            </div>
            <div className="px-4 py-4">
              {result.nature === "two-real" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg px-4 py-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">x₁</div>
                    <div className="text-xl font-mono font-semibold text-indigo-300">
                      {fmt(result.x1Real!)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 font-mono">
                      = (−{result.b} + √{fmt(result.discriminant)}) / {2 * result.a}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg px-4 py-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">x₂</div>
                    <div className="text-xl font-mono font-semibold text-indigo-300">
                      {fmt(result.x2Real!)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 font-mono">
                      = (−{result.b} − √{fmt(result.discriminant)}) / {2 * result.a}
                    </div>
                  </div>
                </div>
              )}

              {result.nature === "one-real" && (
                <div className="bg-gray-800/50 rounded-lg px-4 py-3 text-center max-w-xs mx-auto">
                  <div className="text-xs text-gray-500 mb-1">x₁ = x₂ {t("repeatedRoot")}</div>
                  <div className="text-2xl font-mono font-semibold text-yellow-300">
                    {fmt(result.x1Real!)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 font-mono">
                    = −{result.b} / {2 * result.a}
                  </div>
                </div>
              )}

              {result.nature === "two-complex" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg px-4 py-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">x₁</div>
                      <div className="text-lg font-mono font-semibold text-rose-300">
                        {fmt(result.alpha!)} + {fmt(result.beta!)}i
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg px-4 py-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">x₂</div>
                      <div className="text-lg font-mono font-semibold text-rose-300">
                        {fmt(result.alpha!)} − {fmt(result.beta!)}i
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono text-center">
                    {t("complexForm")}: α ± βi, α = {fmt(result.alpha!)}, β = {fmt(result.beta!)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vertex & Axis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-4 text-center">
              <div className="text-xs text-gray-500 mb-2">{t("vertex")}</div>
              <div className="text-base font-mono text-gray-200">
                ({fmt(result.vertexX)}, {fmt(result.vertexY)})
              </div>
              <div className="text-xs text-gray-600 mt-1 font-mono">
                (−b/2a, −Δ/4a)
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-4 text-center">
              <div className="text-xs text-gray-500 mb-2">{t("axisOfSymmetry")}</div>
              <div className="text-base font-mono text-gray-200">
                x = {fmt(result.vertexX)}
              </div>
              <div className="text-xs text-gray-600 mt-1 font-mono">
                x = −b/2a = −{result.b}/{2 * result.a}
              </div>
            </div>
          </div>

          {/* Step-by-step solution */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-800/60 border-b border-gray-700">
              <span className="text-sm font-semibold text-gray-300">{t("stepsTitle")}</span>
            </div>
            <div className="px-4 py-4 space-y-3">
              {[
                {
                  step: 1,
                  label: t("step1"),
                  content: `${result.a}x² + ${result.b}x + ${result.c} = 0`,
                },
                {
                  step: 2,
                  label: t("step2"),
                  content: `Δ = b² − 4ac = (${result.b})² − 4(${result.a})(${result.c}) = ${result.b * result.b} − ${4 * result.a * result.c} = ${fmt(result.discriminant)}`,
                },
                {
                  step: 3,
                  label: t("step3"),
                  content:
                    result.nature === "two-real"
                      ? `x = (−(${result.b}) ± √${fmt(result.discriminant)}) / (2 × ${result.a})\n  x₁ = ${fmt(result.x1Real!)}\n  x₂ = ${fmt(result.x2Real!)}`
                      : result.nature === "one-real"
                      ? `x = −b / 2a = −(${result.b}) / (2 × ${result.a}) = ${fmt(result.x1Real!)}`
                      : `x = (−(${result.b}) ± √${fmt(result.discriminant)}) / (2 × ${result.a})\n  = ${fmt(result.alpha!)} ± ${fmt(result.beta!)}i`,
                },
                {
                  step: 4,
                  label: t("step4"),
                  content: `Vertex: (−b/2a, −Δ/4a) = (${fmt(result.vertexX)}, ${fmt(result.vertexY)})`,
                },
              ].map(({ step, label, content }) => (
                <div key={step} className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-400">
                    {step}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs font-medium text-gray-400">{label}</div>
                    <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap break-words">
                      {content}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info box when empty */}
      {!result && !error && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-medium text-gray-400">{t("infoTitle")}</h3>
          <ul className="space-y-1.5 text-xs text-gray-500 list-disc list-inside">
            <li>{t("infoDiscriminant")}</li>
            <li>{t("infoTwoReal")}</li>
            <li>{t("infoOneReal")}</li>
            <li>{t("infoComplex")}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
