"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

interface HistoryEntry {
  expression: string;
  result: string;
}

type AngleMode = "DEG" | "RAD";

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function safeEval(expr: string): number {
  // Replace math tokens with JS equivalents
  const sanitized = expr
    .replace(/π/g, String(Math.PI))
    .replace(/e(?![0-9])/g, String(Math.E))
    .replace(/×/g, "*")
    .replace(/÷/g, "/");

  // Allow only safe characters: digits, operators, parens, dot, spaces, Math calls
  if (!/^[0-9+\-*/().e ]+$/.test(sanitized)) {
    throw new Error("Invalid expression");
  }

  // eslint-disable-next-line no-new-func
  const result = new Function(`"use strict"; return (${sanitized})`)();
  if (typeof result !== "number" || !isFinite(result)) {
    throw new Error("Math error");
  }
  return result;
}

export default function ScientificCalculator() {
  const t = useTranslations("ScientificCalculator");

  const [expression, setExpression] = useState<string>("");
  const [display, setDisplay] = useState<string>("0");
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [justEvaluated, setJustEvaluated] = useState<boolean>(false);

  const pushHistory = useCallback((expr: string, result: string) => {
    setHistory((prev) => [{ expression: expr, result }, ...prev].slice(0, 10));
  }, []);

  const appendToExpression = useCallback(
    (value: string) => {
      setJustEvaluated(false);
      setExpression((prev) => {
        const next = justEvaluated ? value : prev + value;
        setDisplay(next || "0");
        return next;
      });
    },
    [justEvaluated]
  );

  const handleNumber = (num: string) => {
    if (justEvaluated) {
      setExpression(num);
      setDisplay(num);
      setJustEvaluated(false);
    } else {
      const next = expression + num;
      setExpression(next);
      setDisplay(next);
    }
  };

  const handleOperator = (op: string) => {
    setJustEvaluated(false);
    const next = expression + op;
    setExpression(next);
    setDisplay(next);
  };

  const handleDecimal = () => {
    // Find the last number segment
    const parts = expression.split(/[+\-×÷*/()]/);
    const last = parts[parts.length - 1];
    if (last.includes(".")) return;
    const next = expression + ".";
    setExpression(next);
    setDisplay(next);
    setJustEvaluated(false);
  };

  const handleClear = () => {
    setExpression("");
    setDisplay("0");
    setJustEvaluated(false);
  };

  const handleClearEntry = () => {
    setExpression("");
    setDisplay("0");
    setJustEvaluated(false);
  };

  const handleBackspace = () => {
    setJustEvaluated(false);
    setExpression((prev) => {
      const next = prev.slice(0, -1);
      setDisplay(next || "0");
      return next;
    });
  };

  const handleEquals = () => {
    if (!expression) return;
    try {
      const result = safeEval(expression);
      const resultStr = Number.isInteger(result)
        ? String(result)
        : parseFloat(result.toPrecision(12)).toString();
      pushHistory(expression, resultStr);
      setDisplay(resultStr);
      setExpression(resultStr);
      setJustEvaluated(true);
    } catch {
      setDisplay(t("error"));
      setExpression("");
      setJustEvaluated(true);
    }
  };

  const handleTrig = (fn: "sin" | "cos" | "tan") => {
    let argExpr = expression;
    if (!argExpr) argExpr = "0";

    let argValue: number;
    try {
      argValue = safeEval(argExpr);
    } catch {
      setDisplay(t("error"));
      setExpression("");
      return;
    }

    const radValue = angleMode === "DEG" ? toRad(argValue) : argValue;
    let result: number;
    if (fn === "sin") result = Math.sin(radValue);
    else if (fn === "cos") result = Math.cos(radValue);
    else result = Math.tan(radValue);

    // Round floating point noise (e.g. sin(180°) should be ~0)
    result = parseFloat(result.toPrecision(10));

    const resultStr = parseFloat(result.toPrecision(12)).toString();
    const displayExpr = `${fn}(${argExpr})`;
    pushHistory(displayExpr, resultStr);
    setDisplay(resultStr);
    setExpression(resultStr);
    setJustEvaluated(true);
  };

  const handleUnary = (fn: "log" | "ln" | "sqrt" | "sq" | "inv") => {
    let argExpr = expression;
    if (!argExpr) argExpr = "0";

    let argValue: number;
    try {
      argValue = safeEval(argExpr);
    } catch {
      setDisplay(t("error"));
      setExpression("");
      return;
    }

    let result: number;
    let label: string;

    switch (fn) {
      case "log":
        if (argValue <= 0) { setDisplay(t("error")); setExpression(""); return; }
        result = Math.log10(argValue);
        label = `log(${argValue})`;
        break;
      case "ln":
        if (argValue <= 0) { setDisplay(t("error")); setExpression(""); return; }
        result = Math.log(argValue);
        label = `ln(${argValue})`;
        break;
      case "sqrt":
        if (argValue < 0) { setDisplay(t("error")); setExpression(""); return; }
        result = Math.sqrt(argValue);
        label = `√(${argValue})`;
        break;
      case "sq":
        result = argValue * argValue;
        label = `(${argValue})²`;
        break;
      case "inv":
        if (argValue === 0) { setDisplay(t("error")); setExpression(""); return; }
        result = 1 / argValue;
        label = `1/(${argValue})`;
        break;
      default:
        return;
    }

    const resultStr = parseFloat(result.toPrecision(12)).toString();
    pushHistory(label, resultStr);
    setDisplay(resultStr);
    setExpression(resultStr);
    setJustEvaluated(true);
  };

  const handlePercent = () => {
    let argExpr = expression;
    if (!argExpr) return;
    try {
      const val = safeEval(argExpr);
      const result = val / 100;
      const resultStr = parseFloat(result.toPrecision(12)).toString();
      setDisplay(resultStr);
      setExpression(resultStr);
      setJustEvaluated(true);
    } catch {
      setDisplay(t("error"));
      setExpression("");
    }
  };

  const handleToggleSign = () => {
    if (!expression) return;
    try {
      const val = safeEval(expression);
      const result = -val;
      const resultStr = parseFloat(result.toPrecision(12)).toString();
      setDisplay(resultStr);
      setExpression(resultStr);
      setJustEvaluated(true);
    } catch {
      setDisplay(t("error"));
      setExpression("");
    }
  };

  const handlePower = () => {
    // Append ** operator for power
    const next = expression + "**";
    setExpression(next);
    setDisplay(next);
    setJustEvaluated(false);
  };

  const handleConstant = (c: "π" | "e") => {
    const val = c === "π" ? "π" : "e";
    if (justEvaluated || !expression) {
      setExpression(val);
      setDisplay(val);
      setJustEvaluated(false);
    } else {
      const next = expression + val;
      setExpression(next);
      setDisplay(next);
    }
  };

  type ButtonDef = {
    label: string;
    onClick: () => void;
    className?: string;
    wide?: boolean;
  };

  const btnBase =
    "flex items-center justify-center rounded-lg text-sm font-medium transition-colors select-none cursor-pointer h-11";
  const btnGray = `${btnBase} bg-gray-800 hover:bg-gray-700 text-gray-200`;
  const btnDark = `${btnBase} bg-gray-900 hover:bg-gray-800 text-gray-300`;
  const btnIndigo = `${btnBase} bg-indigo-600 hover:bg-indigo-500 text-white`;
  const btnOrange = `${btnBase} bg-amber-600 hover:bg-amber-500 text-white`;
  const btnRed = `${btnBase} bg-red-700 hover:bg-red-600 text-white`;

  const buttons: ButtonDef[][] = [
    [
      { label: "sin", onClick: () => handleTrig("sin"), className: btnGray },
      { label: "cos", onClick: () => handleTrig("cos"), className: btnGray },
      { label: "tan", onClick: () => handleTrig("tan"), className: btnGray },
      { label: "(", onClick: () => handleOperator("("), className: btnDark },
      { label: ")", onClick: () => handleOperator(")"), className: btnDark },
      { label: "C", onClick: handleClear, className: btnRed },
    ],
    [
      { label: "log", onClick: () => handleUnary("log"), className: btnGray },
      { label: "ln", onClick: () => handleUnary("ln"), className: btnGray },
      { label: "√", onClick: () => handleUnary("sqrt"), className: btnGray },
      { label: "x²", onClick: () => handleUnary("sq"), className: btnGray },
      { label: "xʸ", onClick: handlePower, className: btnGray },
      { label: "CE", onClick: handleClearEntry, className: btnOrange },
    ],
    [
      { label: "π", onClick: () => handleConstant("π"), className: btnGray },
      { label: "e", onClick: () => handleConstant("e"), className: btnGray },
      { label: "%", onClick: handlePercent, className: btnGray },
      { label: "±", onClick: handleToggleSign, className: btnGray },
      { label: "1/x", onClick: () => handleUnary("inv"), className: btnGray },
      { label: "÷", onClick: () => handleOperator("÷"), className: btnIndigo },
    ],
    [
      { label: "7", onClick: () => handleNumber("7"), className: btnDark },
      { label: "8", onClick: () => handleNumber("8"), className: btnDark },
      { label: "9", onClick: () => handleNumber("9"), className: btnDark },
      { label: "×", onClick: () => handleOperator("×"), className: btnIndigo },
      { label: "⌫", onClick: handleBackspace, className: btnOrange },
      { label: "", onClick: () => {}, className: "" }, // placeholder
    ],
    [
      { label: "4", onClick: () => handleNumber("4"), className: btnDark },
      { label: "5", onClick: () => handleNumber("5"), className: btnDark },
      { label: "6", onClick: () => handleNumber("6"), className: btnDark },
      { label: "−", onClick: () => handleOperator("-"), className: btnIndigo },
      { label: "", onClick: () => {}, className: "" },
      { label: "", onClick: () => {}, className: "" },
    ],
    [
      { label: "1", onClick: () => handleNumber("1"), className: btnDark },
      { label: "2", onClick: () => handleNumber("2"), className: btnDark },
      { label: "3", onClick: () => handleNumber("3"), className: btnDark },
      { label: "+", onClick: () => handleOperator("+"), className: btnIndigo },
      { label: "", onClick: () => {}, className: "" },
      { label: "", onClick: () => {}, className: "" },
    ],
    [
      { label: "0", onClick: () => handleNumber("0"), className: btnDark, wide: true },
      { label: ".", onClick: handleDecimal, className: btnDark },
      { label: "=", onClick: handleEquals, className: `${btnBase} bg-indigo-500 hover:bg-indigo-400 text-white col-span-2`, wide: true },
    ],
  ];

  return (
    <div className="space-y-5 max-w-sm mx-auto">
      {/* Angle Mode Toggle */}
      <div className="flex items-center gap-2 justify-end">
        <span className="text-xs text-gray-500">{t("angleMode")}</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          {(["DEG", "RAD"] as AngleMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setAngleMode(mode)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                angleMode === mode
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Display */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-right">
        <div className="text-gray-500 text-xs min-h-[1rem] truncate mb-1 font-mono">
          {expression && !justEvaluated ? expression : ""}
        </div>
        <div className="text-white text-3xl font-mono font-light truncate">
          {display}
        </div>
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-6 gap-1.5">
        {/* Row 1–3 */}
        {buttons.slice(0, 3).map((row, ri) =>
          row.map((btn, bi) => (
            <button
              key={`r${ri}b${bi}`}
              onClick={btn.onClick}
              className={btn.className}
              disabled={!btn.label}
              style={{ visibility: btn.label ? "visible" : "hidden" }}
            >
              {btn.label}
            </button>
          ))
        )}

        {/* Row 4: 7 8 9 × ⌫ [empty] */}
        {["7", "8", "9"].map((n) => (
          <button key={n} onClick={() => handleNumber(n)} className={btnDark}>
            {n}
          </button>
        ))}
        <button onClick={() => handleOperator("×")} className={btnIndigo}>×</button>
        <button onClick={handleBackspace} className={btnOrange}>⌫</button>
        <div /> {/* empty cell */}

        {/* Row 5: 4 5 6 - [empty] [empty] */}
        {["4", "5", "6"].map((n) => (
          <button key={n} onClick={() => handleNumber(n)} className={btnDark}>
            {n}
          </button>
        ))}
        <button onClick={() => handleOperator("-")} className={btnIndigo}>−</button>
        <div />
        <div />

        {/* Row 6: 1 2 3 + [empty] [empty] */}
        {["1", "2", "3"].map((n) => (
          <button key={n} onClick={() => handleNumber(n)} className={btnDark}>
            {n}
          </button>
        ))}
        <button onClick={() => handleOperator("+")} className={`${btnIndigo} row-span-2`}>+</button>
        <div className="col-span-2" />

        {/* Row 7: 0(×2) . = (×2) */}
        <button onClick={() => handleNumber("0")} className={`${btnDark} col-span-2`}>
          0
        </button>
        <button onClick={handleDecimal} className={btnDark}>.</button>
        <button onClick={handleEquals} className={`${btnBase} col-span-2 bg-indigo-500 hover:bg-indigo-400 text-white`}>
          =
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">{t("history")}</h3>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              {t("clearHistory")}
            </button>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800 max-h-52 overflow-y-auto">
            {history.map((entry, i) => (
              <div
                key={i}
                className="px-4 py-2.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => {
                  setExpression(entry.result);
                  setDisplay(entry.result);
                  setJustEvaluated(true);
                }}
              >
                <span className="text-gray-500 text-xs font-mono truncate">{entry.expression}</span>
                <span className="text-gray-200 text-sm font-mono font-medium whitespace-nowrap">
                  = {entry.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
