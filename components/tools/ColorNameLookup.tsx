"use client";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";

// 140 CSS named colors
const CSS_COLORS: { name: string; hex: string }[] = [
  { name: "aliceblue", hex: "#f0f8ff" }, { name: "antiquewhite", hex: "#faebd7" },
  { name: "aqua", hex: "#00ffff" }, { name: "aquamarine", hex: "#7fffd4" },
  { name: "azure", hex: "#f0ffff" }, { name: "beige", hex: "#f5f5dc" },
  { name: "bisque", hex: "#ffe4c4" }, { name: "black", hex: "#000000" },
  { name: "blanchedalmond", hex: "#ffebcd" }, { name: "blue", hex: "#0000ff" },
  { name: "blueviolet", hex: "#8a2be2" }, { name: "brown", hex: "#a52a2a" },
  { name: "burlywood", hex: "#deb887" }, { name: "cadetblue", hex: "#5f9ea0" },
  { name: "chartreuse", hex: "#7fff00" }, { name: "chocolate", hex: "#d2691e" },
  { name: "coral", hex: "#ff7f50" }, { name: "cornflowerblue", hex: "#6495ed" },
  { name: "cornsilk", hex: "#fff8dc" }, { name: "crimson", hex: "#dc143c" },
  { name: "cyan", hex: "#00ffff" }, { name: "darkblue", hex: "#00008b" },
  { name: "darkcyan", hex: "#008b8b" }, { name: "darkgoldenrod", hex: "#b8860b" },
  { name: "darkgray", hex: "#a9a9a9" }, { name: "darkgreen", hex: "#006400" },
  { name: "darkkhaki", hex: "#bdb76b" }, { name: "darkmagenta", hex: "#8b008b" },
  { name: "darkolivegreen", hex: "#556b2f" }, { name: "darkorange", hex: "#ff8c00" },
  { name: "darkorchid", hex: "#9932cc" }, { name: "darkred", hex: "#8b0000" },
  { name: "darksalmon", hex: "#e9967a" }, { name: "darkseagreen", hex: "#8fbc8f" },
  { name: "darkslateblue", hex: "#483d8b" }, { name: "darkslategray", hex: "#2f4f4f" },
  { name: "darkturquoise", hex: "#00ced1" }, { name: "darkviolet", hex: "#9400d3" },
  { name: "deeppink", hex: "#ff1493" }, { name: "deepskyblue", hex: "#00bfff" },
  { name: "dimgray", hex: "#696969" }, { name: "dodgerblue", hex: "#1e90ff" },
  { name: "firebrick", hex: "#b22222" }, { name: "floralwhite", hex: "#fffaf0" },
  { name: "forestgreen", hex: "#228b22" }, { name: "fuchsia", hex: "#ff00ff" },
  { name: "gainsboro", hex: "#dcdcdc" }, { name: "ghostwhite", hex: "#f8f8ff" },
  { name: "gold", hex: "#ffd700" }, { name: "goldenrod", hex: "#daa520" },
  { name: "gray", hex: "#808080" }, { name: "green", hex: "#008000" },
  { name: "greenyellow", hex: "#adff2f" }, { name: "honeydew", hex: "#f0fff0" },
  { name: "hotpink", hex: "#ff69b4" }, { name: "indianred", hex: "#cd5c5c" },
  { name: "indigo", hex: "#4b0082" }, { name: "ivory", hex: "#fffff0" },
  { name: "khaki", hex: "#f0e68c" }, { name: "lavender", hex: "#e6e6fa" },
  { name: "lavenderblush", hex: "#fff0f5" }, { name: "lawngreen", hex: "#7cfc00" },
  { name: "lemonchiffon", hex: "#fffacd" }, { name: "lightblue", hex: "#add8e6" },
  { name: "lightcoral", hex: "#f08080" }, { name: "lightcyan", hex: "#e0ffff" },
  { name: "lightgoldenrodyellow", hex: "#fafad2" }, { name: "lightgray", hex: "#d3d3d3" },
  { name: "lightgreen", hex: "#90ee90" }, { name: "lightpink", hex: "#ffb6c1" },
  { name: "lightsalmon", hex: "#ffa07a" }, { name: "lightseagreen", hex: "#20b2aa" },
  { name: "lightskyblue", hex: "#87cefa" }, { name: "lightslategray", hex: "#778899" },
  { name: "lightsteelblue", hex: "#b0c4de" }, { name: "lightyellow", hex: "#ffffe0" },
  { name: "lime", hex: "#00ff00" }, { name: "limegreen", hex: "#32cd32" },
  { name: "linen", hex: "#faf0e6" }, { name: "magenta", hex: "#ff00ff" },
  { name: "maroon", hex: "#800000" }, { name: "mediumaquamarine", hex: "#66cdaa" },
  { name: "mediumblue", hex: "#0000cd" }, { name: "mediumorchid", hex: "#ba55d3" },
  { name: "mediumpurple", hex: "#9370db" }, { name: "mediumseagreen", hex: "#3cb371" },
  { name: "mediumslateblue", hex: "#7b68ee" }, { name: "mediumspringgreen", hex: "#00fa9a" },
  { name: "mediumturquoise", hex: "#48d1cc" }, { name: "mediumvioletred", hex: "#c71585" },
  { name: "midnightblue", hex: "#191970" }, { name: "mintcream", hex: "#f5fffa" },
  { name: "mistyrose", hex: "#ffe4e1" }, { name: "moccasin", hex: "#ffe4b5" },
  { name: "navajowhite", hex: "#ffdead" }, { name: "navy", hex: "#000080" },
  { name: "oldlace", hex: "#fdf5e6" }, { name: "olive", hex: "#808000" },
  { name: "olivedrab", hex: "#6b8e23" }, { name: "orange", hex: "#ffa500" },
  { name: "orangered", hex: "#ff4500" }, { name: "orchid", hex: "#da70d6" },
  { name: "palegoldenrod", hex: "#eee8aa" }, { name: "palegreen", hex: "#98fb98" },
  { name: "paleturquoise", hex: "#afeeee" }, { name: "palevioletred", hex: "#db7093" },
  { name: "papayawhip", hex: "#ffefd5" }, { name: "peachpuff", hex: "#ffdab9" },
  { name: "peru", hex: "#cd853f" }, { name: "pink", hex: "#ffc0cb" },
  { name: "plum", hex: "#dda0dd" }, { name: "powderblue", hex: "#b0e0e6" },
  { name: "purple", hex: "#800080" }, { name: "rebeccapurple", hex: "#663399" },
  { name: "red", hex: "#ff0000" }, { name: "rosybrown", hex: "#bc8f8f" },
  { name: "royalblue", hex: "#4169e1" }, { name: "saddlebrown", hex: "#8b4513" },
  { name: "salmon", hex: "#fa8072" }, { name: "sandybrown", hex: "#f4a460" },
  { name: "seagreen", hex: "#2e8b57" }, { name: "seashell", hex: "#fff5ee" },
  { name: "sienna", hex: "#a0522d" }, { name: "silver", hex: "#c0c0c0" },
  { name: "skyblue", hex: "#87ceeb" }, { name: "slateblue", hex: "#6a5acd" },
  { name: "slategray", hex: "#708090" }, { name: "snow", hex: "#fffafa" },
  { name: "springgreen", hex: "#00ff7f" }, { name: "steelblue", hex: "#4682b4" },
  { name: "tan", hex: "#d2b48c" }, { name: "teal", hex: "#008080" },
  { name: "thistle", hex: "#d8bfd8" }, { name: "tomato", hex: "#ff6347" },
  { name: "turquoise", hex: "#40e0d0" }, { name: "violet", hex: "#ee82ee" },
  { name: "wheat", hex: "#f5deb3" }, { name: "white", hex: "#ffffff" },
  { name: "whitesmoke", hex: "#f5f5f5" }, { name: "yellow", hex: "#ffff00" },
  { name: "yellowgreen", hex: "#9acd32" },
];

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r, g, b];
}

function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function parseInput(input: string): [number, number, number] | null {
  const trimmed = input.trim();
  // HEX
  if (trimmed.startsWith("#")) return hexToRgb(trimmed);
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return hexToRgb("#" + trimmed);
  // RGB
  const rgbMatch = trimmed.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgbMatch) return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
  const bare = trimmed.match(/^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)$/);
  if (bare) return [parseInt(bare[1]), parseInt(bare[2]), parseInt(bare[3])];
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function isLight(r: number, g: number, b: number): boolean {
  return 0.299 * r + 0.587 * g + 0.114 * b > 128;
}

export default function ColorNameLookup() {
  const t = useTranslations("ColorNameLookup");
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<{ name: string; hex: string; exact: boolean; distance: number } | null>(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    setError("");
    const rgb = parseInput(input);
    if (!rgb) { setError(t("invalidInput")); return; }
    const [r, g, b] = rgb;

    let nearest = CSS_COLORS[0];
    let minDist = Infinity;
    let exact = false;

    for (const color of CSS_COLORS) {
      const crgb = hexToRgb(color.hex)!;
      const dist = colorDistance(r, g, b, ...crgb);
      if (dist < minDist) { minDist = dist; nearest = color; }
      if (dist === 0) { exact = true; break; }
    }

    setResult({ name: nearest.name, hex: nearest.hex, exact, distance: Math.round(minDist) });
  };

  const filteredColors = useMemo(() =>
    CSS_COLORS.filter((c) => c.name.includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  // Suppress unused variable warning - isLight is available for future use
  void rgbToHex;
  void isLight;

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={t("inputPlaceholder")}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 font-mono focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {t("searchButton")}
        </button>
        <button
          onClick={() => { setInput(""); setResult(null); setError(""); }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {result && (
        <div className="flex gap-4 items-center rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4">
          <div
            className="w-20 h-20 rounded-lg shrink-0 border border-gray-600"
            style={{ backgroundColor: result.hex }}
          />
          <div>
            <div className="text-sm text-gray-400 mb-1">
              {result.exact ? t("exactMatchLabel") : t("nearestNameLabel")}
            </div>
            <div className="text-2xl font-semibold text-gray-100">{result.name}</div>
            <div className="flex gap-4 mt-1 text-sm text-gray-400">
              <span>{t("hexLabel")}: {result.hex}</span>
              <span>{t("rgbLabel")}: {hexToRgb(result.hex)?.join(", ")}</span>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">{t("browseSectionTitle")}</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full mb-3 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-indigo-500"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto pr-1">
          {filteredColors.map((color) => {
            return (
              <button
                key={color.name}
                onClick={() => setInput(color.hex)}
                className="flex items-center gap-2 rounded-lg p-2 border border-gray-700 hover:border-indigo-500/50 transition-colors text-left"
              >
                <div
                  className="w-8 h-8 rounded shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="min-w-0">
                  <div className="text-xs text-gray-300 truncate">{color.name}</div>
                  <div className="text-xs text-gray-500">{color.hex}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
