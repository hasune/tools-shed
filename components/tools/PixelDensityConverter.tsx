"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export default function PixelDensityConverter() {
  const t = useTranslations("PixelDensityConverter");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [size, setSize] = useState("");
  const [result, setResult] = useState<{
    ppi: number;
    totalPixels: number;
    aspectRatio: string;
    category: string;
  } | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    const w = parseInt(width);
    const h = parseInt(height);
    const s = parseFloat(size);
    if (!w || !h || !s || w <= 0 || h <= 0 || s <= 0) {
      setError(t("invalidInput"));
      setResult(null);
      return;
    }
    const diagonal = Math.sqrt(w * w + h * h);
    const ppi = diagonal / s;
    const totalPixels = w * h;
    const d = gcd(w, h);
    const aspectRatio = `${w / d}:${h / d}`;

    let category = "";
    if (ppi < 100) category = t("categoryLow");
    else if (ppi < 200) category = t("categoryStandard");
    else if (ppi < 300) category = t("categoryHigh");
    else category = t("categoryRetina");

    setResult({ ppi: Math.round(ppi * 10) / 10, totalPixels, aspectRatio, category });
  };

  const PRESETS = [
    { label: "FHD 24\"", w: 1920, h: 1080, s: 24 },
    { label: "4K 27\"", w: 3840, h: 2160, s: 27 },
    { label: "iPhone 15", w: 2556, h: 1179, s: 6.12 },
    { label: "MacBook 14\"", w: 3024, h: 1964, s: 14.2 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 mb-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => { setWidth(String(p.w)); setHeight(String(p.h)); setSize(String(p.s)); setResult(null); }}
            className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("widthLabel")}</label>
          <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="1920"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("heightLabel")}</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="1080"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("sizeLabel")}</label>
          <input type="number" value={size} onChange={(e) => setSize(e.target.value)} placeholder='24"'
            step="0.1" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500" />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={handleCalculate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={() => { setWidth(""); setHeight(""); setSize(""); setResult(null); setError(""); }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: t("ppiLabel"), value: result.ppi.toString() },
            { label: t("categoryLabel"), value: result.category },
            { label: t("aspectRatioLabel"), value: result.aspectRatio },
            { label: t("totalPixelsLabel"), value: result.totalPixels.toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3">
              <div className="text-xs text-gray-500 mb-1">{label}</div>
              <div className="text-xl font-semibold text-gray-100 break-words">{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
