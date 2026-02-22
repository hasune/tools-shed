"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
      case gn: h = (bn - rn) / d + 2; break;
      case bn: h = (rn - gn) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hn = h / 360, sn = s / 100, ln = l / 100;
  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

export default function ColorConverter() {
  const t = useTranslations("ColorConverter");
  const tCommon = useTranslations("Common");

  const [hex, setHex] = useState("#6366f1");
  const [rgb, setRgb] = useState({ r: 99, g: 102, b: 241 });
  const [hsl, setHsl] = useState({ h: 239, s: 84, l: 67 });
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const updateFromHex = (value: string) => {
    setHex(value);
    setError("");
    const parsed = hexToRgb(value);
    if (parsed) {
      setRgb(parsed);
      setHsl(rgbToHsl(parsed.r, parsed.g, parsed.b));
    } else if (value.replace("#", "").length >= 6) {
      setError(t("invalidColor"));
    }
  };

  const updateFromRgb = (field: "r" | "g" | "b", val: string) => {
    const num = Math.min(255, Math.max(0, parseInt(val) || 0));
    const newRgb = { ...rgb, [field]: num };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    setError("");
  };

  const updateFromHsl = (field: "h" | "s" | "l", val: string) => {
    const max = field === "h" ? 360 : 100;
    const num = Math.min(max, Math.max(0, parseInt(val) || 0));
    const newHsl = { ...hsl, [field]: num };
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setError("");
  };

  const hexFull = hex.startsWith("#") ? hex : `#${hex}`;
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="space-y-5">
      {/* Color preview */}
      <div
        className="w-full h-24 rounded-xl border border-gray-700 transition-colors"
        style={{ backgroundColor: hexFull }}
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* HEX */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-300">HEX</label>
          <button
            onClick={() => copyToClipboard(hexFull, "hex")}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {copied === "hex" ? tCommon("copied") : tCommon("copy")}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={hexFull}
            onChange={(e) => updateFromHex(e.target.value)}
            className="h-9 w-10 rounded cursor-pointer bg-transparent border-0 p-0"
          />
          <input
            type="text"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-600 text-white font-mono text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            placeholder="#000000"
            maxLength={7}
          />
        </div>
      </div>

      {/* RGB */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-300">RGB</label>
          <button
            onClick={() => copyToClipboard(rgbString, "rgb")}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {copied === "rgb" ? tCommon("copied") : tCommon("copy")}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(["r", "g", "b"] as const).map((ch) => (
            <div key={ch} className="space-y-1">
              <label className="text-xs text-gray-500 uppercase">{ch}</label>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb[ch]}
                onChange={(e) => updateFromRgb(ch, e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 font-mono">{rgbString}</div>
      </div>

      {/* HSL */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-300">HSL</label>
          <button
            onClick={() => copyToClipboard(hslString, "hsl")}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {copied === "hsl" ? tCommon("copied") : tCommon("copy")}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(["h", "s", "l"] as const).map((ch) => (
            <div key={ch} className="space-y-1">
              <label className="text-xs text-gray-500 uppercase">
                {ch === "h" ? t("hue") : ch === "s" ? t("saturation") : t("lightness")}
              </label>
              <input
                type="number"
                min={0}
                max={ch === "h" ? 360 : 100}
                value={hsl[ch]}
                onChange={(e) => updateFromHsl(ch, e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 font-mono">{hslString}</div>
      </div>
    </div>
  );
}
