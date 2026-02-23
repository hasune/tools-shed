"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  return b === 0 ? a : gcd(b, a % b);
}

function simplifyRatio(n: number, d: number): string {
  if (d === 0) return `${n}`;
  const g = gcd(Math.round(Math.abs(n)), Math.round(Math.abs(d)));
  return g > 0 ? `${Math.round(n / g)} : ${Math.round(d / g)}` : `${n} : ${d}`;
}

export default function ProportionSolver() {
  const t = useTranslations("ProportionSolver");

  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [result, setResult] = useState<{ value: number; missing: string; steps: string[] } | null>(null);
  const [error, setError] = useState("");

  const handleSolve = () => {
    setError("");
    setResult(null);
    const vals = [a, b, c, d];
    const blanks = vals.filter((v) => v.trim() === "");
    const parsed = vals.map((v) => (v.trim() === "" ? null : parseFloat(v)));

    if (blanks.length !== 1) {
      setError(t("leaveOneBlank"));
      return;
    }

    const [av, bv, cv, dv] = parsed;
    const labels = ["a", "b", "c", "d"];
    const blankIdx = parsed.indexOf(null);
    let value = 0;
    const steps: string[] = [];

    // a/b = c/d  →  a*d = b*c
    if (blankIdx === 0) {
      // a = b*c/d
      value = (bv! * cv!) / dv!;
      steps.push(`a / ${bv} = ${cv} / ${dv}`);
      steps.push(`a × ${dv} = ${bv} × ${cv}`);
      steps.push(`a = (${bv} × ${cv}) / ${dv}`);
      steps.push(`a = ${value}`);
    } else if (blankIdx === 1) {
      // b = a*d/c
      value = (av! * dv!) / cv!;
      steps.push(`${av} / b = ${cv} / ${dv}`);
      steps.push(`${av} × ${dv} = b × ${cv}`);
      steps.push(`b = (${av} × ${dv}) / ${cv}`);
      steps.push(`b = ${value}`);
    } else if (blankIdx === 2) {
      // c = a*d/b
      value = (av! * dv!) / bv!;
      steps.push(`${av} / ${bv} = c / ${dv}`);
      steps.push(`${av} × ${dv} = ${bv} × c`);
      steps.push(`c = (${av} × ${dv}) / ${bv}`);
      steps.push(`c = ${value}`);
    } else {
      // d = b*c/a
      value = (bv! * cv!) / av!;
      steps.push(`${av} / ${bv} = ${cv} / d`);
      steps.push(`${av} × d = ${bv} × ${cv}`);
      steps.push(`d = (${bv} × ${cv}) / ${av}`);
      steps.push(`d = ${value}`);
    }

    if (!isFinite(value)) { setError("Division by zero"); return; }
    setResult({ value: Math.round(value * 1000000) / 1000000, missing: labels[blankIdx], steps });
  };

  const inputs = [
    { label: "a", val: a, set: setA },
    { label: "b", val: b, set: setB },
    { label: "c", val: c, set: setC },
    { label: "d", val: d, set: setD },
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">{t("equationLabel")}</p>

      {/* Proportion display: a/b = c/d */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {inputs.map((inp, i) => (
          <span key={inp.label} className="flex items-center gap-2">
            <div className="text-center">
              <label className="block text-xs text-gray-500 mb-1">{t(`${inp.label}Label` as Parameters<typeof t>[0])}</label>
              <input
                type="number"
                value={inp.val}
                onChange={(e) => { inp.set(e.target.value); setResult(null); }}
                placeholder="?"
                className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-white text-center font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            {i === 0 && <span className="text-gray-500 text-2xl mt-4">/</span>}
            {i === 1 && <span className="text-gray-400 text-xl mt-4">=</span>}
            {i === 2 && <span className="text-gray-500 text-2xl mt-4">/</span>}
          </span>
        ))}
      </div>

      <p className="text-xs text-gray-600 text-center">{t("leaveOneBlank")}</p>

      <button
        onClick={handleSolve}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-medium transition-colors"
      >
        {t("solveButton")}
      </button>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      {result && (
        <div className="space-y-3">
          <div className="bg-gray-900 rounded-xl p-4 border border-indigo-800 text-center">
            <p className="text-xs text-gray-500 mb-1">{result.missing} =</p>
            <p className="text-4xl font-mono font-bold text-indigo-400">{result.value}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
            <p className="text-xs text-gray-500 mb-2">{t("stepByStepLabel")}</p>
            {result.steps.map((step, i) => (
              <p key={i} className={`font-mono text-sm ${i === result.steps.length - 1 ? "text-green-400 font-bold" : "text-gray-400"}`}>
                {i + 1}. {step}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
