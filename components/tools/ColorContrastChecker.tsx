"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(fg: [number,number,number], bg: [number,number,number]): number {
  const l1 = relativeLuminance(...fg);
  const l2 = relativeLuminance(...bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

type PassFail = { aa: boolean; aaa: boolean };

function assess(ratio: number): { normalText: PassFail; largeText: PassFail; ui: PassFail } {
  return {
    normalText: { aa: ratio >= 4.5, aaa: ratio >= 7.0 },
    largeText: { aa: ratio >= 3.0, aaa: ratio >= 4.5 },
    ui: { aa: ratio >= 3.0, aaa: ratio >= 3.0 },
  };
}

export default function ColorContrastChecker() {
  const t = useTranslations("ColorContrastChecker");
  const [fg, setFg] = useState("#1a1a2e");
  const [bg, setBg] = useState("#ffffff");
  const [result, setResult] = useState<{ ratio: number; assessment: ReturnType<typeof assess> } | null>(null);
  const [error, setError] = useState("");

  const check = () => {
    setError("");
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    if (!fgRgb || !bgRgb) { setError("Please enter valid hex colors (e.g. #ff6b6b)."); return; }
    const ratio = contrastRatio(fgRgb, bgRgb);
    setResult({ ratio, assessment: assess(ratio) });
  };

  const swap = () => { const tmp = fg; setFg(bg); setBg(tmp); setResult(null); };
  const clear = () => { setFg("#1a1a2e"); setBg("#ffffff"); setResult(null); setError(""); };

  const Badge = ({ pass }: { pass: boolean }) => (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${pass ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      {pass ? t("passLabel") : t("failLabel")}
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="rounded-lg p-6 text-center text-lg font-semibold transition-colors"
        style={{ backgroundColor: bg, color: fg }}>
        The quick brown fox jumps over the lazy dog
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("fgLabel")}</label>
          <div className="flex gap-2">
            <input type="color" value={fg} onChange={(e) => { setFg(e.target.value); setResult(null); }}
              className="w-12 h-10 rounded cursor-pointer border border-gray-700 bg-gray-800" />
            <input type="text" value={fg} onChange={(e) => { setFg(e.target.value); setResult(null); }}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("bgLabel")}</label>
          <div className="flex gap-2">
            <input type="color" value={bg} onChange={(e) => { setBg(e.target.value); setResult(null); }}
              className="w-12 h-10 rounded cursor-pointer border border-gray-700 bg-gray-800" />
            <input type="text" value={bg} onChange={(e) => { setBg(e.target.value); setResult(null); }}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={check} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">
          {t("checkButton")}
        </button>
        <button onClick={swap} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("swapButton")}
        </button>
        <button onClick={clear} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-400 mb-1">{t("ratioLabel")}</div>
            <div className="text-5xl font-bold text-indigo-400">{result.ratio.toFixed(2)}<span className="text-2xl">:1</span></div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="text-left px-4 py-2">Context</th>
                  <th className="px-4 py-2">{t("wcagAA")}</th>
                  <th className="px-4 py-2">{t("wcagAAA")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {([
                  [t("normalTextLabel"), result.assessment.normalText],
                  [t("largeTextLabel"), result.assessment.largeText],
                  [t("uiLabel"), result.assessment.ui],
                ] as [string, PassFail][]).map(([label, pf]) => (
                  <tr key={label}>
                    <td className="px-4 py-3 text-gray-300">{label}</td>
                    <td className="px-4 py-3 text-center"><Badge pass={pf.aa} /></td>
                    <td className="px-4 py-3 text-center"><Badge pass={pf.aaa} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-400 space-y-1">
            <p className="font-medium text-gray-300">{t("tipsTitle")}</p>
            <p>{t("tipAA")}</p>
            <p>{t("tipAAA")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
