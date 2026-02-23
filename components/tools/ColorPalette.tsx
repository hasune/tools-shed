"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

type PaletteType = "complementary" | "analogous" | "triadic" | "splitComplementary" | "tetradic" | "monochromatic";

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette(hex: string, type: PaletteType): { hex: string; label: string }[] {
  const [h, s, l] = hexToHsl(hex);
  switch (type) {
    case "complementary":
      return [
        { hex, label: "Base" },
        { hex: hslToHex(h + 180, s, l), label: "Complement" },
      ];
    case "analogous":
      return [-40, -20, 0, 20, 40].map((offset, i) => ({
        hex: hslToHex(h + offset, s, l),
        label: i === 2 ? "Base" : `${offset > 0 ? "+" : ""}${offset}°`,
      }));
    case "triadic":
      return [0, 120, 240].map((offset, i) => ({
        hex: hslToHex(h + offset, s, l),
        label: i === 0 ? "Base" : `+${offset}°`,
      }));
    case "splitComplementary":
      return [
        { hex, label: "Base" },
        { hex: hslToHex(h + 150, s, l), label: "+150°" },
        { hex: hslToHex(h + 210, s, l), label: "+210°" },
      ];
    case "tetradic":
      return [0, 90, 180, 270].map((offset, i) => ({
        hex: hslToHex(h + offset, s, l),
        label: i === 0 ? "Base" : `+${offset}°`,
      }));
    case "monochromatic":
      return [20, 35, 50, 65, 80].map((lightness) => ({
        hex: hslToHex(h, s, lightness),
        label: `L:${lightness}`,
      }));
  }
}

export default function ColorPalette() {
  const t = useTranslations("ColorPalette");
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [paletteType, setPaletteType] = useState<PaletteType>("complementary");
  const [copiedHex, setCopiedHex] = useState("");

  const palette = generatePalette(baseColor, paletteType);

  function copyHex(hex: string) {
    navigator.clipboard.writeText(hex).then(() => {
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(""), 1500);
    });
  }

  const types: { value: PaletteType; label: string }[] = [
    { value: "complementary", label: t("complementary") },
    { value: "analogous", label: t("analogous") },
    { value: "triadic", label: t("triadic") },
    { value: "splitComplementary", label: t("splitComplementary") },
    { value: "tetradic", label: t("tetradic") },
    { value: "monochromatic", label: t("monochromatic") },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">{t("baseColorLabel")}</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer bg-transparent border border-gray-600"
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => {
                if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setBaseColor(e.target.value);
              }}
              className="w-28 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">{t("paletteType")}</label>
          <select
            value={paletteType}
            onChange={(e) => setPaletteType(e.target.value as PaletteType)}
            className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          >
            {types.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {palette.map(({ hex, label }) => (
          <button
            key={hex + label}
            onClick={() => copyHex(hex)}
            title={t("clickToCopy")}
            className="group flex flex-col items-center gap-2 p-3 bg-gray-900 border border-gray-700 hover:border-indigo-500/50 rounded-xl transition-colors"
          >
            <div className="w-full h-20 rounded-lg" style={{ backgroundColor: hex }} />
            <div className="text-xs font-mono text-gray-300 group-hover:text-white transition-colors">
              {copiedHex === hex ? t("colorCopied") : hex.toUpperCase()}
            </div>
            <div className="text-xs text-gray-500">{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
