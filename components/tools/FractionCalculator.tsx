"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

type Op = "add" | "subtract" | "multiply" | "divide";

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function simplify(num: number, den: number): [number, number] {
  const g = gcd(Math.abs(num), Math.abs(den));
  const sign = den < 0 ? -1 : 1;
  return [(num / g) * sign, Math.abs(den) / g];
}

function fractionStr(num: number, den: number): string {
  if (den === 1) return String(num);
  return `${num}/${den}`;
}

export default function FractionCalculator() {
  const t = useTranslations("FractionCalculator");
  const [n1, setN1] = useState("1");
  const [d1, setD1] = useState("2");
  const [n2, setN2] = useState("1");
  const [d2, setD2] = useState("3");
  const [op, setOp] = useState<Op>("add");
  const [result, setResult] = useState<null | { num: number; den: number; steps: string[] }>(null);
  const [error, setError] = useState("");

  function calculate() {
    const a = parseInt(n1), b = parseInt(d1), c = parseInt(n2), d = parseInt(d2);
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) return;
    if (b === 0 || d === 0) { setError(t("zeroDenominator")); setResult(null); return; }
    if (op === "divide" && c === 0) { setError(t("divideByZero")); setResult(null); return; }
    setError("");
    let rNum: number, rDen: number;
    const steps: string[] = [];
    const f1 = fractionStr(a, b);
    const f2 = fractionStr(c, d);
    if (op === "add") {
      rNum = a * d + c * b; rDen = b * d;
      steps.push(`${f1} + ${f2} = (${a}×${d} + ${c}×${b}) / (${b}×${d}) = ${rNum}/${rDen}`);
    } else if (op === "subtract") {
      rNum = a * d - c * b; rDen = b * d;
      steps.push(`${f1} − ${f2} = (${a}×${d} − ${c}×${b}) / (${b}×${d}) = ${rNum}/${rDen}`);
    } else if (op === "multiply") {
      rNum = a * c; rDen = b * d;
      steps.push(`${f1} × ${f2} = (${a}×${c}) / (${b}×${d}) = ${rNum}/${rDen}`);
    } else {
      rNum = a * d; rDen = b * c;
      steps.push(`${f1} ÷ ${f2} = ${f1} × ${d}/${c} = (${a}×${d}) / (${b}×${c}) = ${rNum}/${rDen}`);
    }
    const [sNum, sDen] = simplify(rNum, rDen);
    if (sNum !== rNum || sDen !== rDen) {
      const g = gcd(Math.abs(rNum), Math.abs(rDen));
      steps.push(`Simplify by GCD ${g}: ${rNum}/${rDen} = ${fractionStr(sNum, sDen)}`);
    }
    setResult({ num: sNum, den: sDen, steps });
  }

  const ops: { value: Op; label: string }[] = [
    { value: "add", label: t("add") },
    { value: "subtract", label: t("subtract") },
    { value: "multiply", label: t("multiply") },
    { value: "divide", label: t("divide") },
  ];

  const inputCls =
    "w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 text-center";

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
        {/* Fraction 1 */}
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-2">{t("fraction1")}</div>
          <div className="flex flex-col items-center gap-1" style={{ width: 90 }}>
            <input type="number" value={n1} onChange={(e) => setN1(e.target.value)} placeholder={t("numerator")} className={inputCls} />
            <div className="w-full border-t border-gray-400 my-0.5" />
            <input type="number" value={d1} onChange={(e) => setD1(e.target.value)} placeholder={t("denominator")} className={inputCls} />
          </div>
        </div>
        {/* Operation */}
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-2">{t("operation")}</div>
          <div className="flex flex-col gap-1">
            {ops.map((o) => (
              <button
                key={o.value}
                onClick={() => setOp(o.value)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${op === o.value ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        {/* Fraction 2 */}
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-2">{t("fraction2")}</div>
          <div className="flex flex-col items-center gap-1" style={{ width: 90 }}>
            <input type="number" value={n2} onChange={(e) => setN2(e.target.value)} placeholder={t("numerator")} className={inputCls} />
            <div className="w-full border-t border-gray-400 my-0.5" />
            <input type="number" value={d2} onChange={(e) => setD2(e.target.value)} placeholder={t("denominator")} className={inputCls} />
          </div>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      <div className="flex justify-center">
        <button
          onClick={calculate}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t("calculateButton")}
        </button>
      </div>
      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">{t("simplified")}</div>
              <div className="text-2xl font-mono text-white">{fractionStr(result.num, result.den)}</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">{t("decimal")}</div>
              <div className="text-2xl font-mono text-indigo-400">
                {result.den !== 0 ? parseFloat((result.num / result.den).toPrecision(8)).toString() : "—"}
              </div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-1">
            <div className="text-sm font-medium text-gray-400 mb-2">{t("steps")}</div>
            {result.steps.map((step, i) => (
              <div key={i} className="text-sm font-mono text-gray-300">
                {i + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
