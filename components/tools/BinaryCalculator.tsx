"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type InputMode = "BIN" | "DEC" | "HEX";
type Operation = "ADD" | "SUB" | "MUL" | "AND" | "OR" | "XOR" | "NOT" | "LSHIFT" | "RSHIFT";

const OPERATIONS: Operation[] = ["ADD", "SUB", "MUL", "AND", "OR", "XOR", "NOT", "LSHIFT", "RSHIFT"];

export default function BinaryCalculator() {
  const t = useTranslations("BinaryCalculator");
  const [num1, setNum1] = useState("1010");
  const [num2, setNum2] = useState("0110");
  const [mode, setMode] = useState<InputMode>("BIN");
  const [op, setOp] = useState<Operation>("AND");
  const [result, setResult] = useState<{ dec: number; bin: string; hex: string } | null>(null);
  const [error, setError] = useState("");

  const parseInput = (s: string): number | null => {
    if (!s.trim()) return null;
    let n: number;
    if (mode === "BIN") n = parseInt(s, 2);
    else if (mode === "HEX") n = parseInt(s, 16);
    else n = parseInt(s, 10);
    return isNaN(n) ? null : n;
  };

  const calculate = () => {
    const a = parseInput(num1);
    if (a === null) { setError(t("invalidInput")); setResult(null); return; }

    let val: number;
    if (op === "NOT") {
      val = (~a) >>> 0;
    } else {
      const b = parseInput(num2);
      if (b === null) { setError(t("invalidInput")); setResult(null); return; }
      if (op === "AND") val = (a & b) >>> 0;
      else if (op === "OR") val = (a | b) >>> 0;
      else if (op === "XOR") val = (a ^ b) >>> 0;
      else if (op === "ADD") val = (a + b) >>> 0;
      else if (op === "SUB") val = (a - b) >>> 0;
      else if (op === "MUL") val = Math.imul(a, b) >>> 0;
      else if (op === "LSHIFT") val = (a << (b & 31)) >>> 0;
      else val = (a >>> (b & 31));
    }

    setError("");
    setResult({
      dec: val,
      bin: val.toString(2).padStart(8, "0"),
      hex: val.toString(16).toUpperCase().padStart(2, "0"),
    });
  };

  const clear = () => { setNum1("1010"); setNum2("0110"); setOp("AND"); setResult(null); setError(""); };

  const modes: InputMode[] = ["BIN", "DEC", "HEX"];
  const placeholder = mode === "BIN" ? "1010" : mode === "HEX" ? "FF" : "42";

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{t("inputBaseLabel")}</label>
        <div className="flex gap-2">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setResult(null); setError(""); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-mono font-medium transition-colors ${mode === m ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {t(("inputMode" + m) as any)}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-4 ${op === "NOT" ? "grid-cols-1" : "grid-cols-2"}`}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("num1Label")}</label>
          <input
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
        {op !== "NOT" && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">{t("num2Label")}</label>
            <input
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{t("operationLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {OPERATIONS.map((o) => (
            <button
              key={o}
              onClick={() => { setOp(o); setResult(null); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-colors ${op === o ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={calculate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">{t("calculateButton")}</button>
        <button onClick={clear} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">{t("clearButton")}</button>
      </div>

      {result && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          <p className="text-xs text-gray-500 px-4 py-2 border-b border-gray-700">{t("resultLabel")}</p>
          <table className="w-full text-sm">
            <tbody>
              {[
                [t("binaryLabel"), result.bin],
                [t("decimalLabel"), result.dec.toString()],
                [t("hexLabel"), "0x" + result.hex],
              ].map(([label, value], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-800/30"}>
                  <td className="px-4 py-2.5 text-gray-400 w-36">{label}</td>
                  <td className="px-4 py-2.5 font-mono text-indigo-300">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
