"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

let stopId = 1;

export default function ColorGradientGenerator() {
  const t = useTranslations("ColorGradientGenerator");

  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: stopId++, color: "#6366f1", position: 0 },
    { id: stopId++, color: "#8b5cf6", position: 50 },
    { id: stopId++, color: "#ec4899", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const addStop = () => {
    const pos = stops.length > 0 ? Math.round((stops[stops.length - 1].position + 100) / 2) : 50;
    setStops((s) => [...s, { id: stopId++, color: "#ffffff", position: Math.min(pos, 100) }]);
  };

  const removeStop = (id: number) => {
    if (stops.length <= 2) return;
    setStops((s) => s.filter((stop) => stop.id !== id));
  };

  const updateStop = (id: number, field: "color" | "position", value: string | number) => {
    setStops((s) =>
      s.map((stop) => (stop.id === id ? { ...stop, [field]: value } : stop))
    );
  };

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);

  const stopsCSS = sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ");
  const css =
    type === "linear"
      ? `background: linear-gradient(${angle}deg, ${stopsCSS});`
      : `background: radial-gradient(circle, ${stopsCSS});`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewStyle =
    type === "linear"
      ? { background: `linear-gradient(${angle}deg, ${stopsCSS})` }
      : { background: `radial-gradient(circle, ${stopsCSS})` };

  return (
    <div className="space-y-5">
      {/* Preview */}
      <div
        className="w-full h-32 rounded-xl border border-gray-700"
        style={previewStyle}
      />

      {/* Type + Angle */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t("typeLabel")}</label>
          <div className="flex rounded-lg overflow-hidden border border-gray-700">
            {(["linear", "radial"] as const).map((tp) => (
              <button
                key={tp}
                onClick={() => setType(tp)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  type === tp ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {t(`type${tp.charAt(0).toUpperCase() + tp.slice(1)}` as Parameters<typeof t>[0])}
              </button>
            ))}
          </div>
        </div>
        {type === "linear" && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              {t("angleLabel")}: {angle}°
            </label>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Color stops */}
      <div className="space-y-2">
        {stops.map((stop) => (
          <div key={stop.id} className="flex items-center gap-3">
            <input
              type="color"
              value={stop.color}
              onChange={(e) => updateStop(stop.id, "color", e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="font-mono text-sm text-gray-300 w-20">{stop.color}</span>
            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={100}
                value={stop.position}
                onChange={(e) => updateStop(stop.id, "position", Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
            <span className="text-sm text-gray-400 w-10 text-right">{stop.position}%</span>
            <button
              onClick={() => removeStop(stop.id)}
              disabled={stops.length <= 2}
              className="text-gray-600 hover:text-red-400 disabled:opacity-30 transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={addStop}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          + {t("addColorButton")}
        </button>
      </div>

      {/* CSS Output */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">{t("cssOutputLabel")}</label>
        <div className="relative">
          <pre className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-green-400 font-mono whitespace-pre-wrap break-all">
            {css}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
          >
            {copied ? t("copied") : t("copyButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
