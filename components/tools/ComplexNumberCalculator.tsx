"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Complex { re: number; im: number; }

function add(a: Complex, b: Complex): Complex { return { re: a.re + b.re, im: a.im + b.im }; }
function sub(a: Complex, b: Complex): Complex { return { re: a.re - b.re, im: a.im - b.im }; }
function mul(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}
function div(a: Complex, b: Complex): Complex | null {
  const denom = b.re * b.re + b.im * b.im;
  if (denom === 0) return null;
  return { re: (a.re * b.re + a.im * b.im) / denom, im: (a.im * b.re - a.re * b.im) / denom };
}
function modulus(a: Complex): number { return Math.sqrt(a.re * a.re + a.im * a.im); }
function argument(a: Complex): number { return Math.atan2(a.im, a.re); }
function conjugate(a: Complex): Complex { return { re: a.re, im: -a.im }; }

function fmt(n: number): string {
  const r = Math.round(n * 1e10) / 1e10;
  return r === 0 ? "0" : String(r);
}

function fmtComplex(c: Complex): string {
  const re = fmt(c.re);
  const im = fmt(Math.abs(c.im));
  if (c.im === 0) return re;
  if (c.re === 0) return c.im < 0 ? `-${im}i` : `${im}i`;
  return c.im < 0 ? `${re} − ${im}i` : `${re} + ${im}i`;
}

type Op = "add" | "subtract" | "multiply" | "divide" | "conjugateA" | "modulusA" | "polarA";

export default function ComplexNumberCalculator() {
  const t = useTranslations("ComplexNumberCalculator");
  const [aRe, setARe] = useState("3");
  const [aIm, setAIm] = useState("4");
  const [bRe, setBRe] = useState("1");
  const [bIm, setBIm] = useState("-2");
  const [op, setOp] = useState<Op>("add");
  const [result, setResult] = useState<{
    rect?: string; modulus?: string; arg?: string; argDeg?: string; polar?: string;
  } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    const a: Complex = { re: parseFloat(aRe) || 0, im: parseFloat(aIm) || 0 };
    const b: Complex = { re: parseFloat(bRe) || 0, im: parseFloat(bIm) || 0 };

    let res: Complex | null = null;
    if (op === "add") res = add(a, b);
    else if (op === "subtract") res = sub(a, b);
    else if (op === "multiply") res = mul(a, b);
    else if (op === "divide") { res = div(a, b); if (!res) { setError("Division by zero."); return; } }
    else if (op === "conjugateA") res = conjugate(a);
    else if (op === "modulusA") {
      const mod = modulus(a);
      setResult({ rect: fmt(mod), modulus: fmt(mod) });
      return;
    }
    else if (op === "polarA") {
      const mod = modulus(a);
      const arg = argument(a);
      const argDeg = arg * (180 / Math.PI);
      setResult({
        polar: `${fmt(mod)} · e^(${fmt(arg)}i)`,
        modulus: fmt(mod),
        arg: fmt(arg),
        argDeg: fmt(argDeg),
      });
      return;
    }

    if (res) {
      const mod = modulus(res);
      const arg = argument(res);
      setResult({
        rect: fmtComplex(res),
        modulus: fmt(mod),
        arg: fmt(arg),
        argDeg: fmt(arg * (180 / Math.PI)),
        polar: `${fmt(mod)} · e^(${fmt(arg)}i)`,
      });
    }
  };

  const operations: { key: Op; label: string }[] = [
    { key: "add", label: t("opAdd") },
    { key: "subtract", label: t("opSubtract") },
    { key: "multiply", label: t("opMultiply") },
    { key: "divide", label: t("opDivide") },
    { key: "conjugateA", label: t("opConjugateA") },
    { key: "modulusA", label: t("opModulusA") },
    { key: "polarA", label: t("opPolarA") },
  ];

  const needsB = ["add","subtract","multiply","divide"].includes(op);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-300">A = a + bi</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">{t("aRealLabel")}</label>
              <input type="number" value={aRe} onChange={e => setARe(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">{t("aImagLabel")}</label>
              <input type="number" value={aIm} onChange={e => setAIm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>
        {needsB && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-300">B = a + bi</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">{t("bRealLabel")}</label>
                <input type="number" value={bRe} onChange={e => setBRe(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">{t("bImagLabel")}</label>
                <input type="number" value={bIm} onChange={e => setBIm(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t("operationLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {operations.map(({ key, label }) => (
            <button key={key} onClick={() => { setOp(key); setResult(null); setError(""); }}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${op === key ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={() => { setResult(null); setError(""); }}
          className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-3">
          <p className="text-sm font-medium text-gray-300">{t("resultLabel")}</p>
          {result.rect !== undefined && (
            <div>
              <span className="text-xs text-gray-400">{t("rectangularLabel")}: </span>
              <span className="text-2xl font-bold text-indigo-400 font-mono">{result.rect}</span>
            </div>
          )}
          {result.polar !== undefined && (
            <div>
              <span className="text-xs text-gray-400">{t("polarLabel")}: </span>
              <span className="text-lg font-mono text-yellow-400">{result.polar}</span>
            </div>
          )}
          {result.modulus !== undefined && op !== "modulusA" && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-700">
              <div>
                <div className="text-xs text-gray-400">{t("modulusLabel")}</div>
                <div className="font-mono text-white">{result.modulus}</div>
              </div>
              {result.arg !== undefined && (
                <div>
                  <div className="text-xs text-gray-400">{t("argumentLabel")}</div>
                  <div className="font-mono text-white">{result.arg} rad ({result.argDeg}°)</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
