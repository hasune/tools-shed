"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Dim = "2d" | "3d";
type VecOp = "add" | "sub" | "dot" | "cross" | "magA" | "magB" | "angle";

interface Vec3 { x: number; y: number; z: number; }

export default function VectorCalculator() {
  const t = useTranslations("VectorCalculator");
  const [dim, setDim] = useState<Dim>("3d");
  const [ax, setAx] = useState("1"); const [ay, setAy] = useState("2"); const [az, setAz] = useState("3");
  const [bx, setBx] = useState("4"); const [by, setBy] = useState("5"); const [bz, setBz] = useState("6");
  const [op, setOp] = useState<VecOp>("add");
  const [result, setResult] = useState<{ type: "scalar" | "vector"; value: number | Vec3; label: string } | null>(null);
  const [error, setError] = useState("");

  const getVec = (x: string, y: string, z: string): Vec3 | null => {
    const nx = parseFloat(x), ny = parseFloat(y), nz = parseFloat(z);
    if (isNaN(nx) || isNaN(ny) || (dim === "3d" && isNaN(nz))) return null;
    return { x: nx, y: ny, z: dim === "2d" ? 0 : nz };
  };

  const mag = (v: Vec3) => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  const dot = (a: Vec3, b: Vec3) => a.x * b.x + a.y * b.y + a.z * b.z;
  const cross = (a: Vec3, b: Vec3): Vec3 => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  });

  const calculate = () => {
    const A = getVec(ax, ay, az);
    if (!A) { setError(t("invalidInput")); setResult(null); return; }

    if (op === "magA") {
      setResult({ type: "scalar", value: mag(A), label: "|A|" });
      setError(""); return;
    }

    if (op === "cross" && dim === "2d") {
      setError(t("crossProduct3dOnly")); setResult(null); return;
    }

    const B = getVec(bx, by, bz);
    if (!B) { setError(t("invalidInput")); setResult(null); return; }

    setError("");
    if (op === "add") setResult({ type: "vector", value: { x: A.x + B.x, y: A.y + B.y, z: A.z + B.z }, label: "A + B" });
    else if (op === "sub") setResult({ type: "vector", value: { x: A.x - B.x, y: A.y - B.y, z: A.z - B.z }, label: "A − B" });
    else if (op === "dot") setResult({ type: "scalar", value: dot(A, B), label: "A · B" });
    else if (op === "cross") setResult({ type: "vector", value: cross(A, B), label: "A × B" });
    else if (op === "magB") setResult({ type: "scalar", value: mag(B), label: "|B|" });
    else if (op === "angle") {
      const cosA = dot(A, B) / (mag(A) * mag(B));
      const angle = Math.acos(Math.max(-1, Math.min(1, cosA))) * (180 / Math.PI);
      setResult({ type: "scalar", value: angle, label: "Angle (°)" });
    }
  };

  const clear = () => {
    setAx("1"); setAy("2"); setAz("3");
    setBx("4"); setBy("5"); setBz("6");
    setOp("add"); setResult(null); setError(""); setDim("3d");
  };

  const fmt = (n: number) => parseFloat(n.toPrecision(8)).toString();

  const ops: [VecOp, string][] = [
    ["add", t("opAdd")], ["sub", t("opSubtract")], ["dot", t("opDot")],
    ["cross", t("opCross")], ["magA", t("opMagnitudeA")], ["magB", t("opMagnitudeB")], ["angle", t("opAngle")],
  ];

  const axes = dim === "2d" ? ["x", "y"] : ["x", "y", "z"];
  const aVals = [ax, ay, az];
  const aSetters = [setAx, setAy, setAz];
  const bVals = [bx, by, bz];
  const bSetters = [setBx, setBy, setBz];

  const VecInput = ({
    label,
    vals,
    setters,
  }: {
    label: string;
    vals: string[];
    setters: ((v: string) => void)[];
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <div className={`grid gap-2 ${dim === "2d" ? "grid-cols-2" : "grid-cols-3"}`}>
        {axes.map((axis, i) => (
          <div key={axis}>
            <span className="text-xs text-gray-500">{t((axis + "Label") as any)}</span>
            <input
              type="number"
              value={vals[i]}
              onChange={(e) => setters[i](e.target.value)}
              step="any"
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm font-mono rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(["2d", "3d"] as Dim[]).map((d) => (
          <button
            key={d}
            onClick={() => { setDim(d); setResult(null); setError(""); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${dim === d ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          >
            {d === "2d" ? t("dim2d") : t("dim3d")}
          </button>
        ))}
      </div>

      <VecInput label={t("vector1Label")} vals={aVals} setters={aSetters} />
      {op !== "magA" && <VecInput label={t("vector2Label")} vals={bVals} setters={bSetters} />}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{t("operationLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {ops.map(([o, label]) => (
            <button
              key={o}
              onClick={() => { setOp(o); setResult(null); setError(""); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${op === o ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {label}
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
        <div className="bg-indigo-950/40 border border-indigo-700 rounded-xl p-5">
          <p className="text-sm text-indigo-400 mb-2">{t("resultLabel")}: {result.label}</p>
          {result.type === "scalar" ? (
            <p className="text-3xl font-mono text-white">{fmt(result.value as number)}</p>
          ) : (
            <div className={`grid gap-2 ${dim === "2d" ? "grid-cols-2" : "grid-cols-3"}`}>
              {axes.map((axis) => (
                <div key={axis} className="bg-gray-900 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">{axis.toUpperCase()}</p>
                  <p className="text-lg font-mono text-white">{fmt((result.value as Vec3)[axis as keyof Vec3])}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
