"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Matrix = number[][];

function makeMatrix(size: number): Matrix {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function addMatrix(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}

function subMatrix(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((v, j) => v - b[i][j]));
}

function mulMatrix(a: Matrix, b: Matrix): Matrix {
  const n = a.length;
  const result = makeMatrix(n);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < n; k++)
        result[i][j] += a[i][k] * b[k][j];
  return result;
}

function transpose(a: Matrix): Matrix {
  return a[0].map((_, j) => a.map((row) => row[j]));
}

function det2(a: Matrix): number {
  return a[0][0] * a[1][1] - a[0][1] * a[1][0];
}

function det3(a: Matrix): number {
  return (
    a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) -
    a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) +
    a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0])
  );
}

function inverse2(a: Matrix): Matrix | null {
  const d = det2(a);
  if (Math.abs(d) < 1e-10) return null;
  return [
    [a[1][1] / d, -a[0][1] / d],
    [-a[1][0] / d, a[0][0] / d],
  ];
}

function inverse3(a: Matrix): Matrix | null {
  const d = det3(a);
  if (Math.abs(d) < 1e-10) return null;
  const adj: Matrix = [
    [
      a[1][1] * a[2][2] - a[1][2] * a[2][1],
      -(a[0][1] * a[2][2] - a[0][2] * a[2][1]),
      a[0][1] * a[1][2] - a[0][2] * a[1][1],
    ],
    [
      -(a[1][0] * a[2][2] - a[1][2] * a[2][0]),
      a[0][0] * a[2][2] - a[0][2] * a[2][0],
      -(a[0][0] * a[1][2] - a[0][2] * a[1][0]),
    ],
    [
      a[1][0] * a[2][1] - a[1][1] * a[2][0],
      -(a[0][0] * a[2][1] - a[0][1] * a[2][0]),
      a[0][0] * a[1][1] - a[0][1] * a[1][0],
    ],
  ];
  return adj.map((row) => row.map((v) => v / d));
}

function fmt(n: number): string {
  const r = Math.round(n * 10000) / 10000;
  return r === 0 ? "0" : String(r);
}

type Op = "add" | "subtract" | "multiply" | "transposeA" | "determinantA" | "inverseA";

const SINGLE_OPS: Op[] = ["transposeA", "determinantA", "inverseA"];

export default function MatrixCalculator() {
  const t = useTranslations("MatrixCalculator");

  const [size, setSize] = useState(2);
  const [matA, setMatA] = useState<Matrix>(makeMatrix(2));
  const [matB, setMatB] = useState<Matrix>(makeMatrix(2));
  const [op, setOp] = useState<Op>("add");
  const [result, setResult] = useState<Matrix | number | string | null>(null);
  const [error, setError] = useState("");

  const setMatrixSize = (s: number) => {
    setSize(s);
    setMatA(makeMatrix(s));
    setMatB(makeMatrix(s));
    setResult(null);
    setError("");
  };

  const updateCell = (mat: "A" | "B", r: number, c: number, v: string) => {
    const val = v === "" || v === "-" ? 0 : parseFloat(v);
    if (mat === "A") setMatA((m) => m.map((row, i) => row.map((cell, j) => (i === r && j === c ? (isNaN(val) ? 0 : val) : cell))));
    else setMatB((m) => m.map((row, i) => row.map((cell, j) => (i === r && j === c ? (isNaN(val) ? 0 : val) : cell))));
    setResult(null);
  };

  const handleCalculate = () => {
    setError("");
    setResult(null);
    try {
      if (op === "add") setResult(addMatrix(matA, matB));
      else if (op === "subtract") setResult(subMatrix(matA, matB));
      else if (op === "multiply") setResult(mulMatrix(matA, matB));
      else if (op === "transposeA") setResult(transpose(matA));
      else if (op === "determinantA") setResult(size === 2 ? det2(matA) : det3(matA));
      else if (op === "inverseA") {
        const inv = size === 2 ? inverse2(matA) : inverse3(matA);
        if (inv === null) setError(t("noInverseError"));
        else setResult(inv);
      }
    } catch {
      setError(t("calcError"));
    }
  };

  const renderMatrix = (m: Matrix, label: "A" | "B") => (
    <div>
      <p className="text-sm text-gray-400 mb-2">{t(`matrix${label}Label` as Parameters<typeof t>[0])}</p>
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
        {m.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={cell === 0 ? "" : cell}
              onChange={(e) => updateCell(label, i, j, e.target.value)}
              placeholder="0"
              className="w-16 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-center font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          ))
        )}
      </div>
    </div>
  );

  const renderResult = () => {
    if (result === null) return null;
    if (typeof result === "number") {
      return (
        <div className="bg-gray-900 rounded-xl p-4 border border-indigo-800 text-center">
          <p className="text-xs text-gray-500 mb-1">det(A)</p>
          <p className="text-3xl font-mono font-bold text-indigo-400">{fmt(result)}</p>
        </div>
      );
    }
    return (
      <div>
        <p className="text-sm text-gray-400 mb-2">{t("resultLabel")}</p>
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${(result as Matrix)[0].length}, minmax(0, 1fr))` }}>
          {(result as Matrix).map((row, i) =>
            row.map((cell, j) => (
              <div key={`${i}-${j}`} className="w-16 bg-indigo-950 border border-indigo-800 rounded px-2 py-1.5 text-indigo-300 text-center font-mono text-sm">
                {fmt(cell)}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Size */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">{t("sizeLabel")}</label>
        <div className="flex gap-2">
          {[2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setMatrixSize(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                size === s ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {s}×{s}
            </button>
          ))}
        </div>
      </div>

      {/* Matrices */}
      <div className="flex flex-wrap gap-6">
        {renderMatrix(matA, "A")}
        {!SINGLE_OPS.includes(op) && renderMatrix(matB, "B")}
      </div>

      {/* Operation */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">{t("operationLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {(["add", "subtract", "multiply", "transposeA", "determinantA", "inverseA"] as Op[]).map((o) => (
            <button
              key={o}
              onClick={() => { setOp(o); setResult(null); setError(""); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                op === o ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {t(`op${o.charAt(0).toUpperCase() + o.slice(1)}` as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-medium transition-colors"
      >
        {t("calculateButton")}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {renderResult()}
    </div>
  );
}
